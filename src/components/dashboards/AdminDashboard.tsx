import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dashboardTheme } from "@/utils/dashboardTheme";
import { 
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Legend
} from "recharts";
import { 
  Users,
  Settings,
  Shield,
  Activity,
  Database,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Lock,
  Eye,
  FileText,
  Server,
  Zap,
  BarChart3,
  UserPlus,
  UserMinus,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  MoreVertical,
  Key,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Percent,
  CreditCard,
  Building2,
  Globe,
  HardDrive,
  Cpu,
  WifiOff,
  Bell
} from "lucide-react";

export const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [adminId] = useState("ADMIN-001");
  const [adminName] = useState("System Administrator");

  // User Data
  const systemUsers = [
    { id: "U001", name: "John Uwase", email: "john.uwase@example.com", role: "Farmer", status: "active", lastLogin: "2024-03-15 10:30", region: "Northern Province", joinDate: "2024-01-15", policies: 3 },
    { id: "U002", name: "Alice Mukamana", email: "alice.m@example.com", role: "Assessor", status: "active", lastLogin: "2024-03-15 09:15", region: "Kigali City", joinDate: "2024-02-01", assessments: 124 },
    { id: "U003", name: "David Ndizeye", email: "david.n@insurance.rw", role: "Insurer", status: "active", lastLogin: "2024-03-15 11:00", region: "Eastern Province", joinDate: "2023-12-10", policies: 2450 },
    { id: "U004", name: "Sarah Ingabire", email: "sarah.i@example.com", role: "Farmer", status: "inactive", lastLogin: "2024-02-28 14:20", region: "Western Province", joinDate: "2024-01-20", policies: 1 },
    { id: "U005", name: "Emmanuel Hakizimana", email: "emmanuel.h@gov.rw", role: "Government", status: "active", lastLogin: "2024-03-15 08:45", region: "Southern Province", joinDate: "2023-11-05", access: "full" },
    { id: "U006", name: "Marie Uwimana", email: "marie.u@example.com", role: "Assessor", status: "active", lastLogin: "2024-03-15 07:30", region: "Southern Province", joinDate: "2024-01-10", assessments: 156 },
    { id: "U007", name: "Paul Kagame", email: "paul.k@example.com", role: "Farmer", status: "active", lastLogin: "2024-03-14 16:45", region: "Eastern Province", joinDate: "2023-12-15", policies: 5 },
    { id: "U008", name: "Grace Mukamana", email: "grace.m@example.com", role: "Assessor", status: "active", lastLogin: "2024-03-15 09:00", region: "Western Province", joinDate: "2024-02-15", assessments: 98 }
  ];

  // User Statistics
  const userStats = {
    total: 8450,
    active: 7680,
    inactive: 770,
    newThisMonth: 245,
    farmers: 7950,
    assessors: 24,
    insurers: 4,
    government: 2,
    admins: 3
  };

  // Financial Data
  const financialData = {
    totalRevenue: 15650000,
    monthlyRevenue: 2450000,
    commissionEarned: 726000,
    pendingPayments: 156000,
    growthRate: 18.5
  };

  // Commission Settings
  const commissionRates = [
    { type: "Policy Premium", rate: 3.5, revenue: 169400000, commission: 5929000, status: "active" },
    { type: "Claim Processing", rate: 2.0, revenue: 1278000000, commission: 25560000, status: "active" },
    { type: "Assessment Fee", rate: 5.0, revenue: 45000000, commission: 2250000, status: "active" },
    { type: "Data Analytics", rate: 10.0, revenue: 12000000, commission: 1200000, status: "active" }
  ];

  // System Metrics
  const systemMetrics = {
    uptime: 99.97,
    apiCalls: 1234567,
    avgResponseTime: 127,
    errorRate: 0.03,
    activeConnections: 234,
    dbSize: 15.6,
    cpuUsage: 42.5,
    memoryUsage: 68.3,
    diskUsage: 45.8
  };

  // Activity Logs
  const recentActivities = [
    { id: 1, user: "David Ndizeye", action: "Created new policy", details: "POL-2845 for farmer FMR-0567", timestamp: "2 min ago", type: "policy", severity: "info" },
    { id: 2, user: "Alice Mukamana", action: "Completed assessment", details: "Risk assessment for farm in Nyagatare", timestamp: "15 min ago", type: "assessment", severity: "info" },
    { id: 3, user: "System", action: "Database backup", details: "Automated backup completed successfully", timestamp: "1 hour ago", type: "system", severity: "success" },
    { id: 4, user: "Admin", action: "Security alert", details: "Failed login attempt from unknown IP", timestamp: "2 hours ago", type: "security", severity: "warning" },
    { id: 5, user: "Emmanuel Hakizimana", action: "Generated report", details: "Monthly insurance coverage report", timestamp: "3 hours ago", type: "report", severity: "info" },
    { id: 6, user: "System", action: "Payment processed", details: "Premium payment of RWF 850,000", timestamp: "4 hours ago", type: "payment", severity: "success" }
  ];

  // User Growth Data
  const userGrowthData = [
    { month: "Jan", farmers: 7200, assessors: 20, insurers: 4, total: 7226 },
    { month: "Feb", farmers: 7450, assessors: 22, insurers: 4, total: 7478 },
    { month: "Mar", farmers: 7680, assessors: 23, insurers: 4, total: 7709 },
    { month: "Apr", farmers: 7850, assessors: 24, insurers: 4, total: 7880 },
    { month: "May", farmers: 7920, assessors: 24, insurers: 4, total: 7950 },
    { month: "Jun", farmers: 7950, assessors: 24, insurers: 4, total: 7980 }
  ];

  // Revenue Trends
  const revenueTrends = [
    { month: "Jan", revenue: 12500000, commission: 437500, expenses: 2100000 },
    { month: "Feb", revenue: 13200000, commission: 462000, expenses: 2250000 },
    { month: "Mar", revenue: 14100000, commission: 493500, expenses: 2400000 },
    { month: "Apr", revenue: 14800000, commission: 518000, expenses: 2500000 },
    { month: "May", revenue: 15200000, commission: 532000, expenses: 2600000 },
    { month: "Jun", revenue: 15650000, commission: 547750, expenses: 2700000 }
  ];

  // Dashboard Overview
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className={`${dashboardTheme.card} border-l-4 border-l-blue-500`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Total Users</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{userStats.total.toLocaleString()}</div>
            <p className="text-xs text-white/60 mt-1">
              <span className="text-green-500">+{userStats.newThisMonth}</span> this month
            </p>
          </CardContent>
        </Card>

        <Card className={`${dashboardTheme.card} border-l-4 border-l-green-500`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Monthly Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              RWF {(financialData.monthlyRevenue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-white/60 mt-1">
              <span className="text-green-500">+{financialData.growthRate}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className={`${dashboardTheme.card} border-l-4 border-l-purple-500`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/80">System Health</CardTitle>
            <Activity className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{systemMetrics.uptime}%</div>
            <p className="text-xs text-white/60 mt-1">
              <span className="text-green-500">Excellent</span> uptime
            </p>
          </CardContent>
        </Card>

        <Card className={`${dashboardTheme.card} border-l-4 border-l-orange-500`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Active Sessions</CardTitle>
            <Zap className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{systemMetrics.activeConnections}</div>
            <p className="text-xs text-white/60 mt-1">Live connections</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Card className={dashboardTheme.card}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Platform Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
              <TabsTrigger value="users" className="data-[state=active]:bg-red-600">
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="revenue" className="data-[state=active]:bg-red-600">
                <DollarSign className="h-4 w-4 mr-2" />
                Revenue
              </TabsTrigger>
              <TabsTrigger value="system" className="data-[state=active]:bg-red-600">
                <Server className="h-4 w-4 mr-2" />
                System
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-red-600">
                <Activity className="h-4 w-4 mr-2" />
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userGrowthData}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                      labelStyle={{ color: '#F9FAFB' }}
                    />
                    <Area type="monotone" dataKey="total" stroke="#3B82F6" fillOpacity={1} fill="url(#colorTotal)" name="Total Users" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="revenue" className="mt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={revenueTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                      labelStyle={{ color: '#F9FAFB' }}
                      formatter={(value: number) => `RWF ${(value / 1000000).toFixed(1)}M`}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                    <Line type="monotone" dataKey="commission" stroke="#8B5CF6" strokeWidth={3} name="Commission" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="system" className="mt-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-sm text-white/80">CPU Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{systemMetrics.cpuUsage}%</div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-blue-500" style={{ width: `${systemMetrics.cpuUsage}%` }} />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-sm text-white/80">Memory Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{systemMetrics.memoryUsage}%</div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-purple-500" style={{ width: `${systemMetrics.memoryUsage}%` }} />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-sm text-white/80">Disk Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{systemMetrics.diskUsage}%</div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-green-500" style={{ width: `${systemMetrics.diskUsage}%` }} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <div className="space-y-3">
                {recentActivities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.severity === 'success' ? 'bg-green-500' :
                        activity.severity === 'warning' ? 'bg-yellow-500' :
                        activity.severity === 'error' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-white">{activity.action}</p>
                        <p className="text-xs text-white/60">{activity.user} • {activity.details}</p>
                      </div>
                    </div>
                    <span className="text-xs text-white/50">{activity.timestamp}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-sm text-white/80 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              User Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { role: "Farmers", count: userStats.farmers, color: "bg-green-500" },
              { role: "Assessors", count: userStats.assessors, color: "bg-orange-500" },
              { role: "Insurers", count: userStats.insurers, color: "bg-blue-500" },
              { role: "Government", count: userStats.government, color: "bg-purple-500" },
              { role: "Admins", count: userStats.admins, color: "bg-red-500" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm text-white/80">{item.role}</span>
                </div>
                <span className="text-sm font-medium text-white">{item.count.toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-sm text-white/80 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              Commission Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {commissionRates.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-xs text-white/80">{item.type}</span>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{item.rate}%</div>
                  <div className="text-xs text-green-400">
                    RWF {(item.commission / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-sm text-white/80 flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-500" />
              System Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/60">Uptime</span>
                <span className="text-green-400">{systemMetrics.uptime}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${systemMetrics.uptime}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/60">API Response</span>
                <span className="text-blue-400">{systemMetrics.avgResponseTime}ms</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '85%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/60">Error Rate</span>
                <span className="text-green-400">{systemMetrics.errorRate}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '3%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // User Management Page
  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-white/60">Manage all platform users and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className={`${dashboardTheme.card} border-l-4 border-l-blue-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{userStats.total.toLocaleString()}</div>
            <p className="text-xs text-white/60 mt-1">All roles</p>
          </CardContent>
        </Card>
        <Card className={`${dashboardTheme.card} border-l-4 border-l-green-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{userStats.active.toLocaleString()}</div>
            <p className="text-xs text-green-400 mt-1">90.9% active rate</p>
          </CardContent>
        </Card>
        <Card className={`${dashboardTheme.card} border-l-4 border-l-yellow-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{userStats.inactive.toLocaleString()}</div>
            <p className="text-xs text-white/60 mt-1">Need attention</p>
          </CardContent>
        </Card>
        <Card className={`${dashboardTheme.card} border-l-4 border-l-purple-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">New This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{userStats.newThisMonth}</div>
            <p className="text-xs text-purple-400 mt-1">+3.1% growth</p>
          </CardContent>
        </Card>
      </div>

      <Card className={dashboardTheme.card}>
        <CardHeader>
          <CardTitle className="text-white">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">User</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Email</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Role</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Region</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Status</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Last Login</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {systemUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-xs text-white/60">{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-white/80">{user.email}</td>
                    <td className="py-3 px-4">
                      <Badge className={`${
                        user.role === 'Farmer' ? 'bg-green-600' :
                        user.role === 'Assessor' ? 'bg-orange-600' :
                        user.role === 'Insurer' ? 'bg-blue-600' :
                        user.role === 'Government' ? 'bg-purple-600' :
                        'bg-red-600'
                      }`}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-white/80">{user.region}</td>
                    <td className="py-3 px-4">
                      <Badge className={user.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-white/60">{user.lastLogin}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
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

  // Financial Management Page
  const renderFinancialManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Financial Management & Monetization</h2>
          <p className="text-white/60">Track platform revenue and commission earnings</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className={`${dashboardTheme.card} border-l-4 border-l-green-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              RWF {(financialData.totalRevenue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-green-400 mt-1">All-time earnings</p>
          </CardContent>
        </Card>
        <Card className={`${dashboardTheme.card} border-l-4 border-l-blue-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              RWF {(financialData.monthlyRevenue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-green-400 mt-1">+{financialData.growthRate}% growth</p>
          </CardContent>
        </Card>
        <Card className={`${dashboardTheme.card} border-l-4 border-l-purple-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              RWF {(financialData.commissionEarned / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-white/60 mt-1">This month</p>
          </CardContent>
        </Card>
        <Card className={`${dashboardTheme.card} border-l-4 border-l-yellow-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              RWF {(financialData.pendingPayments / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-white/60 mt-1">To be collected</p>
          </CardContent>
        </Card>
      </div>

      <Card className={dashboardTheme.card}>
        <CardHeader>
          <CardTitle className="text-white">Revenue Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrends}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#F9FAFB' }}
                  formatter={(value: number) => `RWF ${(value / 1000000).toFixed(1)}M`}
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                <Area type="monotone" dataKey="commission" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorCommission)" name="Commission" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className={dashboardTheme.card}>
        <CardHeader>
          <CardTitle className="text-white">Commission Rate Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-white/80 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium">Rate</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium">Total Revenue</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium">Commission Earned</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {commissionRates.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4 text-white font-medium">{item.type}</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-purple-600">{item.rate}%</Badge>
                    </td>
                    <td className="py-3 px-4 text-white">RWF {(item.revenue / 1000000).toFixed(1)}M</td>
                    <td className="py-3 px-4 text-green-400 font-medium">
                      RWF {(item.commission / 1000000).toFixed(1)}M
                    </td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-600">{item.status}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                        <Edit className="h-4 w-4" />
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

  // System Configuration Page
  const renderSystemConfig = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">System Configuration</h2>
          <p className="text-white/60">Configure platform settings and preferences</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Server className="h-5 w-5" />
              Server Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Server Status', value: 'Online', status: 'success' },
              { label: 'Database Size', value: `${systemMetrics.dbSize} GB`, status: 'info' },
              { label: 'API Version', value: 'v2.4.1', status: 'info' },
              { label: 'Backup Status', value: 'Last: 2 hours ago', status: 'success' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-white/80">{item.label}</span>
                <Badge className={`${
                  item.status === 'success' ? 'bg-green-600' :
                  item.status === 'warning' ? 'bg-yellow-600' :
                  'bg-blue-600'
                }`}>
                  {item.value}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Backup Database
            </Button>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Upload className="h-4 w-4 mr-2" />
              Restore from Backup
            </Button>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800">
              <Settings className="h-4 w-4 mr-2" />
              Database Settings
            </Button>
          </CardContent>
        </Card>

        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Two-Factor Authentication', enabled: true },
              { label: 'IP Whitelisting', enabled: true },
              { label: 'SSL/TLS Encryption', enabled: true },
              { label: 'Session Timeout', enabled: true }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-white/80">{item.label}</span>
                <div className={`w-12 h-6 rounded-full ${item.enabled ? 'bg-green-600' : 'bg-gray-600'} relative cursor-pointer`}>
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${item.enabled ? 'right-0.5' : 'left-0.5'}`} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'System Alerts', enabled: true },
              { label: 'Security Alerts', enabled: true },
              { label: 'Performance Alerts', enabled: true },
              { label: 'User Activity Alerts', enabled: false }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-white/80">{item.label}</span>
                <div className={`w-12 h-6 rounded-full ${item.enabled ? 'bg-red-600' : 'bg-gray-600'} relative cursor-pointer`}>
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${item.enabled ? 'right-0.5' : 'left-0.5'}`} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Activity Logs Page
  const renderActivityLogs = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">System Activity Logs</h2>
          <p className="text-white/60">Monitor all system activities and user actions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className={`${dashboardTheme.card} border-l-4 border-l-blue-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">15,247</div>
            <p className="text-xs text-white/60 mt-1">Last 30 days</p>
          </CardContent>
        </Card>
        <Card className={`${dashboardTheme.card} border-l-4 border-l-green-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Success</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">14,892</div>
            <p className="text-xs text-green-400 mt-1">97.7% success rate</p>
          </CardContent>
        </Card>
        <Card className={`${dashboardTheme.card} border-l-4 border-l-yellow-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">298</div>
            <p className="text-xs text-white/60 mt-1">Need review</p>
          </CardContent>
        </Card>
        <Card className={`${dashboardTheme.card} border-l-4 border-l-red-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">57</div>
            <p className="text-xs text-red-400 mt-1">0.4% error rate</p>
          </CardContent>
        </Card>
      </div>

      <Card className={dashboardTheme.card}>
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div 
                key={activity.id} 
                className={`p-4 rounded-lg border-l-4 ${
                  activity.severity === 'success' ? 'bg-green-500/10 border-l-green-500' :
                  activity.severity === 'warning' ? 'bg-yellow-500/10 border-l-yellow-500' :
                  activity.severity === 'error' ? 'bg-red-500/10 border-l-red-500' :
                  'bg-blue-500/10 border-l-blue-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${
                        activity.severity === 'success' ? 'bg-green-600' :
                        activity.severity === 'warning' ? 'bg-yellow-600' :
                        activity.severity === 'error' ? 'bg-red-600' :
                        'bg-blue-600'
                      }`}>
                        {activity.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-white/60">{activity.timestamp}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">{activity.action}</h4>
                    <p className="text-xs text-white/70">User: {activity.user} • {activity.details}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Analytics Page
  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Platform Analytics</h2>
          <p className="text-white/60">Deep insights into platform performance and usage</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 Days
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">
            <Download className="h-4 w-4 mr-2" />
            Export Analytics
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className={`${dashboardTheme.card} border-l-4 border-l-blue-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">API Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {(systemMetrics.apiCalls / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-green-400 mt-1">+12.5% this month</p>
          </CardContent>
        </Card>
        <Card className={`${dashboardTheme.card} border-l-4 border-l-green-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemMetrics.avgResponseTime}ms</div>
            <p className="text-xs text-green-400 mt-1">-8ms from last week</p>
          </CardContent>
        </Card>
        <Card className={`${dashboardTheme.card} border-l-4 border-l-purple-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">User Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">87.3%</div>
            <p className="text-xs text-green-400 mt-1">+3.2% increase</p>
          </CardContent>
        </Card>
        <Card className={`${dashboardTheme.card} border-l-4 border-l-orange-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">23.7%</div>
            <p className="text-xs text-white/60 mt-1">Farmer to policy</p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Analytics */}
      <Card className={dashboardTheme.card}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Platform Usage Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#F9FAFB' }}
                />
                <Legend />
                <Bar dataKey="farmers" fill="#10B981" name="Farmers" />
                <Bar dataKey="assessors" fill="#F59E0B" name="Assessors" />
                <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={3} name="Total Users" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Feature Usage */}
        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Feature Usage Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { feature: "Policy Creation", usage: 2450, percentage: 94.5 },
                { feature: "Risk Assessment", usage: 1867, percentage: 72.1 },
                { feature: "Claims Processing", usage: 1234, percentage: 47.6 },
                { feature: "Crop Monitoring", usage: 987, percentage: 38.1 },
                { feature: "Payment Integration", usage: 2156, percentage: 83.2 }
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/80">{item.feature}</span>
                    <span className="font-medium text-white">{item.usage} uses ({item.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Activity Heatmap */}
        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              User Activity by Hour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { time: "00:00 - 04:00", activity: 12 },
                { time: "04:00 - 08:00", activity: 45 },
                { time: "08:00 - 12:00", activity: 89 },
                { time: "12:00 - 16:00", activity: 76 },
                { time: "16:00 - 20:00", activity: 67 },
                { time: "20:00 - 24:00", activity: 34 }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-xs text-white/70 w-24">{item.time}</span>
                  <div className="flex-1 h-8 bg-gray-800/50 rounded-lg overflow-hidden">
                    <div 
                      className={`h-full flex items-center px-2 ${
                        item.activity > 70 ? 'bg-green-500/30' :
                        item.activity > 40 ? 'bg-blue-500/30' :
                        'bg-gray-500/30'
                      }`}
                      style={{ width: `${item.activity}%` }}
                    >
                      <span className="text-xs font-medium text-white">{item.activity}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographical Distribution */}
      <Card className={dashboardTheme.card}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            User Distribution by Province
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            {[
              { province: "Northern", users: 1250, percentage: 15.7, color: "bg-blue-500" },
              { province: "Southern", users: 2100, percentage: 26.4, color: "bg-green-500" },
              { province: "Eastern", users: 1800, percentage: 22.6, color: "bg-purple-500" },
              { province: "Western", users: 1950, percentage: 24.5, color: "bg-orange-500" },
              { province: "Kigali", users: 850, percentage: 10.8, color: "bg-red-500" }
            ].map((item, idx) => (
              <Card key={idx} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className={`w-full h-2 ${item.color} rounded-full mb-3`} />
                  <div className="text-sm font-medium text-white">{item.province}</div>
                  <div className="text-2xl font-bold text-white mt-1">{item.users.toLocaleString()}</div>
                  <div className="text-xs text-white/60 mt-1">{item.percentage}% of total</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Performance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative w-40 h-40">
                <svg className="transform -rotate-90 w-40 h-40">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#374151"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#10B981"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - 0.94)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold text-white">94</span>
                  <span className="text-sm text-white/60">Excellent</span>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-xs text-white/70">
              <div className="flex justify-between">
                <span>First Contentful Paint</span>
                <span className="text-green-400">1.2s</span>
              </div>
              <div className="flex justify-between">
                <span>Time to Interactive</span>
                <span className="text-green-400">2.8s</span>
              </div>
              <div className="flex justify-between">
                <span>Speed Index</span>
                <span className="text-green-400">3.1s</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Retention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/80">Daily Active Users</span>
                  <span className="font-medium text-white">68.5%</span>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '68.5%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/80">Weekly Active Users</span>
                  <span className="font-medium text-white">84.2%</span>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '84.2%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/80">Monthly Active Users</span>
                  <span className="font-medium text-white">91.8%</span>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: '91.8%' }} />
                </div>
              </div>
              <div className="pt-3 border-t border-gray-700">
                <div className="flex justify-between">
                  <span className="text-sm text-white/80">Churn Rate</span>
                  <span className="text-sm font-medium text-green-400">3.2%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Growth Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { metric: "User Growth", value: "+18.5%", trend: "up", color: "text-green-400" },
                { metric: "Revenue Growth", value: "+22.3%", trend: "up", color: "text-green-400" },
                { metric: "Policy Adoption", value: "+15.7%", trend: "up", color: "text-green-400" },
                { metric: "Session Duration", value: "+8.2%", trend: "up", color: "text-green-400" },
                { metric: "Bounce Rate", value: "-5.1%", trend: "down", color: "text-green-400" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                  <span className="text-sm text-white/80">{item.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${item.color}`}>{item.value}</span>
                    <TrendingUp className={`h-4 w-4 ${item.color}`} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Database Management Page
  const renderDatabase = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Database Management</h2>
          <p className="text-white/60">Manage database operations and backups</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">
            <Settings className="h-4 w-4 mr-2" />
            DB Settings
          </Button>
        </div>
      </div>

      {/* Database Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className={`${dashboardTheme.card} border-l-4 border-l-blue-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Database Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemMetrics.dbSize} GB</div>
            <p className="text-xs text-white/60 mt-1">+2.3 GB this month</p>
          </CardContent>
        </Card>
        <Card className={`${dashboardTheme.card} border-l-4 border-l-green-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1.2M</div>
            <p className="text-xs text-green-400 mt-1">+45K this week</p>
          </CardContent>
        </Card>
        <Card className={`${dashboardTheme.card} border-l-4 border-l-purple-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Active Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">234</div>
            <p className="text-xs text-white/60 mt-1">Real-time</p>
          </CardContent>
        </Card>
        <Card className={`${dashboardTheme.card} border-l-4 border-l-orange-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Query Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">45ms</div>
            <p className="text-xs text-green-400 mt-1">Avg query time</p>
          </CardContent>
        </Card>
      </div>

      {/* Database Tables */}
      <Card className={dashboardTheme.card}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Tables Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-white/80 font-medium">Table Name</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium">Records</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium">Size</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium">Growth</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium">Last Updated</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { table: "users", records: 8450, size: "245 MB", growth: "+2.3%", updated: "2 min ago" },
                  { table: "policies", records: 5900, size: "892 MB", growth: "+5.1%", updated: "5 min ago" },
                  { table: "claims", records: 305, size: "128 MB", growth: "+1.8%", updated: "10 min ago" },
                  { table: "assessments", records: 2847, size: "456 MB", growth: "+3.2%", updated: "15 min ago" },
                  { table: "farmers", records: 7950, size: "512 MB", growth: "+4.5%", updated: "20 min ago" },
                  { table: "insurers", records: 4, size: "2 MB", growth: "0%", updated: "1 day ago" },
                  { table: "transactions", records: 15678, size: "1.2 GB", growth: "+8.7%", updated: "1 min ago" },
                  { table: "activity_logs", records: 234567, size: "3.8 GB", growth: "+12.5%", updated: "30 sec ago" }
                ].map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4 font-medium text-white">{item.table}</td>
                    <td className="py-3 px-4 text-white">{item.records.toLocaleString()}</td>
                    <td className="py-3 px-4 text-white">{item.size}</td>
                    <td className="py-3 px-4">
                      <Badge className={
                        parseFloat(item.growth) > 5 ? 'bg-green-600' :
                        parseFloat(item.growth) > 0 ? 'bg-blue-600' :
                        'bg-gray-600'
                      }>
                        {item.growth}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-white/60 text-sm">{item.updated}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                          <Download className="h-4 w-4" />
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

      <div className="grid gap-6 md:grid-cols-2">
        {/* Backup Management */}
        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Backup Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-400">Last Backup</span>
                <Badge className="bg-green-600">Success</Badge>
              </div>
              <p className="text-xs text-white/60">March 15, 2024 at 02:00 AM</p>
              <p className="text-xs text-white/60 mt-1">Size: 15.2 GB • Duration: 12 minutes</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white/80">Backup Schedule</h4>
              {[
                { type: "Full Backup", schedule: "Daily at 02:00 AM", status: "active" },
                { type: "Incremental", schedule: "Every 6 hours", status: "active" },
                { type: "Transaction Log", schedule: "Every hour", status: "active" }
              ].map((backup, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-white">{backup.type}</div>
                    <div className="text-xs text-white/60">{backup.schedule}</div>
                  </div>
                  <Badge className="bg-green-600">{backup.status}</Badge>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Upload className="h-4 w-4 mr-2" />
                Backup Now
              </Button>
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                <Download className="h-4 w-4 mr-2" />
                Restore
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Database Performance */}
        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Database Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/80">Query Cache Hit Ratio</span>
                <span className="font-medium text-green-400">96.8%</span>
              </div>
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '96.8%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/80">Connection Pool Usage</span>
                <span className="font-medium text-blue-400">68.5%</span>
              </div>
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '68.5%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/80">Index Efficiency</span>
                <span className="font-medium text-purple-400">94.2%</span>
              </div>
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: '94.2%' }} />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/70">Avg Query Time</span>
                <span className="font-medium text-white">45ms</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/70">Slow Queries (&gt;1s)</span>
                <span className="font-medium text-yellow-400">3</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/70">Deadlocks</span>
                <span className="font-medium text-green-400">0</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/70">Replication Lag</span>
                <span className="font-medium text-green-400">0ms</span>
              </div>
            </div>

            <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800 mt-4">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Detailed Metrics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Database Operations */}
      <Card className={dashboardTheme.card}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Database Operations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button className="bg-green-600 hover:bg-green-700 h-auto py-4 flex-col">
              <Database className="h-6 w-6 mb-2" />
              <span>Optimize Tables</span>
              <span className="text-xs mt-1 opacity-80">Improve performance</span>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 h-auto py-4 flex-col">
              <RefreshCw className="h-6 w-6 mb-2" />
              <span>Rebuild Indexes</span>
              <span className="text-xs mt-1 opacity-80">Update all indexes</span>
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 h-auto py-4 flex-col">
              <Trash2 className="h-6 w-6 mb-2" />
              <span>Clear Cache</span>
              <span className="text-xs mt-1 opacity-80">Reset query cache</span>
            </Button>
            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 h-auto py-4 flex-col">
              <Download className="h-6 w-6 mb-2" />
              <span>Export Schema</span>
              <span className="text-xs mt-1 opacity-80">Database structure</span>
            </Button>
            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 h-auto py-4 flex-col">
              <Upload className="h-6 w-6 mb-2" />
              <span>Import Data</span>
              <span className="text-xs mt-1 opacity-80">Bulk import</span>
            </Button>
            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 h-auto py-4 flex-col">
              <Eye className="h-6 w-6 mb-2" />
              <span>View Queries</span>
              <span className="text-xs mt-1 opacity-80">Active queries</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Security Management Page
  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Security & Access Control</h2>
          <p className="text-white/60">Manage platform security and user permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">
            <Download className="h-4 w-4 mr-2" />
            Security Report
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className={`${dashboardTheme.card} border-l-4 border-l-green-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Security Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">98.5%</div>
            <p className="text-xs text-green-400 mt-1">Excellent</p>
          </CardContent>
        </Card>
        <Card className={`${dashboardTheme.card} border-l-4 border-l-blue-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Active 2FA Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">7,890</div>
            <p className="text-xs text-white/60 mt-1">93.4% enabled</p>
          </CardContent>
        </Card>
        <Card className={`${dashboardTheme.card} border-l-4 border-l-yellow-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Failed Logins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">23</div>
            <p className="text-xs text-white/60 mt-1">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card className={`${dashboardTheme.card} border-l-4 border-l-red-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Blocked IPs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-xs text-red-400 mt-1">Auto-blocked</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Features */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Features Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { feature: "SSL/TLS Encryption", status: "enabled", strength: "Strong" },
              { feature: "Two-Factor Authentication", status: "enabled", strength: "Strong" },
              { feature: "Password Encryption", status: "enabled", strength: "Strong" },
              { feature: "Session Management", status: "enabled", strength: "Good" },
              { feature: "IP Whitelisting", status: "enabled", strength: "Good" },
              { feature: "Rate Limiting", status: "enabled", strength: "Strong" },
              { feature: "CORS Protection", status: "enabled", strength: "Strong" },
              { feature: "SQL Injection Prevention", status: "enabled", strength: "Strong" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-white">{item.feature}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={
                    item.strength === 'Strong' ? 'bg-green-600' :
                    item.strength === 'Good' ? 'bg-blue-600' :
                    'bg-yellow-600'
                  }>
                    {item.strength}
                  </Badge>
                  <Badge className="bg-green-600">{item.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: "warning", title: "Multiple failed login attempts", ip: "192.168.1.45", time: "5 min ago" },
                { type: "info", title: "New device login detected", user: "john.uwase@example.com", time: "15 min ago" },
                { type: "success", title: "Security scan completed", details: "No vulnerabilities found", time: "1 hour ago" },
                { type: "warning", title: "Unusual API activity", details: "High request rate from IP", time: "2 hours ago" }
              ].map((alert, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.type === 'warning' ? 'bg-yellow-500/10 border-l-yellow-500' :
                    alert.type === 'info' ? 'bg-blue-500/10 border-l-blue-500' :
                    'bg-green-500/10 border-l-green-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`${
                          alert.type === 'warning' ? 'bg-yellow-600' :
                          alert.type === 'info' ? 'bg-blue-600' :
                          'bg-green-600'
                        }`}>
                          {alert.type.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-white/60">{alert.time}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-white">{alert.title}</h4>
                      {alert.ip && <p className="text-xs text-white/70 mt-1">IP: {alert.ip}</p>}
                      {alert.user && <p className="text-xs text-white/70 mt-1">User: {alert.user}</p>}
                      {alert.details && <p className="text-xs text-white/70 mt-1">{alert.details}</p>}
                    </div>
                    <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Access Control */}
      <Card className={dashboardTheme.card}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Role-Based Access Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-white/80 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium">Users</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium">Permissions</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium">Last Modified</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { role: "Super Admin", users: 3, permissions: ["All"], modified: "2024-01-15" },
                  { role: "Farmer", users: 7950, permissions: ["View Policies", "File Claims", "Update Profile"], modified: "2024-03-10" },
                  { role: "Assessor", users: 24, permissions: ["View Assessments", "Submit Reports", "Update Status"], modified: "2024-03-12" },
                  { role: "Insurer", users: 4, permissions: ["Manage Policies", "Process Claims", "View Analytics"], modified: "2024-03-14" },
                  { role: "Government", users: 2, permissions: ["View All Data", "Generate Reports", "Export Data"], modified: "2024-03-01" }
                ].map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4 font-medium text-white">{item.role}</td>
                    <td className="py-3 px-4 text-white">{item.users.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {item.permissions.slice(0, 2).map((perm, pIdx) => (
                          <Badge key={pIdx} variant="outline" className="text-xs border-gray-600">
                            {perm}
                          </Badge>
                        ))}
                        {item.permissions.length > 2 && (
                          <Badge variant="outline" className="text-xs border-gray-600">
                            +{item.permissions.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white/60 text-sm">{item.modified}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                          <Edit className="h-4 w-4" />
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

      {/* Security Actions */}
      <Card className={dashboardTheme.card}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Security Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button className="bg-red-600 hover:bg-red-700 h-auto py-4 flex-col">
              <Lock className="h-6 w-6 mb-2" />
              <span>Force Password Reset</span>
              <span className="text-xs mt-1 opacity-80">All users</span>
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 h-auto py-4 flex-col">
              <Shield className="h-6 w-6 mb-2" />
              <span>Run Security Scan</span>
              <span className="text-xs mt-1 opacity-80">Full system audit</span>
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 h-auto py-4 flex-col">
              <WifiOff className="h-6 w-6 mb-2" />
              <span>Revoke Sessions</span>
              <span className="text-xs mt-1 opacity-80">End all sessions</span>
            </Button>
            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 h-auto py-4 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              <span>View Audit Logs</span>
              <span className="text-xs mt-1 opacity-80">Security events</span>
            </Button>
            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 h-auto py-4 flex-col">
              <Key className="h-6 w-6 mb-2" />
              <span>Manage API Keys</span>
              <span className="text-xs mt-1 opacity-80">Access tokens</span>
            </Button>
            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 h-auto py-4 flex-col">
              <Globe className="h-6 w-6 mb-2" />
              <span>IP Whitelist</span>
              <span className="text-xs mt-1 opacity-80">Manage IPs</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Login History */}
      <Card className={dashboardTheme.card}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Login Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { user: "admin@nexus.com", ip: "192.168.1.100", location: "Kigali, Rwanda", time: "2 min ago", status: "success" },
              { user: "john.uwase@example.com", ip: "192.168.1.101", location: "Musanze, Rwanda", time: "15 min ago", status: "success" },
              { user: "unknown", ip: "45.123.45.67", location: "Unknown", time: "30 min ago", status: "failed" },
              { user: "alice.m@example.com", ip: "192.168.1.102", location: "Kigali, Rwanda", time: "1 hour ago", status: "success" },
              { user: "david.n@insurance.rw", ip: "192.168.1.103", location: "Huye, Rwanda", time: "2 hours ago", status: "success" }
            ].map((login, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    login.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <div className="text-sm font-medium text-white">{login.user}</div>
                    <div className="text-xs text-white/60">
                      {login.ip} • {login.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={login.status === 'success' ? 'bg-green-600' : 'bg-red-600'}>
                    {login.status}
                  </Badge>
                  <div className="text-xs text-white/60 mt-1">{login.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Settings Page
  const renderSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Admin Settings</h2>
          <p className="text-white/60">Configure your admin preferences</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-white/80 block mb-2">Admin ID</label>
              <div className="p-3 bg-gray-800/50 rounded-lg text-white">{adminId}</div>
            </div>
            <div>
              <label className="text-sm text-white/80 block mb-2">Name</label>
              <div className="p-3 bg-gray-800/50 rounded-lg text-white">{adminName}</div>
            </div>
            <div>
              <label className="text-sm text-white/80 block mb-2">Role</label>
              <Badge className="bg-red-600">Super Administrator</Badge>
            </div>
            <div>
              <label className="text-sm text-white/80 block mb-2">Last Login</label>
              <div className="p-3 bg-gray-800/50 rounded-lg text-white/70 text-sm">
                March 15, 2024 at 08:00 AM
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-red-600 hover:bg-red-700">
              <Key className="h-4 w-4 mr-2" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800">
              <Shield className="h-4 w-4 mr-2" />
              Enable 2FA
            </Button>
            <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800">
              <Eye className="h-4 w-4 mr-2" />
              View Login History
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Render page based on active selection
  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return renderDashboard();
      case "users": return renderUserManagement();
      case "financial": return renderFinancialManagement();
      case "analytics": return renderAnalytics();
      case "database": return renderDatabase();
      case "security": return renderSecurity();
      case "system": return renderSystemConfig();
      case "logs": return renderActivityLogs();
      case "settings": return renderSettings();
      default: return renderDashboard();
    }
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "users", label: "User Management", icon: Users },
    { id: "financial", label: "Financial", icon: DollarSign },
    { id: "commission", label: "Commission", icon: Percent },
    { id: "system", label: "System Config", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
    { id: "logs", label: "Activity Logs", icon: FileText },
    { id: "database", label: "Database", icon: Database },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <DashboardLayout
      userType="admin"
      userId={adminId}
      userName={adminName}
      navigationItems={navigationItems}
      activePage={activePage}
      onPageChange={setActivePage}
      onLogout={() => {}}
    >
      {renderPage()}
    </DashboardLayout>
  );
};
