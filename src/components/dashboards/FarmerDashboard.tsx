import { useState, useEffect } from "react";
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
import { getUserId, getPhoneNumber, getEmail } from "@/services/authAPI";
import { getFarms } from "@/services/farmsApi";
import { getClaims } from "@/services/claimsApi";
import { useToast } from "@/hooks/use-toast";
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
  Camera,
  Info,
  Crop,
  BarChart3
} from "lucide-react";

export default function FarmerDashboard() {
  const { toast } = useToast();
  const [activePage, setActivePage] = useState("dashboard");
  
  // Get logged-in farmer data from localStorage
  const farmerId = getUserId() || "";
  const farmerPhone = getPhoneNumber() || "";
  const farmerEmail = getEmail() || "";
  const farmerName = farmerEmail || farmerPhone || "Farmer";
  
  // State for My Fields page
  const [farms, setFarms] = useState<any[]>([]);
  const [farmsLoading, setFarmsLoading] = useState(false);
  const [farmsError, setFarmsError] = useState<string | null>(null);
  
  // State for Loss Reports page
  const [claims, setClaims] = useState<any[]>([]);
  const [claimsLoading, setClaimsLoading] = useState(false);
  const [claimsError, setClaimsError] = useState<string | null>(null);
  
  // Load data for dashboard and pages
  useEffect(() => {
    if (farmerId) {
      if (activePage === "dashboard") {
        loadFarms();
        loadClaims();
      } else if (activePage === "my-fields") {
        loadFarms();
      } else if (activePage === "loss-reports") {
        loadClaims();
      }
    }
  }, [activePage, farmerId]);
  
  const loadFarms = async () => {
    setFarmsLoading(true);
    setFarmsError(null);
    try {
      const response: any = await getFarms(1, 100);
      const farmsData = response.data || response || [];
      const farmsArray = Array.isArray(farmsData) ? farmsData : (farmsData.items || farmsData.results || []);
      
      // Filter farms by the logged-in farmer
      const farmerFarms = farmsArray.filter((farm: any) => {
        const farmFarmerId = farm.farmerId?._id || farm.farmerId || farm.farmer?._id || farm.farmer;
        return farmFarmerId === farmerId || farmFarmerId === farmerId.toString();
      });
      
      setFarms(farmerFarms);
    } catch (err: any) {
      console.error('Failed to load farms:', err);
      setFarmsError(err.message || 'Failed to load farms');
      toast({
        title: 'Error loading farms',
        description: err.message || 'Failed to load farms',
        variant: 'destructive'
      });
    } finally {
      setFarmsLoading(false);
    }
  };
  
  const loadClaims = async () => {
    setClaimsLoading(true);
    setClaimsError(null);
    try {
      const response: any = await getClaims(1, 100);
      const claimsData = response.data || response || [];
      const claimsArray = Array.isArray(claimsData) ? claimsData : (claimsData.items || claimsData.results || []);
      
      // Filter claims by the logged-in farmer
      const farmerClaims = claimsArray.filter((claim: any) => {
        const claimFarmerId = claim.farmerId?._id || claim.farmerId || claim.farmer?._id || claim.farmer;
        return claimFarmerId === farmerId || claimFarmerId === farmerId.toString();
      });
      
      setClaims(farmerClaims);
    } catch (err: any) {
      console.error('Failed to load claims:', err);
      setClaimsError(err.message || 'Failed to load claims');
      toast({
        title: 'Error loading claims',
        description: err.message || 'Failed to load claims',
        variant: 'destructive'
      });
    } finally {
      setClaimsLoading(false);
    }
  };


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
                <p className="text-sm font-medium text-white/70">My Fields</p>
                <p className="text-2xl font-bold text-white">{farms.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-400/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md shadow-green-900/20">
                <Crop className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-teal-400/80 dark:hover:border-teal-500/80 transition-all duration-300 bg-teal-50/90 dark:bg-teal-900/20 backdrop-blur-sm border border-teal-200/60 dark:border-teal-700/30 rounded-2xl shadow-lg shadow-teal-100/30 dark:shadow-teal-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Total Claims</p>
                <p className="text-2xl font-bold text-white">{claims.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100/80 dark:bg-yellow-900/40 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md shadow-yellow-200/30 dark:shadow-yellow-900/20">
                <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-lime-400/80 dark:hover:border-lime-500/80 transition-all duration-300 bg-lime-50/90 dark:bg-lime-900/20 backdrop-blur-sm border border-lime-200/60 dark:border-lime-700/30 rounded-2xl shadow-lg shadow-lime-100/30 dark:shadow-lime-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Pending Claims</p>
                <p className="text-2xl font-bold text-white">{claims.filter(c => c.status?.toLowerCase() === 'pending').length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100/80 dark:bg-blue-900/40 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md shadow-blue-200/30 dark:shadow-blue-900/20">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-cyan-400/80 dark:hover:border-cyan-500/80 transition-all duration-300 bg-cyan-50/90 dark:bg-cyan-900/20 backdrop-blur-sm border border-cyan-200/60 dark:border-cyan-700/30 rounded-2xl shadow-lg shadow-cyan-100/30 dark:shadow-cyan-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Approved Claims</p>
                <p className="text-2xl font-bold text-white">{claims.filter(c => c.status?.toLowerCase() === 'approved').length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100/80 dark:bg-orange-900/40 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md shadow-orange-200/30 dark:shadow-orange-900/20">
                <CheckCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
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


  const renderMyFields = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">My Fields</h2>
          <p className="text-white/80">Manage and view your registered fields</p>
        </div>
        <Button 
          variant="outline" 
          onClick={loadFarms}
          disabled={farmsLoading}
          className="border-gray-700 text-white hover:bg-gray-800"
        >
          <Crop className={`h-4 w-4 mr-2 ${farmsLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {farmsLoading && (
        <Card className={`${dashboardTheme.card}`}>
          <CardContent className="p-12">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-white/60">Loading fields...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {farmsError && !farmsLoading && (
        <Card className={`${dashboardTheme.card}`}>
          <CardContent className="p-6">
            <div className="text-center text-red-400">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
              <p>{farmsError}</p>
              <Button 
                onClick={loadFarms} 
                className="mt-4 bg-green-600 hover:bg-green-700 text-white"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!farmsLoading && !farmsError && (
        <Card className={`${dashboardTheme.card}`}>
          <CardHeader>
            <CardTitle className="text-white">Registered Fields</CardTitle>
          </CardHeader>
          <CardContent>
            {farms.length === 0 ? (
              <div className="text-center py-12">
                <Crop className="h-16 w-16 mx-auto text-white/40 mb-4" />
                <p className="text-white/60 text-lg mb-2">No fields registered</p>
                <p className="text-white/40 text-sm">Register your fields to get started with crop insurance</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-4 px-6 font-medium text-white/80">Field Name</th>
                      <th className="text-left py-4 px-6 font-medium text-white/80">Crop Type</th>
                      <th className="text-left py-4 px-6 font-medium text-white/80">Area (ha)</th>
                      <th className="text-left py-4 px-6 font-medium text-white/80">Location</th>
                      <th className="text-left py-4 px-6 font-medium text-white/80">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {farms.map((farm, index) => (
                      <tr 
                        key={farm._id || farm.id || index} 
                        className={`border-b border-gray-800/50 hover:bg-gray-900/50 transition-colors ${
                          index % 2 === 0 ? "bg-gray-950/30" : ""
                        }`}
                      >
                        <td className="py-4 px-6 text-white font-medium">{farm.name || "Unnamed Field"}</td>
                        <td className="py-4 px-6 text-white">{farm.cropType || farm.crop || "N/A"}</td>
                        <td className="py-4 px-6 text-white">{farm.area || farm.size || 0} ha</td>
                        <td className="py-4 px-6 text-white">
                          {farm.location?.coordinates 
                            ? `${farm.location.coordinates[1]?.toFixed(4)}, ${farm.location.coordinates[0]?.toFixed(4)}`
                            : farm.location || "N/A"}
                        </td>
                        <td className="py-4 px-6">
                          <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                            {farm.status || "Active"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderLossReports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Loss Reports</h2>
          <p className="text-white/80">View and track your claim reports</p>
        </div>
        <Button 
          variant="outline" 
          onClick={loadClaims}
          disabled={claimsLoading}
          className="border-gray-700 text-white hover:bg-gray-800"
        >
          <BarChart3 className={`h-4 w-4 mr-2 ${claimsLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {claimsLoading && (
        <Card className={`${dashboardTheme.card}`}>
          <CardContent className="p-12">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-white/60">Loading loss reports...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {claimsError && !claimsLoading && (
        <Card className={`${dashboardTheme.card}`}>
          <CardContent className="p-6">
            <div className="text-center text-red-400">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
              <p>{claimsError}</p>
              <Button 
                onClick={loadClaims} 
                className="mt-4 bg-green-600 hover:bg-green-700 text-white"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!claimsLoading && !claimsError && (
        <Card className={`${dashboardTheme.card}`}>
          <CardHeader>
            <CardTitle className="text-white">Claim Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {claims.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-white/40 mb-4" />
                <p className="text-white/60 text-lg mb-2">No loss reports found</p>
                <p className="text-white/40 text-sm">Your claim reports will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-4 px-6 font-medium text-white/80">Claim ID</th>
                      <th className="text-left py-4 px-6 font-medium text-white/80">Crop</th>
                      <th className="text-left py-4 px-6 font-medium text-white/80">Date</th>
                      <th className="text-left py-4 px-6 font-medium text-white/80">Damage Type</th>
                      <th className="text-left py-4 px-6 font-medium text-white/80">Amount</th>
                      <th className="text-left py-4 px-6 font-medium text-white/80">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.map((claim, index) => (
                      <tr 
                        key={claim._id || claim.id || index} 
                        className={`border-b border-gray-800/50 hover:bg-gray-900/50 transition-colors ${
                          index % 2 === 0 ? "bg-gray-950/30" : ""
                        }`}
                      >
                        <td className="py-4 px-6 text-white font-medium">{claim.claimNumber || claim._id || claim.id || "N/A"}</td>
                        <td className="py-4 px-6 text-white">{claim.cropType || claim.crop || "N/A"}</td>
                        <td className="py-4 px-6 text-white">
                          {claim.createdAt || claim.submittedAt || claim.date 
                            ? new Date(claim.createdAt || claim.submittedAt || claim.date).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="py-4 px-6 text-white">{claim.lossEventType || claim.damageType || "N/A"}</td>
                        <td className="py-4 px-6 text-white">
                          {claim.amount || claim.claimAmount 
                            ? `${(claim.amount || claim.claimAmount).toLocaleString()} RWF`
                            : "N/A"}
                        </td>
                        <td className="py-4 px-6">
                          <Badge className={getStatusColor(claim.status?.toLowerCase() || "pending")}>
                            {getStatusIcon(claim.status?.toLowerCase() || "pending")}
                            <span className="ml-1 capitalize">{claim.status?.replace('_', ' ') || "Pending"}</span>
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
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
      case "my-fields": return renderMyFields();
      case "loss-reports": return renderLossReports();
      case "profile": return renderProfileSettings();
      default: return renderDashboard();
    }
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "my-fields", label: "My Fields", icon: Crop },
    { id: "loss-reports", label: "Loss Reports", icon: FileText },
    { id: "profile", label: "Profile", icon: User }
  ];

  return (
    <DashboardLayout
      userType="farmer"
      userId={farmerId}
      userName={farmerName}
      navigationItems={navigationItems}
      activePage={activePage} 
      onPageChange={setActivePage}
      onLogout={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.removeItem('phoneNumber');
        localStorage.removeItem('email');
        window.location.href = '/farmer-login';
      }}
    >
      {renderPage()}
    </DashboardLayout>
  );
}
