import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPolicy as createPolicyApi } from "@/services/policiesApi";
import { getInsuranceRequests } from "@/services/farmsApi";
import assessmentsApiService from "@/services/assessmentsApi";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  Save
} from "lucide-react";

interface CreatePolicyPageProps {
  onBack: () => void;
  onSuccess?: () => void;
}

export default function CreatePolicyPage({ onBack, onSuccess }: CreatePolicyPageProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [farmers, setFarmers] = useState<any[]>([]);
  const [farmersLoading, setFarmersLoading] = useState(false);

  const [formData, setFormData] = useState({
    farmerId: "",
    farmerName: "",
    cropType: "",
    coverageAmount: "",
    premiumAmount: "",
    startDate: "",
    endDate: "",
    location: "",
    farmSize: "",
    riskLevel: "low",
    deductible: ""
  });

  // Load farmers on component mount
  useEffect(() => {
    loadFarmers();
    
    // Set default dates
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);
    setFormData(prev => ({
      ...prev,
      startDate: today.toISOString().split('T')[0],
      endDate: nextYear.toISOString().split('T')[0]
    }));
  }, []);

  const loadFarmers = async () => {
    setFarmersLoading(true);
    try {
      // Get farmers from insurance requests and submitted assessments
      // This approach works for insurers who don't have admin access to getAllUsers()
      const farmersMap = new Map<string, any>();
      
      try {
        // Strategy 1: Get farmers from insurance requests
        const insuranceRequestsResponse: any = await getInsuranceRequests(1, 100);
        let requestsData: any[] = [];
        
        if (insuranceRequestsResponse?.success && Array.isArray(insuranceRequestsResponse.data)) {
          requestsData = insuranceRequestsResponse.data;
        } else if (insuranceRequestsResponse?.success && insuranceRequestsResponse?.data?.items) {
          requestsData = insuranceRequestsResponse.data.items;
        } else if (Array.isArray(insuranceRequestsResponse)) {
          requestsData = insuranceRequestsResponse;
        } else if (Array.isArray(insuranceRequestsResponse?.data)) {
          requestsData = insuranceRequestsResponse.data;
        }
        
        // Extract farmers from insurance requests
        requestsData.forEach((request: any) => {
          const farmer = request.farmerId || request.farmer;
          if (farmer) {
            const farmerId = farmer._id || farmer.id || farmer;
            if (farmerId && !farmersMap.has(farmerId)) {
              farmersMap.set(farmerId, {
                _id: farmerId,
                id: farmerId,
                firstName: farmer.firstName,
                lastName: farmer.lastName,
                name: farmer.name,
                email: farmer.email,
                phoneNumber: farmer.phoneNumber
              });
            }
          }
        });
      } catch (err) {
        console.warn('Failed to load farmers from insurance requests:', err);
      }
      
      try {
        // Strategy 2: Get farmers from submitted assessments
        const assessmentsResponse: any = await assessmentsApiService.getAllAssessments();
        let assessmentsData: any[] = [];
        
        if (assessmentsResponse?.success && Array.isArray(assessmentsResponse.data)) {
          assessmentsData = assessmentsResponse.data;
        } else if (assessmentsResponse?.success && assessmentsResponse?.data?.items) {
          assessmentsData = assessmentsResponse.data.items;
        } else if (Array.isArray(assessmentsResponse)) {
          assessmentsData = assessmentsResponse;
        } else if (Array.isArray(assessmentsResponse?.data)) {
          assessmentsData = assessmentsResponse.data;
        }
        
        // Extract farmers from assessments (only submitted ones)
        assessmentsData.forEach((assessment: any) => {
          if ((assessment.status || '').toUpperCase() === 'SUBMITTED') {
            const farmer = assessment.farmerId || assessment.farmer;
            if (farmer) {
              const farmerId = farmer._id || farmer.id || farmer;
              if (farmerId && !farmersMap.has(farmerId)) {
                farmersMap.set(farmerId, {
                  _id: farmerId,
                  id: farmerId,
                  firstName: farmer.firstName,
                  lastName: farmer.lastName,
                  name: farmer.name,
                  email: farmer.email,
                  phoneNumber: farmer.phoneNumber
                });
              }
            }
          }
        });
      } catch (err) {
        console.warn('Failed to load farmers from assessments:', err);
      }
      
      const farmersList = Array.from(farmersMap.values());
      setFarmers(farmersList);
      console.log('Loaded farmers from insurance requests and assessments:', farmersList);
      
      if (farmersList.length === 0) {
        toast({
          title: 'No Farmers Found',
          description: 'Could not load farmers list. You can still enter farmer ID manually.',
          variant: 'default'
        });
      }
    } catch (err: any) {
      console.error('Failed to load farmers:', err);
      toast({
        title: 'Warning',
        description: 'Could not load farmers list. You can still enter farmer ID manually.',
        variant: 'default'
      });
    } finally {
      setFarmersLoading(false);
    }
  };

  const handleFarmerSelect = (farmerId: string) => {
    const selectedFarmer = farmers.find((f: any) => (f._id || f.id) === farmerId);
    if (selectedFarmer) {
      const farmerName = selectedFarmer.firstName && selectedFarmer.lastName
        ? `${selectedFarmer.firstName} ${selectedFarmer.lastName}`
        : selectedFarmer.name || selectedFarmer.email || selectedFarmer.phoneNumber || 'Unknown Farmer';
      
      setFormData({
        ...formData,
        farmerId: farmerId,
        farmerName: farmerName
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.farmerId || !formData.cropType || !formData.coverageAmount || !formData.premiumAmount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const policyData = {
        farmerId: formData.farmerId,
        cropType: formData.cropType,
        coverageAmount: parseFloat(formData.coverageAmount),
        premium: parseFloat(formData.premiumAmount),
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        endDate: formData.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "pending",
        notes: formData.location ? `Location: ${formData.location}` : undefined,
      };

      await createPolicyApi(policyData);
      
      toast({
        title: "Success",
        description: "Policy created successfully",
        variant: "default",
      });
      
      if (onSuccess) {
        onSuccess();
      }
      onBack();
    } catch (err: any) {
      console.error('Failed to create policy:', err);
      toast({
        title: "Error",
        description: err.message || 'Failed to create policy',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-700">Create New Policy</h1>
          <p className="text-gray-600 mt-1">Fill in the details to create a new insurance policy</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Policies
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="farmerId">Select Farmer *</Label>
                {farmersLoading ? (
                  <div className="text-sm text-gray-500">Loading farmers...</div>
                ) : farmers.length === 0 ? (
                  <div className="space-y-2">
                    <Input
                      id="farmerId"
                      value={formData.farmerId}
                      onChange={(e) => setFormData({...formData, farmerId: e.target.value})}
                      placeholder="Enter farmer ID manually"
                      required
                    />
                    <p className="text-xs text-gray-500">Could not load farmers list. Please enter farmer ID manually.</p>
                  </div>
                ) : (
                  <Select 
                    value={formData.farmerId || undefined} 
                    onValueChange={handleFarmerSelect}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a farmer" />
                    </SelectTrigger>
                    <SelectContent>
                      {farmers.map((farmer: any) => {
                        const farmerId = farmer._id || farmer.id;
                        if (!farmerId) return null; // Skip farmers without ID
                        
                        const farmerName = farmer.firstName && farmer.lastName
                          ? `${farmer.firstName} ${farmer.lastName}`
                          : farmer.name || farmer.email || farmer.phoneNumber || 'Unknown Farmer';
                        
                        return (
                          <SelectItem key={farmerId} value={farmerId}>
                            {farmerName} {farmer.email ? `(${farmer.email})` : ''}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="farmerName">Farmer Name</Label>
                <Input
                  id="farmerName"
                  value={formData.farmerName}
                  onChange={(e) => setFormData({...formData, farmerName: e.target.value})}
                  className={formData.farmerName ? "bg-gray-50" : ""}
                  placeholder={farmers.length > 0 ? "Will be auto-filled when farmer is selected" : "Enter farmer name (optional)"}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cropType">Crop Type *</Label>
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
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="farmSize">Farm Size (hectares)</Label>
                <Input
                  id="farmSize"
                  type="number"
                  value={formData.farmSize}
                  onChange={(e) => setFormData({...formData, farmSize: e.target.value})}
                  placeholder="Enter farm size"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="coverageAmount">Coverage Amount (RWF) *</Label>
                <Input
                  id="coverageAmount"
                  type="number"
                  value={formData.coverageAmount}
                  onChange={(e) => setFormData({...formData, coverageAmount: e.target.value})}
                  placeholder="Enter coverage amount"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="premiumAmount">Premium Amount (RWF) *</Label>
                <Input
                  id="premiumAmount"
                  type="number"
                  value={formData.premiumAmount}
                  onChange={(e) => setFormData({...formData, premiumAmount: e.target.value})}
                  placeholder="Enter premium amount"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Enter location"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="riskLevel">Risk Level</Label>
                <Select value={formData.riskLevel} onValueChange={(value) => setFormData({...formData, riskLevel: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deductible">Deductible (RWF)</Label>
              <Input
                id="deductible"
                type="number"
                value={formData.deductible}
                onChange={(e) => setFormData({...formData, deductible: e.target.value})}
                placeholder="Enter deductible amount"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Creating..." : "Create Policy"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

