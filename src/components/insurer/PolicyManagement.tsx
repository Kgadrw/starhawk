import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardTheme } from "@/utils/dashboardTheme";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PolicyDetailsView from "./PolicyDetailsView";
import { 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Shield,
  User,
  MapPin,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  X
} from "lucide-react";

interface Policy {
  id: string;
  farmerId: string;
  farmerName: string;
  cropType: string;
  coverageAmount: number;
  premiumAmount: number;
  startDate: string;
  endDate: string;
  status: "active" | "pending" | "expired" | "cancelled";
  location: string;
  farmSize: number;
  riskLevel: "low" | "medium" | "high";
  deductible: number;
  createdAt: string;
}

export default function PolicyManagement() {
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: "POL-001",
      farmerId: "FMR-0247",
      farmerName: "Jean Baptiste",
      cropType: "Maize",
      coverageAmount: 250000,
      premiumAmount: 15000,
      startDate: "2024-01-15",
      endDate: "2024-12-31",
      status: "active",
      location: "Nyagatare District",
      farmSize: 2.5,
      riskLevel: "low",
      deductible: 25000,
      createdAt: "2024-01-10"
    },
    {
      id: "POL-002",
      farmerId: "FMR-0248",
      farmerName: "Marie Uwimana",
      cropType: "Rice",
      coverageAmount: 200000,
      premiumAmount: 12000,
      startDate: "2024-02-01",
      endDate: "2024-12-31",
      status: "active",
      location: "Gatsibo District",
      farmSize: 1.8,
      riskLevel: "medium",
      deductible: 20000,
      createdAt: "2024-01-25"
    },
    {
      id: "POL-003",
      farmerId: "FMR-0249",
      farmerName: "Paul Kagame",
      cropType: "Potatoes",
      coverageAmount: 180000,
      premiumAmount: 10000,
      startDate: "2024-03-01",
      endDate: "2024-12-31",
      status: "pending",
      location: "Musanze District",
      farmSize: 3.2,
      riskLevel: "high",
      deductible: 18000,
      createdAt: "2024-02-15"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cropFilter, setCropFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [viewingPolicy, setViewingPolicy] = useState<Policy | null>(null);

  // Form state for create/edit
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "expired": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-700 text-white";
      default: return "bg-gray-700 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "expired": return <AlertTriangle className="h-4 w-4" />;
      case "cancelled": return <X className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-700 text-white";
    }
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.farmerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || policy.status === statusFilter;
    const matchesCrop = cropFilter === "all" || policy.cropType === cropFilter;
    
    return matchesSearch && matchesStatus && matchesCrop;
  });

  const handleCreatePolicy = () => {
    const newPolicy: Policy = {
      id: `POL-${String(policies.length + 1).padStart(3, '0')}`,
      farmerId: formData.farmerId,
      farmerName: formData.farmerName,
      cropType: formData.cropType,
      coverageAmount: parseFloat(formData.coverageAmount),
      premiumAmount: parseFloat(formData.premiumAmount),
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: "pending",
      location: formData.location,
      farmSize: parseFloat(formData.farmSize),
      riskLevel: formData.riskLevel as "low" | "medium" | "high",
      deductible: parseFloat(formData.deductible),
      createdAt: new Date().toISOString().split('T')[0]
    };

    setPolicies([...policies, newPolicy]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEditPolicy = () => {
    if (!selectedPolicy) return;

    const updatedPolicies = policies.map(policy => 
      policy.id === selectedPolicy.id 
        ? {
            ...policy,
            farmerId: formData.farmerId,
            farmerName: formData.farmerName,
            cropType: formData.cropType,
            coverageAmount: parseFloat(formData.coverageAmount),
            premiumAmount: parseFloat(formData.premiumAmount),
            startDate: formData.startDate,
            endDate: formData.endDate,
            location: formData.location,
            farmSize: parseFloat(formData.farmSize),
            riskLevel: formData.riskLevel as "low" | "medium" | "high",
            deductible: parseFloat(formData.deductible)
          }
        : policy
    );

    setPolicies(updatedPolicies);
    setIsEditDialogOpen(false);
    setSelectedPolicy(null);
    resetForm();
  };

  const handleDeletePolicy = (policyId: string) => {
    setPolicies(policies.filter(policy => policy.id !== policyId));
  };

  const handleUpdateStatus = (policyId: string, newStatus: Policy["status"]) => {
    setPolicies(policies.map(policy => 
      policy.id === policyId ? { ...policy, status: newStatus } : policy
    ));
  };

  const openEditDialog = (policy: Policy) => {
    setSelectedPolicy(policy);
    setFormData({
      farmerId: policy.farmerId,
      farmerName: policy.farmerName,
      cropType: policy.cropType,
      coverageAmount: policy.coverageAmount.toString(),
      premiumAmount: policy.premiumAmount.toString(),
      startDate: policy.startDate,
      endDate: policy.endDate,
      location: policy.location,
      farmSize: policy.farmSize.toString(),
      riskLevel: policy.riskLevel,
      deductible: policy.deductible.toString()
    });
    setIsEditDialogOpen(true);
  };

  const handleViewPolicy = (policy: Policy) => {
    setViewingPolicy(policy);
  };

  const handleBackToList = () => {
    setViewingPolicy(null);
  };

  const handleEditFromDetails = (updatedPolicy: Policy) => {
    setPolicies(policies.map(policy => 
      policy.id === updatedPolicy.id ? updatedPolicy : policy
    ));
  };

  const resetForm = () => {
    setFormData({
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
  };

  const renderPolicyForm = () => (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="farmerId">Farmer ID</Label>
          <Input
            id="farmerId"
            value={formData.farmerId}
            onChange={(e) => setFormData({...formData, farmerId: e.target.value})}
            placeholder="FMR-XXXX"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="farmerName">Farmer Name</Label>
          <Input
            id="farmerName"
            value={formData.farmerName}
            onChange={(e) => setFormData({...formData, farmerName: e.target.value})}
            placeholder="Enter farmer name"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cropType">Crop Type</Label>
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
          <Label htmlFor="coverageAmount">Coverage Amount (RWF)</Label>
          <Input
            id="coverageAmount"
            type="number"
            value={formData.coverageAmount}
            onChange={(e) => setFormData({...formData, coverageAmount: e.target.value})}
            placeholder="Enter coverage amount"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="premiumAmount">Premium Amount (RWF)</Label>
          <Input
            id="premiumAmount"
            type="number"
            value={formData.premiumAmount}
            onChange={(e) => setFormData({...formData, premiumAmount: e.target.value})}
            placeholder="Enter premium amount"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
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
    </div>
  );

  // If viewing a specific policy, show the details view
  if (viewingPolicy) {
    return (
      <PolicyDetailsView
        policy={viewingPolicy}
        onBack={handleBackToList}
        onEdit={handleEditFromDetails}
        onDelete={handleDeletePolicy}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Policy Management</h1>
          <p className="text-white/60 mt-1">Manage insurance policies for farmers</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
          >
            {viewMode === "table" ? "Grid View" : "Table View"}
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Policy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Policy</DialogTitle>
              </DialogHeader>
              {renderPolicyForm()}
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePolicy}>
                  Create Policy
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search policies by farmer name, ID, or policy ID..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={cropFilter} onValueChange={setCropFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Crop Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crops</SelectItem>
                  <SelectItem value="maize">Maize</SelectItem>
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="potatoes">Potatoes</SelectItem>
                  <SelectItem value="beans">Beans</SelectItem>
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
                <p className="text-sm font-medium text-white/70">Total Policies</p>
                <p className="text-2xl font-bold text-white">{policies.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Active Policies</p>
                <p className="text-2xl font-bold text-white">{policies.filter(p => p.status === 'active').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Pending Policies</p>
                <p className="text-2xl font-bold text-white">{policies.filter(p => p.status === 'pending').length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Total Coverage</p>
                <p className="text-2xl font-bold text-white">
                  {(policies.reduce((sum, p) => sum + p.coverageAmount, 0) / 1000000).toFixed(1)}M RWF
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Policies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Policies ({filteredPolicies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Policy ID</th>
                  <th className="text-left p-3 font-medium">Farmer</th>
                  <th className="text-left p-3 font-medium">Crop</th>
                  <th className="text-left p-3 font-medium">Coverage</th>
                  <th className="text-left p-3 font-medium">Premium</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Risk</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPolicies.map((policy) => (
                  <tr key={policy.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{policy.id}</td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{policy.farmerName}</div>
                        <div className="text-sm text-gray-500">{policy.farmerId}</div>
                      </div>
                    </td>
                    <td className="p-3">{policy.cropType}</td>
                    <td className="p-3">{policy.coverageAmount.toLocaleString()} RWF</td>
                    <td className="p-3">{policy.premiumAmount.toLocaleString()} RWF</td>
                    <td className="p-3">
                      <Badge className={getStatusColor(policy.status)}>
                        {getStatusIcon(policy.status)}
                        <span className="ml-1 capitalize">{policy.status}</span>
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={getRiskLevelColor(policy.riskLevel)}>
                        {policy.riskLevel} risk
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPolicy(policy)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(policy)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePolicy(policy.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Select
                          value={policy.status}
                          onValueChange={(value) => handleUpdateStatus(policy.id, value as Policy["status"])}
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Policy - {selectedPolicy?.id}</DialogTitle>
          </DialogHeader>
          {renderPolicyForm()}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditPolicy}>
              Update Policy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
