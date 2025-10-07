import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  User, 
  CheckCircle, 
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Home,
  Copy,
  ArrowRight
} from "lucide-react";

interface RegistrationData {
  fullName: string;
  gender: string;
  nationalId: string;
  phoneNumber: string;
  email: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  farmSize: string;
  cropTypes: string;
  additionalInfo: string;
}

interface FarmerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FarmerRegistrationModal({ isOpen, onClose }: FarmerRegistrationModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [farmerId, setFarmerId] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: "",
    gender: "",
    nationalId: "",
    phoneNumber: "",
    email: "",
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
    farmSize: "",
    cropTypes: "",
    additionalInfo: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStep1Valid = formData.fullName && formData.gender && formData.nationalId && 
                       formData.phoneNumber && formData.email;

  const isStep2Valid = formData.province && formData.district && formData.sector && 
                       formData.cell && formData.village && formData.farmSize && formData.cropTypes;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(farmerId);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep2Valid) return;

    setIsSubmitting(true);
    
    // Generate Farmer ID
    const generatedId = `FMR-${Date.now().toString().slice(-4)}`;
    setFarmerId(generatedId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
  };

  const provinces = [
    "Kigali City", "Northern Province", "Southern Province", 
    "Eastern Province", "Western Province"
  ];

  const districts = {
    "Kigali City": ["Nyarugenge", "Gasabo", "Kicukiro"],
    "Northern Province": ["Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo"],
    "Southern Province": ["Gisagara", "Huye", "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango"],
    "Eastern Province": ["Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana"],
    "Western Province": ["Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rusizi", "Rutsiro"]
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white/5 backdrop-blur-xl border border-white/10">
          <Card className="w-full max-w-md bg-transparent border-0 shadow-none">
            <CardHeader className="text-center pb-8">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
              <CardTitle className="text-3xl font-bold text-white mb-2">Registration Successful!</CardTitle>
              <p className="text-white/80">Welcome to the platform</p>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <p className="text-white/80 text-sm mb-3">Your Farmer ID is:</p>
                <div className="flex items-center justify-center space-x-3">
                  <div className="text-2xl font-bold text-green-400 bg-white/10 p-3 rounded-lg border border-white/20 flex-1">
                    {farmerId}
                  </div>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm"
                  >
                    {copySuccess ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {copySuccess && (
                  <p className="text-green-400 text-xs mt-2">Copied to clipboard!</p>
                )}
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                <p className="text-white/70 text-sm mb-4">
                  You can now use this ID to log in and access your dashboard.
                </p>
                <Button
                  onClick={() => {
                    onClose();
                    navigate('/farmer-login');
                  }}
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm rounded-3xl py-3 font-medium duration-500 ease-out hover:scale-105 hover:-translate-y-1"
                >
                  Go to Farmer Login
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    onClose();
                    setShowSuccess(false);
                    setStep(1);
                    setFarmerId("");
                    // Reset form data
                    setFormData({
                      fullName: "",
                      gender: "",
                      nationalId: "",
                      phoneNumber: "",
                      email: "",
                      province: "",
                      district: "",
                      sector: "",
                      cell: "",
                      village: "",
                      farmSize: "",
                      cropTypes: "",
                      additionalInfo: ""
                    });
                  }}
                  variant="outline"
                  className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white/5 backdrop-blur-xl border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center">
            {step === 1 ? "Personal Information" : "Location Details"}
          </DialogTitle>
          <DialogDescription className="text-white/70 text-center">
            {step === 1 
              ? "Please provide your personal details to create your farmer profile"
              : "Tell us about your farm location and agricultural activities"
            }
          </DialogDescription>
        </DialogHeader>

        <Card className="bg-transparent border-0 shadow-none">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-white">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-white">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationalId" className="text-white">National ID</Label>
                    <Input
                      id="nationalId"
                      value={formData.nationalId}
                      onChange={(e) => handleInputChange('nationalId', e.target.value)}
                      placeholder="Enter your National ID"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-white">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="+250 788 123 456"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email" className="text-white">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="province" className="text-white">Province</Label>
                    <Select value={formData.province} onValueChange={(value) => handleInputChange('province', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {provinces.map((province) => (
                          <SelectItem key={province} value={province}>{province}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district" className="text-white">District</Label>
                    <Select 
                      value={formData.district} 
                      onValueChange={(value) => handleInputChange('district', value)}
                      disabled={!formData.province}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {formData.province && districts[formData.province as keyof typeof districts]?.map((district) => (
                          <SelectItem key={district} value={district}>{district}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sector" className="text-white">Sector</Label>
                    <Input
                      id="sector"
                      value={formData.sector}
                      onChange={(e) => handleInputChange('sector', e.target.value)}
                      placeholder="Enter sector name"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cell" className="text-white">Cell</Label>
                    <Input
                      id="cell"
                      value={formData.cell}
                      onChange={(e) => handleInputChange('cell', e.target.value)}
                      placeholder="Enter cell name"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="village" className="text-white">Village</Label>
                    <Input
                      id="village"
                      value={formData.village}
                      onChange={(e) => handleInputChange('village', e.target.value)}
                      placeholder="Enter village name"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="farmSize" className="text-white">Farm Size (hectares)</Label>
                    <Input
                      id="farmSize"
                      type="number"
                      step="0.1"
                      value={formData.farmSize}
                      onChange={(e) => handleInputChange('farmSize', e.target.value)}
                      placeholder="e.g., 2.5"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="cropTypes" className="text-white">Crop Types</Label>
                    <Input
                      id="cropTypes"
                      value={formData.cropTypes}
                      onChange={(e) => handleInputChange('cropTypes', e.target.value)}
                      placeholder="e.g., Maize, Beans, Cassava"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="additionalInfo" className="text-white">Additional Information</Label>
                    <Textarea
                      id="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                      placeholder="Any additional information about your farming activities..."
                      rows={3}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center gap-4 pt-6">
                {step === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm"
                  >
                    Previous
                  </Button>
                )}
                <div className="flex-1"></div>
                {step === 1 ? (
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!isStep1Valid}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm px-8 py-3"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!isStep2Valid || isSubmitting}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm px-8 py-3"
                  >
                    {isSubmitting ? "Creating Account..." : "Register Farmer"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
