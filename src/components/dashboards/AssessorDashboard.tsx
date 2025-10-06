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
import RiskAssessmentSystem from "../assessor/RiskAssessmentSystem";
import ClaimAssessmentSystem from "../assessor/ClaimAssessmentSystem";
import CropMonitoringSystem from "../monitoring/CropMonitoringSystem";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line
} from "recharts";
import { 
  MapPin, 
  FileText, 
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Bell,
  Settings,
  Upload,
  Map,
  Camera,
  User,
  BarChart3,
  Shield,
  Activity
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
    },
    {
      id: "ASS-004",
      type: "loss_assessment",
      farmerId: "FMR-0250",
      farmerName: "Grace Mukamana",
      location: "Huye District",
      farmSize: 2.1,
      cropType: "Beans",
      status: "completed",
      completedDate: "2024-09-25",
      riskLevel: "medium"
    }
  ];

  // Chart data
  const assessmentTypeData = [
    { name: "Risk Assessment", value: 35, color: "#3B82F6" },
    { name: "Loss Assessment", value: 28, color: "#EF4444" },
    { name: "Monitoring", value: 22, color: "#10B981" },
    { name: "Follow-up", value: 15, color: "#F59E0B" }
  ];

  const monthlyAssessmentsData = [
    { month: "Jan", completed: 8, pending: 3 },
    { month: "Feb", completed: 12, pending: 2 },
    { month: "Mar", completed: 15, pending: 4 },
    { month: "Apr", completed: 18, pending: 3 },
    { month: "May", completed: 22, pending: 5 },
    { month: "Jun", completed: 25, pending: 4 },
    { month: "Jul", completed: 28, pending: 6 },
    { month: "Aug", completed: 32, pending: 3 },
    { month: "Sep", completed: 30, pending: 4 },
    { month: "Oct", completed: 15, pending: 2 },
    { month: "Nov", completed: 12, pending: 3 },
    { month: "Dec", completed: 8, pending: 2 }
  ];

  const performanceData = [
    { month: "Jan", accuracy: 85, speed: 78 },
    { month: "Feb", accuracy: 88, speed: 82 },
    { month: "Mar", accuracy: 92, speed: 85 },
    { month: "Apr", accuracy: 90, speed: 88 },
    { month: "May", accuracy: 94, speed: 90 },
    { month: "Jun", accuracy: 96, speed: 92 },
    { month: "Jul", accuracy: 93, speed: 89 },
    { month: "Aug", accuracy: 95, speed: 91 },
    { month: "Sep", accuracy: 97, speed: 94 },
    { month: "Oct", accuracy: 95, speed: 92 },
    { month: "Nov", accuracy: 93, speed: 90 },
    { month: "Dec", accuracy: 91, speed: 88 }
  ];

  const cropTypeDistributionData = [
    { name: "Maize", assessments: 45, color: "#10B981" },
    { name: "Rice", assessments: 32, color: "#3B82F6" },
    { name: "Potatoes", assessments: 28, color: "#F59E0B" },
    { name: "Beans", assessments: 20, color: "#8B5CF6" },
    { name: "Other", assessments: 15, color: "#EF4444" }
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
      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-700/30 rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2 text-orange-800 dark:text-orange-200">
          Welcome back, {assessorName}
        </h1>
        <p className="text-orange-600 dark:text-orange-400">
          Assessor ID: {assessorId} • Last login: Today at 2:30 PM
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="hover:border-amber-400/80 dark:hover:border-amber-500/80 transition-all duration-300 bg-amber-50/90 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-700/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-200">{assessments.filter(a => a.status === 'pending').length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-yellow-400/80 dark:hover:border-yellow-500/80 transition-all duration-300 bg-yellow-50/90 dark:bg-yellow-900/20 border border-yellow-200/60 dark:border-yellow-700/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-200">{assessments.filter(a => a.status === 'in_progress').length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-orange-400/80 dark:hover:border-orange-500/80 transition-all duration-300 bg-orange-50/90 dark:bg-orange-900/20 border border-orange-200/60 dark:border-orange-700/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-200">{completedAssessments.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-teal-400/80 dark:hover:border-teal-500/80 transition-all duration-300 bg-teal-50/90 dark:bg-teal-900/20 border border-teal-200/60 dark:border-teal-700/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-200">92%</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/40 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Assessment Type Distribution Pie Chart */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 rounded-2xl shadow-lg shadow-orange-100/20 dark:shadow-gray-900/20">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800 dark:text-gray-200">
              <FileText className="h-5 w-5 mr-2" />
              Assessment Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assessmentTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {assessmentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Percentage']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {assessmentTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Assessments Bar Chart */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 rounded-2xl shadow-lg shadow-blue-100/20 dark:shadow-gray-900/20">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800 dark:text-gray-200">
              <TrendingUp className="h-5 w-5 mr-2" />
              Monthly Assessment Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyAssessmentsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  <Bar 
                    dataKey="completed" 
                    fill="#10B981" 
                    radius={[4, 4, 0, 0]}
                    name="Completed"
                  />
                  <Bar 
                    dataKey="pending" 
                    fill="#F59E0B" 
                    radius={[4, 4, 0, 0]}
                    name="Pending"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance Trend Line Chart */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 rounded-2xl shadow-lg shadow-green-100/20 dark:shadow-gray-900/20">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800 dark:text-gray-200">
              <TrendingUp className="h-5 w-5 mr-2" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                    domain={[70, 100]}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Score']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    name="Accuracy"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="speed" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    name="Speed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Crop Type Distribution */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 rounded-2xl shadow-lg shadow-purple-100/20 dark:shadow-gray-900/20">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800 dark:text-gray-200">
              <MapPin className="h-5 w-5 mr-2" />
              Assessments by Crop Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cropTypeDistributionData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    type="number"
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name" 
                    stroke="#6B7280"
                    fontSize={12}
                    width={80}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  <Bar 
                    dataKey="assessments" 
                    fill="#8B5CF6" 
                    radius={[0, 4, 4, 0]}
                    name="Assessments"
                  />
                </BarChart>
              </ResponsiveContainer>
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
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Farmer Name</Label>
                <p className="text-lg">Jean Baptiste</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Farmer ID</Label>
                <p className="text-lg">FMR-0247</p>
                </div>
              <div>
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Location</Label>
                <p className="text-lg">Nyagatare District, Eastern Province</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Farm Size</Label>
                <p className="text-lg">2.5 hectares</p>
                </div>
              <div>
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Crop Type</Label>
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
      case "risk-assessments": return <RiskAssessmentSystem />;
      case "claim-assessments": return <ClaimAssessmentSystem />;
      case "crop-monitoring": return <CropMonitoringSystem />;
      case "notifications": return <AssessorNotifications />;
      case "profile-settings": return <AssessorProfileSettings />;
      default: return renderDashboard();
    }
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "risk-assessments", label: "Risk Assessments", icon: Shield },
    { id: "claim-assessments", label: "Claim Assessments", icon: FileText },
    { id: "crop-monitoring", label: "Crop Monitoring", icon: Activity },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile-settings", label: "Profile Settings", icon: User }
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
