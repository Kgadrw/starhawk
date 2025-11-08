import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPolicy as createPolicyApi } from "@/services/policiesApi";
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

  useEffect(() => {
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
                <Label htmlFor="farmerId">Farmer ID *</Label>
                <Input
                  id="farmerId"
                  value={formData.farmerId}
                  onChange={(e) => setFormData({...formData, farmerId: e.target.value})}
                  placeholder="Enter farmer ID"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="farmerName">Farmer Name</Label>
                <Input
                  id="farmerName"
                  value={formData.farmerName}
                  onChange={(e) => setFormData({...formData, farmerName: e.target.value})}
                  placeholder="Enter farmer name (optional)"
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

