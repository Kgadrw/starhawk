import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { isAdmin, logout as authLogout, getUserId, getPhoneNumber, getEmail } from "@/services/authAPI";
import { getAllUsers, deactivateUser, updateUser, getUserById, createUser } from "@/services/usersAPI";
import { getSystemStatistics, getPolicyOverview, getClaimStatistics } from "@/services/adminApi";
import { createPolicy, getPolicies, getPolicyById, updatePolicy, deletePolicy } from "@/services/policiesApi";
import { createClaim, getClaims, getClaimById, updateClaim, deleteClaim } from "@/services/claimsApi";
import assessmentsApiService from "@/services/assessmentsApi";
import { getFarms } from "@/services/farmsApi";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Bell,
  Plus,
  X,
  Save,
  Loader2,
  FileCheck,
  AlertCircle
} from "lucide-react";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [adminId] = useState(getUserId() || "ADMIN-001");
  const [adminName] = useState(getEmail() || getPhoneNumber() || "System Administrator");

  // Route protection - check if user is admin
  useEffect(() => {
    if (!isAdmin()) {
      // Redirect to login if not admin
      navigate("/admin-login");
    }
  }, [navigate]);

  // Load admin statistics
  const loadAdminStatistics = async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const [stats, policies, claims] = await Promise.all([
        getSystemStatistics(),
        getPolicyOverview(),
        getClaimStatistics(),
      ]);

      // Handle different response structures
      setSystemStats(stats.data || stats);
      setPolicyOverview(policies.data || policies);
      setClaimStats(claims.data || claims);
    } catch (err: any) {
      console.error('Failed to load admin statistics:', err);
      setStatsError(err.message || 'Failed to load statistics');
      toast({
        title: "Error",
        description: err.message || 'Failed to load admin statistics',
        variant: "destructive",
      });
    } finally {
      setStatsLoading(false);
    }
  };

  // Load statistics when dashboard is active
  useEffect(() => {
    if (activePage === "dashboard") {
      loadAdminStatistics();
    }
  }, [activePage]);

  // Load assessments when assessments page is active
  useEffect(() => {
    if (activePage === "assessments") {
      loadAssessments();
      loadFarmsForAssessment();
      loadAssessors();
    }
  }, [activePage]);

  // Handle logout
  const handleLogout = () => {
    authLogout();
    navigate("/admin-login");
  };

  // User Management State
  const { toast } = useToast();
  const [systemUsers, setSystemUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);

  // Admin API State
  const [systemStats, setSystemStats] = useState<any | null>(null);
  const [policyOverview, setPolicyOverview] = useState<any | null>(null);
  const [claimStats, setClaimStats] = useState<any | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Policies Management State
  const [policies, setPolicies] = useState<any[]>([]);
  const [policiesLoading, setPoliciesLoading] = useState(false);
  const [policiesError, setPoliciesError] = useState<string | null>(null);
  const [policySearchQuery, setPolicySearchQuery] = useState("");
  const [policyStatusFilter, setPolicyStatusFilter] = useState<string>("all");
  const [showPolicyDialog, setShowPolicyDialog] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<any | null>(null);
  const [deletingPolicyId, setDeletingPolicyId] = useState<string | null>(null);
  const [policyFormData, setPolicyFormData] = useState({
    farmerId: "",
    cropType: "",
    coverageAmount: "",
    premium: "",
    startDate: "",
    endDate: "",
    status: "active",
    notes: "",
  });

  // Claims Management State
  const [claims, setClaims] = useState<any[]>([]);
  const [claimsLoading, setClaimsLoading] = useState(false);
  const [claimsError, setClaimsError] = useState<string | null>(null);
  const [claimSearchQuery, setClaimSearchQuery] = useState("");
  const [claimStatusFilter, setClaimStatusFilter] = useState<string>("all");
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [editingClaim, setEditingClaim] = useState<any | null>(null);
  const [deletingClaimId, setDeletingClaimId] = useState<string | null>(null);
  const [claimFormData, setClaimFormData] = useState({
    farmerId: "",
    policyId: "",
    cropType: "",
    damageType: "",
    amount: "",
    description: "",
    fieldId: "",
    status: "pending",
  });

  // Assessments Management State
  const [assessments, setAssessments] = useState<any[]>([]);
  const [assessmentsLoading, setAssessmentsLoading] = useState(false);
  const [assessmentsError, setAssessmentsError] = useState<string | null>(null);
  const [assessmentSearchQuery, setAssessmentSearchQuery] = useState("");
  const [assessmentStatusFilter, setAssessmentStatusFilter] = useState<string>("all");
  const [showAssessmentDialog, setShowAssessmentDialog] = useState(false);
  const [creatingAssessment, setCreatingAssessment] = useState(false);
  const [farms, setFarms] = useState<any[]>([]);
  const [farmsLoading, setFarmsLoading] = useState(false);
  const [assessors, setAssessors] = useState<any[]>([]);
  const [assessmentFormData, setAssessmentFormData] = useState({
    farmId: "",
    assessorId: "",
  });
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [editUserData, setEditUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
    sex: "",
    active: true,
    farmerProfile: {
      farmProvince: "",
      farmDistrict: "",
      farmSector: "",
      farmCell: "",
      farmVillage: ""
    },
    assessorProfile: {
      specialization: "",
      experienceYears: 0,
      profilePhotoUrl: "",
      bio: "",
      address: ""
    },
    insurerProfile: {
      companyName: "",
      contactPerson: "",
      website: "",
      address: "",
      companyDescription: "",
      licenseNumber: "",
      registrationDate: "",
      companyLogoUrl: ""
    }
  });
  const [newUserData, setNewUserData] = useState({
    // Basic fields
    nationalId: "",
    email: "",
    phoneNumber: "",
    role: "FARMER",
    firstName: "",
    lastName: "",
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
    sex: "",
    // Farmer Profile
    farmerProfile: {
      farmProvince: "",
      farmDistrict: "",
      farmSector: "",
      farmCell: "",
      farmVillage: ""
    },
    // Assessor Profile
    assessorProfile: {
      specialization: "",
      experienceYears: 0,
      profilePhotoUrl: "",
      bio: "",
      address: ""
    },
    // Insurer Profile
    insurerProfile: {
      companyName: "",
      contactPerson: "",
      website: "",
      address: "",
      companyDescription: "",
      licenseNumber: "",
      registrationDate: "",
      companyLogoUrl: ""
    }
  });

  // Computed User Statistics from real data
  const userStats = {
    total: systemUsers.length,
    active: systemUsers.filter(u => u.active !== false).length,
    inactive: systemUsers.filter(u => u.active === false).length,
    newThisMonth: systemUsers.filter(u => {
      if (!u.createdAt) return false;
      const createdDate = new Date(u.createdAt);
      const now = new Date();
      return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
    }).length,
    farmers: systemUsers.filter(u => u.role === 'FARMER' || u.role === 'Farmer').length,
    assessors: systemUsers.filter(u => u.role === 'ASSESSOR' || u.role === 'Assessor').length,
    insurers: systemUsers.filter(u => u.role === 'INSURER' || u.role === 'Insurer').length,
    government: systemUsers.filter(u => u.role === 'GOVERNMENT' || u.role === 'Government').length,
    admins: systemUsers.filter(u => u.role === 'ADMIN' || u.role === 'Admin').length
  };

  // Load users from API
  const loadUsers = async () => {
    if (activePage !== "users") return; // Only load when on users page
    
    setUsersLoading(true);
    setUsersError(null);
    try {
      const response: any = await getAllUsers();
      console.log('Users API response:', response); // Debug log
      console.log('Response type:', typeof response);
      console.log('Is array:', Array.isArray(response));
      if (response && typeof response === 'object') {
        console.log('Response keys:', Object.keys(response));
      }
      
      // Handle different response structures
      let usersData: any[] = [];
      
      // Check if response is directly an array
      if (Array.isArray(response)) {
        usersData = response;
      } else if (response && typeof response === 'object') {
        // Try multiple possible response structures
        // Common patterns: { data: [...] }, { users: [...] }, { data: { users: [...] } }, etc.
        
        // First check if it's a direct property
        if (Array.isArray(response.users)) {
          usersData = response.users;
        } else if (Array.isArray(response.data)) {
          usersData = response.data;
        } else if (Array.isArray(response.results)) {
          usersData = response.results;
        } else if (Array.isArray(response.items)) {
          usersData = response.items;
        } else if (Array.isArray(response.list)) {
          usersData = response.list;
        }
        // Then check nested structures
        else if (response.data) {
          if (Array.isArray(response.data)) {
            usersData = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            usersData = response.data.data;
          } else if (response.data.users && Array.isArray(response.data.users)) {
            usersData = response.data.users;
          } else if (response.data.results && Array.isArray(response.data.results)) {
            usersData = response.data.results;
          } else if (response.data.items && Array.isArray(response.data.items)) {
            usersData = response.data.items;
          } else if (response.data.list && Array.isArray(response.data.list)) {
            usersData = response.data.list;
          }
        }
        // Try to find any array property
        else {
          const keys = Object.keys(response);
          for (const key of keys) {
            if (Array.isArray(response[key])) {
              console.log(`Found array in property: ${key}`, response[key]);
              usersData = response[key];
              break;
            }
          }
        }
      }
      
      // Ensure usersData is an array before mapping
      if (!Array.isArray(usersData)) {
        console.warn('Users data is not an array. Response structure:', JSON.stringify(response, null, 2));
        console.warn('Response keys:', response ? Object.keys(response) : 'No response');
        usersData = [];
      }
      
      console.log('Extracted usersData:', usersData.length, 'users');
      
      // Map API response to expected format
      const mappedUsers = usersData.map((user: any) => ({
        id: user._id || user.id || '',
        userId: user._id || user.id || '',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'Unknown',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        role: user.role || 'Farmer',
        status: user.active !== false ? 'active' : 'inactive',
        active: user.active !== false,
        lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never',
        region: user.region || user.location || 'Unknown',
        joinDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '',
        createdAt: user.createdAt || ''
      }));
      
      setSystemUsers(mappedUsers);
    } catch (err: any) {
      console.error('Failed to load users:', err);
      setUsersError(err.message || 'Failed to load users. Please try again.');
    } finally {
      setUsersLoading(false);
    }
  };

  // Load users when switching to users page
  useEffect(() => {
    if (activePage === "users") {
      loadUsers();
    }
  }, [activePage]);

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
      {/* Loading State */}
      {statsLoading && (
        <Card className={dashboardTheme.card}>
          <CardContent className="p-8 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
            <p className="text-white/60">Loading statistics...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {statsError && !statsLoading && (
        <Card className={`${dashboardTheme.card} border-l-4 border-l-red-500`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <p className="text-red-400">{statsError}</p>
              </div>
              <Button
                onClick={loadAdminStatistics}
                variant="outline"
                size="sm"
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className={`${dashboardTheme.card} border-l-4 border-l-blue-500`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Total Users</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {systemStats?.totalUsers || userStats.total.toLocaleString()}
            </div>
            <p className="text-xs text-white/60 mt-1">
              <span className="text-green-500">+{systemStats?.newUsersThisMonth || userStats.newThisMonth}</span> this month
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
              RWF {systemStats?.monthlyRevenue ? (systemStats.monthlyRevenue / 1000000).toFixed(1) : (financialData.monthlyRevenue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-white/60 mt-1">
              <span className="text-green-500">+{systemStats?.revenueGrowth || financialData.growthRate}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className={`${dashboardTheme.card} border-l-4 border-l-purple-500`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/80">System Health</CardTitle>
            <Activity className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {systemStats?.uptime || systemMetrics.uptime}%
            </div>
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
            <div className="text-3xl font-bold text-white">
              {systemStats?.activeSessions || systemMetrics.activeConnections}
            </div>
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

  // Handle deactivate user
  const handleDeactivateUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to deactivate this user?")) {
      return;
    }

    setUpdatingUserId(userId);
    try {
      await deactivateUser(userId);
      toast({
        title: "Success",
        description: "User deactivated successfully",
      });
      // Reload users
      await loadUsers();
    } catch (err: any) {
      console.error('Failed to deactivate user:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to deactivate user",
        variant: "destructive",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Handle view user details - navigate to user details page
  const handleViewUser = (userId: string) => {
    navigate(`/admin-dashboard/users/${userId}`);
  };

  // Handle edit user button click
  const handleEditUser = async (userId: string) => {
    await handleViewUser(userId);
  };

  // Handle update user
  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    const userId = selectedUser._id || selectedUser.id || selectedUser.userId;
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID not found",
        variant: "destructive",
      });
      return;
    }

    setEditingUser(true);
    try {
      const updateData: any = {};

      // Add basic fields if they exist
      if (editUserData.firstName) updateData.firstName = editUserData.firstName;
      if (editUserData.lastName) updateData.lastName = editUserData.lastName;
      if (editUserData.email) updateData.email = editUserData.email;
      if (editUserData.phoneNumber) updateData.phoneNumber = editUserData.phoneNumber;
      if (editUserData.province) updateData.province = editUserData.province;
      if (editUserData.district) updateData.district = editUserData.district;
      if (editUserData.sector) updateData.sector = editUserData.sector;
      if (editUserData.cell) updateData.cell = editUserData.cell;
      if (editUserData.village) updateData.village = editUserData.village;
      if (editUserData.sex) updateData.sex = editUserData.sex;
      updateData.active = editUserData.active;

      // Add profile data based on role
      const userRole = selectedUser.role;
      if (userRole === 'FARMER' && editUserData.farmerProfile) {
        updateData.farmerProfile = editUserData.farmerProfile;
      } else if (userRole === 'ASSESSOR' && editUserData.assessorProfile) {
        updateData.assessorProfile = editUserData.assessorProfile;
      } else if (userRole === 'INSURER' && editUserData.insurerProfile) {
        updateData.insurerProfile = editUserData.insurerProfile;
      }

      console.log('Updating user with data:', JSON.stringify(updateData, null, 2));
      await updateUser(userId, updateData);

      toast({
        title: "Success",
        description: "User updated successfully",
      });

      setShowEditUserDialog(false);
      setSelectedUser(null);
      await loadUsers();
    } catch (err: any) {
      console.error('Failed to update user:', err);
      toast({
        title: "Error Updating User",
        description: err.message || "Failed to update user. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setEditingUser(false);
    }
  };

  // Handle create new user
  const handleCreateUser = async () => {
    // Validate required fields
    if (!newUserData.nationalId || !newUserData.email || !newUserData.phoneNumber || !newUserData.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (National ID, Email, Phone Number, Role)",
        variant: "destructive",
      });
      return;
    }

    setCreatingUser(true);
    let userDataToSend: any = null;
    
    try {
      // API only accepts these 4 required fields for user creation
      // Other fields (firstName, lastName, profiles, etc.) should be added via update endpoint after creation
      userDataToSend = {
        nationalId: newUserData.nationalId,
        email: newUserData.email,
        phoneNumber: newUserData.phoneNumber,
        role: newUserData.role
      };

      console.log('Creating user with data:', JSON.stringify(userDataToSend, null, 2)); // Debug log
      
      const response = await createUser(userDataToSend);
      
      // Note: The API's update endpoint also rejects these fields, so we skip the update step
      // Additional fields would need to be added through separate profile-specific endpoints if available
      // For now, user is created with just the required fields
      console.log('User created successfully. Additional fields should be added via profile update endpoints if available.');
      
      toast({
        title: "Success",
        description: "User created successfully",
      });
      // Reset form
      setNewUserData({
        nationalId: "",
        email: "",
        phoneNumber: "",
        role: "FARMER",
        firstName: "",
        lastName: "",
        province: "",
        district: "",
        sector: "",
        cell: "",
        village: "",
        sex: "",
        farmerProfile: {
          farmProvince: "",
          farmDistrict: "",
          farmSector: "",
          farmCell: "",
          farmVillage: ""
        },
        assessorProfile: {
          specialization: "",
          experienceYears: 0,
          profilePhotoUrl: "",
          bio: "",
          address: ""
        },
        insurerProfile: {
          companyName: "",
          contactPerson: "",
          website: "",
          address: "",
          companyDescription: "",
          licenseNumber: "",
          registrationDate: "",
          companyLogoUrl: ""
        }
      });
      setShowAddUserDialog(false);
      // Reload users
      await loadUsers();
    } catch (err: any) {
      console.error('Failed to create user:', err);
      console.error('Error details:', err.message);
      if (userDataToSend) {
        console.error('User data that failed:', JSON.stringify(userDataToSend, null, 2));
      }
      
      // Show more detailed error message
      const errorMessage = err.message || "Failed to create user. Please check the console for details.";
      
      toast({
        title: "Error Creating User",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setCreatingUser(false);
    }
  };

  // Filter users based on search query
  const filteredUsers = systemUsers.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phoneNumber?.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query) ||
      user.region.toLowerCase().includes(query)
    );
  });

  // User Management Page
  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-white/60">Manage all platform users and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-gray-700 text-white hover:bg-gray-800"
            onClick={loadUsers}
            disabled={usersLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${usersLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
            <DialogTrigger asChild>
          <Button className="bg-red-600 hover:bg-red-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
            </DialogTrigger>
            <DialogContent className={`${dashboardTheme.card} border-gray-800 max-w-2xl max-h-[90vh] overflow-y-auto`}>
              <DialogHeader>
                <DialogTitle className="text-white text-2xl">Add New User</DialogTitle>
                <DialogDescription className="text-white/60 text-sm mt-2">
                  Create a new user account. Required fields are marked with *
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {/* Required Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nationalId" className="text-white">National ID *</Label>
                    <Input
                      id="nationalId"
                      value={newUserData.nationalId}
                      onChange={(e) => setNewUserData({ ...newUserData, nationalId: e.target.value })}
                      className={`${dashboardTheme.input} border-gray-700`}
                      placeholder="1199012345678901"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUserData.email}
                      onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                      className={`${dashboardTheme.input} border-gray-700`}
                      placeholder="user@example.com"
                      required
                    />
        </div>
      </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phoneNumber" className="text-white">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      value={newUserData.phoneNumber}
                      onChange={(e) => setNewUserData({ ...newUserData, phoneNumber: e.target.value })}
                      className={`${dashboardTheme.input} border-gray-700`}
                      placeholder="0721234567"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="role" className="text-white">Role *</Label>
                    <Select
                      value={newUserData.role}
                      onValueChange={(value) => setNewUserData({ ...newUserData, role: value })}
                    >
                      <SelectTrigger className={`${dashboardTheme.select}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={dashboardTheme.card}>
                        <SelectItem value="FARMER">FARMER</SelectItem>
                        <SelectItem value="ASSESSOR">ASSESSOR</SelectItem>
                        <SelectItem value="INSURER">INSURER</SelectItem>
                        <SelectItem value="GOVERNMENT">GOVERNMENT</SelectItem>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Optional Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-white">First Name</Label>
                    <Input
                      id="firstName"
                      value={newUserData.firstName}
                      onChange={(e) => setNewUserData({ ...newUserData, firstName: e.target.value })}
                      className={`${dashboardTheme.input} border-gray-700`}
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-white">Last Name</Label>
                    <Input
                      id="lastName"
                      value={newUserData.lastName}
                      onChange={(e) => setNewUserData({ ...newUserData, lastName: e.target.value })}
                      className={`${dashboardTheme.input} border-gray-700`}
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="province" className="text-white">Province</Label>
                    <Input
                      id="province"
                      value={newUserData.province}
                      onChange={(e) => setNewUserData({ ...newUserData, province: e.target.value })}
                      className={`${dashboardTheme.input} border-gray-700`}
                      placeholder="Province"
                    />
                  </div>
                  <div>
                    <Label htmlFor="district" className="text-white">District</Label>
                    <Input
                      id="district"
                      value={newUserData.district}
                      onChange={(e) => setNewUserData({ ...newUserData, district: e.target.value })}
                      className={`${dashboardTheme.input} border-gray-700`}
                      placeholder="District"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sector" className="text-white">Sector</Label>
                    <Input
                      id="sector"
                      value={newUserData.sector}
                      onChange={(e) => setNewUserData({ ...newUserData, sector: e.target.value })}
                      className={`${dashboardTheme.input} border-gray-700`}
                      placeholder="Sector"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cell" className="text-white">Cell</Label>
                    <Input
                      id="cell"
                      value={newUserData.cell}
                      onChange={(e) => setNewUserData({ ...newUserData, cell: e.target.value })}
                      className={`${dashboardTheme.input} border-gray-700`}
                      placeholder="Cell"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="village" className="text-white">Village</Label>
                    <Input
                      id="village"
                      value={newUserData.village}
                      onChange={(e) => setNewUserData({ ...newUserData, village: e.target.value })}
                      className={`${dashboardTheme.input} border-gray-700`}
                      placeholder="Village"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sex" className="text-white">Sex</Label>
                    <Select
                      value={newUserData.sex}
                      onValueChange={(value) => setNewUserData({ ...newUserData, sex: value })}
                    >
                      <SelectTrigger className={`${dashboardTheme.select}`}>
                        <SelectValue placeholder="Select sex" />
                      </SelectTrigger>
                      <SelectContent className={dashboardTheme.card}>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Role-Specific Profile Fields */}
                {newUserData.role === 'FARMER' && (
                  <div className="border-t border-gray-800 pt-4 mt-4">
                    <h3 className="text-white font-semibold mb-4">Farmer Profile</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="farmProvince" className="text-white">Farm Province</Label>
                        <Input
                          id="farmProvince"
                          value={newUserData.farmerProfile.farmProvince}
                          onChange={(e) => setNewUserData({
                            ...newUserData,
                            farmerProfile: { ...newUserData.farmerProfile, farmProvince: e.target.value }
                          })}
                          className={`${dashboardTheme.input} border-gray-700`}
                          placeholder="Farm Province"
                        />
                      </div>
                      <div>
                        <Label htmlFor="farmDistrict" className="text-white">Farm District</Label>
                        <Input
                          id="farmDistrict"
                          value={newUserData.farmerProfile.farmDistrict}
                          onChange={(e) => setNewUserData({
                            ...newUserData,
                            farmerProfile: { ...newUserData.farmerProfile, farmDistrict: e.target.value }
                          })}
                          className={`${dashboardTheme.input} border-gray-700`}
                          placeholder="Farm District"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="farmSector" className="text-white">Farm Sector</Label>
                        <Input
                          id="farmSector"
                          value={newUserData.farmerProfile.farmSector}
                          onChange={(e) => setNewUserData({
                            ...newUserData,
                            farmerProfile: { ...newUserData.farmerProfile, farmSector: e.target.value }
                          })}
                          className={`${dashboardTheme.input} border-gray-700`}
                          placeholder="Farm Sector"
                        />
                      </div>
                      <div>
                        <Label htmlFor="farmCell" className="text-white">Farm Cell</Label>
                        <Input
                          id="farmCell"
                          value={newUserData.farmerProfile.farmCell}
                          onChange={(e) => setNewUserData({
                            ...newUserData,
                            farmerProfile: { ...newUserData.farmerProfile, farmCell: e.target.value }
                          })}
                          className={`${dashboardTheme.input} border-gray-700`}
                          placeholder="Farm Cell"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="farmVillage" className="text-white">Farm Village</Label>
                      <Input
                        id="farmVillage"
                        value={newUserData.farmerProfile.farmVillage}
                        onChange={(e) => setNewUserData({
                          ...newUserData,
                          farmerProfile: { ...newUserData.farmerProfile, farmVillage: e.target.value }
                        })}
                        className={`${dashboardTheme.input} border-gray-700`}
                        placeholder="Farm Village"
                      />
                    </div>
                  </div>
                )}

                {newUserData.role === 'ASSESSOR' && (
                  <div className="border-t border-gray-800 pt-4 mt-4">
                    <h3 className="text-white font-semibold mb-4">Assessor Profile</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="specialization" className="text-white">Specialization</Label>
                        <Input
                          id="specialization"
                          value={newUserData.assessorProfile.specialization}
                          onChange={(e) => setNewUserData({
                            ...newUserData,
                            assessorProfile: { ...newUserData.assessorProfile, specialization: e.target.value }
                          })}
                          className={`${dashboardTheme.input} border-gray-700`}
                          placeholder="e.g. Crop Assessment, Risk Evaluation"
                        />
                      </div>
                      <div>
                        <Label htmlFor="experienceYears" className="text-white">Experience Years</Label>
                        <Input
                          id="experienceYears"
                          type="number"
                          min="0"
                          value={newUserData.assessorProfile.experienceYears}
                          onChange={(e) => setNewUserData({
                            ...newUserData,
                            assessorProfile: { ...newUserData.assessorProfile, experienceYears: parseInt(e.target.value) || 0 }
                          })}
                          className={`${dashboardTheme.input} border-gray-700`}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="profilePhotoUrl" className="text-white">Profile Photo URL</Label>
                        <Input
                          id="profilePhotoUrl"
                          value={newUserData.assessorProfile.profilePhotoUrl}
                          onChange={(e) => setNewUserData({
                            ...newUserData,
                            assessorProfile: { ...newUserData.assessorProfile, profilePhotoUrl: e.target.value }
                          })}
                          className={`${dashboardTheme.input} border-gray-700`}
                          placeholder="https://example.com/photo.jpg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="assessorAddress" className="text-white">Address</Label>
                        <Input
                          id="assessorAddress"
                          value={newUserData.assessorProfile.address}
                          onChange={(e) => setNewUserData({
                            ...newUserData,
                            assessorProfile: { ...newUserData.assessorProfile, address: e.target.value }
                          })}
                          className={`${dashboardTheme.input} border-gray-700`}
                          placeholder="Address"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="assessorBio" className="text-white">Bio</Label>
                      <Textarea
                        id="assessorBio"
                        value={newUserData.assessorProfile.bio}
                        onChange={(e) => setNewUserData({
                          ...newUserData,
                          assessorProfile: { ...newUserData.assessorProfile, bio: e.target.value }
                        })}
                        className={`${dashboardTheme.input} border-gray-700 min-h-[100px]`}
                        placeholder="Brief biography or description"
                      />
                    </div>
                  </div>
                )}

                {newUserData.role === 'INSURER' && (
                  <div className="border-t border-gray-800 pt-4 mt-4">
                    <h3 className="text-white font-semibold mb-4">Insurer Profile</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="companyName" className="text-white">Company Name</Label>
                        <Input
                          id="companyName"
                          value={newUserData.insurerProfile.companyName}
                          onChange={(e) => setNewUserData({
                            ...newUserData,
                            insurerProfile: { ...newUserData.insurerProfile, companyName: e.target.value }
                          })}
                          className={`${dashboardTheme.input} border-gray-700`}
                          placeholder="Company Name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactPerson" className="text-white">Contact Person</Label>
                        <Input
                          id="contactPerson"
                          value={newUserData.insurerProfile.contactPerson}
                          onChange={(e) => setNewUserData({
                            ...newUserData,
                            insurerProfile: { ...newUserData.insurerProfile, contactPerson: e.target.value }
                          })}
                          className={`${dashboardTheme.input} border-gray-700`}
                          placeholder="Contact Person Name"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="website" className="text-white">Website</Label>
                        <Input
                          id="website"
                          type="url"
                          value={newUserData.insurerProfile.website}
                          onChange={(e) => setNewUserData({
                            ...newUserData,
                            insurerProfile: { ...newUserData.insurerProfile, website: e.target.value }
                          })}
                          className={`${dashboardTheme.input} border-gray-700`}
                          placeholder="https://example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="insurerAddress" className="text-white">Address</Label>
                        <Input
                          id="insurerAddress"
                          value={newUserData.insurerProfile.address}
                          onChange={(e) => setNewUserData({
                            ...newUserData,
                            insurerProfile: { ...newUserData.insurerProfile, address: e.target.value }
                          })}
                          className={`${dashboardTheme.input} border-gray-700`}
                          placeholder="Company Address"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="licenseNumber" className="text-white">License Number</Label>
                        <Input
                          id="licenseNumber"
                          value={newUserData.insurerProfile.licenseNumber}
                          onChange={(e) => setNewUserData({
                            ...newUserData,
                            insurerProfile: { ...newUserData.insurerProfile, licenseNumber: e.target.value }
                          })}
                          className={`${dashboardTheme.input} border-gray-700`}
                          placeholder="License Number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="registrationDate" className="text-white">Registration Date</Label>
                        <Input
                          id="registrationDate"
                          type="date"
                          value={newUserData.insurerProfile.registrationDate}
                          onChange={(e) => setNewUserData({
                            ...newUserData,
                            insurerProfile: { ...newUserData.insurerProfile, registrationDate: e.target.value }
                          })}
                          className={`${dashboardTheme.input} border-gray-700`}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="companyLogoUrl" className="text-white">Company Logo URL</Label>
                        <Input
                          id="companyLogoUrl"
                          value={newUserData.insurerProfile.companyLogoUrl}
                          onChange={(e) => setNewUserData({
                            ...newUserData,
                            insurerProfile: { ...newUserData.insurerProfile, companyLogoUrl: e.target.value }
                          })}
                          className={`${dashboardTheme.input} border-gray-700`}
                          placeholder="https://example.com/logo.png"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="companyDescription" className="text-white">Company Description</Label>
                      <Textarea
                        id="companyDescription"
                        value={newUserData.insurerProfile.companyDescription}
                        onChange={(e) => setNewUserData({
                          ...newUserData,
                          insurerProfile: { ...newUserData.insurerProfile, companyDescription: e.target.value }
                        })}
                        className={`${dashboardTheme.input} border-gray-700 min-h-[100px]`}
                        placeholder="Company description and overview"
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddUserDialog(false)}
                    className="border-gray-700 text-white hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateUser}
                    disabled={creatingUser}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {creatingUser ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create User
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit User Dialog */}
          <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
            <DialogContent className={`${dashboardTheme.card} border-gray-800 max-w-2xl max-h-[90vh] overflow-y-auto`}>
              <DialogHeader>
                <DialogTitle className="text-white text-2xl">Edit User</DialogTitle>
                <DialogDescription className="text-white/60 text-sm mt-2">
                  Update user information. Fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="space-y-4 mt-4">
                  {/* User Info (Read-only) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/60">National ID</Label>
                      <Input
                        value={selectedUser.nationalId || ""}
                        disabled
                        className={`${dashboardTheme.input} border-gray-700 opacity-50`}
                      />
                    </div>
                    <div>
                      <Label className="text-white/60">Role</Label>
                      <Input
                        value={selectedUser.role || ""}
                        disabled
                        className={`${dashboardTheme.input} border-gray-700 opacity-50`}
                      />
                    </div>
                  </div>

                  {/* Basic Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="editFirstName" className="text-white">First Name</Label>
                      <Input
                        id="editFirstName"
                        value={editUserData.firstName}
                        onChange={(e) => setEditUserData({ ...editUserData, firstName: e.target.value })}
                        className={`${dashboardTheme.input} border-gray-700`}
                        placeholder="First Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editLastName" className="text-white">Last Name</Label>
                      <Input
                        id="editLastName"
                        value={editUserData.lastName}
                        onChange={(e) => setEditUserData({ ...editUserData, lastName: e.target.value })}
                        className={`${dashboardTheme.input} border-gray-700`}
                        placeholder="Last Name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="editEmail" className="text-white">Email *</Label>
                      <Input
                        id="editEmail"
                        type="email"
                        value={editUserData.email}
                        onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                        className={`${dashboardTheme.input} border-gray-700`}
                        placeholder="user@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="editPhoneNumber" className="text-white">Phone Number *</Label>
                      <Input
                        id="editPhoneNumber"
                        value={editUserData.phoneNumber}
                        onChange={(e) => setEditUserData({ ...editUserData, phoneNumber: e.target.value })}
                        className={`${dashboardTheme.input} border-gray-700`}
                        placeholder="0721234567"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="editProvince" className="text-white">Province</Label>
                      <Input
                        id="editProvince"
                        value={editUserData.province}
                        onChange={(e) => setEditUserData({ ...editUserData, province: e.target.value })}
                        className={`${dashboardTheme.input} border-gray-700`}
                        placeholder="Province"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editDistrict" className="text-white">District</Label>
                      <Input
                        id="editDistrict"
                        value={editUserData.district}
                        onChange={(e) => setEditUserData({ ...editUserData, district: e.target.value })}
                        className={`${dashboardTheme.input} border-gray-700`}
                        placeholder="District"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="editSector" className="text-white">Sector</Label>
                      <Input
                        id="editSector"
                        value={editUserData.sector}
                        onChange={(e) => setEditUserData({ ...editUserData, sector: e.target.value })}
                        className={`${dashboardTheme.input} border-gray-700`}
                        placeholder="Sector"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editCell" className="text-white">Cell</Label>
                      <Input
                        id="editCell"
                        value={editUserData.cell}
                        onChange={(e) => setEditUserData({ ...editUserData, cell: e.target.value })}
                        className={`${dashboardTheme.input} border-gray-700`}
                        placeholder="Cell"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="editVillage" className="text-white">Village</Label>
                      <Input
                        id="editVillage"
                        value={editUserData.village}
                        onChange={(e) => setEditUserData({ ...editUserData, village: e.target.value })}
                        className={`${dashboardTheme.input} border-gray-700`}
                        placeholder="Village"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editSex" className="text-white">Sex</Label>
                      <Select
                        value={editUserData.sex}
                        onValueChange={(value) => setEditUserData({ ...editUserData, sex: value })}
                      >
                        <SelectTrigger className={`${dashboardTheme.select}`}>
                          <SelectValue placeholder="Select sex" />
                        </SelectTrigger>
                        <SelectContent className={dashboardTheme.card}>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="editActive" className="text-white flex items-center gap-2">
                      <input
                        id="editActive"
                        type="checkbox"
                        checked={editUserData.active}
                        onChange={(e) => setEditUserData({ ...editUserData, active: e.target.checked })}
                        className="w-4 h-4"
                      />
                      Active
                    </Label>
                  </div>

                  {/* Role-specific Profile Fields */}
                  {selectedUser.role === 'FARMER' && (
                    <div className="space-y-4 mt-4 pt-4 border-t border-gray-700">
                      <h3 className="text-white font-semibold">Farmer Profile</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="editFarmProvince" className="text-white">Farm Province</Label>
                          <Input
                            id="editFarmProvince"
                            value={editUserData.farmerProfile.farmProvince}
                            onChange={(e) => setEditUserData({
                              ...editUserData,
                              farmerProfile: { ...editUserData.farmerProfile, farmProvince: e.target.value }
                            })}
                            className={`${dashboardTheme.input} border-gray-700`}
                            placeholder="Farm Province"
                          />
                        </div>
                        <div>
                          <Label htmlFor="editFarmDistrict" className="text-white">Farm District</Label>
                          <Input
                            id="editFarmDistrict"
                            value={editUserData.farmerProfile.farmDistrict}
                            onChange={(e) => setEditUserData({
                              ...editUserData,
                              farmerProfile: { ...editUserData.farmerProfile, farmDistrict: e.target.value }
                            })}
                            className={`${dashboardTheme.input} border-gray-700`}
                            placeholder="Farm District"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="editFarmSector" className="text-white">Farm Sector</Label>
                          <Input
                            id="editFarmSector"
                            value={editUserData.farmerProfile.farmSector}
                            onChange={(e) => setEditUserData({
                              ...editUserData,
                              farmerProfile: { ...editUserData.farmerProfile, farmSector: e.target.value }
                            })}
                            className={`${dashboardTheme.input} border-gray-700`}
                            placeholder="Farm Sector"
                          />
                        </div>
                        <div>
                          <Label htmlFor="editFarmCell" className="text-white">Farm Cell</Label>
                          <Input
                            id="editFarmCell"
                            value={editUserData.farmerProfile.farmCell}
                            onChange={(e) => setEditUserData({
                              ...editUserData,
                              farmerProfile: { ...editUserData.farmerProfile, farmCell: e.target.value }
                            })}
                            className={`${dashboardTheme.input} border-gray-700`}
                            placeholder="Farm Cell"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="editFarmVillage" className="text-white">Farm Village</Label>
                        <Input
                          id="editFarmVillage"
                          value={editUserData.farmerProfile.farmVillage}
                          onChange={(e) => setEditUserData({
                            ...editUserData,
                            farmerProfile: { ...editUserData.farmerProfile, farmVillage: e.target.value }
                          })}
                          className={`${dashboardTheme.input} border-gray-700`}
                          placeholder="Farm Village"
                        />
                      </div>
                    </div>
                  )}

                  {selectedUser.role === 'ASSESSOR' && (
                    <div className="space-y-4 mt-4 pt-4 border-t border-gray-700">
                      <h3 className="text-white font-semibold">Assessor Profile</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="editSpecialization" className="text-white">Specialization</Label>
                          <Input
                            id="editSpecialization"
                            value={editUserData.assessorProfile.specialization}
                            onChange={(e) => setEditUserData({
                              ...editUserData,
                              assessorProfile: { ...editUserData.assessorProfile, specialization: e.target.value }
                            })}
                            className={`${dashboardTheme.input} border-gray-700`}
                            placeholder="Specialization"
                          />
                        </div>
                        <div>
                          <Label htmlFor="editExperienceYears" className="text-white">Experience Years</Label>
                          <Input
                            id="editExperienceYears"
                            type="number"
                            value={editUserData.assessorProfile.experienceYears}
                            onChange={(e) => setEditUserData({
                              ...editUserData,
                              assessorProfile: { ...editUserData.assessorProfile, experienceYears: parseInt(e.target.value) || 0 }
                            })}
                            className={`${dashboardTheme.input} border-gray-700`}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="editProfilePhotoUrl" className="text-white">Profile Photo URL</Label>
                        <Input
                          id="editProfilePhotoUrl"
                          value={editUserData.assessorProfile.profilePhotoUrl}
                          onChange={(e) => setEditUserData({
                            ...editUserData,
                            assessorProfile: { ...editUserData.assessorProfile, profilePhotoUrl: e.target.value }
                          })}
                          className={`${dashboardTheme.input} border-gray-700`}
                          placeholder="https://example.com/photo.jpg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="editAddress" className="text-white">Address</Label>
                        <Input
                          id="editAddress"
                          value={editUserData.assessorProfile.address}
                          onChange={(e) => setEditUserData({
                            ...editUserData,
                            assessorProfile: { ...editUserData.assessorProfile, address: e.target.value }
                          })}
                          className={`${dashboardTheme.input} border-gray-700`}
                          placeholder="Address"
                        />
                      </div>
                      <div>
                        <Label htmlFor="editBio" className="text-white">Bio</Label>
                        <Textarea
                          id="editBio"
                          value={editUserData.assessorProfile.bio}
                          onChange={(e) => setEditUserData({
                            ...editUserData,
                            assessorProfile: { ...editUserData.assessorProfile, bio: e.target.value }
                          })}
                          className={`${dashboardTheme.input} border-gray-700 min-h-[100px]`}
                          placeholder="Bio"
                        />
                      </div>
                    </div>
                  )}

                  {selectedUser.role === 'INSURER' && (
                    <div className="space-y-4 mt-4 pt-4 border-t border-gray-700">
                      <h3 className="text-white font-semibold">Insurer Profile</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="editCompanyName" className="text-white">Company Name</Label>
                          <Input
                            id="editCompanyName"
                            value={editUserData.insurerProfile.companyName}
                            onChange={(e) => setEditUserData({
                              ...editUserData,
                              insurerProfile: { ...editUserData.insurerProfile, companyName: e.target.value }
                            })}
                            className={`${dashboardTheme.input} border-gray-700`}
                            placeholder="Company Name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="editContactPerson" className="text-white">Contact Person</Label>
                          <Input
                            id="editContactPerson"
                            value={editUserData.insurerProfile.contactPerson}
                            onChange={(e) => setEditUserData({
                              ...editUserData,
                              insurerProfile: { ...editUserData.insurerProfile, contactPerson: e.target.value }
                            })}
                            className={`${dashboardTheme.input} border-gray-700`}
                            placeholder="Contact Person"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="editWebsite" className="text-white">Website</Label>
                          <Input
                            id="editWebsite"
                            value={editUserData.insurerProfile.website}
                            onChange={(e) => setEditUserData({
                              ...editUserData,
                              insurerProfile: { ...editUserData.insurerProfile, website: e.target.value }
                            })}
                            className={`${dashboardTheme.input} border-gray-700`}
                            placeholder="https://example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="editInsurerAddress" className="text-white">Address</Label>
                          <Input
                            id="editInsurerAddress"
                            value={editUserData.insurerProfile.address}
                            onChange={(e) => setEditUserData({
                              ...editUserData,
                              insurerProfile: { ...editUserData.insurerProfile, address: e.target.value }
                            })}
                            className={`${dashboardTheme.input} border-gray-700`}
                            placeholder="Company Address"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="editLicenseNumber" className="text-white">License Number</Label>
                          <Input
                            id="editLicenseNumber"
                            value={editUserData.insurerProfile.licenseNumber}
                            onChange={(e) => setEditUserData({
                              ...editUserData,
                              insurerProfile: { ...editUserData.insurerProfile, licenseNumber: e.target.value }
                            })}
                            className={`${dashboardTheme.input} border-gray-700`}
                            placeholder="License Number"
                          />
                        </div>
                        <div>
                          <Label htmlFor="editRegistrationDate" className="text-white">Registration Date</Label>
                          <Input
                            id="editRegistrationDate"
                            type="date"
                            value={editUserData.insurerProfile.registrationDate}
                            onChange={(e) => setEditUserData({
                              ...editUserData,
                              insurerProfile: { ...editUserData.insurerProfile, registrationDate: e.target.value }
                            })}
                            className={`${dashboardTheme.input} border-gray-700`}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="editCompanyLogoUrl" className="text-white">Company Logo URL</Label>
                        <Input
                          id="editCompanyLogoUrl"
                          value={editUserData.insurerProfile.companyLogoUrl}
                          onChange={(e) => setEditUserData({
                            ...editUserData,
                            insurerProfile: { ...editUserData.insurerProfile, companyLogoUrl: e.target.value }
                          })}
                          className={`${dashboardTheme.input} border-gray-700`}
                          placeholder="https://example.com/logo.png"
                        />
                      </div>
                      <div>
                        <Label htmlFor="editCompanyDescription" className="text-white">Company Description</Label>
                        <Textarea
                          id="editCompanyDescription"
                          value={editUserData.insurerProfile.companyDescription}
                          onChange={(e) => setEditUserData({
                            ...editUserData,
                            insurerProfile: { ...editUserData.insurerProfile, companyDescription: e.target.value }
                          })}
                          className={`${dashboardTheme.input} border-gray-700 min-h-[100px]`}
                          placeholder="Company description and overview"
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowEditUserDialog(false);
                        setSelectedUser(null);
                      }}
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpdateUser}
                      disabled={editingUser}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {editingUser ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Update User
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Error Message */}
      {usersError && (
        <Card className={`${dashboardTheme.card} border-l-4 border-l-red-500`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <p className="text-red-400">{usersError}</p>
              </div>
              <Button
                onClick={loadUsers}
                variant="outline"
                size="sm"
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
          {usersLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                <p className="text-white/60">Loading users...</p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-white/40" />
                <p className="text-white/60">No users found</p>
                {searchQuery && (
                  <Button
                    onClick={() => setSearchQuery("")}
                    variant="outline"
                    className="mt-4 border-gray-700 text-white hover:bg-gray-800"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">User</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Email</th>
                    <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Phone</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Role</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Region</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Status</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Last Login</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                  {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{user.name}</div>
                            <div className="text-xs text-white/60">{user.userId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-white/80">{user.email}</td>
                      <td className="py-3 px-4 text-sm text-white/80">{user.phoneNumber || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <Badge className={`${
                          user.role === 'FARMER' || user.role === 'Farmer' ? 'bg-green-600' :
                          user.role === 'ASSESSOR' || user.role === 'Assessor' ? 'bg-orange-600' :
                          user.role === 'INSURER' || user.role === 'Insurer' ? 'bg-blue-600' :
                          user.role === 'GOVERNMENT' || user.role === 'Government' ? 'bg-purple-600' :
                          user.role === 'ADMIN' || user.role === 'Admin' ? 'bg-red-600' :
                          'bg-gray-600'
                      }`}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-white/80">{user.region}</td>
                    <td className="py-3 px-4">
                        <Badge className={user.active !== false ? 'bg-green-600' : 'bg-gray-600'}>
                          {user.active !== false ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-white/60">{user.lastLogin}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-white/60 hover:text-white"
                            onClick={() => handleViewUser(user.userId)}
                            title="View Details"
                          >
                          <Eye className="h-4 w-4" />
                        </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-white/60 hover:text-white"
                            onClick={() => handleEditUser(user.userId)}
                            title="Edit User"
                          >
                          <Edit className="h-4 w-4" />
                        </Button>
                          {user.active !== false && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-400 hover:text-red-300"
                              onClick={() => handleDeactivateUser(user.userId)}
                              disabled={updatingUserId === user.userId}
                              title="Deactivate User"
                            >
                              <UserMinus className="h-4 w-4" />
                        </Button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
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
        <div className="flex gap-2">
          <Button 
            onClick={loadAdminStatistics}
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800"
            disabled={statsLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${statsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {statsLoading && (
        <Card className={dashboardTheme.card}>
          <CardContent className="p-8 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
            <p className="text-white/60">Loading financial data...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {statsError && !statsLoading && (
        <Card className={`${dashboardTheme.card} border-l-4 border-l-red-500`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <p className="text-red-400">{statsError}</p>
              </div>
              <Button
                onClick={loadAdminStatistics}
                variant="outline"
                size="sm"
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Policy Overview Section */}
      {policyOverview && !statsLoading && (
        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Policy Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-white/60 mb-1">Total Policies</p>
                <p className="text-2xl font-bold text-white">
                  {policyOverview.totalPolicies || policyOverview.policies?.total || 0}
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-white/60 mb-1">Active Policies</p>
                <p className="text-2xl font-bold text-green-400">
                  {policyOverview.activePolicies || policyOverview.policies?.active || 0}
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-white/60 mb-1">Total Premium</p>
                <p className="text-2xl font-bold text-white">
                  RWF {policyOverview.totalPremium 
                    ? (policyOverview.totalPremium / 1000000).toFixed(1) 
                    : policyOverview.policies?.totalPremium 
                    ? (policyOverview.policies.totalPremium / 1000000).toFixed(1)
                    : 0}M
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-white/60 mb-1">Pending Claims</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {policyOverview.pendingClaims || policyOverview.policies?.pendingClaims || 0}
                </p>
              </div>
            </div>
            {policyOverview.policies && (
              <div className="mt-4 text-sm text-white/60">
                <pre className="bg-gray-900/50 p-4 rounded-lg overflow-auto">
                  {JSON.stringify(policyOverview.policies, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Claim Statistics Section */}
      {claimStats && !statsLoading && (
        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Claim Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-white/60 mb-1">Total Claims</p>
                <p className="text-2xl font-bold text-white">
                  {claimStats.totalClaims || claimStats.claims?.total || 0}
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-white/60 mb-1">Pending Claims</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {claimStats.pendingClaims || claimStats.claims?.pending || 0}
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-white/60 mb-1">Approved Claims</p>
                <p className="text-2xl font-bold text-green-400">
                  {claimStats.approvedClaims || claimStats.claims?.approved || 0}
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-white/60 mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-white">
                  RWF {claimStats.totalPaid 
                    ? (claimStats.totalPaid / 1000000).toFixed(1) 
                    : claimStats.claims?.totalPaid 
                    ? (claimStats.claims.totalPaid / 1000000).toFixed(1)
                    : 0}M
                </p>
              </div>
            </div>
            {claimStats.claims && (
              <div className="mt-4 text-sm text-white/60">
                <pre className="bg-gray-900/50 p-4 rounded-lg overflow-auto">
                  {JSON.stringify(claimStats.claims, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-4">
        <Card className={`${dashboardTheme.card} border-l-4 border-l-green-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              RWF {systemStats?.totalRevenue 
                ? (systemStats.totalRevenue / 1000000).toFixed(1) 
                : (financialData.totalRevenue / 1000000).toFixed(1)}M
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
              RWF {systemStats?.monthlyRevenue 
                ? (systemStats.monthlyRevenue / 1000000).toFixed(1) 
                : (financialData.monthlyRevenue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-green-400 mt-1">
              +{systemStats?.revenueGrowth || financialData.growthRate}% growth
            </p>
          </CardContent>
        </Card>
        <Card className={`${dashboardTheme.card} border-l-4 border-l-purple-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              RWF {systemStats?.commissionEarned 
                ? (systemStats.commissionEarned / 1000).toFixed(0) 
                : (financialData.commissionEarned / 1000).toFixed(0)}K
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
              RWF {systemStats?.pendingPayments 
                ? (systemStats.pendingPayments / 1000).toFixed(0) 
                : (financialData.pendingPayments / 1000).toFixed(0)}K
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
          <Button 
            onClick={loadAdminStatistics}
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800"
            disabled={statsLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${statsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
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

      {/* Loading State */}
      {statsLoading && (
        <Card className={dashboardTheme.card}>
          <CardContent className="p-8 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
            <p className="text-white/60">Loading analytics...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {statsError && !statsLoading && (
        <Card className={`${dashboardTheme.card} border-l-4 border-l-red-500`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <p className="text-red-400">{statsError}</p>
              </div>
              <Button
                onClick={loadAdminStatistics}
                variant="outline"
                size="sm"
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Statistics Section */}
      {systemStats && !statsLoading && (
        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-white/60 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-white">
                  {systemStats.totalUsers || systemStats.users?.total || 0}
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-white/60 mb-1">Total Policies</p>
                <p className="text-2xl font-bold text-blue-400">
                  {systemStats.totalPolicies || systemStats.policies?.total || 0}
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-white/60 mb-1">Total Claims</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {systemStats.totalClaims || systemStats.claims?.total || 0}
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-white/60 mb-1">System Uptime</p>
                <p className="text-2xl font-bold text-green-400">
                  {systemStats.uptime || systemMetrics.uptime}%
                </p>
              </div>
            </div>
            {systemStats && (
              <div className="mt-4 text-sm text-white/60">
                <pre className="bg-gray-900/50 p-4 rounded-lg overflow-auto max-h-96">
                  {JSON.stringify(systemStats, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className={`${dashboardTheme.card} border-l-4 border-l-blue-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">API Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {systemStats?.apiCalls 
                ? (systemStats.apiCalls / 1000000).toFixed(1) + 'M'
                : (systemMetrics.apiCalls / 1000000).toFixed(1) + 'M'}
            </div>
            <p className="text-xs text-green-400 mt-1">+12.5% this month</p>
          </CardContent>
        </Card>
        <Card className={`${dashboardTheme.card} border-l-4 border-l-green-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {systemStats?.avgResponseTime || systemMetrics.avgResponseTime}ms
            </div>
            <p className="text-xs text-green-400 mt-1">-8ms from last week</p>
          </CardContent>
        </Card>
        <Card className={`${dashboardTheme.card} border-l-4 border-l-purple-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">User Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {systemStats?.userEngagement || '87.3'}%
            </div>
            <p className="text-xs text-green-400 mt-1">+3.2% increase</p>
          </CardContent>
        </Card>
        <Card className={`${dashboardTheme.card} border-l-4 border-l-orange-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {systemStats?.conversionRate || '23.7'}%
            </div>
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

  // Commission Management Page
  const renderCommission = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Commission Management</h2>
          <p className="text-white/60">Track and manage commission rates and earnings</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={loadAdminStatistics}
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800"
            disabled={statsLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${statsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {statsLoading && (
        <Card className={dashboardTheme.card}>
          <CardContent className="p-8 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
            <p className="text-white/60">Loading commission data...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {statsError && !statsLoading && (
        <Card className={`${dashboardTheme.card} border-l-4 border-l-red-500`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <p className="text-red-400">{statsError}</p>
              </div>
              <Button
                onClick={loadAdminStatistics}
                variant="outline"
                size="sm"
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Policy Overview in Commission Page */}
      {policyOverview && !statsLoading && (
        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Policy Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-white/60 mb-1">Total Policies</p>
                <p className="text-2xl font-bold text-white">
                  {policyOverview.totalPolicies || policyOverview.policies?.total || 0}
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-white/60 mb-1">Active Policies</p>
                <p className="text-2xl font-bold text-green-400">
                  {policyOverview.activePolicies || policyOverview.policies?.active || 0}
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-white/60 mb-1">Total Premium</p>
                <p className="text-2xl font-bold text-white">
                  RWF {policyOverview.totalPremium 
                    ? (policyOverview.totalPremium / 1000000).toFixed(1) 
                    : policyOverview.policies?.totalPremium 
                    ? (policyOverview.policies.totalPremium / 1000000).toFixed(1)
                    : 0}M
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-white/60 mb-1">Pending Claims</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {policyOverview.pendingClaims || policyOverview.policies?.pendingClaims || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Claim Statistics in Commission Page */}
      {claimStats && !statsLoading && (
        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Claim Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-white/60 mb-1">Total Claims</p>
                <p className="text-2xl font-bold text-white">
                  {claimStats.totalClaims || claimStats.claims?.total || 0}
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-white/60 mb-1">Pending Claims</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {claimStats.pendingClaims || claimStats.claims?.pending || 0}
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-white/60 mb-1">Approved Claims</p>
                <p className="text-2xl font-bold text-green-400">
                  {claimStats.approvedClaims || claimStats.claims?.approved || 0}
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-white/60 mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-white">
                  RWF {claimStats.totalPaid 
                    ? (claimStats.totalPaid / 1000000).toFixed(1) 
                    : claimStats.claims?.totalPaid 
                    ? (claimStats.claims.totalPaid / 1000000).toFixed(1)
                    : 0}M
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Commission Rate Settings */}
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

  // Load Policies
  const loadPolicies = async () => {
    setPoliciesLoading(true);
    setPoliciesError(null);
    try {
      const status = policyStatusFilter === "all" ? undefined : policyStatusFilter;
      const response: any = await getPolicies(1, 100, status);
      let policiesData: any[] = [];
      
      if (Array.isArray(response)) {
        policiesData = response;
      } else if (response && typeof response === 'object') {
        policiesData = response.data || response.policies || response.items || [];
      }
      
      setPolicies(policiesData);
    } catch (err: any) {
      console.error('Failed to load policies:', err);
      setPoliciesError(err.message || 'Failed to load policies');
      toast({
        title: "Error",
        description: err.message || 'Failed to load policies',
        variant: "destructive",
      });
    } finally {
      setPoliciesLoading(false);
    }
  };

  // Load Claims
  const loadClaims = async () => {
    setClaimsLoading(true);
    setClaimsError(null);
    try {
      const status = claimStatusFilter === "all" ? undefined : claimStatusFilter;
      const response: any = await getClaims(1, 100, status);
      let claimsData: any[] = [];
      
      if (Array.isArray(response)) {
        claimsData = response;
      } else if (response && typeof response === 'object') {
        claimsData = response.data || response.claims || response.items || [];
      }
      
      setClaims(claimsData);
    } catch (err: any) {
      console.error('Failed to load claims:', err);
      setClaimsError(err.message || 'Failed to load claims');
      toast({
        title: "Error",
        description: err.message || 'Failed to load claims',
        variant: "destructive",
      });
    } finally {
      setClaimsLoading(false);
    }
  };

  // Load policies and claims when their pages are active
  useEffect(() => {
    if (activePage === "policies") {
      loadPolicies();
    } else if (activePage === "claims") {
      loadClaims();
    }
  }, [activePage, policyStatusFilter, claimStatusFilter]);

  // Policy CRUD Functions
  const handleCreatePolicy = async () => {
    try {
      const policyData = {
        farmerId: policyFormData.farmerId,
        cropType: policyFormData.cropType,
        coverageAmount: parseFloat(policyFormData.coverageAmount),
        premium: parseFloat(policyFormData.premium),
        startDate: policyFormData.startDate,
        endDate: policyFormData.endDate,
        status: policyFormData.status,
        notes: policyFormData.notes,
      };
      
      await createPolicy(policyData);
      toast({
        title: "Success",
        description: "Policy created successfully",
      });
      setShowPolicyDialog(false);
      resetPolicyForm();
      loadPolicies();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'Failed to create policy',
        variant: "destructive",
      });
    }
  };

  const handleUpdatePolicy = async (policyId: string) => {
    try {
      const updateData: any = {};
      if (policyFormData.status) updateData.status = policyFormData.status;
      if (policyFormData.notes) updateData.notes = policyFormData.notes;
      if (policyFormData.coverageAmount) updateData.coverageAmount = parseFloat(policyFormData.coverageAmount);
      if (policyFormData.premium) updateData.premium = parseFloat(policyFormData.premium);
      if (policyFormData.endDate) updateData.endDate = policyFormData.endDate;
      
      await updatePolicy(policyId, updateData);
      toast({
        title: "Success",
        description: "Policy updated successfully",
      });
      setShowPolicyDialog(false);
      setEditingPolicy(null);
      resetPolicyForm();
      loadPolicies();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'Failed to update policy',
        variant: "destructive",
      });
    }
  };

  const handleDeletePolicy = async (policyId: string) => {
    try {
      await deletePolicy(policyId);
      toast({
        title: "Success",
        description: "Policy deleted successfully",
      });
      setDeletingPolicyId(null);
      loadPolicies();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'Failed to delete policy',
        variant: "destructive",
      });
    }
  };

  const resetPolicyForm = () => {
    setPolicyFormData({
      farmerId: "",
      cropType: "",
      coverageAmount: "",
      premium: "",
      startDate: "",
      endDate: "",
      status: "active",
      notes: "",
    });
    setEditingPolicy(null);
  };

  const openEditPolicy = (policy: any) => {
    setEditingPolicy(policy);
    setPolicyFormData({
      farmerId: policy.farmerId || "",
      cropType: policy.cropType || "",
      coverageAmount: policy.coverageAmount?.toString() || "",
      premium: policy.premium?.toString() || "",
      startDate: policy.startDate || "",
      endDate: policy.endDate || "",
      status: policy.status || "active",
      notes: policy.notes || "",
    });
    setShowPolicyDialog(true);
  };

  // Claim CRUD Functions
  const handleCreateClaim = async () => {
    try {
      const claimData = {
        farmerId: claimFormData.farmerId,
        policyId: claimFormData.policyId || undefined,
        cropType: claimFormData.cropType,
        damageType: claimFormData.damageType,
        amount: parseFloat(claimFormData.amount),
        description: claimFormData.description,
        fieldId: claimFormData.fieldId || undefined,
        status: claimFormData.status,
      };
      
      await createClaim(claimData);
      toast({
        title: "Success",
        description: "Claim created successfully",
      });
      setShowClaimDialog(false);
      resetClaimForm();
      loadClaims();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'Failed to create claim',
        variant: "destructive",
      });
    }
  };

  const handleUpdateClaim = async (claimId: string) => {
    try {
      const updateData: any = {};
      if (claimFormData.status) updateData.status = claimFormData.status;
      if (claimFormData.amount) updateData.amount = parseFloat(claimFormData.amount);
      if (claimFormData.description) updateData.description = claimFormData.description;
      
      await updateClaim(claimId, updateData);
      toast({
        title: "Success",
        description: "Claim updated successfully",
      });
      setShowClaimDialog(false);
      setEditingClaim(null);
      resetClaimForm();
      loadClaims();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'Failed to update claim',
        variant: "destructive",
      });
    }
  };

  const handleDeleteClaim = async (claimId: string) => {
    try {
      await deleteClaim(claimId);
      toast({
        title: "Success",
        description: "Claim deleted successfully",
      });
      setDeletingClaimId(null);
      loadClaims();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'Failed to delete claim',
        variant: "destructive",
      });
    }
  };

  const resetClaimForm = () => {
    setClaimFormData({
      farmerId: "",
      policyId: "",
      cropType: "",
      damageType: "",
      amount: "",
      description: "",
      fieldId: "",
      status: "pending",
    });
    setEditingClaim(null);
  };

  const openEditClaim = (claim: any) => {
    setEditingClaim(claim);
    setClaimFormData({
      farmerId: claim.farmerId || "",
      policyId: claim.policyId || "",
      cropType: claim.cropType || "",
      damageType: claim.damageType || "",
      amount: claim.amount?.toString() || "",
      description: claim.description || "",
      fieldId: claim.fieldId || "",
      status: claim.status || "pending",
    });
    setShowClaimDialog(true);
  };

  // Policies Management Page
  const renderPoliciesManagement = () => {
    const filteredPolicies = policies.filter((policy) => {
      const matchesSearch = policySearchQuery === "" || 
        policy.cropType?.toLowerCase().includes(policySearchQuery.toLowerCase()) ||
        policy.farmerId?.toLowerCase().includes(policySearchQuery.toLowerCase()) ||
        policy._id?.toLowerCase().includes(policySearchQuery.toLowerCase());
      return matchesSearch;
    });

    const getStatusBadge = (status: string) => {
      const statusMap: Record<string, { label: string; className: string }> = {
        active: { label: "Active", className: "bg-green-600" },
        inactive: { label: "Inactive", className: "bg-gray-600" },
        expired: { label: "Expired", className: "bg-red-600" },
        pending: { label: "Pending", className: "bg-yellow-600" },
      };
      const statusInfo = statusMap[status?.toLowerCase()] || { label: status, className: "bg-gray-600" };
      return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Policies Management</h2>
            <p className="text-white/60">Manage all insurance policies</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={loadPolicies}
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
              disabled={policiesLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${policiesLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={() => {
                resetPolicyForm();
                setShowPolicyDialog(true);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Policy
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className={dashboardTheme.card}>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    placeholder="Search policies..."
                    value={policySearchQuery}
                    onChange={(e) => setPolicySearchQuery(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              <Select value={policyStatusFilter} onValueChange={setPolicyStatusFilter}>
                <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {policiesLoading && (
          <Card className={dashboardTheme.card}>
            <CardContent className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
              <p className="text-white/60">Loading policies...</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {policiesError && !policiesLoading && (
          <Card className={`${dashboardTheme.card} border-l-4 border-l-red-500`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <p className="text-red-400">{policiesError}</p>
                </div>
                <Button
                  onClick={loadPolicies}
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-white hover:bg-gray-800"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Policies Table */}
        {!policiesLoading && !policiesError && (
          <Card className={dashboardTheme.card}>
            <CardHeader>
              <CardTitle className="text-white">
                Policies ({filteredPolicies.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-white/80 font-medium">Policy ID</th>
                      <th className="text-left py-3 px-4 text-white/80 font-medium">Farmer</th>
                      <th className="text-left py-3 px-4 text-white/80 font-medium">Crop Type</th>
                      <th className="text-left py-3 px-4 text-white/80 font-medium">Coverage</th>
                      <th className="text-left py-3 px-4 text-white/80 font-medium">Premium</th>
                      <th className="text-left py-3 px-4 text-white/80 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-white/80 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPolicies.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-white/60">
                          No policies found
                        </td>
                      </tr>
                    ) : (
                      filteredPolicies.map((policy) => (
                        <tr key={policy._id || policy.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-3 px-4 text-white font-medium">
                            {policy._id?.toString().substring(0, 8) || policy.id || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-white">
                            {policy.farmerId?.toString().substring(0, 8) || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-white">{policy.cropType || "N/A"}</td>
                          <td className="py-3 px-4 text-white">
                            RWF {policy.coverageAmount?.toLocaleString() || "0"}
                          </td>
                          <td className="py-3 px-4 text-white">
                            RWF {policy.premium?.toLocaleString() || "0"}
                          </td>
                          <td className="py-3 px-4">{getStatusBadge(policy.status)}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-400 hover:text-blue-300"
                                onClick={() => openEditPolicy(policy)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300"
                                onClick={() => setDeletingPolicyId(policy._id || policy.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create/Edit Policy Dialog */}
        <Dialog open={showPolicyDialog} onOpenChange={setShowPolicyDialog}>
          <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingPolicy ? "Edit Policy" : "Create New Policy"}
              </DialogTitle>
              <DialogDescription className="text-white/60">
                {editingPolicy ? "Update policy information" : "Fill in the details to create a new policy"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/80">Farmer ID</Label>
                  <Input
                    value={policyFormData.farmerId}
                    onChange={(e) => setPolicyFormData({ ...policyFormData, farmerId: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter farmer ID"
                  />
                </div>
                <div>
                  <Label className="text-white/80">Crop Type</Label>
                  <Select
                    value={policyFormData.cropType}
                    onValueChange={(value) => setPolicyFormData({ ...policyFormData, cropType: value })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MAIZE">Maize</SelectItem>
                      <SelectItem value="BEANS">Beans</SelectItem>
                      <SelectItem value="RICE">Rice</SelectItem>
                      <SelectItem value="WHEAT">Wheat</SelectItem>
                      <SelectItem value="POTATOES">Potatoes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/80">Coverage Amount (RWF)</Label>
                  <Input
                    type="number"
                    value={policyFormData.coverageAmount}
                    onChange={(e) => setPolicyFormData({ ...policyFormData, coverageAmount: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter coverage amount"
                  />
                </div>
                <div>
                  <Label className="text-white/80">Premium (RWF)</Label>
                  <Input
                    type="number"
                    value={policyFormData.premium}
                    onChange={(e) => setPolicyFormData({ ...policyFormData, premium: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter premium"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/80">Start Date</Label>
                  <Input
                    type="date"
                    value={policyFormData.startDate}
                    onChange={(e) => setPolicyFormData({ ...policyFormData, startDate: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/80">End Date</Label>
                  <Input
                    type="date"
                    value={policyFormData.endDate}
                    onChange={(e) => setPolicyFormData({ ...policyFormData, endDate: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              <div>
                <Label className="text-white/80">Status</Label>
                <Select
                  value={policyFormData.status}
                  onValueChange={(value) => setPolicyFormData({ ...policyFormData, status: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/80">Notes</Label>
                <Textarea
                  value={policyFormData.notes}
                  onChange={(e) => setPolicyFormData({ ...policyFormData, notes: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPolicyDialog(false);
                    resetPolicyForm();
                  }}
                  className="border-gray-700 text-white hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => editingPolicy ? handleUpdatePolicy(editingPolicy._id || editingPolicy.id) : handleCreatePolicy()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingPolicy ? "Update" : "Create"} Policy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deletingPolicyId} onOpenChange={(open) => !open && setDeletingPolicyId(null)}>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Delete Policy</DialogTitle>
              <DialogDescription className="text-white/60">
                Are you sure you want to delete this policy? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setDeletingPolicyId(null)}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={() => deletingPolicyId && handleDeletePolicy(deletingPolicyId)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // Claims Management Page
  const renderClaimsManagement = () => {
    const filteredClaims = claims.filter((claim) => {
      const matchesSearch = claimSearchQuery === "" || 
        claim.cropType?.toLowerCase().includes(claimSearchQuery.toLowerCase()) ||
        claim.damageType?.toLowerCase().includes(claimSearchQuery.toLowerCase()) ||
        claim.farmerId?.toLowerCase().includes(claimSearchQuery.toLowerCase()) ||
        claim._id?.toLowerCase().includes(claimSearchQuery.toLowerCase());
      return matchesSearch;
    });

    const getStatusBadge = (status: string) => {
      const statusMap: Record<string, { label: string; className: string }> = {
        pending: { label: "Pending", className: "bg-yellow-600" },
        approved: { label: "Approved", className: "bg-green-600" },
        rejected: { label: "Rejected", className: "bg-red-600" },
        processing: { label: "Processing", className: "bg-blue-600" },
      };
      const statusInfo = statusMap[status?.toLowerCase()] || { label: status, className: "bg-gray-600" };
      return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Claims Management</h2>
            <p className="text-white/60">Manage all insurance claims</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={loadClaims}
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
              disabled={claimsLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${claimsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={() => {
                resetClaimForm();
                setShowClaimDialog(true);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Claim
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className={dashboardTheme.card}>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    placeholder="Search claims..."
                    value={claimSearchQuery}
                    onChange={(e) => setClaimSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              <Select value={claimStatusFilter} onValueChange={setClaimStatusFilter}>
                <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {claimsLoading && (
          <Card className={dashboardTheme.card}>
            <CardContent className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
              <p className="text-white/60">Loading claims...</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {claimsError && !claimsLoading && (
          <Card className={`${dashboardTheme.card} border-l-4 border-l-red-500`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <p className="text-red-400">{claimsError}</p>
                </div>
                <Button
                  onClick={loadClaims}
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-white hover:bg-gray-800"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Claims Table */}
        {!claimsLoading && !claimsError && (
          <Card className={dashboardTheme.card}>
            <CardHeader>
              <CardTitle className="text-white">
                Claims ({filteredClaims.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-white/80 font-medium">Claim ID</th>
                      <th className="text-left py-3 px-4 text-white/80 font-medium">Farmer</th>
                      <th className="text-left py-3 px-4 text-white/80 font-medium">Crop Type</th>
                      <th className="text-left py-3 px-4 text-white/80 font-medium">Damage Type</th>
                      <th className="text-left py-3 px-4 text-white/80 font-medium">Amount</th>
                      <th className="text-left py-3 px-4 text-white/80 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-white/80 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClaims.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-white/60">
                          No claims found
                        </td>
                      </tr>
                    ) : (
                      filteredClaims.map((claim) => (
                        <tr key={claim._id || claim.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-3 px-4 text-white font-medium">
                            {claim._id?.toString().substring(0, 8) || claim.id || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-white">
                            {claim.farmerId?.toString().substring(0, 8) || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-white">{claim.cropType || "N/A"}</td>
                          <td className="py-3 px-4 text-white">{claim.damageType || "N/A"}</td>
                          <td className="py-3 px-4 text-white">
                            RWF {claim.amount?.toLocaleString() || "0"}
                          </td>
                          <td className="py-3 px-4">{getStatusBadge(claim.status)}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-400 hover:text-blue-300"
                                onClick={() => openEditClaim(claim)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300"
                                onClick={() => setDeletingClaimId(claim._id || claim.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create/Edit Claim Dialog */}
        <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
          <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingClaim ? "Edit Claim" : "Create New Claim"}
              </DialogTitle>
              <DialogDescription className="text-white/60">
                {editingClaim ? "Update claim information" : "Fill in the details to create a new claim"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/80">Farmer ID</Label>
                  <Input
                    value={claimFormData.farmerId}
                    onChange={(e) => setClaimFormData({ ...claimFormData, farmerId: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter farmer ID"
                  />
                </div>
                <div>
                  <Label className="text-white/80">Policy ID (Optional)</Label>
                  <Input
                    value={claimFormData.policyId}
                    onChange={(e) => setClaimFormData({ ...claimFormData, policyId: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter policy ID"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/80">Crop Type</Label>
                  <Select
                    value={claimFormData.cropType}
                    onValueChange={(value) => setClaimFormData({ ...claimFormData, cropType: value })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MAIZE">Maize</SelectItem>
                      <SelectItem value="BEANS">Beans</SelectItem>
                      <SelectItem value="RICE">Rice</SelectItem>
                      <SelectItem value="WHEAT">Wheat</SelectItem>
                      <SelectItem value="POTATOES">Potatoes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white/80">Damage Type</Label>
                  <Select
                    value={claimFormData.damageType}
                    onValueChange={(value) => setClaimFormData({ ...claimFormData, damageType: value })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select damage type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DROUGHT">Drought</SelectItem>
                      <SelectItem value="FLOOD">Flood</SelectItem>
                      <SelectItem value="PEST">Pest</SelectItem>
                      <SelectItem value="DISEASE">Disease</SelectItem>
                      <SelectItem value="HAIL">Hail</SelectItem>
                      <SelectItem value="FIRE">Fire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/80">Amount (RWF)</Label>
                  <Input
                    type="number"
                    value={claimFormData.amount}
                    onChange={(e) => setClaimFormData({ ...claimFormData, amount: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter claim amount"
                  />
                </div>
                <div>
                  <Label className="text-white/80">Status</Label>
                  <Select
                    value={claimFormData.status}
                    onValueChange={(value) => setClaimFormData({ ...claimFormData, status: value })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-white/80">Description</Label>
                <Textarea
                  value={claimFormData.description}
                  onChange={(e) => setClaimFormData({ ...claimFormData, description: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Describe the damage..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowClaimDialog(false);
                    resetClaimForm();
                  }}
                  className="border-gray-700 text-white hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => editingClaim ? handleUpdateClaim(editingClaim._id || editingClaim.id) : handleCreateClaim()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingClaim ? "Update" : "Create"} Claim
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deletingClaimId} onOpenChange={(open) => !open && setDeletingClaimId(null)}>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Delete Claim</DialogTitle>
              <DialogDescription className="text-white/60">
                Are you sure you want to delete this claim? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setDeletingClaimId(null)}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={() => deletingClaimId && handleDeleteClaim(deletingClaimId)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // Load assessments
  const loadAssessments = async () => {
    setAssessmentsLoading(true);
    setAssessmentsError(null);
    try {
      const response: any = await assessmentsApiService.getAllAssessments();
      let assessmentsData: any[] = [];
      
      if (Array.isArray(response)) {
        assessmentsData = response;
      } else if (response && typeof response === 'object') {
        assessmentsData = response.data || response.assessments || [];
      }
      
      setAssessments(assessmentsData);
    } catch (err: any) {
      console.error('Failed to load assessments:', err);
      setAssessmentsError(err.message || 'Failed to load assessments');
      toast({
        title: "Error",
        description: err.message || 'Failed to load assessments',
        variant: "destructive",
      });
    } finally {
      setAssessmentsLoading(false);
    }
  };

  // Load farms for assessment creation
  const loadFarmsForAssessment = async () => {
    setFarmsLoading(true);
    try {
      const response: any = await getFarms(1, 100);
      let farmsData: any[] = [];
      
      if (Array.isArray(response)) {
        farmsData = response;
      } else if (response && typeof response === 'object') {
        farmsData = response.data || response.farms || response.items || [];
      }
      
      // Ensure farmsData is always an array
      if (!Array.isArray(farmsData)) {
        farmsData = [];
      }
      
      setFarms(farmsData);
    } catch (err: any) {
      console.error('Failed to load farms:', err);
      setFarms([]); // Set to empty array on error
      toast({
        title: "Warning",
        description: "Could not load farms. You may not be able to create assessments.",
        variant: "default",
      });
    } finally {
      setFarmsLoading(false);
    }
  };

  // Load assessors for assessment creation
  const loadAssessors = async () => {
    try {
      const allUsers = await getAllUsers();
      let assessorUsers: any[] = [];
      
      if (Array.isArray(allUsers)) {
        assessorUsers = allUsers.filter((user: any) => user.role === 'ASSESSOR' || user.role === 'Assessor');
      } else if (allUsers && typeof allUsers === 'object') {
        // Handle case where users might be in data property
        const usersData = allUsers.data || allUsers.users || [];
        if (Array.isArray(usersData)) {
          assessorUsers = usersData.filter((user: any) => user.role === 'ASSESSOR' || user.role === 'Assessor');
        }
      }
      
      // Ensure assessorUsers is always an array
      if (!Array.isArray(assessorUsers)) {
        assessorUsers = [];
      }
      
      setAssessors(assessorUsers);
    } catch (err: any) {
      console.error('Failed to load assessors:', err);
      setAssessors([]); // Set to empty array on error
      toast({
        title: "Warning",
        description: "Could not load assessors. You may not be able to create assessments.",
        variant: "default",
      });
    }
  };

  // Handle create assessment
  const handleCreateAssessment = async () => {
    if (!assessmentFormData.farmId || !assessmentFormData.assessorId) {
      toast({
        title: "Validation Error",
        description: "Please select both a farm and an assessor.",
        variant: "destructive",
      });
      return;
    }

    setCreatingAssessment(true);
    try {
      await assessmentsApiService.createAssessment({
        farmId: assessmentFormData.farmId,
        assessorId: assessmentFormData.assessorId,
      });
      
      toast({
        title: "Success",
        description: "Assessment created successfully!",
        variant: "default",
      });
      
      setShowAssessmentDialog(false);
      setAssessmentFormData({ farmId: "", assessorId: "" });
      loadAssessments();
    } catch (err: any) {
      console.error('Failed to create assessment:', err);
      toast({
        title: "Error",
        description: err.message || 'Failed to create assessment',
        variant: "destructive",
      });
    } finally {
      setCreatingAssessment(false);
    }
  };

  // Render Assessments Management Page
  const renderAssessmentsManagement = () => {
    const filteredAssessments = assessments.filter(assessment => {
      const matchesSearch = assessmentSearchQuery === "" ||
        (assessment.farm?.name || '').toLowerCase().includes(assessmentSearchQuery.toLowerCase()) ||
        (assessment.assessor?.name || '').toLowerCase().includes(assessmentSearchQuery.toLowerCase()) ||
        (assessment.farmer?.name || '').toLowerCase().includes(assessmentSearchQuery.toLowerCase());
      
      const matchesStatus = assessmentStatusFilter === "all" || 
        (assessment.status || '').toLowerCase() === assessmentStatusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Assessments Management</h1>
            <p className="text-white/60 mt-1">Manage and create assessments for farms</p>
          </div>
          <Button
            onClick={() => setShowAssessmentDialog(true)}
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Assessment
          </Button>
        </div>

        {/* Error Message */}
        {assessmentsError && (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <p className="text-red-400">{assessmentsError}</p>
                </div>
                <Button
                  onClick={loadAssessments}
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-white hover:bg-gray-800"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              placeholder="Search assessments..."
              value={assessmentSearchQuery}
              onChange={(e) => setAssessmentSearchQuery(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <Select value={assessmentStatusFilter} onValueChange={setAssessmentStatusFilter}>
            <SelectTrigger className="w-48 bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={loadAssessments}
            disabled={assessmentsLoading}
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${assessmentsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Assessments Table */}
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-0">
            {assessmentsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
                  <p className="text-white/60">Loading assessments...</p>
                </div>
              </div>
            ) : filteredAssessments.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-white/40" />
                  <p className="text-white/60">No assessments found</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-4 px-6 font-medium text-white/80">Farm</th>
                      <th className="text-left py-4 px-6 font-medium text-white/80">Farmer</th>
                      <th className="text-left py-4 px-6 font-medium text-white/80">Assessor</th>
                      <th className="text-left py-4 px-6 font-medium text-white/80">Status</th>
                      <th className="text-left py-4 px-6 font-medium text-white/80">Created</th>
                      <th className="text-left py-4 px-6 font-medium text-white/80">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssessments.map((assessment, index) => (
                      <tr
                        key={assessment._id || assessment.id || index}
                        className={`border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors ${
                          index % 2 === 0 ? "bg-gray-950/30" : ""
                        }`}
                      >
                        <td className="py-4 px-6 text-white">{assessment.farm?.name || 'N/A'}</td>
                        <td className="py-4 px-6 text-white">{assessment.farmer?.name || assessment.farm?.farmerName || 'N/A'}</td>
                        <td className="py-4 px-6 text-white">{assessment.assessor?.name || assessment.assessorId || 'N/A'}</td>
                        <td className="py-4 px-6">
                          <Badge
                            variant={
                              assessment.status === 'completed' || assessment.status === 'submitted'
                                ? 'default'
                                : assessment.status === 'in-progress'
                                ? 'secondary'
                                : 'outline'
                            }
                            className={
                              assessment.status === 'completed' || assessment.status === 'submitted'
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : assessment.status === 'in-progress'
                                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                            }
                          >
                            {assessment.status || 'Pending'}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-white/80">
                          {assessment.createdAt
                            ? new Date(assessment.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // View assessment details
                                toast({
                                  title: "Assessment Details",
                                  description: `Assessment ID: ${assessment._id || assessment.id}`,
                                  variant: "default",
                                });
                              }}
                              className="text-white hover:bg-gray-800"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Assessment Dialog */}
        <Dialog open={showAssessmentDialog} onOpenChange={setShowAssessmentDialog}>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Create Assessment</DialogTitle>
              <DialogDescription className="text-white/60">
                Create a new assessment by selecting a farm and an assessor.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="farmId" className="text-white">Farm</Label>
                <Select
                  value={assessmentFormData.farmId}
                  onValueChange={(value) => setAssessmentFormData({ ...assessmentFormData, farmId: value })}
                >
                  <SelectTrigger id="farmId" className="bg-gray-800 border-gray-700 text-white mt-1">
                    <SelectValue placeholder="Select a farm" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {farmsLoading ? (
                      <SelectItem value="loading" disabled>Loading farms...</SelectItem>
                    ) : !Array.isArray(farms) || farms.length === 0 ? (
                      <SelectItem value="none" disabled>No farms available</SelectItem>
                    ) : (
                      farms.map((farm) => (
                        <SelectItem key={farm._id || farm.id} value={farm._id || farm.id}>
                          {farm.name || 'Unnamed Farm'} - {farm.farmerName || farm.farmer?.name || 'Unknown Farmer'}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="assessorId" className="text-white">Assessor</Label>
                <Select
                  value={assessmentFormData.assessorId}
                  onValueChange={(value) => setAssessmentFormData({ ...assessmentFormData, assessorId: value })}
                >
                  <SelectTrigger id="assessorId" className="bg-gray-800 border-gray-700 text-white mt-1">
                    <SelectValue placeholder="Select an assessor" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {!Array.isArray(assessors) || assessors.length === 0 ? (
                      <SelectItem value="none" disabled>No assessors available</SelectItem>
                    ) : (
                      assessors.map((assessor) => (
                        <SelectItem key={assessor._id || assessor.id} value={assessor._id || assessor.id}>
                          {assessor.firstName} {assessor.lastName} ({assessor.email || assessor.phoneNumber})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAssessmentDialog(false);
                    setAssessmentFormData({ farmId: "", assessorId: "" });
                  }}
                  className="border-gray-700 text-white hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateAssessment}
                  disabled={creatingAssessment || !assessmentFormData.farmId || !assessmentFormData.assessorId}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {creatingAssessment ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Assessment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // Render page based on active selection
  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return renderDashboard();
      case "users": return renderUserManagement();
      case "policies": return renderPoliciesManagement();
      case "claims": return renderClaimsManagement();
      case "assessments": return renderAssessmentsManagement();
      case "settings": return renderSettings();
      default: return renderDashboard();
    }
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "users", label: "User Management", icon: Users },
    { id: "policies", label: "Policies", icon: FileCheck },
    { id: "claims", label: "Claims", icon: AlertCircle },
    { id: "assessments", label: "Assessments", icon: FileText },
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
      onLogout={handleLogout}
    >
      {renderPage()}
    </DashboardLayout>
  );
};
