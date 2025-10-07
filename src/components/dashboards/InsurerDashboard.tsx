import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardTheme } from "@/utils/dashboardTheme";
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
import PolicyManagement from "../insurer/PolicyManagement";
import RiskReviewManagement from "../insurer/RiskReviewManagement";
import RiskAssessmentSystem from "../assessor/RiskAssessmentSystem";
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
  Building2, 
  FileText, 
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Bell,
  Settings,
  DollarSign,
  Users,
  BarChart3,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Shield,
  Activity
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
    },
    {
      id: "POL-003",
      farmerId: "FMR-0249",
      farmerName: "Paul Kagame",
      cropType: "Potatoes",
      coverage: 180000,
      premium: 10000,
      status: "active",
      startDate: "2024-03-01",
      endDate: "2024-12-31"
    }
  ];

  // Chart data
  const riskDistributionData = [
    { name: "Low Risk", value: 45, color: "#10B981" },
    { name: "Medium Risk", value: 35, color: "#F59E0B" },
    { name: "High Risk", value: 20, color: "#EF4444" }
  ];

  const claimsOverTimeData = [
    { month: "Jan", claims: 12, amount: 450000 },
    { month: "Feb", claims: 8, amount: 320000 },
    { month: "Mar", claims: 15, amount: 580000 },
    { month: "Apr", claims: 10, amount: 380000 },
    { month: "May", claims: 18, amount: 720000 },
    { month: "Jun", claims: 22, amount: 890000 },
    { month: "Jul", claims: 25, amount: 950000 },
    { month: "Aug", claims: 20, amount: 780000 },
    { month: "Sep", claims: 28, amount: 1100000 },
    { month: "Oct", claims: 15, amount: 620000 },
    { month: "Nov", claims: 12, amount: 480000 },
    { month: "Dec", claims: 8, amount: 320000 }
  ];

  const revenueData = [
    { month: "Jan", revenue: 180000, expenses: 120000 },
    { month: "Feb", revenue: 220000, expenses: 140000 },
    { month: "Mar", revenue: 250000, expenses: 160000 },
    { month: "Apr", revenue: 280000, expenses: 180000 },
    { month: "May", revenue: 320000, expenses: 200000 },
    { month: "Jun", revenue: 350000, expenses: 220000 },
    { month: "Jul", revenue: 380000, expenses: 240000 },
    { month: "Aug", revenue: 420000, expenses: 260000 },
    { month: "Sep", revenue: 450000, expenses: 280000 },
    { month: "Oct", revenue: 480000, expenses: 300000 },
    { month: "Nov", revenue: 520000, expenses: 320000 },
    { month: "Dec", revenue: 550000, expenses: 340000 }
  ];

  const cropTypeData = [
    { name: "Maize", policies: 45, claims: 12, color: "#10B981" },
    { name: "Rice", policies: 32, claims: 8, color: "#3B82F6" },
    { name: "Potatoes", policies: 28, claims: 15, color: "#F59E0B" },
    { name: "Beans", policies: 20, claims: 6, color: "#8B5CF6" },
    { name: "Other", policies: 15, claims: 4, color: "#EF4444" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending_review": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "expired": return "bg-gray-800/20 text-white";
      default: return "bg-gray-800/20 text-white";
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
      default: return "bg-gray-800/20 text-white";
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700/30 rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2 text-white">
          Welcome back, {insurerName}
        </h1>
        <p className="text-blue-600 dark:text-blue-400">
          Insurer ID: {insurerId} • Last login: Today at 2:30 PM
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className={`${dashboardTheme.card} border-indigo-700/30`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Risk Reviews</p>
                <p className="text-2xl font-bold text-white">{riskAssessments.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-400/20 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${dashboardTheme.card} border-sky-700/30`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Active Policies</p>
                <p className="text-2xl font-bold text-white">{policies.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${dashboardTheme.card} border-cyan-700/30`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Claim Reviews</p>
                <p className="text-2xl font-bold text-white">{claims.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-400/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${dashboardTheme.card} border-blue-700/30`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Total Premium</p>
                <p className="text-2xl font-bold text-white">2.4B RWF</p>
              </div>
              <div className="w-12 h-12 bg-purple-400/20 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Risk Distribution Pie Chart */}
        <Card className="bg-gradient-to-br from-white/90 to-blue-50/50 dark:from-gray-800/90 dark:to-gray-900/50 backdrop-blur-xl border border-blue-200/30 dark:border-gray-700/30 rounded-3xl shadow-2xl shadow-blue-200/20 dark:shadow-gray-900/20 hover:shadow-blue-300/30 dark:hover:shadow-gray-800/30 transition-all duration-500">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-white text-lg font-bold">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-blue-200/50">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              Risk Level Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth={3}
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        style={{
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Percentage']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '16px',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    labelStyle={{
                      color: '#374151',
                      fontWeight: '600',
                      fontSize: '13px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {riskDistributionData.reduce((sum, item) => sum + item.value, 0)}%
                  </div>
                  <div className="text-sm text-white/70 font-medium">Total Coverage</div>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {riskDistributionData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/40 hover:bg-gray-700/80 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                    <span className="text-white/80 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-white bg-gray-800/80 px-3 py-1 rounded-lg">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Claims Over Time Bar Chart */}
        <Card className="bg-gradient-to-br from-white/90 to-orange-50/50 dark:from-gray-800/90 dark:to-gray-900/50 backdrop-blur-xl border border-orange-200/30 dark:border-gray-700/30 rounded-3xl shadow-2xl shadow-orange-200/20 dark:shadow-gray-900/20 hover:shadow-orange-300/30 dark:hover:shadow-gray-800/30 transition-all duration-500">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-white text-lg font-bold">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-orange-200/50">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              Claims Filed This Year
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={claimsOverTimeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="claimsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#D97706" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6B7280"
                    fontSize={12}
                    fontWeight="500"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                    fontWeight="500"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '16px',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    labelStyle={{
                      color: '#374151',
                      fontWeight: '600',
                      fontSize: '13px'
                    }}
                  />
                  <Bar 
                    dataKey="claims" 
                    fill="url(#claimsGradient)" 
                    radius={[8, 8, 0, 0]}
                    name="Claims Count"
                    style={{
                      filter: 'drop-shadow(0 4px 8px rgba(245, 158, 11, 0.3))'
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue vs Expenses Area Chart */}
        <Card className="bg-gradient-to-br from-white/90 to-green-50/50 dark:from-gray-800/90 dark:to-gray-900/50 backdrop-blur-xl border border-green-200/30 dark:border-gray-700/30 rounded-3xl shadow-2xl shadow-green-200/20 dark:shadow-gray-900/20 hover:shadow-green-300/30 dark:hover:shadow-gray-800/30 transition-all duration-500">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-white text-lg font-bold">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-green-200/50">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              Revenue vs Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="50%" stopColor="#059669" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#047857" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                      <stop offset="50%" stopColor="#DC2626" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#B91C1C" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6B7280"
                    fontSize={12}
                    fontWeight="500"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                    fontWeight="500"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000)}K`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString()} RWF`, 'Amount']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '16px',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    labelStyle={{
                      color: '#374151',
                      fontWeight: '600',
                      fontSize: '13px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stackId="1"
                    stroke="#10B981" 
                    fill="url(#revenueGradient)"
                    strokeWidth={3}
                    style={{
                      filter: 'drop-shadow(0 4px 8px rgba(16, 185, 129, 0.2))'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    stackId="2"
                    stroke="#EF4444" 
                    fill="url(#expenseGradient)"
                    strokeWidth={3}
                    style={{
                      filter: 'drop-shadow(0 4px 8px rgba(239, 68, 68, 0.2))'
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Crop Type Distribution */}
        <Card className="bg-gradient-to-br from-white/90 to-purple-50/50 dark:from-gray-800/90 dark:to-gray-900/50 backdrop-blur-xl border border-purple-200/30 dark:border-gray-700/30 rounded-3xl shadow-2xl shadow-purple-200/20 dark:shadow-gray-900/20 hover:shadow-purple-300/30 dark:hover:shadow-gray-800/30 transition-all duration-500">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-white text-lg font-bold">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-purple-200/50">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              Policies by Crop Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cropTypeData} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="cropGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
                  <XAxis 
                    type="number"
                    stroke="#6B7280"
                    fontSize={12}
                    fontWeight="500"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name" 
                    stroke="#6B7280"
                    fontSize={12}
                    fontWeight="500"
                    width={80}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '16px',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    labelStyle={{
                      color: '#374151',
                      fontWeight: '600',
                      fontSize: '13px'
                    }}
                  />
                  <Bar 
                    dataKey="policies" 
                    fill="url(#cropGradient)" 
                    radius={[0, 8, 8, 0]}
                    name="Policies"
                    style={{
                      filter: 'drop-shadow(0 4px 8px rgba(139, 92, 246, 0.3))'
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
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
                  <p className="text-sm text-white/80 mb-1">
                    {assessment.farmerName} • {assessment.cropType}
                  </p>
                  <p className="text-xs text-white/60">
                    Assessor: {assessment.assessorName}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setActivePage("risk-reviews")}
                    >
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
                  <p className="text-sm text-white/80 mb-1">
                    {claim.farmerName} • {claim.cropType}
                  </p>
                  <p className="text-xs text-white/60">
                    Policy: {claim.policyId}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setActivePage("claim-reviews")}
                    >
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




  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return renderDashboard();
      case "risk-reviews": return <RiskReviewManagement />;
      case "claim-reviews": return <ClaimsTable />;
      case "claim-review-detail": return <ClaimReviewPage />;
      case "policy-management": return <PolicyManagement />;
      case "risk-assessments": return <RiskAssessmentSystem />;
      case "crop-monitoring": return <CropMonitoringSystem />;
      case "notifications": return <InsurerNotifications />;
      case "profile-settings": return <InsurerProfileSettings />;
      default: return renderDashboard();
    }
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "risk-reviews", label: "Risk Reviews", icon: Shield },
    { id: "claim-reviews", label: "Claim Reviews", icon: FileText },
    { id: "policy-management", label: "Policy Management", icon: CheckCircle },
    { id: "risk-assessments", label: "Risk Assessments", icon: AlertTriangle },
    { id: "crop-monitoring", label: "Crop Monitoring", icon: Activity },
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
