import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "../layout/DashboardLayout";
import InsurerNotifications from "../insurer/InsurerNotifications";
import InsurerProfileSettings from "../insurer/InsurerProfileSettings";
import ClaimReviewPage from "../insurer/ClaimReviewPage";
import ClaimsTable from "../insurer/ClaimsTable";
import { 
  Building2, 
  FileText, 
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  LogOut,
  Bell,
  Settings,
  DollarSign,
  Users,
  BarChart3,
  Eye,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";

export default function InsurerDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [insurerId] = useState("INS-001"); // This would come from auth context
  const [insurerName] = useState("Rwanda Insurance Company"); // This would come from auth context

  // Mock data
  const riskAssessments = [
    {
      id: "RISK-001",
      farmerId: "FMR-0247",
      farmerName: "Jean Baptiste",
      cropType: "Maize",
      farmSize: 2.5,
      location: "Nyagatare District",
      assessorId: "ASS-001",
      assessorName: "Richard Nkurunziza",
      riskLevel: "low",
      status: "pending_review",
      submittedDate: "2024-10-03"
    },
    {
      id: "RISK-002",
      farmerId: "FMR-0248", 
      farmerName: "Marie Uwimana",
      cropType: "Rice",
      farmSize: 1.8,
      location: "Gatsibo District",
      assessorId: "ASS-002",
      assessorName: "Grace Mukamana",
      riskLevel: "medium",
      status: "pending_review",
      submittedDate: "2024-10-04"
    }
  ];

  const claims = [
    {
      id: "CLM-001",
      farmerId: "FMR-0249",
      farmerName: "Paul Kagame",
      policyId: "POL-001",
      cropType: "Potatoes",
      claimAmount: 150000,
      status: "pending_review",
      filedDate: "2024-10-02",
      assessorId: "ASS-003",
      assessorName: "John Doe"
    }
  ];

  const policies = [
    {
      id: "POL-001",
      farmerId: "FMR-0247",
      farmerName: "Jean Baptiste",
      cropType: "Maize",
      coverage: 250000,
      premium: 15000,
      status: "active",
      startDate: "2024-01-15",
      endDate: "2024-12-31"
    },
    {
      id: "POL-002",
      farmerId: "FMR-0248",
      farmerName: "Marie Uwimana", 
      cropType: "Rice",
      coverage: 200000,
      premium: 12000,
      status: "active",
      startDate: "2024-02-01",
      endDate: "2024-12-31"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending_review": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "expired": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4" />;
      case "pending_review": return <Clock className="h-4 w-4" />;
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "rejected": return <AlertTriangle className="h-4 w-4" />;
      case "expired": return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">
          Welcome back, {insurerName}
        </h1>
        <p className="text-gray-600">
          Insurer ID: {insurerId} • Last login: Today at 2:30 PM
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Risk Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{riskAssessments.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Policies</p>
                <p className="text-2xl font-bold text-gray-900">{policies.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Claim Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{claims.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Premium</p>
                <p className="text-2xl font-bold text-gray-900">2.4B RWF</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Pending Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {riskAssessments.filter(r => r.status === 'pending_review').map((assessment) => (
                <div key={assessment.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{assessment.id}</span>
                    <Badge className={getRiskLevelColor(assessment.riskLevel)}>
                      {assessment.riskLevel} risk
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {assessment.farmerName} • {assessment.cropType}
                  </p>
                  <p className="text-xs text-gray-500">
                    Assessor: {assessment.assessorName}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Claim Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {claims.filter(c => c.status === 'pending_review').map((claim) => (
                <div key={claim.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{claim.id}</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {claim.claimAmount.toLocaleString()} RWF
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {claim.farmerName} • {claim.cropType}
                  </p>
                  <p className="text-xs text-gray-500">
                    Policy: {claim.policyId}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderRiskReviews = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Risk Assessment Reviews</h2>
        <Button variant="outline" onClick={() => setActivePage("dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Risk Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Assessment ID</th>
                  <th className="text-left p-3">Farmer</th>
                  <th className="text-left p-3">Crop</th>
                  <th className="text-left p-3">Location</th>
                  <th className="text-left p-3">Risk Level</th>
                  <th className="text-left p-3">Assessor</th>
                  <th className="text-left p-3">Submitted</th>
                  <th className="text-left p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {riskAssessments.map((assessment) => (
                  <tr key={assessment.id} className="border-b">
                    <td className="p-3 font-medium">{assessment.id}</td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{assessment.farmerName}</p>
                        <p className="text-sm text-gray-500">{assessment.farmerId}</p>
                      </div>
                    </td>
                    <td className="p-3">{assessment.cropType}</td>
                    <td className="p-3">{assessment.location}</td>
                    <td className="p-3">
                      <Badge className={getRiskLevelColor(assessment.riskLevel)}>
                        {assessment.riskLevel}
                      </Badge>
                    </td>
                    <td className="p-3">{assessment.assessorName}</td>
                    <td className="p-3">{assessment.submittedDate}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          Review
                        </Button>
                      </div>
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


  const renderPolicyManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Policy Management</h2>
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
                  <th className="text-left p-3">Farmer</th>
                  <th className="text-left p-3">Crop</th>
                  <th className="text-left p-3">Coverage</th>
                  <th className="text-left p-3">Premium</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Start Date</th>
                  <th className="text-left p-3">End Date</th>
                  <th className="text-left p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy) => (
                  <tr key={policy.id} className="border-b">
                    <td className="p-3 font-medium">{policy.id}</td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{policy.farmerName}</p>
                        <p className="text-sm text-gray-500">{policy.farmerId}</p>
                      </div>
                    </td>
                    <td className="p-3">{policy.cropType}</td>
                    <td className="p-3">{policy.coverage.toLocaleString()} RWF</td>
                    <td className="p-3">{policy.premium.toLocaleString()} RWF</td>
                    <td className="p-3">
                      <Badge className={getStatusColor(policy.status)}>
                        {getStatusIcon(policy.status)}
                        <span className="ml-1 capitalize">{policy.status}</span>
                      </Badge>
                    </td>
                    <td className="p-3">{policy.startDate}</td>
                    <td className="p-3">{policy.endDate}</td>
                    <td className="p-3">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
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

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return renderDashboard();
      case "risk-reviews": return renderRiskReviews();
      case "claim-reviews": return <ClaimsTable />;
      case "claim-review-detail": return <ClaimReviewPage />;
      case "policy-management": return renderPolicyManagement();
      case "notifications": return <InsurerNotifications />;
      case "profile-settings": return <InsurerProfileSettings />;
      default: return renderDashboard();
    }
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "risk-reviews", label: "Risk Reviews", icon: FileText },
    { id: "claim-reviews", label: "Claim Reviews", icon: AlertTriangle },
    { id: "policy-management", label: "Policy Management", icon: CheckCircle },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile-settings", label: "Profile Settings", icon: Settings }
  ];

  return (
    <DashboardLayout
      userType="insurer"
      userId={insurerId}
      userName="Insurance Company"
      navigationItems={navigationItems}
      activePage={activePage}
      onPageChange={setActivePage}
      onLogout={() => {}}
    >
      {renderPage()}
    </DashboardLayout>
  );
}
