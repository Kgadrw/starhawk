import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardTheme } from "@/utils/dashboardTheme";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  MapPin,
  Calendar,
  User,
  Crop,
  AlertTriangle,
  Shield,
  BarChart3,
  Camera,
  FileText,
  Save,
  Send,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  X,
  CloudRain,
  Sun,
  Wind,
  Thermometer,
  Droplets,
  Leaf,
  Bug,
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react";

interface RiskAssessment {
  id: string;
  farmerId: string;
  farmerName: string;
  cropType: string;
  farmSize: number;
  location: string;
  assessorId: string;
  assessorName: string;
  riskLevel: "low" | "medium" | "high";
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected";
  submittedDate?: string;
  reviewDate?: string;
  coverageRecommendation?: number;
  premiumRecommendation?: number;
  riskFactors: string[];
  mitigationMeasures: string[];
  weatherRisk: number;
  soilQuality: number;
  marketRisk: number;
  pestRisk: number;
  overallScore: number;
  notes?: string;
  reviewerNotes?: string;
  decision?: "approve" | "reject" | "request_more_info";
  photos?: string[];
  gpsCoordinates?: { lat: number; lng: number };
  weatherData?: {
    temperature: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
  };
}

export default function RiskAssessmentSystem() {
  const [assessments, setAssessments] = useState<RiskAssessment[]>([
    {
      id: "RISK-001",
      farmerId: "FMR-0247",
      farmerName: "Jean Baptiste",
      cropType: "Maize",
      farmSize: 2.5,
      location: "Nyagatare District",
      assessorId: "ASS-001",
      assessorName: "Richard Nkurunziza",
      riskLevel: "low",
      status: "submitted",
      submittedDate: "2024-10-03",
      coverageRecommendation: 250000,
      premiumRecommendation: 15000,
      riskFactors: [
        "Moderate rainfall variability",
        "Occasional pest outbreaks",
        "Market price fluctuations"
      ],
      mitigationMeasures: [
        "Implement irrigation system",
        "Regular pest monitoring",
        "Diversify crop portfolio"
      ],
      weatherRisk: 45,
      soilQuality: 85,
      marketRisk: 60,
      pestRisk: 35,
      overallScore: 75,
      notes: "Good soil quality and experienced farmer. Low overall risk profile.",
      photos: ["photo1.jpg", "photo2.jpg"],
      gpsCoordinates: { lat: -1.9441, lng: 30.0619 }
    }
  ]);

  const [activeTab, setActiveTab] = useState("assessments");
  const [isCreating, setIsCreating] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<RiskAssessment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Form state for new/edit assessment
  const [formData, setFormData] = useState({
    farmerId: "",
    farmerName: "",
    cropType: "",
    farmSize: 0,
    location: "",
    weatherRisk: 50,
    soilQuality: 50,
    marketRisk: 50,
    pestRisk: 50,
    riskFactors: [] as string[],
    mitigationMeasures: [] as string[],
    notes: ""
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800";
      case "submitted": return "bg-blue-100 text-blue-800";
      case "under_review": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft": return <Edit className="h-4 w-4" />;
      case "submitted": return <Send className="h-4 w-4" />;
      case "under_review": return <Clock className="h-4 w-4" />;
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "rejected": return <X className="h-4 w-4" />;
      default: return <Edit className="h-4 w-4" />;
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const calculateOverallScore = () => {
    const weights = { weather: 0.3, soil: 0.25, market: 0.25, pest: 0.2 };
    const score = Math.round(
      (formData.weatherRisk * weights.weather) +
      (formData.soilQuality * weights.soil) +
      (formData.marketRisk * weights.market) +
      (formData.pestRisk * weights.pest)
    );
    return score;
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return "high";
    if (score >= 50) return "medium";
    return "low";
  };

  const handleSaveAssessment = () => {
    const overallScore = calculateOverallScore();
    const riskLevel = getRiskLevel(overallScore);
    
    const newAssessment: RiskAssessment = {
      id: `RISK-${String(assessments.length + 1).padStart(3, '0')}`,
      farmerId: formData.farmerId,
      farmerName: formData.farmerName,
      cropType: formData.cropType,
      farmSize: formData.farmSize,
      location: formData.location,
      assessorId: "ASS-001", // Current assessor
      assessorName: "Richard Nkurunziza",
      riskLevel,
      status: "draft",
      coverageRecommendation: formData.farmSize * 100000, // 100k per hectare
      premiumRecommendation: formData.farmSize * 6000, // 6k per hectare
      riskFactors: formData.riskFactors,
      mitigationMeasures: formData.mitigationMeasures,
      weatherRisk: formData.weatherRisk,
      soilQuality: formData.soilQuality,
      marketRisk: formData.marketRisk,
      pestRisk: formData.pestRisk,
      overallScore,
      notes: formData.notes,
      photos: [],
      gpsCoordinates: { lat: -1.9441, lng: 30.0619 }
    };

    if (editingAssessment) {
      setAssessments(assessments.map(a => a.id === editingAssessment.id ? { ...newAssessment, id: editingAssessment.id } : a));
      setEditingAssessment(null);
    } else {
      setAssessments([...assessments, newAssessment]);
    }

    resetForm();
    setIsCreating(false);
  };

  const handleSubmitAssessment = (assessmentId: string) => {
    setAssessments(assessments.map(a => 
      a.id === assessmentId 
        ? { ...a, status: "submitted", submittedDate: new Date().toISOString().split('T')[0] }
        : a
    ));
  };

  const resetForm = () => {
    setFormData({
      farmerId: "",
      farmerName: "",
      cropType: "",
      farmSize: 0,
      location: "",
      weatherRisk: 50,
      soilQuality: 50,
      marketRisk: 50,
      pestRisk: 50,
      riskFactors: [],
      mitigationMeasures: [],
      notes: ""
    });
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.farmerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || assessment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const renderAssessmentForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          {editingAssessment ? "Edit Risk Assessment" : "New Risk Assessment"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="risk-factors">Risk Factors</TabsTrigger>
            <TabsTrigger value="scores">Risk Scores</TabsTrigger>
            <TabsTrigger value="notes">Notes & Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Farmer ID</Label>
                <Input
                  className={dashboardTheme.input}
                  value={formData.farmerId}
                  onChange={(e) => setFormData({...formData, farmerId: e.target.value})}
                  placeholder="FMR-0247"
                />
              </div>
              <div className="space-y-2">
                <Label>Farmer Name</Label>
                <Input
                  className={dashboardTheme.input}
                  value={formData.farmerName}
                  onChange={(e) => setFormData({...formData, farmerName: e.target.value})}
                  placeholder="Jean Baptiste"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Crop Type</Label>
                <Select value={formData.cropType} onValueChange={(value) => setFormData({...formData, cropType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maize">Maize</SelectItem>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="potatoes">Potatoes</SelectItem>
                    <SelectItem value="beans">Beans</SelectItem>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="sorghum">Sorghum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Farm Size (hectares)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.farmSize}
                  onChange={(e) => setFormData({...formData, farmSize: parseFloat(e.target.value) || 0})}
                  placeholder="2.5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Nyagatare District, Eastern Province"
              />
            </div>
          </TabsContent>

          <TabsContent value="risk-factors" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium text-gray-700 dark:text-gray-300">Risk Factors</Label>
                <p className="text-sm text-gray-500 mb-3">Select all applicable risk factors</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    "Drought conditions",
                    "Excessive rainfall",
                    "Pest infestation",
                    "Disease outbreak",
                    "Market price volatility",
                    "Limited market access",
                    "Poor soil quality",
                    "Erosion risk",
                    "Flood risk",
                    "Hail damage risk",
                    "Wind damage",
                    "Temperature extremes"
                  ].map((factor) => (
                    <div key={factor} className="flex items-center space-x-2">
                      <Checkbox
                        id={factor}
                        checked={formData.riskFactors.includes(factor)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({...formData, riskFactors: [...formData.riskFactors, factor]});
                          } else {
                            setFormData({...formData, riskFactors: formData.riskFactors.filter(f => f !== factor)});
                          }
                        }}
                      />
                      <Label htmlFor={factor} className="text-sm text-gray-700 dark:text-gray-300">{factor}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium text-gray-700 dark:text-gray-300">Mitigation Measures</Label>
                <p className="text-sm text-gray-500 mb-3">Select recommended mitigation measures</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    "Irrigation system",
                    "Drainage improvement",
                    "Pest monitoring",
                    "Crop rotation",
                    "Soil conservation",
                    "Market diversification",
                    "Insurance coverage",
                    "Weather monitoring",
                    "Early warning systems",
                    "Training programs",
                    "Technology adoption",
                    "Financial planning"
                  ].map((measure) => (
                    <div key={measure} className="flex items-center space-x-2">
                      <Checkbox
                        id={measure}
                        checked={formData.mitigationMeasures.includes(measure)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({...formData, mitigationMeasures: [...formData.mitigationMeasures, measure]});
                          } else {
                            setFormData({...formData, mitigationMeasures: formData.mitigationMeasures.filter(m => m !== measure)});
                          }
                        }}
                      />
                      <Label htmlFor={measure} className="text-sm text-gray-700 dark:text-gray-300">{measure}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scores" className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center">
                    <CloudRain className="h-4 w-4 mr-2" />
                    Weather Risk
                  </Label>
                  <span className="font-medium">{formData.weatherRisk}/100</span>
                </div>
                <Slider
                  value={[formData.weatherRisk]}
                  onValueChange={(value) => setFormData({...formData, weatherRisk: value[0]})}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">Higher values indicate greater weather-related risks</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center">
                    <Leaf className="h-4 w-4 mr-2" />
                    Soil Quality
                  </Label>
                  <span className="font-medium">{formData.soilQuality}/100</span>
                </div>
                <Slider
                  value={[formData.soilQuality]}
                  onValueChange={(value) => setFormData({...formData, soilQuality: value[0]})}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">Higher values indicate better soil quality</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Market Risk
                  </Label>
                  <span className="font-medium">{formData.marketRisk}/100</span>
                </div>
                <Slider
                  value={[formData.marketRisk]}
                  onValueChange={(value) => setFormData({...formData, marketRisk: value[0]})}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">Higher values indicate greater market-related risks</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center">
                    <Bug className="h-4 w-4 mr-2" />
                    Pest Risk
                  </Label>
                  <span className="font-medium">{formData.pestRisk}/100</span>
                </div>
                <Slider
                  value={[formData.pestRisk]}
                  onValueChange={(value) => setFormData({...formData, pestRisk: value[0]})}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">Higher values indicate greater pest-related risks</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Overall Risk Score</span>
                  <span className="text-2xl font-bold">{calculateOverallScore()}/100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Risk Level</span>
                  <Badge className={getRiskLevelColor(getRiskLevel(calculateOverallScore()))}>
                    {getRiskLevel(calculateOverallScore())} risk
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <div className="space-y-2">
              <Label>Assessment Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Add detailed notes about the assessment..."
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label>Photos</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Click to upload photos or drag and drop</p>
                <p className="text-xs text-gray-400">PNG, JPG up to 10MB each</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button className={`${dashboardTheme.buttonSecondary}`} onClick={() => {
            setIsCreating(false);
            setEditingAssessment(null);
            resetForm();
          }}>
            Cancel
          </Button>
          <Button className={`${dashboardTheme.buttonPrimary}`} onClick={handleSaveAssessment}>
            <Save className="h-4 w-4 mr-2" />
            {editingAssessment ? "Update Assessment" : "Save Assessment"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderAssessmentsList = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Risk Assessments</h1>
          <p className="text-white/70 mt-1">Manage and submit risk assessments for farmers</p>
        </div>
        <Button className={`${dashboardTheme.buttonPrimary}`} onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Assessment
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search assessments by farmer name, ID, or assessment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-900">{assessments.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assessments.filter(a => a.status === 'draft').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Edit className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Submitted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assessments.filter(a => a.status === 'submitted').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Send className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assessments.filter(a => a.status === 'approved').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Risk Assessments ({filteredAssessments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Assessment ID</th>
                  <th className="text-left p-3 font-medium">Farmer</th>
                  <th className="text-left p-3 font-medium">Crop</th>
                  <th className="text-left p-3 font-medium">Risk Level</th>
                  <th className="text-left p-3 font-medium">Score</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssessments.map((assessment) => (
                  <tr key={assessment.id} className="border-b ">
                    <td className="p-3 font-medium">{assessment.id}</td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{assessment.farmerName}</div>
                        <div className="text-sm text-gray-500">{assessment.farmerId}</div>
                      </div>
                    </td>
                    <td className="p-3">{assessment.cropType}</td>
                    <td className="p-3">
                      <Badge className={getRiskLevelColor(assessment.riskLevel)}>
                        {assessment.riskLevel} risk
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{assessment.overallScore}/100</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              assessment.overallScore >= 70 ? 'bg-red-500' : 
                              assessment.overallScore >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${assessment.overallScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(assessment.status)}>
                        {getStatusIcon(assessment.status)}
                        <span className="ml-1 capitalize">{assessment.status.replace('_', ' ')}</span>
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingAssessment(assessment);
                            setFormData({
                              farmerId: assessment.farmerId,
                              farmerName: assessment.farmerName,
                              cropType: assessment.cropType,
                              farmSize: assessment.farmSize,
                              location: assessment.location,
                              weatherRisk: assessment.weatherRisk,
                              soilQuality: assessment.soilQuality,
                              marketRisk: assessment.marketRisk,
                              pestRisk: assessment.pestRisk,
                              riskFactors: assessment.riskFactors,
                              mitigationMeasures: assessment.mitigationMeasures,
                              notes: assessment.notes || ""
                            });
                            setIsCreating(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {assessment.status === "draft" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSubmitAssessment(assessment.id)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {isCreating ? renderAssessmentForm() : renderAssessmentsList()}
    </div>
  );
}
