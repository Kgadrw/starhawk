import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BaseDashboard } from "./BaseDashboard";
import { DashboardPage, StatCard, DataTable, StatusBadge } from "./DashboardPage";
import { 
  LineChart as RechartsLineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Settings,
  Users,
  Shield,
  Activity,
  Database,
  Bell,
  FileText,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Percent,
  Wallet,
  CreditCard,
  TrendingDown,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

export const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [commissionSettings, setCommissionSettings] = useState({
    policySale: 15,
    claimProcessing: 10,
    policyRenewal: 15,
    assessmentFee: 15,
    premiumCollection: 5
  });
  const [isEditingCommission, setIsEditingCommission] = useState(false);
  
  const users = [
    { id: "U001", name: "John Doe", email: "john@example.com", role: "farmer", status: "active", lastLogin: "2024-03-15" },
    { id: "U002", name: "Jane Smith", email: "jane@example.com", role: "insurer", status: "active", lastLogin: "2024-03-14" },
    { id: "U003", name: "Bob Wilson", email: "bob@example.com", role: "assessor", status: "inactive", lastLogin: "2024-03-10" }
  ];

  const systemLogs = [
    { id: "L001", action: "User Login", user: "John Doe", timestamp: "2024-03-15 10:30:00", status: "success" },
    { id: "L002", action: "Policy Created", user: "Jane Smith", timestamp: "2024-03-15 09:15:00", status: "success" },
    { id: "L003", action: "Failed Login", user: "Unknown", timestamp: "2024-03-15 08:45:00", status: "failed" }
  ];

  const transactions = [
    { id: "T001", type: "Policy Sale", user: "John Doe", amount: 2500000, commission: 375000, percentage: 15, date: "2024-03-15", status: "completed" },
    { id: "T002", type: "Claim Processing", user: "Jane Smith", amount: 5000000, commission: 500000, percentage: 10, date: "2024-03-14", status: "completed" },
    { id: "T003", type: "Policy Renewal", user: "Bob Wilson", amount: 1800000, commission: 270000, percentage: 15, date: "2024-03-13", status: "pending" },
    { id: "T004", type: "New Policy", user: "Alice Brown", amount: 3200000, commission: 480000, percentage: 15, date: "2024-03-12", status: "completed" },
    { id: "T005", type: "Assessment Fee", user: "Charlie Davis", amount: 800000, commission: 120000, percentage: 15, date: "2024-03-11", status: "completed" }
  ];

  const handleCommissionUpdate = (key: string, value: number) => {
    setCommissionSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveCommissionSettings = () => {
    // In a real app, this would save to the backend
    console.log('Saving commission settings:', commissionSettings);
    setIsEditingCommission(false);
  };

  const revenueData = [
    { month: 'Jan', revenue: 12000000, commission: 1800000 },
    { month: 'Feb', revenue: 14500000, commission: 2175000 },
    { month: 'Mar', revenue: 16800000, commission: 2520000 },
    { month: 'Apr', revenue: 19200000, commission: 2880000 },
    { month: 'May', revenue: 21500000, commission: 3225000 },
    { month: 'Jun', revenue: 23800000, commission: 3570000 }
  ];

  const commissionBreakdown = [
    { name: 'Policy Sales', value: 8450000, color: '#3B82F6' },
    { name: 'Claim Processing', value: 4200000, color: '#10B981' },
    { name: 'Policy Renewals', value: 2800000, color: '#F59E0B' },
    { name: 'Assessment Fees', value: 200000, color: '#8B5CF6' }
  ];

  const transactionTrends = [
    { day: 'Mon', transactions: 12, amount: 2500000 },
    { day: 'Tue', transactions: 18, amount: 3800000 },
    { day: 'Wed', transactions: 15, amount: 3200000 },
    { day: 'Thu', transactions: 22, amount: 4500000 },
    { day: 'Fri', transactions: 25, amount: 5200000 },
    { day: 'Sat', transactions: 8, amount: 1800000 },
    { day: 'Sun', transactions: 5, amount: 1200000 }
  ];

  const renderDashboard = () => (
    <DashboardPage title="Admin Panel" actions={
      <Button className="bg-gray-600 hover:bg-gray-700">
        <Settings className="h-4 w-4 mr-2" />
        System Settings
      </Button>
    }>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value="RWF 1,745,000" icon={<DollarSign className="h-6 w-6 text-green-600" />} change="+RWF 245,000 this week" changeType="positive" />
        <StatCard title="Active Transactions" value="89" icon={<CreditCard className="h-6 w-6 text-blue-600" />} change="+12 from yesterday" changeType="positive" />
        <StatCard title="Commission Rate" value="14.2%" icon={<Percent className="h-6 w-6 text-orange-600" />} change="Average across all services" />
        <StatCard title="Total Users" value="1,247" icon={<Users className="h-6 w-6 text-purple-600" />} change="+23 this week" changeType="positive" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Monthly Commission" value="RWF 12,450,000" icon={<Wallet className="h-6 w-6 text-green-600" />} change="+8.5% from last month" changeType="positive" />
        <StatCard title="Pending Payouts" value="RWF 3,200,000" icon={<Clock className="h-6 w-6 text-yellow-600" />} change="5 transactions pending" />
        <StatCard title="System Health" value="99.9%" icon={<Shield className="h-6 w-6 text-green-600" />} change="All systems operational" changeType="positive" />
        <StatCard title="Storage Used" value="2.4GB" icon={<Database className="h-6 w-6 text-orange-600" />} change="45% of capacity" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DataTable 
          headers={["Transaction Type", "User", "Amount", "Commission", "Date", "Status", "Actions"]}
          data={transactions}
          renderRow={(transaction) => (
            <tr key={transaction.id} className="border-b">
              <td className="py-3 px-4">{transaction.type}</td>
              <td className="py-3 px-4">{transaction.user}</td>
              <td className="py-3 px-4">RWF {transaction.amount.toLocaleString()}</td>
              <td className="py-3 px-4">
                <div>
                  <div className="font-medium text-green-600">RWF {transaction.commission.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{transaction.percentage}%</div>
                </div>
              </td>
              <td className="py-3 px-4">{transaction.date}</td>
              <td className="py-3 px-4"><StatusBadge status={transaction.status} /></td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </td>
            </tr>
          )}
        />

        <DataTable 
          headers={["Action", "User", "Timestamp", "Status"]}
          data={systemLogs}
          renderRow={(log) => (
            <tr key={log.id} className="border-b">
              <td className="py-3 px-4">{log.action}</td>
              <td className="py-3 px-4">{log.user}</td>
              <td className="py-3 px-4">{log.timestamp}</td>
              <td className="py-3 px-4"><StatusBadge status={log.status} /></td>
            </tr>
          )}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Weekly Transaction Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={transactionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `RWF ${(value / 1000000).toFixed(0)}M`} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'transactions' ? value : `RWF ${value.toLocaleString()}`,
                      name === 'transactions' ? 'Transactions' : 'Amount'
                    ]}
                  />
                  <Bar yAxisId="left" dataKey="transactions" fill="#3B82F6" name="transactions" />
                  <Line yAxisId="right" type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={3} name="amount" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPage>
  );

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return renderDashboard();
      case "monetization":
        return (
          <DashboardPage title="Monetization & Commission Management" actions={
            <div className="flex gap-2">
              <Button className="bg-green-600 hover:bg-green-700">
                <DollarSign className="h-4 w-4 mr-2" />
                Process Payouts
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          }>
            <div className="grid gap-6 lg:grid-cols-3">
              <StatCard title="Total Commission Earned" value="RWF 15,650,000" icon={<DollarSign className="h-6 w-6 text-green-600" />} change="+12.5% this month" changeType="positive" />
              <StatCard title="Average Commission Rate" value="14.2%" icon={<Percent className="h-6 w-6 text-blue-600" />} change="Across all services" />
              <StatCard title="Active Revenue Streams" value="5" icon={<TrendingUp className="h-6 w-6 text-orange-600" />} change="All streams active" changeType="positive" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Revenue Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `RWF ${(value / 1000000).toFixed(0)}M`} />
                        <Tooltip 
                          formatter={(value: number, name: string) => [
                            `RWF ${value.toLocaleString()}`, 
                            name === 'revenue' ? 'Revenue' : 'Commission'
                          ]}
                        />
                        <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="commission" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Commission Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={commissionBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {commissionBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `RWF ${value.toLocaleString()}`} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      {commissionBreakdown.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DataTable 
              headers={["Transaction ID", "Type", "User", "Amount", "Commission", "Rate", "Date", "Status", "Actions"]}
              data={transactions}
              renderRow={(transaction) => (
                <tr key={transaction.id} className="border-b">
                  <td className="py-3 px-4 font-mono text-sm">{transaction.id}</td>
                  <td className="py-3 px-4">{transaction.type}</td>
                  <td className="py-3 px-4">{transaction.user}</td>
                  <td className="py-3 px-4">RWF {transaction.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-green-600">RWF {transaction.commission.toLocaleString()}</div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      {transaction.percentage}%
                    </Badge>
                  </td>
                  <td className="py-3 px-4">{transaction.date}</td>
                  <td className="py-3 px-4"><StatusBadge status={transaction.status} /></td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" title="View Details">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" title="Edit Transaction">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" title="Remove">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            />
          </DashboardPage>
        );
      case "commission":
        return (
          <DashboardPage title="Commission Settings" actions={
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Settings className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          }>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Commission Rates by Service</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="policySale" className="text-sm font-medium">Policy Sales</Label>
                      <p className="text-xs text-gray-500">Commission for new policy sales</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="policySale" 
                        type="number" 
                        defaultValue={commissionSettings.policySale} 
                        className="w-20 text-center"
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="claimProcessing" className="text-sm font-medium">Claim Processing</Label>
                      <p className="text-xs text-gray-500">Commission for processed claims</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="claimProcessing" 
                        type="number" 
                        defaultValue={commissionSettings.claimProcessing} 
                        className="w-20 text-center"
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="policyRenewal" className="text-sm font-medium">Policy Renewals</Label>
                      <p className="text-xs text-gray-500">Commission for policy renewals</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="policyRenewal" 
                        type="number" 
                        defaultValue={commissionSettings.policyRenewal} 
                        className="w-20 text-center"
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="assessmentFee" className="text-sm font-medium">Assessment Fees</Label>
                      <p className="text-xs text-gray-500">Commission for field assessments</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="assessmentFee" 
                        type="number" 
                        defaultValue={commissionSettings.assessmentFee} 
                        className="w-20 text-center"
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="premiumCollection" className="text-sm font-medium">Premium Collection</Label>
                      <p className="text-xs text-gray-500">Commission for premium collections</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="premiumCollection" 
                        type="number" 
                        defaultValue={commissionSettings.premiumCollection} 
                        className="w-20 text-center"
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Revenue Analytics</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-green-800">This Month's Revenue</h4>
                        <p className="text-sm text-green-600">Total commission earned</p>
                      </div>
                      <div className="text-2xl font-bold text-green-700">RWF 15,650,000</div>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-blue-800">Top Revenue Service</h4>
                        <p className="text-sm text-blue-600">Highest earning service</p>
                      </div>
                      <div className="text-xl font-bold text-blue-700">Policy Sales</div>
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-orange-800">Growth Rate</h4>
                        <p className="text-sm text-orange-600">Month over month</p>
                      </div>
                      <div className="text-xl font-bold text-orange-700">+12.5%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DashboardPage>
        );
      case "users":
        return (
          <DashboardPage title="User Management" actions={
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Users className="h-4 w-4 mr-2" />
              Add User
            </Button>
          }>
            <DataTable 
              headers={["Name", "Email", "Role", "Status", "Last Login", "Actions"]}
              data={users}
              renderRow={(user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4"><StatusBadge status={user.role} /></td>
                  <td className="py-3 px-4"><StatusBadge status={user.status} /></td>
                  <td className="py-3 px-4">{user.lastLogin}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">Delete</Button>
                    </div>
                  </td>
                </tr>
              )}
            />
          </DashboardPage>
        );
      case "system":
        return (
          <DashboardPage title="System Monitoring">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">CPU Usage</span>
                  <span className="font-medium text-green-600">23%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Memory Usage</span>
                  <span className="font-medium text-yellow-600">67%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Disk Usage</span>
                  <span className="font-medium text-orange-600">45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Network I/O</span>
                  <span className="font-medium text-green-600">12 MB/s</span>
                </div>
              </div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <Activity className="h-12 w-12 text-gray-400" />
              </div>
            </div>
          </DashboardPage>
        );
      case "analytics":
        return (
          <DashboardPage title="System Analytics">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-12 w-12 text-gray-400" />
              </div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-12 w-12 text-gray-400" />
              </div>
            </div>
          </DashboardPage>
        );
      case "security":
        return (
          <DashboardPage title="Security Overview">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">All security systems operational</span>
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">3 failed login attempts detected</span>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-800">SSL certificate expires in 30 days</span>
                </div>
              </div>
            </div>
          </DashboardPage>
        );
      case "logs":
        return (
          <DashboardPage title="System Logs">
            <DataTable 
              headers={["Action", "User", "Timestamp", "Status", "Details"]}
              data={systemLogs}
              renderRow={(log) => (
                <tr key={log.id} className="border-b">
                  <td className="py-3 px-4">{log.action}</td>
                  <td className="py-3 px-4">{log.user}</td>
                  <td className="py-3 px-4">{log.timestamp}</td>
                  <td className="py-3 px-4"><StatusBadge status={log.status} /></td>
                  <td className="py-3 px-4">
                    <Button size="sm" variant="outline">View</Button>
                  </td>
                </tr>
              )}
            />
          </DashboardPage>
        );
      case "backup":
        return (
          <DashboardPage title="Backup Management" actions={
            <Button className="bg-green-600 hover:bg-green-700">
              <Database className="h-4 w-4 mr-2" />
              Create Backup
            </Button>
          }>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">Last backup: 2024-03-15 02:00:00</span>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-800">Next scheduled backup: 2024-03-16 02:00:00</span>
                </div>
              </div>
            </div>
          </DashboardPage>
        );
      case "settings":
        return (
          <DashboardPage title="System Settings">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">General Settings</h3>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">System Name</label>
                  <input className="w-full p-2 border rounded" defaultValue="STARHAWK Platform" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Maintenance Mode</label>
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Enable maintenance mode</span>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Security Settings</h3>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Session Timeout (minutes)</label>
                  <input type="number" className="w-full p-2 border rounded" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Max Login Attempts</label>
                  <input type="number" className="w-full p-2 border rounded" defaultValue="5" />
                </div>
              </div>
            </div>
          </DashboardPage>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <BaseDashboard 
      role="admin" 
      activePage={activePage} 
      onPageChange={setActivePage}
    >
      {renderPage()}
    </BaseDashboard>
  );
};