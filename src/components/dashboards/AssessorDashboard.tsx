import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "../layout/DashboardLayout";
import AssessorNotifications from "../assessor/AssessorNotifications";
import AssessorProfileSettings from "../assessor/AssessorProfileSettings";
import { 
  MapPin, 
  FileText, 
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  LogOut,
  Bell,
  Settings,
  Upload,
  Map,
  Camera,
  User
} from "lucide-react";

export default function AssessorDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [assessorId] = useState("ASS-001"); // This would come from auth context
  const [assessorName] = useState("Richard Nkurunziza"); // This would come from auth context

  // Mock data
  const assessments = [
    {
      id: "ASS-001",
      type: "risk_assessment",
      farmerId: "FMR-0247",
      farmerName: "Jean Baptiste",
      location: "Nyagatare District",
      farmSize: 2.5,
      cropType: "Maize",
      status: "pending",
      assignedDate: "2024-10-01",
      dueDate: "2024-10-05"
    },
    {
      id: "ASS-002", 
      type: "loss_assessment",
      farmerId: "FMR-0248",
      farmerName: "Marie Uwimana",
      location: "Gatsibo District",
      farmSize: 1.8,
      cropType: "Rice",
      status: "in_progress",
      assignedDate: "2024-10-02",
      dueDate: "2024-10-06"
    }
  ];

  const completedAssessments = [
    {
      id: "ASS-003",
      type: "risk_assessment",
      farmerId: "FMR-0249",
      farmerName: "Paul Kagame",
      location: "Musanze District",
      farmSize: 3.2,
      cropType: "Potatoes",
      status: "completed",
      completedDate: "2024-09-28",
      riskLevel: "low"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "in_progress": return <Clock className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "overdue": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "risk_assessment": return "bg-blue-100 text-blue-800";
      case "loss_assessment": return "bg-red-100 text-red-800";
      case "monitoring": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">
          Welcome back, {assessorName}
        </h1>
        <p className="text-gray-600">
          Assessor ID: {assessorId} • Last login: Today at 2:30 PM
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{assessments.filter(a => a.status === 'pending').length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{assessments.filter(a => a.status === 'in_progress').length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedAssessments.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">92%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Pending Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assessments.filter(a => a.status === 'pending').map((assessment) => (
                <div key={assessment.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{assessment.id}</span>
                    <Badge className={getTypeColor(assessment.type)}>
                      {assessment.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {assessment.farmerName} • {assessment.cropType}
                  </p>
                  <p className="text-xs text-gray-500">
                    Due: {assessment.dueDate}
                  </p>
                  <Button size="sm" className="mt-2" onClick={() => setActivePage("assessment-detail")}>
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Recent Completions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedAssessments.map((assessment) => (
                <div key={assessment.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{assessment.id}</span>
                    <Badge className={getTypeColor(assessment.type)}>
                      {assessment.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {assessment.farmerName} • {assessment.cropType}
                  </p>
                  <p className="text-xs text-gray-500">
                    Completed: {assessment.completedDate}
                  </p>
                  <div className="mt-2">
                    <Badge className="bg-green-100 text-green-800">
                      Risk Level: {assessment.riskLevel}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAssessmentTasks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Assessment Tasks</h2>
        <Button variant="outline" onClick={() => setActivePage("dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Assessment ID</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Farmer</th>
                  <th className="text-left p-3">Crop</th>
                  <th className="text-left p-3">Location</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Due Date</th>
                  <th className="text-left p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((assessment) => (
                  <tr key={assessment.id} className="border-b">
                    <td className="p-3 font-medium">{assessment.id}</td>
                    <td className="p-3">
                      <Badge className={getTypeColor(assessment.type)}>
                        {assessment.type.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{assessment.farmerName}</p>
                        <p className="text-sm text-gray-500">{assessment.farmerId}</p>
                      </div>
                    </td>
                    <td className="p-3">{assessment.cropType}</td>
                    <td className="p-3">{assessment.location}</td>
                    <td className="p-3">
                      <Badge className={getStatusColor(assessment.status)}>
                        {getStatusIcon(assessment.status)}
                        <span className="ml-1 capitalize">{assessment.status.replace('_', ' ')}</span>
                      </Badge>
                    </td>
                    <td className="p-3">{assessment.dueDate}</td>
                    <td className="p-3">
                      <Button size="sm" variant="outline">
                        View Details
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

  const renderAssessmentDetail = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Assessment Details</h2>
        <Button variant="outline" onClick={() => setActivePage("assessment-tasks")}>
          Back to Tasks
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Farmer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Farmer Name</Label>
                <p className="text-lg">Jean Baptiste</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Farmer ID</Label>
                <p className="text-lg">FMR-0247</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Location</Label>
                <p className="text-lg">Nyagatare District, Eastern Province</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Farm Size</Label>
                <p className="text-lg">2.5 hectares</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Crop Type</Label>
                <p className="text-lg">Maize</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assessment Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="riskLevel">Risk Level Assessment</Label>
              <Select>
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

            <div className="space-y-2">
              <Label htmlFor="soilQuality">Soil Quality</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select soil quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="waterAccess">Water Access</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select water access" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="limited">Limited</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Field Observations</Label>
              <Textarea 
                id="observations" 
                placeholder="Describe your field observations..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Upload Photos</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to upload field photos</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpsCoordinates">GPS Coordinates</Label>
              <Input 
                id="gpsCoordinates" 
                placeholder="Latitude, Longitude (e.g., -1.9441, 30.0619)"
              />
            </div>

            <Button className="w-full bg-orange-600 hover:bg-orange-700">
              Submit Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return renderDashboard();
      case "assessment-tasks": return renderAssessmentTasks();
      case "assessment-detail": return renderAssessmentDetail();
      case "notifications": return <AssessorNotifications />;
      case "profile-settings": return <AssessorProfileSettings />;
      default: return renderDashboard();
    }
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: User },
    { id: "assessment-tasks", label: "Assessment Tasks", icon: FileText },
    { id: "assessment-detail", label: "Assessment Detail", icon: Map },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile-settings", label: "Profile Settings", icon: Settings }
  ];

  return (
    <DashboardLayout
      userType="assessor"
      userId={assessorId}
      userName="Richard Nkurunziza"
      navigationItems={navigationItems}
      activePage={activePage}
      onPageChange={setActivePage}
      onLogout={() => {}}
    >
      {renderPage()}
    </DashboardLayout>
  );
}
