import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Activity,
  DollarSign,
  Percent,
  Calculator,
  Scale,
  Target,
  Zap,
  Layers
} from "lucide-react";

interface ClaimAssessment {
  id: string;
  claimId: string;
  farmerId: string;
  farmerName: string;
  cropType: string;
  farmSize: number;
  location: string;
  assessorId: string;
  assessorName: string;
  claimType: "drought" | "flood" | "pest" | "disease" | "hail" | "fire" | "other";
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected";
  submittedDate?: string;
  reviewDate?: string;
  damageAssessment: {
    totalDamage: number;
    affectedArea: number;
    damagePercentage: number;
    estimatedLoss: number;
  };
  riskFactors: string[];
  mitigationMeasures: string[];
  weatherImpact: number;
  soilCondition: number;
  marketImpact: number;
  pestDiseaseImpact: number;
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
  recommendedCompensation?: number;
}

export default function ClaimAssessmentSystem() {
  const [assessments, setAssessments] = useState<ClaimAssessment[]>([
    {
      id: "CLAIM-ASSESS-001",
      claimId: "CLM-001",
      farmerId: "FMR-0247",
      farmerName: "Jean Baptiste",
      cropType: "Maize",
      farmSize: 2.5,
      location: "Nyagatare District",
      assessorId: "ASS-001",
      assessorName: "Richard Nkurunziza",
      claimType: "drought",
      status: "submitted",
      submittedDate: "2024-10-03",
      damageAssessment: {
        totalDamage: 1.2,
        affectedArea: 1.2,
        damagePercentage: 48,
        estimatedLoss: 120000
      },
      riskFactors: [
        "Extended drought period",
        "Insufficient irrigation",
        "High temperature stress"
      ],
      mitigationMeasures: [
        "Emergency irrigation setup",
        "Drought-resistant crop varieties",
        "Water conservation techniques"
      ],
      weatherImpact: 85,
      soilCondition: 30,
      marketImpact: 40,
      pestDiseaseImpact: 20,
      overallScore: 75,
      notes: "Significant crop damage due to prolonged drought. Farmer has good insurance coverage.",
      photos: ["damage1.jpg", "damage2.jpg"],
      gpsCoordinates: { lat: -1.9441, lng: 30.0619 },
      recommendedCompensation: 120000
    }
  ]);

  const [activeTab, setActiveTab] = useState("assessments");
  const [isCreating, setIsCreating] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<ClaimAssessment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [claimTypeFilter, setClaimTypeFilter] = useState("all");

  // Form state for new/edit assessment
  const [formData, setFormData] = useState({
    claimId: "",
    farmerId: "",
    farmerName: "",
    cropType: "",
    farmSize: 0,
    location: "",
    claimType: "",
    damageAssessment: {
      totalDamage: 0,
      affectedArea: 0,
      damagePercentage: 0,
      estimatedLoss: 0
    },
    weatherImpact: 50,
    soilCondition: 50,
    marketImpact: 50,
    pestDiseaseImpact: 50,
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

  const getClaimTypeColor = (type: string) => {
    switch (type) {
      case "drought": return "bg-orange-100 text-orange-800";
      case "flood": return "bg-blue-100 text-blue-800";
      case "pest": return "bg-red-100 text-red-800";
      case "disease": return "bg-purple-100 text-purple-800";
      case "hail": return "bg-gray-100 text-gray-800";
      case "fire": return "bg-red-100 text-red-800";
      case "other": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const calculateOverallScore = () => {
    const weights = { weather: 0.3, soil: 0.25, market: 0.25, pest: 0.2 };
    const score = Math.round(
      (formData.weatherImpact * weights.weather) +
      (formData.soilCondition * weights.soil) +
      (formData.marketImpact * weights.market) +
      (formData.pestDiseaseImpact * weights.pest)
    );
    return score;
  };

  const calculateDamagePercentage = () => {
    if (formData.damageAssessment.affectedArea === 0 || formData.farmSize === 0) return 0;
    return Math.round((formData.damageAssessment.affectedArea / formData.farmSize) * 100);
  };

  const calculateEstimatedLoss = () => {
    const baseValue = formData.farmSize * 100000; // 100k per hectare base value
    const damagePercentage = calculateDamagePercentage();
    return Math.round(baseValue * (damagePercentage / 100));
  };

  const handleSaveAssessment = () => {
    const overallScore = calculateOverallScore();
    const damagePercentage = calculateDamagePercentage();
    const estimatedLoss = calculateEstimatedLoss();
    
    const newAssessment: ClaimAssessment = {
      id: `CLAIM-ASSESS-${String(assessments.length + 1).padStart(3, '0')}`,
      claimId: formData.claimId,
      farmerId: formData.farmerId,
      farmerName: formData.farmerName,
      cropType: formData.cropType,
      farmSize: formData.farmSize,
      location: formData.location,
      assessorId: "ASS-001", // Current assessor
      assessorName: "Richard Nkurunziza",
      claimType: formData.claimType as ClaimAssessment["claimType"],
      status: "draft",
      damageAssessment: {
        totalDamage: formData.damageAssessment.totalDamage,
        affectedArea: formData.damageAssessment.affectedArea,
        damagePercentage,
        estimatedLoss
      },
      riskFactors: formData.riskFactors,
      mitigationMeasures: formData.mitigationMeasures,
      weatherImpact: formData.weatherImpact,
      soilCondition: formData.soilCondition,
      marketImpact: formData.marketImpact,
      pestDiseaseImpact: formData.pestDiseaseImpact,
      overallScore,
      notes: formData.notes,
      photos: [],
      gpsCoordinates: { lat: -1.9441, lng: 30.0619 },
      recommendedCompensation: estimatedLoss
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
      claimId: "",
      farmerId: "",
      farmerName: "",
      cropType: "",
      farmSize: 0,
      location: "",
      claimType: "",
      damageAssessment: {
        totalDamage: 0,
        affectedArea: 0,
        damagePercentage: 0,
        estimatedLoss: 0
      },
      weatherImpact: 50,
      soilCondition: 50,
      marketImpact: 50,
      pestDiseaseImpact: 50,
      riskFactors: [],
      mitigationMeasures: [],
      notes: ""
    });
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.claimId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || assessment.status === statusFilter;
    const matchesClaimType = claimTypeFilter === "all" || assessment.claimType === claimTypeFilter;
    
    return matchesSearch && matchesStatus && matchesClaimType;
  });

  const renderAssessmentForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          {editingAssessment ? "Edit Claim Assessment" : "New Claim Assessment"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="damage">Damage Assessment</TabsTrigger>
            <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
            <TabsTrigger value="notes">Notes & Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Claim ID</Label>
                <Input
                  value={formData.claimId}
                  onChange={(e) => setFormData({...formData, claimId: e.target.value})}
                  placeholder="CLM-001"
                />
              </div>
              <div className="space-y-2">
                <Label>Farmer ID</Label>
                <Input
                  value={formData.farmerId}
                  onChange={(e) => setFormData({...formData, farmerId: e.target.value})}
                  placeholder="FMR-0247"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Farmer Name</Label>
                <Input
                  value={formData.farmerName}
                  onChange={(e) => setFormData({...formData, farmerName: e.target.value})}
                  placeholder="Jean Baptiste"
                />
              </div>
              <div className="space-y-2">
                <Label>Claim Type</Label>
                <Select value={formData.claimType} onValueChange={(value) => setFormData({...formData, claimType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select claim type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drought">Drought</SelectItem>
                    <SelectItem value="flood">Flood</SelectItem>
                    <SelectItem value="pest">Pest Damage</SelectItem>
                    <SelectItem value="disease">Disease</SelectItem>
                    <SelectItem value="hail">Hail Damage</SelectItem>
                    <SelectItem value="fire">Fire</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
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

          <TabsContent value="damage" className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Total Damage (hectares)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.damageAssessment.totalDamage}
                    onChange={(e) => setFormData({
                      ...formData, 
                      damageAssessment: {
                        ...formData.damageAssessment,
                        totalDamage: parseFloat(e.target.value) || 0
                      }
                    })}
                    placeholder="1.2"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Affected Area (hectares)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.damageAssessment.affectedArea}
                    onChange={(e) => setFormData({
                      ...formData, 
                      damageAssessment: {
                        ...formData.damageAssessment,
                        affectedArea: parseFloat(e.target.value) || 0
                      }
                    })}
                    placeholder="1.2"
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Damage Percentage</Label>
                    <p className="text-2xl font-bold text-red-600">{calculateDamagePercentage()}%</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Loss</Label>
                    <p className="text-2xl font-bold text-red-600">{calculateEstimatedLoss().toLocaleString()} RWF</p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium text-gray-700 dark:text-gray-300">Damage Factors</Label>
                <p className="text-sm text-gray-500 mb-3">Select all applicable damage factors</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    "Complete crop failure",
                    "Partial crop loss",
                    "Quality degradation",
                    "Delayed harvest",
                    "Reduced yield",
                    "Market value loss",
                    "Storage damage",
                    "Transportation issues",
                    "Processing problems",
                    "Labor cost increase",
                    "Input cost increase",
                    "Opportunity cost"
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
                <Label className="text-base font-medium text-gray-700 dark:text-gray-300">Recovery Measures</Label>
                <p className="text-sm text-gray-500 mb-3">Select recommended recovery measures</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    "Emergency replanting",
                    "Crop rotation",
                    "Soil rehabilitation",
                    "Pest control",
                    "Disease management",
                    "Water management",
                    "Fertilizer application",
                    "Market diversification",
                    "Financial support",
                    "Training programs",
                    "Technology adoption",
                    "Insurance claim processing"
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

          <TabsContent value="impact" className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center">
                    <CloudRain className="h-4 w-4 mr-2" />
                    Weather Impact
                  </Label>
                  <span className="font-medium">{formData.weatherImpact}/100</span>
                </div>
                <Slider
                  value={[formData.weatherImpact]}
                  onValueChange={(value) => setFormData({...formData, weatherImpact: value[0]})}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">Higher values indicate greater weather-related impact</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center">
                    <Layers className="h-4 w-4 mr-2" />
                    Soil Condition Impact
                  </Label>
                  <span className="font-medium">{formData.soilCondition}/100</span>
                </div>
                <Slider
                  value={[formData.soilCondition]}
                  onValueChange={(value) => setFormData({...formData, soilCondition: value[0]})}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">Higher values indicate better soil condition (lower impact)</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Market Impact
                  </Label>
                  <span className="font-medium">{formData.marketImpact}/100</span>
                </div>
                <Slider
                  value={[formData.marketImpact]}
                  onValueChange={(value) => setFormData({...formData, marketImpact: value[0]})}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">Higher values indicate greater market-related impact</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center">
                    <Bug className="h-4 w-4 mr-2" />
                    Pest/Disease Impact
                  </Label>
                  <span className="font-medium">{formData.pestDiseaseImpact}/100</span>
                </div>
                <Slider
                  value={[formData.pestDiseaseImpact]}
                  onValueChange={(value) => setFormData({...formData, pestDiseaseImpact: value[0]})}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">Higher values indicate greater pest/disease impact</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Overall Impact Score</span>
                  <span className="text-2xl font-bold">{calculateOverallScore()}/100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Recommended Compensation</span>
                  <span className="text-lg font-bold text-green-600">
                    {calculateEstimatedLoss().toLocaleString()} RWF
                  </span>
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
                placeholder="Add detailed notes about the claim assessment..."
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label>Damage Photos</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Click to upload damage photos or drag and drop</p>
                <p className="text-xs text-gray-400">PNG, JPG up to 10MB each</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={() => {
            setIsCreating(false);
            setEditingAssessment(null);
            resetForm();
          }}>
            Cancel
          </Button>
          <Button onClick={handleSaveAssessment}>
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
          <h1 className="text-3xl font-bold text-gray-900">Claim Assessments</h1>
          <p className="text-gray-600 mt-1">Assess and evaluate insurance claims for farmers</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
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
                  placeholder="Search assessments by farmer name, claim ID, or assessment ID..."
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
              <Select value={claimTypeFilter} onValueChange={setClaimTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Claim Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="drought">Drought</SelectItem>
                  <SelectItem value="flood">Flood</SelectItem>
                  <SelectItem value="pest">Pest</SelectItem>
                  <SelectItem value="disease">Disease</SelectItem>
                  <SelectItem value="hail">Hail</SelectItem>
                  <SelectItem value="fire">Fire</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
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
          <CardTitle>Claim Assessments ({filteredAssessments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Assessment ID</th>
                  <th className="text-left p-3 font-medium">Claim ID</th>
                  <th className="text-left p-3 font-medium">Farmer</th>
                  <th className="text-left p-3 font-medium">Claim Type</th>
                  <th className="text-left p-3 font-medium">Damage %</th>
                  <th className="text-left p-3 font-medium">Estimated Loss</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssessments.map((assessment) => (
                  <tr key={assessment.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{assessment.id}</td>
                    <td className="p-3 font-medium">{assessment.claimId}</td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{assessment.farmerName}</div>
                        <div className="text-sm text-gray-500">{assessment.farmerId}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getClaimTypeColor(assessment.claimType)}>
                        {assessment.claimType}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{assessment.damageAssessment.damagePercentage}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-red-500"
                            style={{ width: `${assessment.damageAssessment.damagePercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-medium text-red-600">
                        {assessment.damageAssessment.estimatedLoss.toLocaleString()} RWF
                      </span>
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
                              claimId: assessment.claimId,
                              farmerId: assessment.farmerId,
                              farmerName: assessment.farmerName,
                              cropType: assessment.cropType,
                              farmSize: assessment.farmSize,
                              location: assessment.location,
                              claimType: assessment.claimType,
                              damageAssessment: assessment.damageAssessment,
                              weatherImpact: assessment.weatherImpact,
                              soilCondition: assessment.soilCondition,
                              marketImpact: assessment.marketImpact,
                              pestDiseaseImpact: assessment.pestDiseaseImpact,
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
