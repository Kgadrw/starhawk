import { useState } from "react";
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
  Plus
} from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssessment, setSelectedAssessment] = useState<LossAssessment | null>(null);
  const [assessmentNotes, setAssessmentNotes] = useState("Severe flood confirmed. Drone verified damage zone.");
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");

  // Mock data for loss assessments
  const assessments: LossAssessment[] = [
    {
      id: "LOSS-001",
      farmerName: "Mugabo John",
      fieldId: "9812345",
      crop: "Maize",
      area: "3.4 ha",
      cause: "Flood",
      date: "16/04/2025",
      severity: "Moderate",
      affectedArea: "1.2 ha",
      affectedPercentage: 35,
      status: "Under Review"
    },
    {
      id: "LOSS-002",
      farmerName: "Kamali Peace",
      fieldId: "9812346",
      crop: "Rice",
      area: "2.0 ha",
      cause: "Drought",
      date: "12/04/2025",
      severity: "Severe",
      affectedArea: "1.5 ha",
      affectedPercentage: 75,
      status: "Pending"
    },
    {
      id: "LOSS-003",
      farmerName: "Jean Baptiste",
      fieldId: "9812347",
      crop: "Beans",
      area: "1.8 ha",
      cause: "Pest Infestation",
      date: "08/04/2025",
      severity: "Mild",
      affectedArea: "0.5 ha",
      affectedPercentage: 28,
      status: "Approved"
    }
  ];

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
        <h1 className="text-4xl font-bold text-white">Loss Assessment</h1>
        <p className="text-white/70 mt-2">Document and evaluate crop loss events</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center justify-end gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
          <Input
            placeholder="Search fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${dashboardTheme.input} pl-10 w-64 border-gray-700`}
          />
        </div>
        <Button className={`${dashboardTheme.card} text-white hover:bg-gray-800 border border-gray-700`}>
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Assessment
        </Button>
      </div>

      {/* Data Table */}
      <Card className={`${dashboardTheme.card}`}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-4 px-6 font-medium text-white/80">Assessment ID</th>
                  <th className="text-left py-4 px-6 font-medium text-white/80">Farmer</th>
                  <th className="text-left py-4 px-6 font-medium text-white/80">Field ID</th>
                  <th className="text-left py-4 px-6 font-medium text-white/80">Crop</th>
                  <th className="text-left py-4 px-6 font-medium text-white/80">Cause</th>
                  <th className="text-left py-4 px-6 font-medium text-white/80">Severity</th>
                  <th className="text-left py-4 px-6 font-medium text-white/80">Affected Area</th>
                  <th className="text-left py-4 px-6 font-medium text-white/80">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssessments.map((assessment, index) => (
                  <tr
                    key={assessment.id}
                    onClick={() => handleAssessmentClick(assessment)}
                    className={`border-b border-gray-800/50 hover:bg-gray-900/50 transition-colors cursor-pointer ${
                      index % 2 === 0 ? "bg-gray-950/30" : ""
                    }`}
                  >
                    <td className="py-4 px-6 text-white">{assessment.id}</td>
                    <td className="py-4 px-6 text-white">{assessment.farmerName}</td>
                    <td className="py-4 px-6 text-white">{assessment.fieldId}</td>
                    <td className="py-4 px-6 text-white">{assessment.crop}</td>
                    <td className="py-4 px-6 text-white">{assessment.cause}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        assessment.severity === "Severe"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : assessment.severity === "Moderate"
                          ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      }`}>
                        {assessment.severity}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-white">
                      {assessment.affectedArea} ({assessment.affectedPercentage}%)
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        assessment.status === "Approved"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : assessment.status === "Under Review"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      }`}>
                        {assessment.status}
                      </span>
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
          <TabsList className={`${dashboardTheme.card} border border-gray-800`}>
            <TabsTrigger 
              value="details" 
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-white/70"
            >
              <FileText className="h-4 w-4 mr-2" />
              Loss Details
            </TabsTrigger>
            <TabsTrigger 
              value="quantification" 
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-white/70"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Quantification
            </TabsTrigger>
            <TabsTrigger 
              value="decision" 
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-white/70"
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
                <CardTitle className="text-white">Field Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="border-r border-gray-800 pr-4">
                    <p className="text-sm text-white/60 mb-1">Farmer</p>
                    <p className="text-white font-medium">{selectedAssessment.farmerName}</p>
                  </div>
                  <div className="border-r border-gray-800 pr-4">
                    <p className="text-sm text-white/60 mb-1">Field ID</p>
                    <p className="text-white font-medium">{selectedAssessment.fieldId}</p>
                  </div>
                  <div className="border-r border-gray-800 pr-4">
                    <p className="text-sm text-white/60 mb-1">Crop</p>
                    <p className="text-white font-medium">{selectedAssessment.crop}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60 mb-1">Area</p>
                    <p className="text-white font-medium">{selectedAssessment.area}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loss Details */}
            <Card className={`${dashboardTheme.card}`}>
              <CardHeader>
                <CardTitle className="text-white">Loss Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cause" className="text-white/80 mb-2 block">Cause</Label>
                    <Input
                      id="cause"
                      value={lossData.cause}
                      readOnly
                      className={`${dashboardTheme.input} border-gray-700`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date" className="text-white/80 mb-2 block">Date</Label>
                    <div className="relative">
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                      <Input
                        id="date"
                        value={lossData.date}
                        readOnly
                        className={`${dashboardTheme.input} border-gray-700 pr-10`}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description" className="text-white/80 mb-2 block">Description</Label>
                  <Textarea
                    id="description"
                    value={lossData.description}
                    readOnly
                    className={`${dashboardTheme.input} border-gray-700 min-h-[100px]`}
                  />
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">Evidence</Label>
                  <Button 
                    variant="outline" 
                    className="border-gray-700 text-white hover:bg-gray-800"
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
            {/* Loss Quantification */}
            <Card className={`${dashboardTheme.card}`}>
              <CardHeader>
                <CardTitle className="text-white">Loss Quantification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-orange-950/30 border border-orange-900/50 rounded-lg p-6">
                    <p className="text-3xl font-bold text-orange-400 mb-1">
                      {lossData.affectedArea}
                    </p>
                    <p className="text-sm text-white/80">Affected Area</p>
                    <p className="text-xs text-orange-400 mt-1">({lossData.affectedPercentage}%)</p>
                  </div>
                  <div className="bg-orange-950/30 border border-orange-900/50 rounded-lg p-6">
                    <p className="text-3xl font-bold text-orange-400 mb-1">
                      {lossData.severity}
                    </p>
                    <p className="text-sm text-white/80">Severity</p>
                  </div>
                  <div className="bg-orange-950/30 border border-orange-900/50 rounded-lg p-6">
                    <p className="text-3xl font-bold text-orange-400 mb-1">
                      {lossData.yieldImpact}%
                    </p>
                    <p className="text-sm text-white/80">Yield Impact</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Visualization */}
            <Card className={`${dashboardTheme.card}`}>
              <CardHeader>
                <CardTitle className="text-white">Map Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900/50 rounded-lg border border-gray-800 h-[500px] flex items-center justify-center relative">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 mx-auto mb-4 text-white/30" />
                    <p className="text-white/60 text-lg font-medium">Map View</p>
                    <p className="text-white/40 text-sm mt-2">Field: {selectedAssessment.fieldId}</p>
                    <p className="text-white/40 text-sm">Damage Overlay</p>
                  </div>
                  {/* Legend */}
                  <div className="absolute bottom-4 right-4 bg-gray-900/80 border border-gray-800 rounded-lg p-3">
                    <p className="text-white/80 text-sm font-medium mb-2">Legend</p>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      <span className="text-white/70 text-xs">Affected Area</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-white/70 text-xs">Normal Area</span>
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
                <CardTitle className="text-white">Decision Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-yellow-950/20 border border-yellow-900/30 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <p className="text-white font-medium">Policy Threshold</p>
                    </div>
                    <p className="text-4xl font-bold text-white mb-1">
                      {decisionSupport.policyThreshold}%
                    </p>
                    <p className="text-sm text-white/60">Minimum affected area</p>
                  </div>

                  <div className={`${decisionSupport.meetsCondition ? 'bg-green-950/20 border-green-900/30' : 'bg-red-950/20 border-red-900/30'} rounded-lg p-6`}>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className={`h-5 w-5 ${decisionSupport.meetsCondition ? 'text-green-500' : 'text-red-500'}`} />
                      <p className="text-white font-medium">Meets Condition</p>
                    </div>
                    <p className={`text-4xl font-bold mb-1 ${decisionSupport.meetsCondition ? 'text-green-500' : 'text-red-500'}`}>
                      {decisionSupport.meetsCondition ? 'YES' : 'NO'}
                    </p>
                    <p className="text-sm text-white/60">
                      {decisionSupport.meetsCondition 
                        ? `Exceeds threshold by ${decisionSupport.thresholdExcess}%`
                        : `Below threshold by ${decisionSupport.thresholdExcess}%`
                      }
                    </p>
                  </div>
                </div>

                <div className="bg-teal-950/20 border border-teal-900/30 rounded-lg p-6">
                  <p className="text-white font-medium mb-2">Recommendation</p>
                  <p className="text-white/80">{decisionSupport.recommendation}</p>
                </div>
              </CardContent>
            </Card>

            {/* Assessor Notes */}
            <Card className={`${dashboardTheme.card}`}>
              <CardHeader>
                <CardTitle className="text-white">Assessor Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={assessmentNotes}
                  onChange={(e) => setAssessmentNotes(e.target.value)}
                  placeholder="Add your assessment notes here..."
                  className={`${dashboardTheme.input} border-gray-700 min-h-[120px]`}
                />
                <div className="flex gap-2">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Save Assessment
                  </Button>
                  <Button className={`${dashboardTheme.card} text-white hover:bg-gray-800 border border-gray-700`}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Generate Report PDF
                  </Button>
                </div>
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
