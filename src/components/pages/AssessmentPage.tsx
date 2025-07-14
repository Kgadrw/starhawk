import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect, useRef } from "react";

interface DroneData {
  ndvi: number;
  cropHealth: number;
  soilMoisture: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  pestInfestation: number;
  diseasePresence: number;
  cropDensity: number;
  timestamp: string;
}

interface RiskAssessment {
  overallRisk: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  factors: {
    weather: number;
    cropHealth: number;
    pestRisk: number;
    diseaseRisk: number;
    soilRisk: number;
  };
  recommendations: string[];
  payoutProbability: number;
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

interface DroneDataFile {
  filename: string;
  data: DroneData;
  uploadedAt: string;
}

const assessments = [
  { id: "INA-2025-001", farmer: "John Smith", location: "Nairobi East", date: "Jan 15", status: "Pending", priority: "HIGH" },
  { id: "INA-2025-002", farmer: "Sarah Johnson", location: "Kiambu Central", date: "Jan 14", status: "Approved", priority: "MEDIUM" },
  { id: "INA-2025-003", farmer: "David Wilson", location: "Machakos West", date: "Jan 13", status: "Pending", priority: "LOW" },
];

export function AssessmentPage() {
  const { toast } = useToast();
  const [droneData, setDroneData] = useState<DroneData | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [selectedCrop, setSelectedCrop] = useState("maize");
  const [selectedLocation, setSelectedLocation] = useState("nairobi");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysis[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [droneDataFile, setDroneDataFile] = useState<DroneDataFile | null>(null);
  const [isProcessingDroneData, setIsProcessingDroneData] = useState(false);
  const droneFileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => toast({ title: "Exported!", description: "Assessment data exported." });
  const handleFilter = () => toast({ title: "Filter applied!", description: "Assessment filter applied." });
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); toast({ title: "Assessment Submitted!", description: "Your assessment has been submitted." }); };
  const handleUpload = () => toast({ title: "Upload!", description: "Photo upload simulated." });

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    const newImages = Array.from(files).filter(file => file.type.startsWith('image/'));
    setUploadedImages(prev => [...prev, ...newImages]);
    toast({ title: "Images Uploaded", description: `${newImages.length} image(s) added for analysis.` });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleImageUpload(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setImageAnalysis(prev => prev.filter((_, i) => i !== index));
  };

  const processImages = async () => {
    if (uploadedImages.length === 0) {
      toast({ title: "No Images", description: "Please upload images first." });
      return;
    }

    setIsProcessing(true);
    toast({ title: "Processing Images", description: "Analyzing uploaded images..." });

    setTimeout(() => {
      const analyses: ImageAnalysis[] = uploadedImages.map((file) => {
        const cropTypes = ["Maize", "Wheat", "Rice", "Coffee", "Tea"];
        const damageLevels = ["Severe", "Moderate", "Light", "None"];
        
        return {
          filename: file.name,
          cropType: cropTypes[Math.floor(Math.random() * cropTypes.length)],
          healthScore: Math.random() * 100,
          damageAssessment: damageLevels[Math.floor(Math.random() * damageLevels.length)],
          estimatedLoss: Math.random() * 50000 + 10000,
          confidence: Math.random() * 30 + 70,
          processedAt: new Date().toISOString(),
        };
      });

      setImageAnalysis(analyses);
      generateProcessedData(analyses);
      setIsProcessing(false);
      toast({ title: "Analysis Complete", description: "Image analysis finished successfully." });
    }, 3000);
  };

  const generateProcessedData = (analyses: ImageAnalysis[]) => {
    const totalImages = analyses.length;
    const averageHealthScore = analyses.reduce((sum, analysis) => sum + analysis.healthScore, 0) / totalImages;
    const totalEstimatedLoss = analyses.reduce((sum, analysis) => sum + analysis.estimatedLoss, 0);
    
    const damageBreakdown = {
      severe: analyses.filter(a => a.damageAssessment === "Severe").length,
      moderate: analyses.filter(a => a.damageAssessment === "Moderate").length,
      light: analyses.filter(a => a.damageAssessment === "Light").length,
      none: analyses.filter(a => a.damageAssessment === "None").length,
    };

    const recommendations = [];
    if (damageBreakdown.severe > 0) recommendations.push("Immediate intervention required for severely damaged areas");
    if (averageHealthScore < 50) recommendations.push("Overall crop health is poor - consider replanting");
    if (totalEstimatedLoss > 100000) recommendations.push("High financial impact - expedite insurance claim");
    if (damageBreakdown.moderate > damageBreakdown.light) recommendations.push("Moderate damage detected - implement recovery measures");

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

  const collectDroneData = () => {
    setIsCollecting(true);
    toast({ title: "Drone Deployed", description: "Collecting field data..." });
    
    setTimeout(() => {
      const newDroneData: DroneData = {
        ndvi: Math.random() * 0.8 + 0.2,
        cropHealth: Math.random() * 100,
        soilMoisture: Math.random() * 100,
        temperature: Math.random() * 20 + 15,
        humidity: Math.random() * 40 + 40,
        windSpeed: Math.random() * 20,
        rainfall: Math.random() * 50,
        pestInfestation: Math.random() * 100,
        diseasePresence: Math.random() * 100,
        cropDensity: Math.random() * 100,
        timestamp: new Date().toISOString(),
      };
      
      setDroneData(newDroneData);
      processDroneData(newDroneData);
      setIsCollecting(false);
      toast({ title: "Data Collected!", description: "Drone data processed successfully." });
    }, 3000);
  };

  const processDroneData = (data: DroneData) => {
    const weatherRisk = calculateWeatherRisk(data);
    const cropHealthRisk = calculateCropHealthRisk(data);
    const pestRisk = data.pestInfestation / 100;
    const diseaseRisk = data.diseasePresence / 100;
    const soilRisk = (100 - data.soilMoisture) / 100;

    const overallRisk = (weatherRisk + cropHealthRisk + pestRisk + diseaseRisk + soilRisk) / 5;
    
    const riskLevel = overallRisk < 0.3 ? "Low" : 
                     overallRisk < 0.6 ? "Medium" : 
                     overallRisk < 0.8 ? "High" : "Critical";

    const payoutProbability = Math.max(0, 1 - overallRisk);

    const recommendations = generateRecommendations(data, riskLevel);

    setRiskAssessment({
      overallRisk,
      riskLevel,
      factors: {
        weather: weatherRisk,
        cropHealth: cropHealthRisk,
        pestRisk,
        diseaseRisk,
        soilRisk,
      },
      recommendations,
      payoutProbability,
    });
  };

  const calculateWeatherRisk = (data: DroneData): number => {
    let risk = 0;
    if (data.temperature > 30 || data.temperature < 10) risk += 0.3;
    if (data.humidity > 80) risk += 0.2;
    if (data.windSpeed > 15) risk += 0.2;
    if (data.rainfall > 30) risk += 0.3;
    return Math.min(1, risk);
  };

  const calculateCropHealthRisk = (data: DroneData): number => {
    return (100 - data.cropHealth) / 100;
  };

  const generateRecommendations = (data: DroneData, riskLevel: string): string[] => {
    const recommendations = [];
    
    if (data.ndvi < 0.4) recommendations.push("Low vegetation health detected - consider irrigation");
    if (data.pestInfestation > 50) recommendations.push("High pest infestation - immediate treatment required");
    if (data.diseasePresence > 30) recommendations.push("Disease presence detected - quarantine recommended");
    if (data.soilMoisture < 30) recommendations.push("Low soil moisture - irrigation needed");
    if (data.temperature > 35) recommendations.push("High temperature stress - monitor crop health");
    
    if (riskLevel === "Critical") {
      recommendations.push("CRITICAL: Immediate intervention required");
      recommendations.push("Consider crop insurance claim");
    } else if (riskLevel === "High") {
      recommendations.push("High risk - frequent monitoring needed");
    }
    
    return recommendations;
  };

  const handleDroneDataUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setIsProcessingDroneData(true);
    toast({ title: "Processing Drone Data", description: "Analyzing uploaded drone data..." });

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let droneData: DroneData;
        
        if (file.name.endsWith('.json')) {
          droneData = JSON.parse(e.target?.result as string);
        } else if (file.name.endsWith('.csv')) {
          const csvText = e.target?.result as string;
          const lines = csvText.split('\n');
          const headers = lines[0].split(',');
          const values = lines[1].split(',');
          
          droneData = {
            ndvi: parseFloat(values[headers.indexOf('ndvi')] || '0.5'),
            cropHealth: parseFloat(values[headers.indexOf('cropHealth')] || '75'),
            soilMoisture: parseFloat(values[headers.indexOf('soilMoisture')] || '60'),
            temperature: parseFloat(values[headers.indexOf('temperature')] || '25'),
            humidity: parseFloat(values[headers.indexOf('humidity')] || '65'),
            windSpeed: parseFloat(values[headers.indexOf('windSpeed')] || '8'),
            rainfall: parseFloat(values[headers.indexOf('rainfall')] || '15'),
            pestInfestation: parseFloat(values[headers.indexOf('pestInfestation')] || '20'),
            diseasePresence: parseFloat(values[headers.indexOf('diseasePresence')] || '10'),
            cropDensity: parseFloat(values[headers.indexOf('cropDensity')] || '85'),
            timestamp: values[headers.indexOf('timestamp')] || new Date().toISOString(),
          };
        } else {
          droneData = {
            ndvi: Math.random() * 0.8 + 0.2,
            cropHealth: Math.random() * 100,
            soilMoisture: Math.random() * 100,
            temperature: Math.random() * 20 + 15,
            humidity: Math.random() * 40 + 40,
            windSpeed: Math.random() * 20,
            rainfall: Math.random() * 50,
            pestInfestation: Math.random() * 100,
            diseasePresence: Math.random() * 100,
            cropDensity: Math.random() * 100,
            timestamp: new Date().toISOString(),
          };
        }

        setDroneData(droneData);
        setDroneDataFile({
          filename: file.name,
          data: droneData,
          uploadedAt: new Date().toISOString(),
        });
        processDroneData(droneData);
        setIsProcessingDroneData(false);
        toast({ title: "Drone Data Processed", description: "Drone data analyzed successfully." });
      } catch (error) {
        setIsProcessingDroneData(false);
        toast({ title: "Error", description: "Failed to process drone data file." });
      }
    };
    
    reader.readAsText(file);
  };

  const handleDroneFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleDroneDataUpload(e.dataTransfer.files);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Field Assessment</h1>
          <p className="text-gray-600">Drone Data Analysis & Risk Assessment</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={collectDroneData} disabled={isCollecting}>
            {isCollecting ? "Collecting Data..." : "Simulate Drone"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Field Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-gray-600">2 months locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-gray-600">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">High Risk Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 Days</div>
            <p className="text-xs text-gray-600">Next assessment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">Upgraded Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 Days</div>
            <p className="text-xs text-gray-600">Average time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assessment Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Drone Data Analysis</CardTitle>
            <p className="text-sm text-gray-600">Upload drone data files or simulate collection</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cropType">Crop Type</Label>
                  <Select value={selectedCrop} onValueChange={setSelectedCrop}>
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
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
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

              {/* Drone Data Upload Section */}
              <div className="space-y-4">
                <div>
                  <Label>Drone Data Upload</Label>
                  <div 
                    className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDroneFileDrop}
                  >
                    <input
                      ref={droneFileInputRef}
                      type="file"
                      accept=".csv,.json,.txt"
                      onChange={(e) => handleDroneDataUpload(e.target.files)}
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      type="button" 
                      onClick={() => droneFileInputRef.current?.click()}
                      className="mb-2"
                      disabled={isProcessingDroneData}
                    >
                      📊 Upload Drone Data
                    </Button>
                    <p className="text-sm text-gray-500">Drag & drop drone data files here or click to browse</p>
                    <p className="text-xs text-gray-400 mt-1">Supports: CSV, JSON, TXT files</p>
                  </div>
                </div>

                {/* Uploaded Drone Data Display */}
                {droneDataFile && (
                  <div className="space-y-2">
                    <Label>Uploaded Drone Data</Label>
                    <div className="p-3 border rounded bg-blue-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{droneDataFile.filename}</div>
                          <div className="text-sm text-gray-600">
                            Uploaded: {new Date(droneDataFile.uploadedAt).toLocaleString()}
                          </div>
                        </div>
                        <Badge variant="default">Processed</Badge>
                      </div>
                    </div>
                  </div>
                )}

                {/* Drone Data Display */}
                {droneData && (
                  <div className="space-y-4 mt-4">
                    <h3 className="font-semibold">Drone Data Analysis</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-lg font-bold">{droneData.ndvi.toFixed(2)}</div>
                        <div className="text-xs text-gray-600">NDVI Index</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-lg font-bold">{droneData.cropHealth.toFixed(0)}%</div>
                        <div className="text-xs text-gray-600">Crop Health</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded">
                        <div className="text-lg font-bold">{droneData.soilMoisture.toFixed(0)}%</div>
                        <div className="text-xs text-gray-600">Soil Moisture</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded">
                        <div className="text-lg font-bold">{droneData.temperature.toFixed(1)}°C</div>
                        <div className="text-xs text-gray-600">Temperature</div>
                      </div>
                    </div>
                    
                    {/* Additional Drone Data */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <div className="text-lg font-bold">{droneData.humidity.toFixed(0)}%</div>
                        <div className="text-xs text-gray-600">Humidity</div>
                      </div>
                      <div className="text-center p-3 bg-indigo-50 rounded">
                        <div className="text-lg font-bold">{droneData.windSpeed.toFixed(1)} km/h</div>
                        <div className="text-xs text-gray-600">Wind Speed</div>
                      </div>
                      <div className="text-center p-3 bg-pink-50 rounded">
                        <div className="text-lg font-bold">{droneData.rainfall.toFixed(1)} mm</div>
                        <div className="text-xs text-gray-600">Rainfall</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-lg font-bold">{droneData.cropDensity.toFixed(0)}%</div>
                        <div className="text-xs text-gray-600">Crop Density</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Image Upload Section */}
                <div className="space-y-4">
                  <div>
                    <Label>Field Images Upload</Label>
                    <div 
                      className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
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
                      <p className="text-sm text-gray-500">Drag & drop images here or click to browse</p>
                      <p className="text-xs text-gray-400 mt-1">Supports: JPG, PNG, GIF</p>
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
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
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
                        className="w-full"
                      >
                        {isProcessing ? "Processing..." : "Analyze Images"}
                      </Button>
                    </div>
                  )}

                  {/* Image Analysis Results */}
                  {imageAnalysis.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Image Analysis Results</h3>
                      <div className="space-y-2">
                        {imageAnalysis.map((analysis, index) => (
                          <div key={index} className="p-3 border rounded">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{analysis.filename}</div>
                                <div className="text-sm text-gray-600">
                                  Crop: {analysis.cropType} | Health: {analysis.healthScore.toFixed(1)}%
                                </div>
                                <div className="text-sm text-gray-600">
                                  Damage: {analysis.damageAssessment} | Loss: KSh {analysis.estimatedLoss.toLocaleString()}
                                </div>
                              </div>
                              <Badge variant={analysis.confidence > 90 ? "default" : "secondary"}>
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
                      <h3 className="font-semibold">P&L Assessment Summary</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <div className="text-lg font-bold">{processedData.totalImages}</div>
                          <div className="text-xs text-gray-600">Images Analyzed</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded">
                          <div className="text-lg font-bold">{processedData.averageHealthScore.toFixed(1)}%</div>
                          <div className="text-xs text-gray-600">Avg Health</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded">
                          <div className="text-lg font-bold">KSh {processedData.totalEstimatedLoss.toLocaleString()}</div>
                          <div className="text-xs text-gray-600">Total Loss</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded">
                          <div className="text-lg font-bold">KSh {processedData.pnlImpact.netImpact.toLocaleString()}</div>
                          <div className="text-xs text-gray-600">Net Impact</div>
                        </div>
                      </div>

                      {/* Damage Breakdown */}
                      <div>
                        <Label>Damage Breakdown</Label>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          <div className="text-center p-2 bg-red-100 rounded">
                            <div className="font-bold">{processedData.damageBreakdown.severe}</div>
                            <div className="text-xs">Severe</div>
                          </div>
                          <div className="text-center p-2 bg-orange-100 rounded">
                            <div className="font-bold">{processedData.damageBreakdown.moderate}</div>
                            <div className="text-xs">Moderate</div>
                          </div>
                          <div className="text-center p-2 bg-yellow-100 rounded">
                            <div className="font-bold">{processedData.damageBreakdown.light}</div>
                            <div className="text-xs">Light</div>
                          </div>
                          <div className="text-center p-2 bg-green-100 rounded">
                            <div className="font-bold">{processedData.damageBreakdown.none}</div>
                            <div className="text-xs">None</div>
                          </div>
                        </div>
                      </div>

                      {/* P&L Impact */}
                      <div>
                        <Label>Financial Impact</Label>
                        <div className="space-y-2 mt-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Revenue Loss:</span>
                            <span className="text-sm font-medium">KSh {processedData.pnlImpact.revenueLoss.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Recovery Cost:</span>
                            <span className="text-sm font-medium">KSh {processedData.pnlImpact.recoveryCost.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Insurance Coverage:</span>
                            <span className="text-sm font-medium">KSh {processedData.pnlImpact.insuranceCoverage.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-sm font-medium">Net Impact:</span>
                            <span className="text-sm font-bold">KSh {processedData.pnlImpact.netImpact.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div>
                        <Label>Recommendations</Label>
                        <div className="space-y-1 mt-2">
                          {processedData.recommendations.map((rec, index) => (
                            <div key={index} className="text-sm text-gray-600">• {rec}</div>
                          ))}
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

                  <Button className="w-full bg-green-600 hover:bg-green-700" type="submit">Submit Assessment</Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Risk Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {riskAssessment ? (
              <>
                <div>
                  <p className="text-sm font-medium mb-2">Overall Risk Score</p>
                  <div className="text-2xl font-bold">{Math.round(riskAssessment.overallRisk * 100)}%</div>
                  <Badge className={`mt-2 ${
                    riskAssessment.riskLevel === "Low" ? "bg-green-100 text-green-800" :
                    riskAssessment.riskLevel === "Medium" ? "bg-yellow-100 text-yellow-800" :
                    riskAssessment.riskLevel === "High" ? "bg-orange-100 text-orange-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {riskAssessment.riskLevel} Risk
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Payout Probability</p>
                  <div className="text-2xl font-bold">{Math.round(riskAssessment.payoutProbability * 100)}%</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Weather Risk</span>
                    <Badge className="bg-blue-100 text-blue-800">{Math.round(riskAssessment.factors.weather * 100)}%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Crop Health</span>
                    <Badge className="bg-green-100 text-green-800">{Math.round(riskAssessment.factors.cropHealth * 100)}%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pest Risk</span>
                    <Badge className="bg-orange-100 text-orange-800">{Math.round(riskAssessment.factors.pestRisk * 100)}%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Disease Risk</span>
                    <Badge className="bg-red-100 text-red-800">{Math.round(riskAssessment.factors.diseaseRisk * 100)}%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Soil Risk</span>
                    <Badge className="bg-yellow-100 text-yellow-800">{Math.round(riskAssessment.factors.soilRisk * 100)}%</Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Recommendations</p>
                  <div className="space-y-1">
                    {riskAssessment.recommendations.map((rec, index) => (
                      <div key={index} className="text-xs text-gray-600">• {rec}</div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm font-medium mb-2">Risk Probability</p>
                  <div className="text-2xl font-bold">--</div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Risk Analysis</p>
                  <div className="h-32 bg-green-100 rounded flex items-center justify-center">
                    <span className="text-sm text-gray-600">Deploy drone to analyze</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Crop Condition</span>
                    <Badge className="bg-green-100 text-green-800">--</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Weather Risk</span>
                    <Badge className="bg-orange-100 text-orange-800">--</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Soil Risk</span>
                    <Badge className="bg-red-100 text-red-800">--</Badge>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Assessments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Assessments</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" type="button" onClick={handleFilter}>Filter</Button>
            <Button variant="outline" size="sm" type="button" onClick={handleExport}>Export</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Assessment ID</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Farmer</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Location</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Priority</th>
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
                      <Badge variant={assessment.status === "Approved" ? "default" : "secondary"}>
                        {assessment.status}
                      </Badge>
                    </td>
                    <td className="py-2 text-sm">
                      <Badge variant={
                        assessment.priority === "HIGH" ? "destructive" :
                        assessment.priority === "MEDIUM" ? "default" : "secondary"
                      }>
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