import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Camera, 
  MapPin, 
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  X
} from "lucide-react";

interface AssessmentFormProps {
  type: "risk" | "loss";
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

export function ComprehensiveAssessmentForm({ type, onSubmit, onCancel }: AssessmentFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    farmerName: "",
    farmLocation: "",
    contactNumber: "",
    farmSize: "",
    
    // Seasonal & Crop Information
    seasonType: "",
    plantingDate: "",
    expectedHarvest: "",
    cropVariety: "",
    seedSpecifications: "",
    tillingMethod: "",
    
    // Agricultural Practices
    fertilizerType: "",
    fertilizerSchedule: "",
    irrigationSystem: "",
    waterAvailability: "",
    pestControlMeasures: "",
    
    // Risk/Loss Specific
    disasterType: "",
    damageExtent: "",
    financialLoss: "",
    assessmentComments: "",
    
    // File Uploads
    satelliteImages: [] as File[],
    droneFootage: [] as File[],
    assessmentReports: [] as File[],
    photographicEvidence: [] as File[]
  });

  const totalSteps = type === "risk" ? 4 : 5;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field as keyof typeof prev] as File[], ...newFiles]
      }));
    }
  };

  const removeFile = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as File[]).filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="farmerName">Farmer Name</Label>
            <Input
              id="farmerName"
              value={formData.farmerName}
              onChange={(e) => handleInputChange("farmerName", e.target.value)}
              placeholder="Enter farmer's full name"
            />
          </div>
          <div>
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              value={formData.contactNumber}
              onChange={(e) => handleInputChange("contactNumber", e.target.value)}
              placeholder="Enter contact number"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="farmLocation">Farm Location</Label>
            <Input
              id="farmLocation"
              value={formData.farmLocation}
              onChange={(e) => handleInputChange("farmLocation", e.target.value)}
              placeholder="Enter farm location with coordinates"
            />
          </div>
          <div>
            <Label htmlFor="farmSize">Farm Size (acres)</Label>
            <Input
              id="farmSize"
              type="number"
              value={formData.farmSize}
              onChange={(e) => handleInputChange("farmSize", e.target.value)}
              placeholder="Enter farm size in acres"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Seasonal & Crop Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="seasonType">Season Type</Label>
            <Select value={formData.seasonType} onValueChange={(value) => handleInputChange("seasonType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select season type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Season A</SelectItem>
                <SelectItem value="B">Season B</SelectItem>
                <SelectItem value="C">Season C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="plantingDate">Planting Date</Label>
            <Input
              id="plantingDate"
              type="date"
              value={formData.plantingDate}
              onChange={(e) => handleInputChange("plantingDate", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="expectedHarvest">Expected Harvest Date</Label>
            <Input
              id="expectedHarvest"
              type="date"
              value={formData.expectedHarvest}
              onChange={(e) => handleInputChange("expectedHarvest", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cropVariety">Crop Variety</Label>
            <Input
              id="cropVariety"
              value={formData.cropVariety}
              onChange={(e) => handleInputChange("cropVariety", e.target.value)}
              placeholder="Enter crop variety"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="seedSpecifications">Seed Specifications</Label>
            <Textarea
              id="seedSpecifications"
              value={formData.seedSpecifications}
              onChange={(e) => handleInputChange("seedSpecifications", e.target.value)}
              placeholder="Enter seed specifications and details"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="tillingMethod">Tilling Method</Label>
            <Textarea
              id="tillingMethod"
              value={formData.tillingMethod}
              onChange={(e) => handleInputChange("tillingMethod", e.target.value)}
              placeholder="Describe tilling methods employed"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Agricultural Practices</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="fertilizerType">Fertilizer Type</Label>
            <Input
              id="fertilizerType"
              value={formData.fertilizerType}
              onChange={(e) => handleInputChange("fertilizerType", e.target.value)}
              placeholder="Enter fertilizer type used"
            />
          </div>
          <div>
            <Label htmlFor="fertilizerSchedule">Fertilizer Application Schedule</Label>
            <Input
              id="fertilizerSchedule"
              value={formData.fertilizerSchedule}
              onChange={(e) => handleInputChange("fertilizerSchedule", e.target.value)}
              placeholder="Enter application schedule"
            />
          </div>
          <div>
            <Label htmlFor="irrigationSystem">Irrigation System</Label>
            <Select value={formData.irrigationSystem} onValueChange={(value) => handleInputChange("irrigationSystem", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select irrigation system" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="drip">Drip Irrigation</SelectItem>
                <SelectItem value="sprinkler">Sprinkler System</SelectItem>
                <SelectItem value="flood">Flood Irrigation</SelectItem>
                <SelectItem value="rainfed">Rainfed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="waterAvailability">Water Availability</Label>
            <Select value={formData.waterAvailability} onValueChange={(value) => handleInputChange("waterAvailability", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select water availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="pestControlMeasures">Pest Control Measures</Label>
            <Textarea
              id="pestControlMeasures"
              value={formData.pestControlMeasures}
              onChange={(e) => handleInputChange("pestControlMeasures", e.target.value)}
              placeholder="Describe pest control measures implemented"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">
          {type === "risk" ? "Risk Assessment Details" : "Loss Assessment Details"}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {type === "loss" && (
            <>
              <div>
                <Label htmlFor="disasterType">Disaster Type</Label>
                <Select value={formData.disasterType} onValueChange={(value) => handleInputChange("disasterType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select disaster type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drought">Drought</SelectItem>
                    <SelectItem value="flood">Flood</SelectItem>
                    <SelectItem value="pest">Pest Attack</SelectItem>
                    <SelectItem value="disease">Disease Outbreak</SelectItem>
                    <SelectItem value="hail">Hail Storm</SelectItem>
                    <SelectItem value="fire">Fire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="damageExtent">Damage Extent (%)</Label>
                <Input
                  id="damageExtent"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.damageExtent}
                  onChange={(e) => handleInputChange("damageExtent", e.target.value)}
                  placeholder="Enter damage percentage"
                />
              </div>
              <div>
                <Label htmlFor="financialLoss">Estimated Financial Loss</Label>
                <Input
                  id="financialLoss"
                  type="number"
                  value={formData.financialLoss}
                  onChange={(e) => handleInputChange("financialLoss", e.target.value)}
                  placeholder="Enter estimated loss amount"
                />
              </div>
            </>
          )}
          <div className="md:col-span-2">
            <Label htmlFor="assessmentComments">Assessment Comments & Recommendations</Label>
            <Textarea
              id="assessmentComments"
              value={formData.assessmentComments}
              onChange={(e) => handleInputChange("assessmentComments", e.target.value)}
              placeholder="Enter detailed assessment comments and recommendations"
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">File Upload System</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Satellite Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload("satelliteImages", e.target.files)}
                  className="w-full"
                />
                <div className="space-y-2">
                  {formData.satelliteImages.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile("satelliteImages", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Drone Footage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="file"
                  multiple
                  accept="video/*,image/*"
                  onChange={(e) => handleFileUpload("droneFootage", e.target.files)}
                  className="w-full"
                />
                <div className="space-y-2">
                  {formData.droneFootage.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile("droneFootage", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Assessment Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload("assessmentReports", e.target.files)}
                  className="w-full"
                />
                <div className="space-y-2">
                  {formData.assessmentReports.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile("assessmentReports", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Photographic Evidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload("photographicEvidence", e.target.files)}
                  className="w-full"
                />
                <div className="space-y-2">
                  {formData.photographicEvidence.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile("photographicEvidence", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {type === "risk" ? "Risk Assessment Form" : "Loss Assessment Form"}
            </CardTitle>
            <Badge variant="outline">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>

          {/* Form Content */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <div className="flex gap-2">
              {onCancel && (
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              {currentStep < totalSteps ? (
                <Button onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  Submit Assessment
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
