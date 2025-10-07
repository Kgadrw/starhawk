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
import DashboardLayout from "../layout/DashboardLayout";
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
    },
    {
      id: "POL-002",
      crop: "Rice",
      coverage: 180000,
      premium: 12000,
      status: "active",
      startDate: "2024-03-01",
      endDate: "2024-12-31"
    },
    {
      id: "POL-003",
      crop: "Beans",
      coverage: 120000,
      premium: 8000,
      status: "pending",
      startDate: "2024-06-01",
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
    },
    {
      id: "CLM-003",
      crop: "Rice",
      date: "2024-09-15",
      status: "approved",
      assessor: "Marie",
      description: "Flood damage to rice fields"
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

  // Chart data
  const policyDistributionData = [
    { name: "Maize", value: 250000, color: "#10B981" },
    { name: "Rice", value: 180000, color: "#3B82F6" },
    { name: "Beans", value: 120000, color: "#F59E0B" }
  ];

  const claimsOverTimeData = [
    { month: "Jan", claims: 0, amount: 0 },
    { month: "Feb", claims: 0, amount: 0 },
    { month: "Mar", claims: 0, amount: 0 },
    { month: "Apr", claims: 0, amount: 0 },
    { month: "May", claims: 0, amount: 0 },
    { month: "Jun", claims: 0, amount: 0 },
    { month: "Jul", claims: 0, amount: 0 },
    { month: "Aug", claims: 0, amount: 0 },
    { month: "Sep", claims: 1, amount: 45000 },
    { month: "Oct", claims: 1, amount: 35000 },
    { month: "Nov", claims: 0, amount: 0 },
    { month: "Dec", claims: 0, amount: 0 }
  ];

  const coverageTrendData = [
    { month: "Jan", coverage: 250000 },
    { month: "Feb", coverage: 250000 },
    { month: "Mar", coverage: 430000 },
    { month: "Apr", coverage: 430000 },
    { month: "May", coverage: 430000 },
    { month: "Jun", coverage: 550000 },
    { month: "Jul", coverage: 550000 },
    { month: "Aug", coverage: 550000 },
    { month: "Sep", coverage: 550000 },
    { month: "Oct", coverage: 550000 },
    { month: "Nov", coverage: 550000 },
    { month: "Dec", coverage: 550000 }
  ];

  const statusDistributionData = [
    { name: "Active", value: 2, color: "#10B981" },
    { name: "Pending", value: 1, color: "#F59E0B" },
    { name: "Expired", value: 0, color: "#EF4444" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "in_review": return "bg-blue-100 text-blue-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-800/20 text-white";
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
      <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm border border-green-200/50 dark:border-green-700/30 rounded-2xl p-6 shadow-lg shadow-green-100/30 dark:shadow-green-900/20">
        <h1 className="text-2xl font-bold mb-2 text-white">
          Welcome back, {farmerName}
        </h1>
        <p className="text-green-600 dark:text-green-400">
          Farmer ID: {farmerId} • Last login: Today at 2:30 PM
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className={`${dashboardTheme.card} hover:border-green-400/50 transition-all duration-300 rounded-2xl shadow-lg shadow-green-900/20`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">My Policies</p>
                <p className="text-2xl font-bold text-white">{policies.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-400/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md shadow-green-900/20">
                <FileText className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-teal-400/80 dark:hover:border-teal-500/80 transition-all duration-300 bg-teal-50/90 dark:bg-teal-900/20 backdrop-blur-sm border border-teal-200/60 dark:border-teal-700/30 rounded-2xl shadow-lg shadow-teal-100/30 dark:shadow-teal-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Pending Requests</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100/80 dark:bg-yellow-900/40 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md shadow-yellow-200/30 dark:shadow-yellow-900/20">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
      </div>
          </CardContent>
        </Card>

        <Card className="hover:border-lime-400/80 dark:hover:border-lime-500/80 transition-all duration-300 bg-lime-50/90 dark:bg-lime-900/20 backdrop-blur-sm border border-lime-200/60 dark:border-lime-700/30 rounded-2xl shadow-lg shadow-lime-100/30 dark:shadow-lime-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Claims Filed</p>
                <p className="text-2xl font-bold text-white">{claims.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100/80 dark:bg-blue-900/40 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md shadow-blue-200/30 dark:shadow-blue-900/20">
                <AlertTriangle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-cyan-400/80 dark:hover:border-cyan-500/80 transition-all duration-300 bg-cyan-50/90 dark:bg-cyan-900/20 backdrop-blur-sm border border-cyan-200/60 dark:border-cyan-700/30 rounded-2xl shadow-lg shadow-cyan-100/30 dark:shadow-cyan-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Claims in Review</p>
                <p className="text-2xl font-bold text-white">{claims.filter(c => c.status === 'in_review').length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100/80 dark:bg-orange-900/40 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md shadow-orange-200/30 dark:shadow-orange-900/20">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2">
        {/* Policy Distribution Pie Chart */}
        <Card className="bg-gradient-to-br from-white/90 to-green-50/50 dark:from-gray-800/90 dark:to-gray-900/50 backdrop-blur-xl border border-green-200/30 dark:border-gray-700/30 rounded-3xl shadow-2xl shadow-green-200/20 dark:shadow-gray-900/20 hover:shadow-green-300/30 dark:hover:shadow-gray-800/30 transition-all duration-500">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-white text-lg font-bold">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-green-200/50">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              Policy Coverage Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={policyDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth={3}
                  >
                    {policyDistributionData.map((entry, index) => (
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
                    formatter={(value, name, props) => [
                      `${value.toLocaleString()} RWF`, 
                      'Coverage'
                    ]}
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
                    {policyDistributionData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-white/70 font-medium">Total RWF</div>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {policyDistributionData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50/60 backdrop-blur-sm rounded-xl border border-green-200/40 hover:bg-green-100/80 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                    <span className="text-white/80 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-white bg-gray-800/80 px-3 py-1 rounded-lg">{item.value.toLocaleString()} RWF</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Claims Over Time Bar Chart */}
        <Card className="bg-gradient-to-br from-white/90 to-blue-50/50 dark:from-gray-800/90 dark:to-gray-900/50 backdrop-blur-xl border border-blue-200/30 dark:border-gray-700/30 rounded-3xl shadow-2xl shadow-blue-200/20 dark:shadow-gray-900/20 hover:shadow-blue-300/30 dark:hover:shadow-gray-800/30 transition-all duration-500">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-white text-lg font-bold">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-blue-200/50">
                <AlertTriangle className="h-5 w-5 text-white" />
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
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0.6}/>
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
                      filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))'
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
        {/* Coverage Trend Area Chart */}
        <Card className="bg-gradient-to-br from-white/90 to-emerald-50/50 backdrop-blur-xl border border-emerald-200/30 rounded-3xl shadow-2xl shadow-emerald-200/20 hover:shadow-emerald-300/30 transition-all duration-500">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-white text-lg font-bold">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-emerald-200/50">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              Coverage Growth Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={coverageTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="coverageGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="50%" stopColor="#059669" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#047857" stopOpacity={0.1}/>
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
                    formatter={(value) => [`${value.toLocaleString()} RWF`, 'Coverage']}
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
                    dataKey="coverage" 
                    stroke="#10B981" 
                    fill="url(#coverageGradient)"
                    strokeWidth={3}
                    style={{
                      filter: 'drop-shadow(0 4px 8px rgba(16, 185, 129, 0.2))'
                    }}
                  />
                </AreaChart>
                  </ResponsiveContainer>
                </div>
          </CardContent>
        </Card>

        {/* Policy Status Distribution */}
        <Card className="bg-gradient-to-br from-white/90 to-yellow-50/50 backdrop-blur-xl border border-yellow-200/30 rounded-3xl shadow-2xl shadow-yellow-200/20 hover:shadow-yellow-300/30 transition-all duration-500">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-white text-lg font-bold">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-yellow-200/50">
                <FileText className="h-5 w-5 text-white" />
              </div>
              Policy Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth={3}
                  >
                    {statusDistributionData.map((entry, index) => (
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
                    formatter={(value) => [`${value} policies`, 'Count']}
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
                    {statusDistributionData.reduce((sum, item) => sum + item.value, 0)}
                  </div>
                  <div className="text-sm text-white/70 font-medium">Total Policies</div>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {statusDistributionData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50/60 backdrop-blur-sm rounded-xl border border-green-200/40 hover:bg-green-100/80 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                    <span className="text-white/80 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-white bg-gray-800/80 px-3 py-1 rounded-lg">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
              </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:border-violet-400/80 dark:hover:border-violet-500/80 transition-all duration-300 bg-violet-50/90 dark:bg-violet-900/20 backdrop-blur-sm border border-violet-200/60 dark:border-violet-700/30 rounded-2xl shadow-lg shadow-violet-100/30 dark:shadow-violet-900/20">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Plus className="h-5 w-5 mr-2 text-white/70" />
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

        <Card className={`${dashboardTheme.card}`}>
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Bell className="h-5 w-5 mr-2 text-white/70" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className={`flex items-start space-x-3 p-4 rounded-xl border ${
                  notification.type === 'success' ? 'bg-green-600/30 border-green-600/40' : 'bg-blue-600/30 border-blue-600/40'
                }`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mt-1 ${
                    notification.type === 'success' ? 'bg-green-400/20 text-green-400' : 'bg-blue-400/20 text-blue-400'
                  }`}>
                    {notification.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white mb-1">
                      {notification.type === 'success' ? 'Policy Update' : 'System Notification'}
                    </h4>
                    <p className="text-sm text-white/80 mb-1">{notification.message}</p>
                    <p className="text-xs text-white/60">{notification.date}</p>
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
        <h2 className="text-2xl font-bold text-white">Request Insurance</h2>
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
        <h2 className="text-2xl font-bold text-white">My Policies</h2>
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
        <h2 className="text-2xl font-bold text-white">File a Claim</h2>
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
            <div className="border-2 border-dashed border-gray-700/50 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-white/60 mb-2" />
              <p className="text-sm text-white/80">Click to upload or drag and drop</p>
              <p className="text-xs text-white/60">PNG, JPG up to 10MB</p>
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
        <h2 className="text-2xl font-bold text-white">Claim Status</h2>
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
        <div>
          <h2 className="text-2xl font-bold text-white">Notifications</h2>
          <p className="text-white/80">Stay updated with your policy status and claim updates</p>
        </div>
        <Button variant="outline" onClick={() => setActivePage("dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={`${dashboardTheme.card} transition-all duration-200 ${
            notification.type === 'success' ? "border-l-4 border-l-green-500 bg-green-600/30" : "border-l-4 border-l-blue-500 bg-blue-600/30"
          }`}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  notification.type === 'success' ? "bg-green-400/20 text-green-400" : "bg-blue-400/20 text-blue-400"
                }`}>
                  {notification.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <Info className="h-5 w-5" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-white">
                      {notification.type === 'success' ? 'Policy Update' : 'System Notification'}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${
                        notification.type === 'success' ? "bg-green-400/20 text-green-400" : "bg-blue-400/20 text-blue-400"
                      }`}>
                        {notification.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-white/80 mb-3">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-white/60">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {notification.date}
                      </div>
                    </div>
                  </div>
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
        <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
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
