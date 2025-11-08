import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardTheme } from "@/utils/dashboardTheme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search,
  Filter,
  Calendar,
  Paperclip,
  CheckCircle,
  AlertTriangle,
  FileText,
  Save,
  FileDown,
  MapPin,
  Plus,
  RefreshCw,
  X,
  Send
} from "lucide-react";
import { getClaims, getClaimById, updateClaimAssessment, submitAssessment } from "@/services/claimsApi";
import { getUserId } from "@/services/authAPI";
import { getUserById } from "@/services/usersAPI";
import { getFarmById } from "@/services/farmsApi";
import { useToast } from "@/hooks/use-toast";

interface LossAssessment {
  id: string;
  farmerName: string;
  fieldId: string;
  crop: string;
  area: string;
  cause: string;
  date: string;
  severity: string;
  affectedArea: string;
  affectedPercentage: number;
  status: string;
}

export default function LossAssessmentSystem() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssessment, setSelectedAssessment] = useState<LossAssessment | null>(null);
  const [assessmentNotes, setAssessmentNotes] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [assessments, setAssessments] = useState<LossAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [currentClaim, setCurrentClaim] = useState<any | null>(null);
  const [claimAssessmentForm, setClaimAssessmentForm] = useState({
    visitDate: new Date().toISOString().split('T')[0],
    observations: [] as string[],
    observationInput: "",
    reportText: "",
    damageArea: "",
    ndviBefore: "",
    ndviAfter: "",
  });
  const [isUpdatingAssessment, setIsUpdatingAssessment] = useState(false);
  const [isSubmittingAssessment, setIsSubmittingAssessment] = useState(false);

  const assessorId = getUserId() || "";

  useEffect(() => {
    loadLossAssessments();
  }, []);

  useEffect(() => {
    if (selectedAssessment && viewMode === "detail") {
      loadAssessmentDetail(selectedAssessment.id);
    }
  }, [selectedAssessment, viewMode]);

  const loadLossAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await getClaims();
      const claimsData = response.data || response || [];
      const claimsArray = Array.isArray(claimsData) ? claimsData : (claimsData.items || claimsData.results || []);

      // Filter claims assigned to this assessor
      const assignedClaims = claimsArray.filter((claim: any) => {
        if (!assessorId) return false;
        const claimAssessorId = claim.assessorId || claim.assessor?._id || claim.assessor?.id;
        return claimAssessorId === assessorId || claimAssessorId === assessorId.toString();
      });

      // Map claims to LossAssessment interface
      const mappedAssessments: LossAssessment[] = await Promise.all(
        assignedClaims.map(async (claim: any) => {
          const claimId = claim._id || claim.id || "";
          const claimDate = claim.createdAt || claim.submittedAt || claim.date || new Date().toISOString();
          const farmerId = claim.farmerId?._id || claim.farmerId || claim.farmer?.id || "";
          let farmerName = "Unknown Farmer";
          let fieldId = claim.fieldId || claim.farmId || "";
          let crop = claim.cropType || claim.crop || "Unknown";
          let area = "0 ha";
          let location = "";

          // Get farmer info
          if (claim.farmer || claim.farmerId) {
            const farmer = claim.farmer || claim.farmerId;
            if (typeof farmer === 'object') {
              farmerName = farmer.firstName && farmer.lastName
                ? `${farmer.firstName} ${farmer.lastName}`
                : farmer.email || farmer.phoneNumber || "Unknown Farmer";
            }
          }

          // Try to get farmer info from API if needed
          if (farmerName === "Unknown Farmer" && farmerId) {
            try {
              const farmerData: any = await getUserById(farmerId);
              const farmer = farmerData.data || farmerData;
              farmerName = farmer.firstName && farmer.lastName
                ? `${farmer.firstName} ${farmer.lastName}`
                : farmer.email || farmer.phoneNumber || "Unknown Farmer";
            } catch (err) {
              console.error('Failed to load farmer data:', err);
            }
          }

          // Get farm/field info if available
          if (fieldId) {
            try {
              const farmData = await getFarmById(fieldId);
              const farm = farmData.data || farmData;
              if (farm) {
                crop = farm.cropType || farm.crop || crop;
                if (farm.area || farm.size) {
                  area = `${farm.area || farm.size} ha`;
                }
                if (farm.location) {
                  if (typeof farm.location === 'string') {
                    location = farm.location;
                  } else if (farm.location.coordinates && Array.isArray(farm.location.coordinates)) {
                    location = `${farm.location.coordinates[1]?.toFixed(4)}, ${farm.location.coordinates[0]?.toFixed(4)}`;
                  }
                }
              }
            } catch (err) {
              console.error('Failed to load farm data:', err);
            }
          }

          // Determine severity based on claim amount or damage description
          const lossEventType = claim.lossEventType || claim.damageType || claim.cause || "Unknown";
          const claimAmount = claim.amount || claim.claimAmount || 0;
          let severity = "Mild";
          if (claimAmount > 1000000 || lossEventType.toLowerCase().includes("severe") || lossEventType.toLowerCase().includes("drought")) {
            severity = "Severe";
          } else if (claimAmount > 500000 || lossEventType.toLowerCase().includes("moderate") || lossEventType.toLowerCase().includes("flood")) {
            severity = "Moderate";
          }

          // Calculate affected area and percentage (if available in claim data)
          const affectedArea = claim.affectedArea || claim.damagedArea || "0 ha";
          const affectedPercentage = claim.affectedPercentage || claim.damagePercentage || 0;

          return {
            id: claimId,
            farmerName,
            fieldId: fieldId || claim.claimNumber || claimId,
            crop,
            area,
            cause: lossEventType,
            date: new Date(claimDate).toLocaleDateString(),
            severity,
            affectedArea: typeof affectedArea === 'number' ? `${affectedArea} ha` : affectedArea,
            affectedPercentage,
            status: claim.status || "Pending"
          };
        })
      );

      setAssessments(mappedAssessments);
    } catch (err: any) {
      console.error('Failed to load loss assessments:', err);
      setError(err.message || 'Failed to load loss assessments');
      toast({
        title: 'Error loading loss assessments',
        description: err.message || 'Failed to load loss assessments',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAssessmentDetail = async (assessmentId: string) => {
    setLoadingDetail(true);
    try {
      const claimData: any = await getClaimById(assessmentId);
      const claim = claimData.data || claimData;
      setCurrentClaim(claim);
      
      if (claim && selectedAssessment) {
        // Update assessment notes if available
        if (claim.notes || claim.assessmentNotes) {
          setAssessmentNotes(claim.notes || claim.assessmentNotes || "");
        }

        // Load existing assessment data if available
        if (claim.assessmentReport) {
          const report = claim.assessmentReport;
          setClaimAssessmentForm({
            visitDate: report.visitDate ? new Date(report.visitDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            observations: report.observations || [],
            observationInput: "",
            reportText: report.reportText || "",
            damageArea: report.damageArea?.toString() || "",
            ndviBefore: report.ndviBefore?.toString() || "",
            ndviAfter: report.ndviAfter?.toString() || "",
          });
        }
      }
    } catch (err: any) {
      console.error('Failed to load assessment detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleUpdateAssessment = async () => {
    if (!selectedAssessment) return;

    setIsUpdatingAssessment(true);
    try {
      const assessmentData: any = {
        visitDate: new Date(claimAssessmentForm.visitDate).toISOString(),
        observations: claimAssessmentForm.observations,
        reportText: claimAssessmentForm.reportText,
      };

      // Add optional fields if provided
      if (claimAssessmentForm.damageArea) {
        assessmentData.damageArea = parseFloat(claimAssessmentForm.damageArea);
      }
      if (claimAssessmentForm.ndviBefore) {
        assessmentData.ndviBefore = parseFloat(claimAssessmentForm.ndviBefore);
      }
      if (claimAssessmentForm.ndviAfter) {
        assessmentData.ndviAfter = parseFloat(claimAssessmentForm.ndviAfter);
      }

      await updateClaimAssessment(selectedAssessment.id, assessmentData);
      
      toast({
        title: "Success",
        description: "Assessment updated successfully",
      });

      // Reload claim details
      await loadAssessmentDetail(selectedAssessment.id);
      await loadLossAssessments();
    } catch (err: any) {
      console.error('Failed to update assessment:', err);
      toast({
        title: "Error",
        description: err.message || 'Failed to update assessment',
        variant: 'destructive'
      });
    } finally {
      setIsUpdatingAssessment(false);
    }
  };

  const handleSubmitAssessment = async () => {
    if (!selectedAssessment) return;

    setIsSubmittingAssessment(true);
    try {
      // Prepare assessment data
      const assessmentData: any = {
        visitDate: new Date(claimAssessmentForm.visitDate).toISOString(),
        observations: claimAssessmentForm.observations,
        reportText: claimAssessmentForm.reportText,
      };

      // Add optional fields if provided
      if (claimAssessmentForm.damageArea) {
        assessmentData.damageArea = parseFloat(claimAssessmentForm.damageArea);
      }
      if (claimAssessmentForm.ndviBefore) {
        assessmentData.ndviBefore = parseFloat(claimAssessmentForm.ndviBefore);
      }
      if (claimAssessmentForm.ndviAfter) {
        assessmentData.ndviAfter = parseFloat(claimAssessmentForm.ndviAfter);
      }

      // Submit assessment (this will update and submit)
      await submitAssessment(selectedAssessment.id, assessmentData);
      
      toast({
        title: "Success",
        description: "Assessment submitted successfully",
      });

      // Reload data
      await loadAssessmentDetail(selectedAssessment.id);
      await loadLossAssessments();
    } catch (err: any) {
      console.error('Failed to submit assessment:', err);
      toast({
        title: "Error",
        description: err.message || 'Failed to submit assessment',
        variant: 'destructive'
      });
    } finally {
      setIsSubmittingAssessment(false);
    }
  };

  const addObservation = () => {
    if (claimAssessmentForm.observationInput.trim()) {
      setClaimAssessmentForm({
        ...claimAssessmentForm,
        observations: [...claimAssessmentForm.observations, claimAssessmentForm.observationInput.trim()],
        observationInput: "",
      });
    }
  };

  const removeObservation = (index: number) => {
    setClaimAssessmentForm({
      ...claimAssessmentForm,
      observations: claimAssessmentForm.observations.filter((_, i) => i !== index),
    });
  };

  const filteredAssessments = assessments.filter(assessment => {
    return searchQuery === "" ||
      assessment.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.fieldId.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleAssessmentClick = (assessment: LossAssessment) => {
    setSelectedAssessment(assessment);
    setViewMode("detail");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedAssessment(null);
  };

  const renderList = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Loss Assessment</h1>
        <p className="text-gray-600 mt-2">Document and evaluate crop loss events</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center justify-end gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${dashboardTheme.input} pl-10 w-64 border-gray-300`}
          />
        </div>
        <Button 
          onClick={loadLossAssessments}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <Card className={`${dashboardTheme.card}`}>
          <CardContent className="p-12">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading loss assessments...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className={`${dashboardTheme.card}`}>
          <CardContent className="p-6">
            <div className="text-center text-red-400">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
              <p>{error}</p>
              <Button 
                onClick={loadLossAssessments} 
                className="mt-4 bg-teal-500 hover:bg-teal-600 text-gray-900"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      {!loading && !error && (
        <Card className={`${dashboardTheme.card}`}>
          <CardContent className="p-0">
            {filteredAssessments.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-600">No loss assessments found.</p>
                {assessments.length === 0 && !assessorId && (
                  <p className="text-gray-500 text-sm mt-2">Please log in to view loss assessments.</p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Assessment ID</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Farmer</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Field ID</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Crop</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Cause</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Severity</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Affected Area</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssessments.map((assessment, index) => (
                      <tr
                        key={assessment.id}
                        onClick={() => handleAssessmentClick(assessment)}
                        className={`border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${
                          index % 2 === 0 ? "bg-gray-50" : ""
                        }`}
                      >
                        <td className="py-4 px-6 text-gray-900">{assessment.id}</td>
                        <td className="py-4 px-6 text-gray-900">{assessment.farmerName}</td>
                        <td className="py-4 px-6 text-gray-900">{assessment.fieldId}</td>
                        <td className="py-4 px-6 text-gray-900">{assessment.crop}</td>
                        <td className="py-4 px-6 text-gray-900">{assessment.cause}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            assessment.severity === "Severe"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : assessment.severity === "Moderate"
                              ? "bg-orange-100 text-orange-700 border border-orange-200"
                              : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                          }`}>
                            {assessment.severity}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-900">
                          {assessment.affectedArea} ({assessment.affectedPercentage}%)
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            assessment.status?.toLowerCase() === "approved"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : assessment.status?.toLowerCase() === "under review" || assessment.status?.toLowerCase() === "review"
                              ? "bg-blue-100 text-blue-700 border border-blue-200"
                              : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                          }`}>
                            {assessment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderDetail = () => {
    if (!selectedAssessment) return null;

    const lossData = {
      cause: selectedAssessment.cause,
      date: selectedAssessment.date,
      description: `${selectedAssessment.cause} affected ${selectedAssessment.affectedPercentage}% of the field.`,
      evidenceFiles: 3,
      affectedArea: selectedAssessment.affectedArea,
      affectedPercentage: selectedAssessment.affectedPercentage,
      severity: selectedAssessment.severity,
      yieldImpact: selectedAssessment.severity === "Severe" ? 75 : selectedAssessment.severity === "Moderate" ? 40 : 20
    };

    const decisionSupport = {
      policyThreshold: 30,
      meetsCondition: selectedAssessment.affectedPercentage >= 30,
      thresholdExcess: Math.max(0, selectedAssessment.affectedPercentage - 30),
      recommendation: selectedAssessment.affectedPercentage >= 30 
        ? "Proceed to claim validation" 
        : "Does not meet minimum threshold"
    };

    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <button 
            onClick={handleBackToList}
            className="text-teal-400 hover:text-teal-300"
          >
            Loss Assessments
          </button>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className={`${dashboardTheme.card} border border-gray-200`}>
            <TabsTrigger 
              value="details" 
              className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 text-gray-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              Loss Details
            </TabsTrigger>
            <TabsTrigger 
              value="quantification" 
              className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 text-gray-700"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Quantification
            </TabsTrigger>
            <TabsTrigger 
              value="decision" 
              className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 text-gray-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Decision Support
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Loss Details */}
          <TabsContent value="details" className="space-y-6">
            {/* Field Summary */}
            <Card className={`${dashboardTheme.card}`}>
              <CardHeader>
                <CardTitle className="text-gray-900">Field Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="border-r border-gray-200 pr-4">
                    <p className="text-sm text-gray-600 mb-1">Farmer</p>
                    <p className="text-gray-900 font-medium">{selectedAssessment.farmerName}</p>
                  </div>
                  <div className="border-r border-gray-200 pr-4">
                    <p className="text-sm text-gray-600 mb-1">Field ID</p>
                    <p className="text-gray-900 font-medium">{selectedAssessment.fieldId}</p>
                  </div>
                  <div className="border-r border-gray-200 pr-4">
                    <p className="text-sm text-gray-600 mb-1">Crop</p>
                    <p className="text-gray-900 font-medium">{selectedAssessment.crop}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Area</p>
                    <p className="text-gray-900 font-medium">{selectedAssessment.area}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loss Details */}
            <Card className={`${dashboardTheme.card}`}>
              <CardHeader>
                <CardTitle className="text-gray-900">Loss Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cause" className="text-gray-700 mb-2 block">Cause</Label>
                    <Input
                      id="cause"
                      value={lossData.cause}
                      readOnly
                      className={`${dashboardTheme.input} border-gray-300`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date" className="text-gray-700 mb-2 block">Date</Label>
                    <div className="relative">
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="date"
                        value={lossData.date}
                        readOnly
                        className={`${dashboardTheme.input} border-gray-300 pr-10`}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description" className="text-gray-700 mb-2 block">Description</Label>
                  <Textarea
                    id="description"
                    value={lossData.description}
                    readOnly
                    className={`${dashboardTheme.input} border-gray-300 min-h-[100px]`}
                  />
                </div>
                <div>
                  <Label className="text-gray-700 mb-2 block">Evidence</Label>
                  <Button 
                    variant="outline" 
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    <Paperclip className="h-4 w-4 mr-2" />
                    View Attachments ({lossData.evidenceFiles} files)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Quantification */}
          <TabsContent value="quantification" className="space-y-6">
            {/* Assessment Form */}
            <Card className={`${dashboardTheme.card}`}>
              <CardHeader>
                <CardTitle className="text-gray-900">Update Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-700 mb-2 block">Visit Date *</Label>
                  <Input
                    type="date"
                    value={claimAssessmentForm.visitDate}
                    onChange={(e) => setClaimAssessmentForm({ ...claimAssessmentForm, visitDate: e.target.value })}
                    className={`${dashboardTheme.input} border-gray-300`}
                  />
                </div>

                <div>
                  <Label className="text-gray-700 mb-2 block">Observations</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={claimAssessmentForm.observationInput}
                      onChange={(e) => setClaimAssessmentForm({ ...claimAssessmentForm, observationInput: e.target.value })}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addObservation();
                        }
                      }}
                      placeholder="Enter an observation and press Enter"
                      className={`${dashboardTheme.input} border-gray-300`}
                    />
                    <Button
                      onClick={addObservation}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {claimAssessmentForm.observations.map((obs, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
                        <span className="text-gray-700 text-sm">{obs}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeObservation(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-gray-700 mb-2 block">Damage Area (ha) - Optional</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={claimAssessmentForm.damageArea}
                    onChange={(e) => setClaimAssessmentForm({ ...claimAssessmentForm, damageArea: e.target.value })}
                    placeholder="Leave empty to auto-calculate"
                    className={`${dashboardTheme.input} border-gray-300`}
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty to let backend calculate from NDVI</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700 mb-2 block">NDVI Before - Optional</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={claimAssessmentForm.ndviBefore}
                      onChange={(e) => setClaimAssessmentForm({ ...claimAssessmentForm, ndviBefore: e.target.value })}
                      placeholder="Auto-calculated if empty"
                      className={`${dashboardTheme.input} border-gray-300`}
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 mb-2 block">NDVI After - Optional</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={claimAssessmentForm.ndviAfter}
                      onChange={(e) => setClaimAssessmentForm({ ...claimAssessmentForm, ndviAfter: e.target.value })}
                      placeholder="Auto-calculated if empty"
                      className={`${dashboardTheme.input} border-gray-300`}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">NDVI values will be automatically calculated by backend if not provided</p>

                <div>
                  <Label className="text-gray-700 mb-2 block">Assessment Report *</Label>
                  <Textarea
                    value={claimAssessmentForm.reportText}
                    onChange={(e) => setClaimAssessmentForm({ ...claimAssessmentForm, reportText: e.target.value })}
                    placeholder="Enter detailed assessment report..."
                    className={`${dashboardTheme.input} border-gray-300 min-h-[120px]`}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleUpdateAssessment}
                    disabled={isUpdatingAssessment || !claimAssessmentForm.visitDate || !claimAssessmentForm.reportText}
                    className="bg-teal-500 hover:bg-teal-600 text-gray-900"
                  >
                    {isUpdatingAssessment ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Assessment
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleSubmitAssessment}
                    disabled={isSubmittingAssessment || isUpdatingAssessment || !claimAssessmentForm.visitDate || !claimAssessmentForm.reportText || selectedAssessment?.status?.toLowerCase() === 'assessed'}
                    className="bg-green-500 hover:bg-green-600 text-gray-900"
                  >
                    {isSubmittingAssessment ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Assessment
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Loss Quantification */}
            <Card className={`${dashboardTheme.card}`}>
              <CardHeader>
                <CardTitle className="text-gray-900">Loss Quantification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-orange-950/30 border border-orange-900/50 rounded-lg p-6">
                    <p className="text-3xl font-bold text-orange-400 mb-1">
                      {lossData.affectedArea}
                    </p>
                    <p className="text-sm text-gray-900/80">Affected Area</p>
                    <p className="text-xs text-orange-400 mt-1">({lossData.affectedPercentage}%)</p>
                  </div>
                  <div className="bg-orange-950/30 border border-orange-900/50 rounded-lg p-6">
                    <p className="text-3xl font-bold text-orange-400 mb-1">
                      {lossData.severity}
                    </p>
                    <p className="text-sm text-gray-900/80">Severity</p>
                  </div>
                  <div className="bg-orange-950/30 border border-orange-900/50 rounded-lg p-6">
                    <p className="text-3xl font-bold text-orange-400 mb-1">
                      {lossData.yieldImpact}%
                    </p>
                    <p className="text-sm text-gray-900/80">Yield Impact</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Visualization */}
            <Card className={`${dashboardTheme.card}`}>
              <CardHeader>
                <CardTitle className="text-gray-900">Map Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg border border-gray-800 h-[500px] flex items-center justify-center relative">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-900/30" />
                    <p className="text-gray-900/60 text-lg font-medium">Map View</p>
                    <p className="text-gray-900/40 text-sm mt-2">Field: {selectedAssessment.fieldId}</p>
                    <p className="text-gray-900/40 text-sm">Damage Overlay</p>
                  </div>
                  {/* Legend */}
                  <div className="absolute bottom-4 right-4 bg-gray-100 border border-gray-800 rounded-lg p-3">
                    <p className="text-gray-900/80 text-sm font-medium mb-2">Legend</p>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      <span className="text-gray-900/70 text-xs">Affected Area</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-gray-900/70 text-xs">Normal Area</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Decision Support */}
          <TabsContent value="decision" className="space-y-6">
            {/* Decision Support */}
            <Card className={`${dashboardTheme.card}`}>
              <CardHeader>
                <CardTitle className="text-gray-900">Decision Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-yellow-950/20 border border-yellow-900/30 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <p className="text-gray-900 font-medium">Policy Threshold</p>
                    </div>
                    <p className="text-4xl font-bold text-gray-900 mb-1">
                      {decisionSupport.policyThreshold}%
                    </p>
                    <p className="text-sm text-gray-900/60">Minimum affected area</p>
                  </div>

                  <div className={`${decisionSupport.meetsCondition ? 'bg-green-950/20 border-green-900/30' : 'bg-red-950/20 border-red-900/30'} rounded-lg p-6`}>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className={`h-5 w-5 ${decisionSupport.meetsCondition ? 'text-green-500' : 'text-red-500'}`} />
                      <p className="text-gray-900 font-medium">Meets Condition</p>
                    </div>
                    <p className={`text-4xl font-bold mb-1 ${decisionSupport.meetsCondition ? 'text-green-500' : 'text-red-500'}`}>
                      {decisionSupport.meetsCondition ? 'YES' : 'NO'}
                    </p>
                    <p className="text-sm text-gray-900/60">
                      {decisionSupport.meetsCondition 
                        ? `Exceeds threshold by ${decisionSupport.thresholdExcess}%`
                        : `Below threshold by ${decisionSupport.thresholdExcess}%`
                      }
                    </p>
                  </div>
                </div>

                <div className="bg-teal-950/20 border border-teal-900/30 rounded-lg p-6">
                  <p className="text-gray-900 font-medium mb-2">Recommendation</p>
                  <p className="text-gray-900/80">{decisionSupport.recommendation}</p>
                </div>
              </CardContent>
            </Card>

            {/* Assessor Notes */}
            <Card className={`${dashboardTheme.card}`}>
              <CardHeader>
                <CardTitle className="text-gray-900">Assessor Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={assessmentNotes}
                  onChange={(e) => setAssessmentNotes(e.target.value)}
                  placeholder="Add your assessment notes here..."
                  className={`${dashboardTheme.input} border-gray-300 min-h-[120px]`}
                />
                <Button className={`${dashboardTheme.card} text-gray-900 hover:bg-gray-800 border border-gray-300`}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Generate Report PDF
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  if (viewMode === "detail") {
    return renderDetail();
  }

  return renderList();
}
