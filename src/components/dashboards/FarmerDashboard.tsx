import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DashboardLayout from "../layout/DashboardLayout";
import { 
  User, 
  FileText, 
  Plus, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  LogOut,
  Bell,
  Settings,
  Upload,
  Camera
} from "lucide-react";

export default function FarmerDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [farmerId] = useState("FMR-0247"); // This would come from auth context
  const [farmerName] = useState("Jean Baptiste"); // This would come from auth context

  // Mock data
  const policies = [
    {
      id: "POL-001",
      crop: "Maize",
      coverage: 250000,
      premium: 15000,
      status: "active",
      startDate: "2024-01-15",
      endDate: "2024-12-31"
    }
  ];

  const claims = [
    {
      id: "CLM-002",
      crop: "Maize",
      date: "2024-10-02",
      status: "in_review",
      assessor: "Richard",
      description: "Drought damage affecting 60% of crop"
    }
  ];

  const notifications = [
    {
      id: 1,
      message: "Your policy POL-001 was approved.",
      type: "success",
      date: "2024-01-20"
    },
    {
      id: 2,
      message: "An assessor has been assigned to your claim CLM-002.",
      type: "info",
      date: "2024-10-03"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "in_review": return "bg-blue-100 text-blue-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "in_review": return <Clock className="h-4 w-4" />;
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "rejected": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm border border-green-200/50 rounded-2xl p-6 shadow-lg shadow-green-100/30">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Welcome back, {farmerName}
        </h1>
        <p className="text-gray-500">
          Farmer ID: {farmerId} • Last login: Today at 2:30 PM
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-green-100/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">My Policies</p>
                <p className="text-2xl font-bold text-gray-800">{policies.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md shadow-green-200/30">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-yellow-100/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-800">0</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md shadow-yellow-200/30">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-100/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Claims Filed</p>
                <p className="text-2xl font-bold text-gray-800">{claims.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md shadow-blue-200/30">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-orange-100/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Claims in Review</p>
                <p className="text-2xl font-bold text-gray-800">{claims.filter(c => c.status === 'in_review').length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md shadow-orange-200/30">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-green-100/20">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <Plus className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => setActivePage("request-insurance")}
              className="w-full justify-start bg-gradient-to-r from-green-500/80 to-emerald-600/80 hover:from-green-600/90 hover:to-emerald-700/90 text-white backdrop-blur-sm shadow-md shadow-green-200/30"
            >
              <Plus className="h-4 w-4 mr-2" />
              Request New Insurance
            </Button>
            <Button 
              onClick={() => setActivePage("file-claim")}
              className="w-full justify-start bg-gradient-to-r from-blue-500/80 to-indigo-600/80 hover:from-blue-600/90 hover:to-indigo-700/90 text-white backdrop-blur-sm shadow-md shadow-blue-200/30"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              File a Claim
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-100/20">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <Bell className="h-5 w-5 mr-2" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderRequestInsurance = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Request Insurance</h2>
        <Button variant="outline" onClick={() => setActivePage("dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Insurance Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="farmerId">Farmer ID</Label>
              <Input id="farmerId" value={farmerId} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cropType">Crop Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select crop type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maize">Maize</SelectItem>
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="beans">Beans</SelectItem>
                  <SelectItem value="potatoes">Potatoes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="farmSize">Farm Size (hectares)</Label>
              <Input id="farmSize" type="number" placeholder="Enter farm size" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Auto-filled from profile" disabled />
            </div>
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700">
            Submit Request
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderMyPolicies = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Policies</h2>
        <Button variant="outline" onClick={() => setActivePage("dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Policy ID</th>
                  <th className="text-left p-3">Crop</th>
                  <th className="text-left p-3">Coverage</th>
                  <th className="text-left p-3">Premium</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy) => (
                  <tr key={policy.id} className="border-b">
                    <td className="p-3 font-medium">{policy.id}</td>
                    <td className="p-3">{policy.crop}</td>
                    <td className="p-3">{policy.coverage.toLocaleString()} RWF</td>
                    <td className="p-3">{policy.premium.toLocaleString()} RWF</td>
                    <td className="p-3">
                      <Badge className={getStatusColor(policy.status)}>
                        {getStatusIcon(policy.status)}
                        <span className="ml-1 capitalize">{policy.status}</span>
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Button variant="outline" size="sm">View</Button>
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

  const renderFileClaim = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">File a Claim</h2>
        <Button variant="outline" onClick={() => setActivePage("dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Claim Submission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="policySelect">Select Active Policy</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose policy to claim against" />
              </SelectTrigger>
              <SelectContent>
                {policies.map((policy) => (
                  <SelectItem key={policy.id} value={policy.id}>
                    {policy.id} - {policy.crop} ({policy.coverage.toLocaleString()} RWF)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lossDescription">Describe Loss Event</Label>
            <Textarea 
              id="lossDescription" 
              placeholder="Describe what happened to your crops..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Upload Photos</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
            </div>
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700">
            Submit Claim
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderClaimStatus = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Claim Status</h2>
        <Button variant="outline" onClick={() => setActivePage("dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Claim Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Claim ID</th>
                  <th className="text-left p-3">Crop</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Assessor</th>
                  <th className="text-left p-3">Decision</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim.id} className="border-b">
                    <td className="p-3 font-medium">{claim.id}</td>
                    <td className="p-3">{claim.crop}</td>
                    <td className="p-3">{claim.date}</td>
                    <td className="p-3">
                      <Badge className={getStatusColor(claim.status)}>
                        {getStatusIcon(claim.status)}
                        <span className="ml-1 capitalize">{claim.status.replace('_', ' ')}</span>
                      </Badge>
                    </td>
                    <td className="p-3">{claim.assessor}</td>
                    <td className="p-3">—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <Button variant="outline" onClick={() => setActivePage("dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-gray-900">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-1">{notification.date}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Profile Settings</h2>
        <Button variant="outline" onClick={() => setActivePage("dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={farmerName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="farmerId">Farmer ID</Label>
              <Input id="farmerId" value={farmerId} disabled />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="+250 7XX XXX XXX" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your.email@example.com" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="Province, District, Sector, Cell, Village" />
          </div>

          <Button className="bg-green-600 hover:bg-green-700">
            Update Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return renderDashboard();
      case "my-policies": return renderMyPolicies();
      case "request-insurance": return renderRequestInsurance();
      case "file-claim": return renderFileClaim();
      case "claim-status": return renderClaimStatus();
      case "notifications": return renderNotifications();
      case "profile-settings": return renderProfileSettings();
      default: return renderDashboard();
    }
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: User },
    { id: "my-policies", label: "My Policies", icon: FileText },
    { id: "request-insurance", label: "Request Insurance", icon: Plus },
    { id: "file-claim", label: "File Claim", icon: AlertTriangle },
    { id: "claim-status", label: "Claim Status", icon: Clock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile-settings", label: "Profile Settings", icon: Settings }
  ];

  return (
    <DashboardLayout
      userType="farmer"
      userId={farmerId}
      userName="Jean Baptiste"
      navigationItems={navigationItems}
      activePage={activePage}
      onPageChange={setActivePage}
      onLogout={() => {}}
    >
      {renderPage()}
    </DashboardLayout>
  );
}
