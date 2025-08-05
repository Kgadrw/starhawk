/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from "react";
import {
  Upload,
  Leaf,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  MapPin,
  FileText,
  LogOut,
  Loader2,
  Download,
  Eye,
  Calendar,
  Activity,
   ArrowDownCircle, ArrowUpCircle, Percent, Sigma
} from "lucide-react";

interface AnalysisResult {
  data: {
    analysis: {
      ncdiAnalysis: {
        averageNcdi: number;
        median: number;
        min: number;
        max: number;
        standardDeviation: number;
        percentiles: {
          p25: number;
          p75: number;
        };
        distribution: {
          lowDensity: { count: number; percentage: number };
          mediumDensity: { count: number; percentage: number };
          highDensity: { count: number; percentage: number };
        };
        spatialCoverage: {
          totalDataPoints: number;
          area: number;
        };
      };
      riskAnalysis: {
        overallRiskScore: number;
        riskCategory: string;
        payoutProbability: number;
        riskFactors: {
          densityRisk: { score: number; description: string };
          variabilityRisk: { score: number; description: string };
          distributionRisk: { score: number; description: string };
        };
        recommendations: string[];
      };
      processingInfo: {
        processedAt: string;
        fileSize: number;
        validRows: number;
        invalidRows: number;
      };
    };
    assessment: any;
  };
  filename: string;
}

interface ImageAnalysis {
  filename: string;
  cropType: string;
  healthScore: number;
  damageAssessment: string;
  estimatedLoss: number;
  confidence: number;
  processedAt: string;
}

interface ProcessedData {
  totalImages: number;
  averageHealthScore: number;
  totalEstimatedLoss: number;
  damageBreakdown: {
    severe: number;
    moderate: number;
    light: number;
    none: number;
  };
  recommendations: string[];
  pnlImpact: {
    revenueLoss: number;
    recoveryCost: number;
    insuranceCoverage: number;
    netImpact: number;
  };
}

const assessments = [
  {
    id: "INA-2025-001",
    farmer: "John Smith",
    location: "Nairobi East",
    date: "Jan 15",
    status: "Pending",
    priority: "HIGH",
  },
  {
    id: "INA-2025-002",
    farmer: "Sarah Johnson",
    location: "Kiambu Central",
    date: "Jan 14",
    status: "Approved",
    priority: "MEDIUM",
  },
  {
    id: "INA-2025-003",
    farmer: "David Wilson",
    location: "Machakos West",
    date: "Jan 13",
    status: "Pending",
    priority: "LOW",
  },
];

export function AssessmentPage() {
  const { toast } = useToast();
  const [selectedCrop, setSelectedCrop] = useState("maize");
  const [selectedLocation, setSelectedLocation] = useState("nairobi");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysis[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [ncdiFile, setNcdiFile] = useState<File | null>(null);
  const [analysisTitle, setAnalysisTitle] = useState("");
  const [analysisDescription, setAnalysisDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const ncdiFileInputRef = useRef<HTMLInputElement>(null);

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");

    if (storedToken) setToken(storedToken);
  }, []);

  const handleExport = () =>
    toast({ title: "Exported!", description: "Assessment data exported." });
  const handleFilter = () =>
    toast({
      title: "Filter applied!",
      description: "Assessment filter applied.",
    });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Assessment Submitted!",
      description: "Your assessment has been submitted.",
    });
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    const newImages = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    setUploadedImages((prev) => [...prev, ...newImages]);
    toast({
      title: "Images Uploaded",
      description: `${newImages.length} image(s) added for analysis.`,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleImageUpload(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setImageAnalysis((prev) => prev.filter((_, i) => i !== index));
  };

  const processImages = async () => {
    if (uploadedImages.length === 0) {
      toast({ title: "No Images", description: "Please upload images first." });
      return;
    }

    setIsProcessing(true);
    toast({
      title: "Processing Images",
      description: "Analyzing uploaded images...",
    });

    setTimeout(() => {
      const analyses: ImageAnalysis[] = uploadedImages.map((file) => {
        const cropTypes = ["Maize", "Wheat", "Rice", "Coffee", "Tea"];
        const damageLevels = ["Severe", "Moderate", "Light", "None"];

        return {
          filename: file.name,
          cropType: cropTypes[Math.floor(Math.random() * cropTypes.length)],
          healthScore: Math.random() * 100,
          damageAssessment:
            damageLevels[Math.floor(Math.random() * damageLevels.length)],
          estimatedLoss: Math.random() * 50000 + 10000,
          confidence: Math.random() * 30 + 70,
          processedAt: new Date().toISOString(),
        };
      });

      setImageAnalysis(analyses);
      generateProcessedData(analyses);
      setIsProcessing(false);
      toast({
        title: "Analysis Complete",
        description: "Image analysis finished successfully.",
      });
    }, 3000);
  };

  const generateProcessedData = (analyses: ImageAnalysis[]) => {
    const totalImages = analyses.length;
    const averageHealthScore =
      analyses.reduce((sum, analysis) => sum + analysis.healthScore, 0) /
      totalImages;
    const totalEstimatedLoss = analyses.reduce(
      (sum, analysis) => sum + analysis.estimatedLoss,
      0
    );

    const damageBreakdown = {
      severe: analyses.filter((a) => a.damageAssessment === "Severe").length,
      moderate: analyses.filter((a) => a.damageAssessment === "Moderate")
        .length,
      light: analyses.filter((a) => a.damageAssessment === "Light").length,
      none: analyses.filter((a) => a.damageAssessment === "None").length,
    };

    const recommendations = [];
    if (damageBreakdown.severe > 0)
      recommendations.push(
        "Immediate intervention required for severely damaged areas"
      );
    if (averageHealthScore < 50)
      recommendations.push("Overall crop health is poor - consider replanting");
    if (totalEstimatedLoss > 100000)
      recommendations.push("High financial impact - expedite insurance claim");
    if (damageBreakdown.moderate > damageBreakdown.light)
      recommendations.push(
        "Moderate damage detected - implement recovery measures"
      );

    const pnlImpact = {
      revenueLoss: totalEstimatedLoss,
      recoveryCost: totalEstimatedLoss * 0.3,
      insuranceCoverage: totalEstimatedLoss * 0.8,
      netImpact: totalEstimatedLoss * 0.2,
    };

    setProcessedData({
      totalImages,
      averageHealthScore,
      totalEstimatedLoss,
      damageBreakdown,
      recommendations,
      pnlImpact,
    });
  };

  const handleNcdiFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setNcdiFile(selectedFile);
      if (!analysisTitle) {
        setAnalysisTitle(`NVDI Analysis - ${selectedFile.name}`);
      }
    }
  };

  const analyzeNcdiData = async () => {
    if (!ncdiFile) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", ncdiFile);
      if (analysisTitle) formData.append("title", analysisTitle);
      if (analysisDescription)
        formData.append("description", analysisDescription);

      const response = await fetch(
        "https://nexus-agri-backend.onrender.com/assessments/process-ncdi-and-save/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setAnalysisResult(data);

      toast({
        title: "Analysis Complete",
        description: "NVDI analysis has been completed successfully.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description:
          "There was an error processing your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 30) return "text-agri-success";
    if (score <= 60) return "text-agri-warning";
    return "text-agri-danger";
  };

  const getRiskBadgeVariant = (category: string) => {
    switch (category.toLowerCase()) {
      case "low risk":
        return "default";
      case "medium risk":
        return "secondary";
      case "high risk":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background h-screen overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">CropScan AI</h1>
          <p className="text-gray-500">NVDI Data Analysis & Risk Assessment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Field Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-gray-500">2 months locations</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-agri-success">
              Completed Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-agri-warning">
              High Risk Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 Days</div>
            <p className="text-xs text-gray-500">Next assessment</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-agri-accent">
              Upgraded Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 Days</div>
            <p className="text-xs text-gray-500">Average time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Assessment Form */}
        <Card className="lg:col-span-2 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Leaf className="w-5 h-5 text-green-500" />
              <span>Field Assessment & NVDI Analysis</span>
            </CardTitle>
            <p className="text-sm text-gray-500">
              Upload NVDI data files or field images for analysis
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="field" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="field">Field Images</TabsTrigger>
                <TabsTrigger value="ncdi">NVDI Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="field" className="space-y-4">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="cropType">Crop Type</Label>
                      <Select
                        value={selectedCrop}
                        onValueChange={setSelectedCrop}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Maize" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maize">Maize</SelectItem>
                          <SelectItem value="wheat">Wheat</SelectItem>
                          <SelectItem value="rice">Rice</SelectItem>
                          <SelectItem value="coffee">Coffee</SelectItem>
                          <SelectItem value="tea">Tea</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Select
                        value={selectedLocation}
                        onValueChange={setSelectedLocation}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Nairobi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nairobi">Nairobi</SelectItem>
                          <SelectItem value="kiambu">Kiambu</SelectItem>
                          <SelectItem value="machakos">Machakos</SelectItem>
                          <SelectItem value="nyeri">Nyeri</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Field Images Upload</Label>
                      <div
                        className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-agri-green transition-colors"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files)}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="mb-2"
                        >
                          📷 Select Images
                        </Button>
                        <p className="text-sm text-gray-500">
                          Drag & drop images here or click to browse
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Supports: JPG, PNG, GIF
                        </p>
                      </div>
                    </div>

                    {/* Uploaded Images Preview */}
                    {uploadedImages.length > 0 && (
                      <div className="space-y-2">
                        <Label>Uploaded Images ({uploadedImages.length})</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {uploadedImages.map((file, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-full h-20 object-cover rounded border"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <Button
                          type="button"
                          onClick={processImages}
                          disabled={isProcessing}
                          className="w-full bg-gradient-primary hover:opacity-90"
                        >
                          {isProcessing ? "Processing..." : "Analyze Images"}
                        </Button>
                      </div>
                    )}

                    {/* Image Analysis Results */}
                    {imageAnalysis.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-semibold">
                          Image Analysis Results
                        </h3>
                        <div className="space-y-2">
                          {imageAnalysis.map((analysis, index) => (
                            <div
                              key={index}
                              className="p-3 border rounded bg-card"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium">
                                    {analysis.filename}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Crop: {analysis.cropType} | Health:{" "}
                                    {analysis.healthScore.toFixed(1)}%
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Damage: {analysis.damageAssessment} | Loss:
                                    FRW{" "}
                                    {analysis.estimatedLoss.toLocaleString()}
                                  </div>
                                </div>
                                <Badge
                                  variant={
                                    analysis.confidence > 90
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {analysis.confidence.toFixed(0)}% confidence
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Processed Data Summary */}
                    {processedData && (
                      <div className="space-y-4">
                        <h3 className="font-semibold">
                          P&L Assessment Summary
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-agri-green-light rounded">
                            <div className="text-lg font-bold">
                              {processedData.totalImages}
                            </div>
                            <div className="text-xs text-gray-500">
                              Images Analyzed
                            </div>
                          </div>
                          <div className="text-center p-3 bg-agri-success-light rounded">
                            <div className="text-lg font-bold">
                              {processedData.averageHealthScore.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-500">
                              Avg Health
                            </div>
                          </div>
                          <div className="text-center p-3 bg-agri-danger-light rounded">
                            <div className="text-lg font-bold">
                              FRW{" "}
                              {processedData.totalEstimatedLoss.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              Total Loss
                            </div>
                          </div>
                          <div className="text-center p-3 bg-agri-warning-light rounded">
                            <div className="text-lg font-bold">
                              FRW{" "}
                              {processedData.pnlImpact.netImpact.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              Net Impact
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="description">Assessment Notes</Label>
                      <Textarea
                        placeholder="Enter assessment details..."
                        className="mt-1"
                      />
                    </div>

                    <Button
                      className="w-full bg-gradient-primary hover:opacity-90"
                      type="submit"
                    >
                      Submit Assessment
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="ncdi" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ncdiFile">NVDI CSV File</Label>
                    <Input
                      id="ncdiFile"
                      type="file"
                      accept=".csv"
                      onChange={handleNcdiFileChange}
                      className="file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:bg-agri-green-light file:text-green-500 hover:file:bg-agri-green hover:file:text-white"
                    />
                    {ncdiFile && (
                      <p className="text-sm text-gray-500 mt-2">
                        Selected: {ncdiFile.name} (
                        {(ncdiFile.size / 1024).toFixed(1)} KB)
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="analysisTitle">Analysis Title</Label>
                    <Input
                      id="analysisTitle"
                      value={analysisTitle}
                      onChange={(e) => setAnalysisTitle(e.target.value)}
                      placeholder="Enter analysis title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="analysisDescription">
                      Description (Optional)
                    </Label>
                    <Textarea
                      id="analysisDescription"
                      value={analysisDescription}
                      onChange={(e) => setAnalysisDescription(e.target.value)}
                      placeholder="Enter analysis description"
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={analyzeNcdiData}
                    disabled={!ncdiFile || isAnalyzing}
                    className="w-full hover:opacity-90 transition-smooth"
                  >
                    {isAnalyzing && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isAnalyzing ? "Analyzing..." : "Analyze NVDI Data"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-green-500" />
              <span>Analysis Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysisResult ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Overall Risk Score</p>
                  <div className="text-2xl font-bold">
                    {analysisResult.data.analysis.riskAnalysis.overallRiskScore}
                  </div>
                  <Badge
                    className={`mt-2 ${getRiskBadgeVariant(
                      analysisResult.data.analysis.riskAnalysis.riskCategory
                    )}`}
                  >
                    {analysisResult.data.analysis.riskAnalysis.riskCategory}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Payout Probability</p>
                  <div className="text-2xl font-bold">
                    {
                      analysisResult.data.analysis.riskAnalysis
                        .payoutProbability
                    }
                    %
                  </div>
                  <Progress
                    value={
                      analysisResult.data.analysis.riskAnalysis
                        .payoutProbability
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Average NVDI</p>
                  <div className="text-2xl font-bold">
                    {analysisResult.data.analysis.ncdiAnalysis.averageNcdi.toFixed(
                      3
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Data Points:{" "}
                    {analysisResult.data.analysis.ncdiAnalysis.spatialCoverage.totalDataPoints.toLocaleString()}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Risk Factors</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Density Risk</span>
                      <span
                        className={getRiskColor(
                          analysisResult.data.analysis.riskAnalysis.riskFactors
                            .densityRisk.score
                        )}
                      >
                        {
                          analysisResult.data.analysis.riskAnalysis.riskFactors
                            .densityRisk.score
                        }
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Variability Risk</span>
                      <span
                        className={getRiskColor(
                          analysisResult.data.analysis.riskAnalysis.riskFactors
                            .variabilityRisk.score
                        )}
                      >
                        {
                          analysisResult.data.analysis.riskAnalysis.riskFactors
                            .variabilityRisk.score
                        }
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distribution Risk</span>
                      <span
                        className={getRiskColor(
                          analysisResult.data.analysis.riskAnalysis.riskFactors
                            .distributionRisk.score
                        )}
                      >
                        {
                          analysisResult.data.analysis.riskAnalysis.riskFactors
                            .distributionRisk.score
                        }
                        %
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Recommendations</p>
                  <div className="space-y-1">
                    {analysisResult.data.analysis.riskAnalysis.recommendations.map(
                      (rec, index) => (
                        <div
                          key={index}
                          className="text-xs text-gray-500 flex items-start space-x-1"
                        >
                          <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Risk Analysis</p>
                  <div className="h-32 bg-muted rounded flex items-center justify-center">
                    <span className="text-sm text-gray-500">
                      Upload NVDI data to analyze
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Overall Risk</span>
                    <Badge variant="outline">--</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Payout Probability</span>
                    <Badge variant="outline">--</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Data Quality</span>
                    <Badge variant="outline">--</Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {analysisResult && (
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span>Detailed NDVI Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* NDVI Statistics */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" /> NDVI Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-md flex flex-col items-start">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <ArrowDownCircle className="w-4 h-4 text-blue-500" />{" "}
                      Minimum
                    </div>
                    <p className="text-xl font-bold">
                      {analysisResult.data.analysis.ncdiAnalysis.min.toFixed(3)}
                    </p>
                  </div>
                  <div className="p-3 border rounded-md flex flex-col items-start">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <ArrowUpCircle className="w-4 h-4 text-red-500" /> Maximum
                    </div>
                    <p className="text-xl font-bold">
                      {analysisResult.data.analysis.ncdiAnalysis.max.toFixed(3)}
                    </p>
                  </div>
                  <div className="p-3 border rounded-md flex flex-col items-start">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Percent className="w-4 h-4 text-yellow-500" /> 25th
                      Percentile
                    </div>
                    <p className="text-xl font-bold">
                      {analysisResult.data.analysis.ncdiAnalysis.percentiles.p25.toFixed(
                        3
                      )}
                    </p>
                  </div>
                  <div className="p-3 border rounded-md flex flex-col items-start">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Percent className="w-4 h-4 text-yellow-500" /> 75th
                      Percentile
                    </div>
                    <p className="text-xl font-bold">
                      {analysisResult.data.analysis.ncdiAnalysis.percentiles.p75.toFixed(
                        3
                      )}
                    </p>
                  </div>
                </div>
                <div className="p-3 border rounded-md flex flex-col items-start">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Sigma className="w-4 h-4 text-purple-500" /> Standard
                    Deviation
                  </div>
                  <p className="text-xl font-bold">
                    {analysisResult.data.analysis.ncdiAnalysis.standardDeviation.toFixed(
                      3
                    )}
                  </p>
                </div>
              </div>

              {/* Vegetation Distribution */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-green-500" /> Vegetation
                  Distribution
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-1">
                        <ArrowDownCircle className="w-4 h-4 text-blue-400" />{" "}
                        Low Density
                      </span>
                      <Badge variant="outline">
                        {
                          analysisResult.data.analysis.ncdiAnalysis.distribution
                            .lowDensity.percentage
                        }
                        %
                      </Badge>
                    </div>
                    <Progress
                      value={
                        analysisResult.data.analysis.ncdiAnalysis.distribution
                          .lowDensity.percentage
                      }
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {analysisResult.data.analysis.ncdiAnalysis.distribution.lowDensity.count.toLocaleString()}{" "}
                      data points
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Percent className="w-4 h-4 text-yellow-500" /> Medium
                        Density
                      </span>
                      <Badge variant="secondary">
                        {
                          analysisResult.data.analysis.ncdiAnalysis.distribution
                            .mediumDensity.percentage
                        }
                        %
                      </Badge>
                    </div>
                    <Progress
                      value={
                        analysisResult.data.analysis.ncdiAnalysis.distribution
                          .mediumDensity.percentage
                      }
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {analysisResult.data.analysis.ncdiAnalysis.distribution.mediumDensity.count.toLocaleString()}{" "}
                      data points
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-1">
                        <ArrowUpCircle className="w-4 h-4 text-green-500" />{" "}
                        High Density
                      </span>
                      <Badge variant="default">
                        {
                          analysisResult.data.analysis.ncdiAnalysis.distribution
                            .highDensity.percentage
                        }
                        %
                      </Badge>
                    </div>
                    <Progress
                      value={
                        analysisResult.data.analysis.ncdiAnalysis.distribution
                          .highDensity.percentage
                      }
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {analysisResult.data.analysis.ncdiAnalysis.distribution.highDensity.count.toLocaleString()}{" "}
                      data points
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-medium">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Assessments</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={handleFilter}
            >
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={handleExport}
            >
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-sm font-medium text-gray-500">
                    Assessment ID
                  </th>
                  <th className="text-left py-2 text-sm font-medium text-gray-500">
                    Farmer
                  </th>
                  <th className="text-left py-2 text-sm font-medium text-gray-500">
                    Location
                  </th>
                  <th className="text-left py-2 text-sm font-medium text-gray-500">
                    Date
                  </th>
                  <th className="text-left py-2 text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-left py-2 text-sm font-medium text-gray-500">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((assessment) => (
                  <tr key={assessment.id} className="border-b">
                    <td className="py-2 text-sm">{assessment.id}</td>
                    <td className="py-2 text-sm">{assessment.farmer}</td>
                    <td className="py-2 text-sm">{assessment.location}</td>
                    <td className="py-2 text-sm">{assessment.date}</td>
                    <td className="py-2 text-sm">
                      <Badge
                        variant={
                          assessment.status === "Approved"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {assessment.status}
                      </Badge>
                    </td>
                    <td className="py-2 text-sm">
                      <Badge
                        variant={
                          assessment.priority === "HIGH"
                            ? "destructive"
                            : assessment.priority === "MEDIUM"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {assessment.priority}
                      </Badge>
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
}
