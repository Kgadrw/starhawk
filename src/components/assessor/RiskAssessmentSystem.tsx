import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import LeafletMap from "@/components/common/LeafletMap";
import assessmentsApiService from "@/services/assessmentsApi";
import { getFarms, uploadKML, getWeatherForecast, getHistoricalWeather, getAccumulatedWeather, getVegetationStats, getNDVITimeSeries } from "@/services/farmsApi";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin,
  Search,
  Upload,
  FileText,
  Shield,
  CloudRain,
  Leaf,
  FileSpreadsheet,
  Activity,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  ArrowLeft,
  Sprout,
  Save,
  BarChart3,
  TrendingUp,
  Download,
  Eye,
  Map
} from "lucide-react";

interface Farmer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  farmerProfile: {
    farmProvince: string;
    farmDistrict: string;
    farmSector: string;
  };
  farms: Farm[];
}

interface Farm {
  id: string;
  cropType: string;
  sowingDate: string;
  status: "PENDING" | "REGISTERED";
  name: string | null;
}

interface Assessment {
  _id: string;
  farmId: {
    _id: string;
    name: string;
    cropType: string;
    eosdaFieldId: string;
  };
  assessorId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  status: string;
  riskScore: number | null;
  observations: any[];
  photoUrls: string[];
  reportText: string | null;
  droneAnalysisPdfUrl: string | null;
  droneAnalysisData: any;
  comprehensiveNotes: string | null;
  reportGenerated: boolean;
}

export default function RiskAssessmentSystem(): JSX.Element {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"farmers" | "assessment">("farmers");
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loadingAssessment, setLoadingAssessment] = useState(false);
  
  // KML Upload State
  const [uploadingKML, setUploadingKML] = useState(false);
  const [selectedKMLFile, setSelectedKMLFile] = useState<File | null>(null);
  const [farmName, setFarmName] = useState("");
  const [showKMLUpload, setShowKMLUpload] = useState<string | null>(null);
  
  // Assessment State
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [calculatingRisk, setCalculatingRisk] = useState(false);
  const [comprehensiveNotes, setComprehensiveNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [selectedPDFFile, setSelectedPDFFile] = useState<File | null>(null);
  const [uploadingPDF, setUploadingPDF] = useState(false);
  
  // Data State
  const [fieldStatistics, setFieldStatistics] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Load assigned farmers
  useEffect(() => {
    loadFarmers();
  }, []);

  const loadFarmers = async () => {
    setLoading(true);
    try {
      const response = await assessmentsApiService.getAssignedFarmers();
      const farmersData = response.data || response || [];
      setFarmers(Array.isArray(farmersData) ? farmersData : []);
    } catch (err: any) {
      console.error('Failed to load farmers:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to load assigned farmers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle KML file selection
  const handleKMLFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.kml')) {
      toast({
        title: "Invalid File Type",
        description: "Please select a .kml file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (1MB max)
    if (file.size > 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 1MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedKMLFile(file);
  };

  // Handle KML upload
  const handleUploadKML = async (farmId: string) => {
    if (!selectedKMLFile || !farmName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please select a KML file and enter a farm name",
        variant: "destructive",
      });
      return;
    }

    setUploadingKML(true);
    try {
      const result = await uploadKML(selectedKMLFile, farmId, farmName.trim());
      
      toast({
        title: "Success",
        description: "KML uploaded successfully. EOSDA field created.",
      });
      
      // Reset form
      setSelectedKMLFile(null);
      setFarmName("");
      setShowKMLUpload(null);
      
      // Reload farmers to get updated status
      await loadFarmers();
      
      // Navigate to assessment if farm is now REGISTERED
      if (result.status === "REGISTERED") {
        // Find or create assessment for this farm
        await loadAssessmentForFarm(farmId);
      }
    } catch (err: any) {
      console.error('Failed to upload KML:', err);
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload KML file",
        variant: "destructive",
      });
    } finally {
      setUploadingKML(false);
    }
  };

  // Load assessment for a farm
  const loadAssessmentForFarm = async (farmId: string) => {
    setLoadingAssessment(true);
    try {
      // First, try to get existing assessment
      const assessments = await assessmentsApiService.getAssessments();
      const assessmentsData = assessments.data || assessments.items || assessments || [];
      const existingAssessment = Array.isArray(assessmentsData) 
        ? assessmentsData.find((a: any) => a.farmId?._id === farmId || a.farmId === farmId)
        : null;

      if (existingAssessment) {
        const assessmentDetails = await assessmentsApiService.getAssessmentById(
          existingAssessment._id || existingAssessment.id
        );
        const assessmentData = assessmentDetails.data || assessmentDetails;
        setAssessment(assessmentData);
        
        // Safely set risk score - ensure it's a number or null
        const riskScoreValue = assessmentData.riskScore;
        if (riskScoreValue !== null && riskScoreValue !== undefined && typeof riskScoreValue === 'number') {
          setRiskScore(riskScoreValue);
        } else {
          setRiskScore(null);
        }
        
        setComprehensiveNotes(assessmentData.comprehensiveNotes || "");
        setViewMode("assessment");
        
        // Load field data
        await loadFieldData(farmId);
      } else {
        // Create new assessment or show message
        toast({
          title: "No Assessment Found",
          description: "Please create an assessment for this farm first",
        });
      }
    } catch (err: any) {
      console.error('Failed to load assessment:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to load assessment",
        variant: "destructive",
      });
    } finally {
      setLoadingAssessment(false);
    }
  };

  // Load field statistics and weather data
  const loadFieldData = async (farmId: string) => {
    if (!farmId) return;
    
    setLoadingData(true);
    try {
      const today = new Date();
      const startDate = new Date();
      startDate.setFullYear(today.getFullYear() - 3); // 3 years of data
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = today.toISOString().split('T')[0];
      
      // Load field statistics
      try {
        const stats = await getVegetationStats(farmId, startDateStr, endDateStr, 'NDVI,MSAVI,NDMI,EVI');
        setFieldStatistics(stats.data || stats);
      } catch (err: any) {
        // Handle EOSDA-specific errors gracefully
        const errorMessage = err?.message || '';
        if (errorMessage.includes('EOSDA') || errorMessage.includes('requests limit exceeded')) {
          // Silently handle EOSDA errors - these are expected when limits are exceeded or farm not registered
          console.log('EOSDA data not available (limit exceeded or farm not registered)');
        } else if (errorMessage.includes('EOSDA field ID') || errorMessage.includes('register the farm')) {
          // Farm not registered with EOSDA yet
          console.log('Farm not registered with EOSDA yet');
        } else {
          console.warn('Failed to load field statistics:', err);
        }
        // Don't set fieldStatistics to null, keep it as is or set to empty
        setFieldStatistics(null);
      }
      
      // Load weather data
      try {
        const weather = await getHistoricalWeather(farmId, startDateStr, endDateStr);
        setWeatherData(weather.data || weather);
      } catch (err: any) {
        // Handle EOSDA-specific errors gracefully
        const errorMessage = err?.message || '';
        if (errorMessage.includes('EOSDA') || errorMessage.includes('requests limit exceeded')) {
          // Silently handle EOSDA errors
          console.log('EOSDA weather data not available (limit exceeded or farm not registered)');
        } else if (errorMessage.includes('EOSDA field ID') || errorMessage.includes('register the farm')) {
          // Farm not registered with EOSDA yet
          console.log('Farm not registered with EOSDA yet - weather data unavailable');
        } else {
          console.warn('Failed to load weather data:', err);
        }
        // Don't set weatherData to null, keep it as is or set to empty
        setWeatherData(null);
      }
    } catch (err: any) {
      console.error('Failed to load field data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Calculate risk score
  const handleCalculateRiskScore = async () => {
    if (!assessment?._id) {
      toast({
        title: "Error",
        description: "Assessment not loaded",
        variant: "destructive",
      });
      return;
    }

    // Prevent multiple simultaneous calls
    if (calculatingRisk) {
      console.log('⚠️ Risk calculation already in progress, ignoring duplicate call');
      return;
    }

    setCalculatingRisk(true);
    try {
      console.log('🔄 Starting risk score calculation for assessment:', assessment._id);
      const score = await assessmentsApiService.calculateRiskScore(assessment._id);
      const scoreValue = typeof score === 'number' ? score : (score?.data || score?.riskScore || score);
      
      console.log('📊 Risk score response:', { score, scoreValue });
      
      // Ensure scoreValue is a valid number
      if (scoreValue !== null && scoreValue !== undefined && typeof scoreValue === 'number') {
        setRiskScore(scoreValue);
        
        // Reload assessment
        try {
          const updated = await assessmentsApiService.getAssessmentById(assessment._id);
          const updatedData = updated.data || updated;
          setAssessment(updatedData);
        } catch (reloadErr) {
          console.warn('⚠️ Failed to reload assessment after risk calculation:', reloadErr);
          // Continue even if reload fails
        }
        
        toast({
          title: "Success",
          description: `Risk score calculated: ${scoreValue.toFixed(1)}`,
        });
      } else {
        throw new Error('Invalid risk score returned from API');
      }
    } catch (err: any) {
      console.error('❌ Failed to calculate risk score:', err);
      
      // Handle 404 specifically - endpoint might not be implemented yet
      const errorMessage = err.message || '';
      if (errorMessage.includes('404') || errorMessage.includes('not found') || errorMessage.includes('Cannot POST')) {
        toast({
          title: "Feature Not Available",
          description: "Risk score calculation endpoint is not yet available on the server. Please contact support or try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Calculation Failed",
          description: err.message || "Failed to calculate risk score. Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      // Always reset the loading state, even if there was an error
      console.log('✅ Resetting calculatingRisk state');
      setCalculatingRisk(false);
      
      // Extra safeguard: force reset after a short delay if somehow it didn't reset
      setTimeout(() => {
        setCalculatingRisk(false);
      }, 100);
    }
  };

  // Upload drone PDF
  const handleUploadPDF = async () => {
    if (!selectedPDFFile || !assessment?._id) {
      toast({
        title: "Validation Error",
        description: "Please select a PDF file",
        variant: "destructive",
      });
      return;
    }

    setUploadingPDF(true);
    try {
      console.log('📤 Uploading drone PDF...', {
        assessmentId: assessment._id,
        fileName: selectedPDFFile.name,
        fileSize: selectedPDFFile.size
      });

      const result = await assessmentsApiService.uploadDronePDF(assessment._id, selectedPDFFile);
      console.log('📥 PDF upload API response:', JSON.stringify(result, null, 2));
      
      // Extract data from response - handle different response structures
      const responseData = result.data || result;
      const extractedData = responseData?.droneAnalysisData || null;
      const pdfUrl = responseData?.droneAnalysisPdfUrl || responseData?.droneAnalysisPdfUrl || null;
      
      console.log('✅ Extracted drone analysis data:', JSON.stringify(extractedData, null, 2));
      
      // Update assessment immediately with extracted data
      if (extractedData || pdfUrl) {
        setAssessment({
          ...assessment,
          droneAnalysisPdfUrl: pdfUrl || assessment.droneAnalysisPdfUrl,
          droneAnalysisData: extractedData || assessment.droneAnalysisData
        });
      }
      
      // Reload assessment to get the latest data from the API (ensures consistency)
      try {
        const updated = await assessmentsApiService.getAssessmentById(assessment._id);
        const updatedData = updated.data || updated;
        
        // Use the latest data from API, but prefer extracted data if it's more complete
        const latestDroneData = updatedData?.droneAnalysisData || extractedData;
        
        setAssessment({
          ...updatedData,
          droneAnalysisData: latestDroneData || updatedData?.droneAnalysisData
        });
        
        console.log('✅ Assessment reloaded with drone data:', {
          hasDroneAnalysisData: !!latestDroneData,
          hasPdfUrl: !!updatedData?.droneAnalysisPdfUrl,
          droneAnalysisData: latestDroneData
        });
      } catch (reloadErr) {
        console.warn('⚠️ Failed to reload assessment, using upload result:', reloadErr);
        // Continue with the data we extracted from the upload response
      }
      
      // Show success message based on whether data was extracted
      const hasExtractedData = extractedData && (
        extractedData.cropHealth || 
        extractedData.coverage !== undefined || 
        (extractedData.anomalies && extractedData.anomalies.length > 0)
      );
      
      toast({
        title: "Upload Successful",
        description: hasExtractedData 
          ? "Drone PDF uploaded and analyzed successfully. Extracted data is displayed below."
          : "Drone PDF uploaded successfully. Analysis data will be available shortly.",
      });
      
      setSelectedPDFFile(null);
    } catch (err: any) {
      console.error('❌ Failed to upload PDF:', err);
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload drone PDF",
        variant: "destructive",
      });
    } finally {
      setUploadingPDF(false);
    }
  };

  // Save comprehensive notes
  const handleSaveNotes = async () => {
    if (!assessment?._id) {
      toast({
        title: "Error",
        description: "Assessment not loaded",
        variant: "destructive",
      });
      return;
    }

    setSavingNotes(true);
    try {
      await assessmentsApiService.updateAssessment(assessment._id, {
        comprehensiveNotes: comprehensiveNotes,
      });
      
      // Reload assessment
      const updated = await assessmentsApiService.getAssessmentById(assessment._id);
      setAssessment(updated.data || updated);
      
      toast({
        title: "Success",
        description: "Comprehensive notes saved successfully",
      });
    } catch (err: any) {
      console.error('Failed to save notes:', err);
      toast({
        title: "Save Failed",
        description: err.message || "Failed to save notes",
        variant: "destructive",
      });
    } finally {
      setSavingNotes(false);
    }
  };

  // Generate report
  const handleGenerateReport = async () => {
    if (!assessment?._id) {
      toast({
        title: "Error",
        description: "Assessment not loaded",
        variant: "destructive",
      });
      return;
    }

    // Validation
    if (riskScore === null || riskScore === undefined || typeof riskScore !== 'number') {
      toast({
        title: "Validation Error",
        description: "Please calculate risk score before generating report",
        variant: "destructive",
      });
      return;
    }

    if (!comprehensiveNotes || comprehensiveNotes.trim().length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add comprehensive notes before generating report",
        variant: "destructive",
      });
      return;
    }

    setGeneratingReport(true);
    try {
      await assessmentsApiService.generateReport(assessment._id);
      
      // Reload assessment
      const updated = await assessmentsApiService.getAssessmentById(assessment._id);
      setAssessment(updated.data || updated);
      
      toast({
        title: "Success",
        description: "Report generated. Insurer has been notified.",
      });
    } catch (err: any) {
      console.error('Failed to generate report:', err);
      toast({
        title: "Generation Failed",
        description: err.message || "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setGeneratingReport(false);
    }
  };

  // Get risk score color
  const getRiskScoreColor = (score: number | null | undefined) => {
    if (score === null || score === undefined || typeof score !== 'number') return 'bg-gray-500';
    if (score <= 30) return 'bg-green-600';
    if (score <= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Get risk score label
  const getRiskScoreLabel = (score: number | null | undefined) => {
    if (score === null || score === undefined || typeof score !== 'number') return 'Not Calculated';
    if (score <= 30) return 'Low Risk';
    if (score <= 70) return 'Medium Risk';
    return 'High Risk';
  };

  // Filter farmers
  const filteredFarmers = farmers.filter(farmer => {
    const query = searchQuery.toLowerCase();
    return (
      farmer.firstName.toLowerCase().includes(query) ||
      farmer.lastName.toLowerCase().includes(query) ||
      farmer.email.toLowerCase().includes(query) ||
      farmer.phoneNumber.includes(query) ||
      farmer.farmerProfile.farmProvince.toLowerCase().includes(query) ||
      farmer.farmerProfile.farmDistrict.toLowerCase().includes(query)
    );
  });

  // Render Farmers List View
  if (viewMode === "farmers") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Shield className="h-8 w-8 text-green-600" />
                  Risk Assessment
                </h1>
                <p className="text-sm text-gray-500 mt-1">Manage assigned farms and assessments</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search farmers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-white border-gray-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {loading ? (
            <Card className="bg-white border border-gray-200 shadow-lg rounded-xl">
              <CardContent className="p-16">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                  <p className="text-sm text-gray-600">Loading farmers...</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredFarmers.length === 0 ? (
            <Card className="bg-white border border-gray-200 shadow-lg rounded-xl">
              <CardContent className="p-16 text-center">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-base font-semibold text-gray-900 mb-1">No farmers found</p>
                <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredFarmers.map((farmer) => (
                <Card key={farmer.id} className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b border-gray-200 px-6 py-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">
                          {farmer.firstName} {farmer.lastName}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {farmer.email} • {farmer.phoneNumber}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {farmer.farmerProfile.farmProvince}, {farmer.farmerProfile.farmDistrict}, {farmer.farmerProfile.farmSector}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Farms</h3>
                      {farmer.farms.length === 0 ? (
                        <p className="text-sm text-gray-500">No farms assigned</p>
                      ) : (
                        <div className="space-y-3">
                          {farmer.farms.map((farm) => (
                            <div
                              key={farm.id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <Sprout className="h-5 w-5 text-green-600" />
                                  <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                      {farm.name || `Farm - ${farm.cropType}`}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      {farm.cropType} • Sown: {new Date(farm.sowingDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge
                                  className={
                                    farm.status === "PENDING"
                                      ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                      : "bg-green-100 text-green-800 border-green-300"
                                  }
                                >
                                  {farm.status}
                                </Badge>
                                {farm.status === "PENDING" ? (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedFarm(farm);
                                      setSelectedFarmer(farmer);
                                      setShowKMLUpload(farm.id);
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload KML
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedFarm(farm);
                                      setSelectedFarmer(farmer);
                                      loadAssessmentForFarm(farm.id);
                                    }}
                                    className="border-green-600 text-green-600 hover:bg-green-50"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Assessment
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* KML Upload Dialog */}
        {showKMLUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="bg-white w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Upload KML File</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Farm Name</Label>
                  <Input
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="Enter farm name"
                  />
                </div>
                <div>
                  <Label>KML File (.kml, max 1MB)</Label>
                  <Input
                    type="file"
                    accept=".kml"
                    onChange={handleKMLFileChange}
                  />
                  {selectedKMLFile && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected: {selectedKMLFile.name} ({(selectedKMLFile.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleUploadKML(showKMLUpload)}
                    disabled={!selectedKMLFile || !farmName.trim() || uploadingKML}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {uploadingKML ? "Uploading..." : "Upload"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowKMLUpload(null);
                      setSelectedKMLFile(null);
                      setFarmName("");
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // Render Assessment View
  if (!assessment || !selectedFarm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setViewMode("farmers");
                setAssessment(null);
                setSelectedFarm(null);
                setSelectedFarmer(null);
              }}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Farmers
            </Button>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Risk Assessment</h1>
            <p className="text-sm text-gray-500 mt-1">
              {selectedFarmer?.firstName} {selectedFarmer?.lastName} • {selectedFarm.cropType} • {selectedFarm.name || "Farm"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-gray-200 shadow-sm inline-flex h-12 items-center justify-center rounded-xl p-1.5 gap-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-600 data-[state=active]:text-white px-5 py-2.5 rounded-lg text-sm font-medium">
              <FileText className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="field-data" className="data-[state=active]:bg-green-600 data-[state=active]:text-white px-5 py-2.5 rounded-lg text-sm font-medium">
              <BarChart3 className="h-4 w-4 mr-2" />
              Field Data
            </TabsTrigger>
            <TabsTrigger value="weather" className="data-[state=active]:bg-green-600 data-[state=active]:text-white px-5 py-2.5 rounded-lg text-sm font-medium">
              <CloudRain className="h-4 w-4 mr-2" />
              Weather
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Risk Score Card */}
            <Card className="bg-gradient-to-br from-white to-green-50/30 border-2 border-green-200 shadow-lg rounded-xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b border-green-200 px-6 py-5">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Activity className="h-5 w-5 text-green-600" />
                    </div>
                    <span>Risk Assessment Score</span>
                  </div>
                  {riskScore !== null && riskScore !== undefined && typeof riskScore === 'number' && (
                    <Badge className={`${getRiskScoreColor(riskScore)} text-white`}>
                      {getRiskScoreLabel(riskScore)}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {riskScore !== null && riskScore !== undefined && typeof riskScore === 'number' ? (
                  <div className="text-center py-6">
                    <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getRiskScoreColor(riskScore)} text-white text-4xl font-bold mb-4`}>
                      {riskScore.toFixed(1)}
                    </div>
                    <p className="text-gray-600">{getRiskScoreLabel(riskScore)}</p>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4">Risk score has not been calculated yet.</p>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!calculatingRisk && assessment?._id) {
                          handleCalculateRiskScore();
                        }
                      }}
                      disabled={calculatingRisk || !assessment?._id}
                      className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {calculatingRisk ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Calculating...
                        </>
                      ) : (
                        <>
                          <Activity className="h-4 w-4 mr-2" />
                          Calculate Risk Score
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-500 mt-3">
                      Note: If calculation fails, the endpoint may not be available yet on the server.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Drone PDF Upload */}
            <Card className="bg-white border border-gray-200 shadow-lg rounded-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b border-gray-200 px-6 py-5">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Upload className="h-5 w-5 text-purple-600" />
                  </div>
                  Drone Analysis PDF
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {assessment.droneAnalysisPdfUrl ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-sm font-medium text-green-900">PDF uploaded successfully</p>
                    </div>
                    <a
                      href={assessment.droneAnalysisPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-700 hover:text-green-900 hover:underline flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      View PDF
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setSelectedPDFFile(e.target.files?.[0] || null)}
                    />
                    {selectedPDFFile && (
                      <p className="text-sm text-gray-600">Selected: {selectedPDFFile.name}</p>
                    )}
                    <Button
                      onClick={handleUploadPDF}
                      disabled={!selectedPDFFile || uploadingPDF}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {uploadingPDF ? "Uploading..." : "Upload PDF"}
                    </Button>
                  </div>
                )}
                
                {/* Display extracted drone data - Automatically shown after upload */}
                {assessment.droneAnalysisData && (
                  <div className="mt-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl animate-in fade-in duration-300 shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-200 rounded-full">
                        <CheckCircle className="h-5 w-5 text-green-700" />
                      </div>
                      <p className="text-base font-bold text-gray-900">Extracted Analysis Data</p>
                      <Badge variant="outline" className="ml-auto bg-green-100 text-green-700 border-green-400 font-semibold">
                        Auto-extracted
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {assessment.droneAnalysisData.cropHealth && (
                        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Crop Health</p>
                          <div className="flex items-center gap-2">
                            <Leaf className="h-5 w-5 text-green-600" />
                            <p className="text-base font-bold text-gray-900">{assessment.droneAnalysisData.cropHealth}</p>
                          </div>
                        </div>
                      )}
                      {assessment.droneAnalysisData.coverage !== undefined && (
                        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Coverage</p>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-3 shadow-inner">
                              <div
                                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                                style={{ width: `${assessment.droneAnalysisData.coverage}%` }}
                              />
                            </div>
                            <span className="text-base font-bold text-gray-900 min-w-[3rem] text-right">
                              {assessment.droneAnalysisData.coverage}%
                            </span>
                          </div>
                        </div>
                      )}
                      {assessment.droneAnalysisData.anomalies && Array.isArray(assessment.droneAnalysisData.anomalies) && assessment.droneAnalysisData.anomalies.length > 0 && (
                        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Anomalies Detected</p>
                          <ul className="space-y-2">
                            {assessment.droneAnalysisData.anomalies.map((anomaly: string, index: number) => (
                              <li key={index} className="text-sm text-gray-900 flex items-start gap-2 p-2 bg-amber-50 rounded border border-amber-200">
                                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                <span>{anomaly}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {/* Display any additional fields from the extracted data */}
                      {Object.keys(assessment.droneAnalysisData).some(key => 
                        !['cropHealth', 'coverage', 'anomalies'].includes(key)
                      ) && (
                        <details className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
                          <summary className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-gray-900 mb-2">
                            View All Extracted Data
                          </summary>
                          <pre className="text-xs bg-gray-50 p-3 rounded border border-gray-200 overflow-auto mt-2 max-h-48">
                            {JSON.stringify(assessment.droneAnalysisData, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Show message if PDF uploaded but analysis data is still processing */}
                {assessment.droneAnalysisPdfUrl && !assessment.droneAnalysisData && !uploadingPDF && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-pulse">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <p className="text-sm font-medium text-blue-900">
                        Drone PDF uploaded. Analysis data is being processed...
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comprehensive Notes */}
            <Card className="bg-white border border-gray-200 shadow-lg rounded-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-200 px-6 py-5">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  Comprehensive Assessment Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Textarea
                  value={comprehensiveNotes}
                  onChange={(e) => setComprehensiveNotes(e.target.value)}
                  placeholder="Enter comprehensive assessment notes here..."
                  className="min-h-[200px] border-gray-300"
                />
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">{comprehensiveNotes.length} characters</p>
                  <Button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {savingNotes ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Notes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Generate Report */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50/30 border-2 border-amber-200 shadow-lg rounded-xl">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-white border-b border-amber-200 px-6 py-5">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <FileText className="h-5 w-5 text-amber-600" />
                  </div>
                  Generate Full Assessment Report
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className={`flex items-center gap-2 p-2 rounded ${riskScore !== null && riskScore !== undefined && typeof riskScore === 'number' ? 'bg-green-50' : 'bg-gray-50'}`}>
                    {riskScore !== null && riskScore !== undefined && typeof riskScore === 'number' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-gray-400" />
                    )}
                    <span className={`text-sm ${riskScore !== null && riskScore !== undefined && typeof riskScore === 'number' ? 'text-green-900' : 'text-gray-600'}`}>
                      Risk score calculated {riskScore !== null && riskScore !== undefined && typeof riskScore === 'number' ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className={`flex items-center gap-2 p-2 rounded ${comprehensiveNotes.trim().length > 0 ? 'bg-green-50' : 'bg-gray-50'}`}>
                    {comprehensiveNotes.trim().length > 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-gray-400" />
                    )}
                    <span className={`text-sm ${comprehensiveNotes.trim().length > 0 ? 'text-green-900' : 'text-gray-600'}`}>
                      Comprehensive notes added {comprehensiveNotes.trim().length > 0 ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleGenerateReport}
                  disabled={generatingReport || riskScore === null || riskScore === undefined || typeof riskScore !== 'number' || comprehensiveNotes.trim().length === 0}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12 font-semibold"
                >
                  {generatingReport ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5 mr-2" />
                      Generate & Send Report to Insurer
                    </>
                  )}
                </Button>
                {assessment.reportGenerated && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-700" />
                      <p className="text-sm font-semibold text-green-900">
                        Report generated successfully
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Field Data Tab */}
          <TabsContent value="field-data" className="mt-6">
            <Card className="bg-white border border-gray-200 shadow-lg rounded-xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b border-gray-200 px-6 py-5">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  Field Statistics (NDVI, MSAVI, NDMI, EVI)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {loadingData ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading field statistics...</p>
                  </div>
                ) : fieldStatistics ? (
                  <div className="space-y-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={fieldStatistics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="ndvi" stroke="#8884d8" name="NDVI" />
                        <Line type="monotone" dataKey="msavi" stroke="#82ca9d" name="MSAVI" />
                        <Line type="monotone" dataKey="ndmi" stroke="#ffc658" name="NDMI" />
                        <Line type="monotone" dataKey="evi" stroke="#ff7300" name="EVI" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm font-medium text-gray-900 mb-1">Field Statistics Not Available</p>
                    <p className="text-xs text-gray-500 mb-3">
                      EOSDA data is currently unavailable. This may be due to:
                    </p>
                    <ul className="text-xs text-gray-500 text-left max-w-md mx-auto space-y-1 mb-4">
                      <li>• API request limit exceeded</li>
                      <li>• Farm not yet registered with EOSDA</li>
                      <li>• Data processing in progress</li>
                    </ul>
                    <p className="text-xs text-gray-600">
                      Field statistics will be available once the farm is fully registered with EOSDA.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weather Tab */}
          <TabsContent value="weather" className="mt-6">
            <Card className="bg-white border border-gray-200 shadow-lg rounded-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-200 px-6 py-5">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CloudRain className="h-5 w-5 text-blue-600" />
                  </div>
                  Historical Weather Data
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {loadingData ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading weather data...</p>
                  </div>
                ) : weatherData ? (
                  <div className="space-y-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={weatherData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperature (°C)" />
                        <Line type="monotone" dataKey="precipitation" stroke="#82ca9d" name="Precipitation (mm)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CloudRain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm font-medium text-gray-900 mb-1">Weather Data Not Available</p>
                    <p className="text-xs text-gray-500 mb-3">
                      Historical weather data requires the farm to be registered with EOSDA.
                    </p>
                    <ul className="text-xs text-gray-500 text-left max-w-md mx-auto space-y-1 mb-4">
                      <li>• Farm must have EOSDA field ID</li>
                      <li>• KML file must be uploaded and processed</li>
                      <li>• EOSDA registration must be completed</li>
                    </ul>
                    <p className="text-xs text-gray-600">
                      Weather data will be available once the farm is fully registered with EOSDA.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

