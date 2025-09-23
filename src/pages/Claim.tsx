import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Upload, 
  Camera, 
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  Shield,
  Users,
  BarChart3
} from "lucide-react";

export default function Claim() {
  const [currentStep, setCurrentStep] = useState(1);
  const [claimData, setClaimData] = useState({
    // Personal Information
    farmerName: "",
    contactNumber: "",
    email: "",
    farmLocation: "",
    farmSize: "",
    
    // Policy Information
    policyNumber: "",
    insuranceCompany: "",
    policyType: "",
    
    // Claim Details
    disasterType: "",
    incidentDate: "",
    damageDescription: "",
    estimatedLoss: "",
    affectedArea: "",
    
    // Supporting Documents
    photos: [] as File[],
    documents: [] as File[],
    reports: [] as File[]
  });

  const totalSteps = 4;

  const handleInputChange = (field: string, value: any) => {
    setClaimData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setClaimData(prev => ({
        ...prev,
        [field]: [...prev[field as keyof typeof prev] as File[], ...newFiles]
      }));
    }
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
    console.log("Claim submitted:", claimData);
    // Handle claim submission
  };

  const disasterTypes = [
    "Drought",
    "Flood",
    "Pest Attack",
    "Disease Outbreak",
    "Hail Storm",
    "Fire",
    "Wind Damage",
    "Excessive Rain",
    "Frost",
    "Other"
  ];

  const insuranceCompanies = [
    "Rwanda Insurance Company",
    "SORAS General Insurance",
    "Radiant Insurance",
    "Phoenix of Rwanda Assurance",
    "Other"
  ];

  const claimSteps = [
    { number: 1, title: "Personal Info", description: "Your contact and farm details" },
    { number: 2, title: "Policy Details", description: "Insurance policy information" },
    { number: 3, title: "Incident Report", description: "Describe the damage and loss" },
    { number: 4, title: "Documentation", description: "Upload supporting evidence" }
  ];

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="farmerName">Full Name *</Label>
            <Input
              id="farmerName"
              value={claimData.farmerName}
              onChange={(e) => handleInputChange("farmerName", e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <Label htmlFor="contactNumber">Contact Number *</Label>
            <Input
              id="contactNumber"
              value={claimData.contactNumber}
              onChange={(e) => handleInputChange("contactNumber", e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={claimData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <Label htmlFor="farmLocation">Farm Location *</Label>
            <Input
              id="farmLocation"
              value={claimData.farmLocation}
              onChange={(e) => handleInputChange("farmLocation", e.target.value)}
              placeholder="Enter farm location with coordinates"
              required
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="farmSize">Farm Size (acres) *</Label>
            <Input
              id="farmSize"
              type="number"
              value={claimData.farmSize}
              onChange={(e) => handleInputChange("farmSize", e.target.value)}
              placeholder="Enter farm size in acres"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Policy Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="policyNumber">Policy Number *</Label>
            <Input
              id="policyNumber"
              value={claimData.policyNumber}
              onChange={(e) => handleInputChange("policyNumber", e.target.value)}
              placeholder="Enter your policy number"
              required
            />
          </div>
          <div>
            <Label htmlFor="insuranceCompany">Insurance Company *</Label>
            <Select value={claimData.insuranceCompany} onValueChange={(value) => handleInputChange("insuranceCompany", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select insurance company" />
              </SelectTrigger>
              <SelectContent>
                {insuranceCompanies.map((company) => (
                  <SelectItem key={company} value={company}>{company}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="policyType">Policy Type *</Label>
            <Select value={claimData.policyType} onValueChange={(value) => handleInputChange("policyType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select policy type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crop">Crop Insurance</SelectItem>
                <SelectItem value="livestock">Livestock Insurance</SelectItem>
                <SelectItem value="weather">Weather Insurance</SelectItem>
                <SelectItem value="comprehensive">Comprehensive Coverage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Incident Report</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="disasterType">Type of Disaster *</Label>
            <Select value={claimData.disasterType} onValueChange={(value) => handleInputChange("disasterType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select disaster type" />
              </SelectTrigger>
              <SelectContent>
                {disasterTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="incidentDate">Date of Incident *</Label>
            <Input
              id="incidentDate"
              type="date"
              value={claimData.incidentDate}
              onChange={(e) => handleInputChange("incidentDate", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="estimatedLoss">Estimated Financial Loss *</Label>
            <Input
              id="estimatedLoss"
              type="number"
              value={claimData.estimatedLoss}
              onChange={(e) => handleInputChange("estimatedLoss", e.target.value)}
              placeholder="Enter estimated loss amount"
              required
            />
          </div>
          <div>
            <Label htmlFor="affectedArea">Affected Area (acres) *</Label>
            <Input
              id="affectedArea"
              type="number"
              value={claimData.affectedArea}
              onChange={(e) => handleInputChange("affectedArea", e.target.value)}
              placeholder="Enter affected area"
              required
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="damageDescription">Damage Description *</Label>
            <Textarea
              id="damageDescription"
              value={claimData.damageDescription}
              onChange={(e) => handleInputChange("damageDescription", e.target.value)}
              placeholder="Describe the damage in detail"
              rows={4}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Supporting Documentation</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload("photos", e.target.files)}
                  className="w-full"
                />
                <div className="space-y-2">
                  {claimData.photos.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{file.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload photos showing the damage to your crops or property.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload("documents", e.target.files)}
                  className="w-full"
                />
                <div className="space-y-2">
                  {claimData.documents.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{file.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload policy documents, receipts, or other relevant paperwork.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload("reports", e.target.files)}
                  className="w-full"
                />
                <div className="space-y-2">
                  {claimData.reports.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{file.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload weather reports, assessment reports, or expert evaluations.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-900 to-orange-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              File a Claim
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100">
              Report your agricultural loss quickly and efficiently with our streamlined
              claims process. Get the support you need when you need it most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Phone className="h-5 w-5 mr-2" />
                Emergency Hotline
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-red-600">
                <MessageCircle className="h-5 w-5 mr-2" />
                Live Chat Support
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Process */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple Claims Process
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our streamlined 4-step process makes filing a claim quick and easy.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {claimSteps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep >= step.number 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.number}
                </div>
                <div className="ml-3 text-left">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-primary' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {index < claimSteps.length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-200 mx-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Claim Form */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">
                Step {currentStep} of {totalSteps}
              </CardTitle>
              <Badge variant="outline">
                {claimSteps[currentStep - 1].title}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
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
                {currentStep < totalSteps ? (
                  <Button onClick={nextStep}>
                    Next Step
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} className="bg-gradient-to-r from-red-600 to-orange-600">
                    Submit Claim
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Support Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Need Help with Your Claim?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our support team is here to help you through every step of the claims process.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                <p className="text-muted-foreground mb-4">
                  Speak directly with our claims specialists
                </p>
                <Button variant="outline">+250 123 456 789</Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
                <p className="text-muted-foreground mb-4">
                  Get instant help through our chat system
                </p>
                <Button variant="outline">Start Chat</Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email Support</h3>
                <p className="text-muted-foreground mb-4">
                  Send us your questions and documents
                </p>
                <Button variant="outline">claims@starhawk.com</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
