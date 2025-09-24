import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RoleSidebar } from "@/components/RoleSidebar";
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
  TrendingUp
} from "lucide-react";

export const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <div className="space-y-6 p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Admin Dashboard
              </h1>
              <p className="text-gray-500 font-light">System administration and management</p>
            </div>

            {/* System Overview */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-3xl font-light text-gray-900">3,247</p>
                      <p className="text-xs text-gray-600">+8% this month</p>
                    </div>
                    <Users className="h-12 w-12 text-gray-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Active Sessions</p>
                      <p className="text-3xl font-light text-blue-900">1,156</p>
                      <p className="text-xs text-blue-600">Currently online</p>
                    </div>
                    <Activity className="h-12 w-12 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">System Health</p>
                      <p className="text-3xl font-light text-green-900">99.9%</p>
                      <p className="text-xs text-green-600">Uptime this month</p>
                    </div>
                    <Shield className="h-12 w-12 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Data Storage</p>
                      <p className="text-3xl font-light text-purple-900">2.4TB</p>
                      <p className="text-xs text-purple-600">Used of 10TB</p>
                    </div>
                    <Database className="h-12 w-12 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Activity */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Recent System Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: "New user registered", user: "Jean Baptiste", time: "2 minutes ago", type: "success" },
                      { action: "Policy created", user: "Marie Uwimana", time: "5 minutes ago", type: "info" },
                      { action: "Claim submitted", user: "Paul Nkurunziza", time: "12 minutes ago", type: "warning" },
                      { action: "Assessment completed", user: "Alice Mukamana", time: "18 minutes ago", type: "success" },
                      { action: "System backup completed", user: "System", time: "1 hour ago", type: "info" }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-500">{activity.user} • {activity.time}</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { alert: "High server load detected", severity: "medium", time: "30 minutes ago" },
                      { alert: "Database backup overdue", severity: "low", time: "2 hours ago" },
                      { alert: "SSL certificate expires soon", severity: "high", time: "1 day ago" },
                      { alert: "Disk space running low", severity: "medium", time: "2 days ago" }
                    ].map((alert, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{alert.alert}</p>
                          <p className="text-sm text-gray-500">{alert.time}</p>
                        </div>
                        <Badge variant={alert.severity === "high" ? "destructive" : alert.severity === "medium" ? "default" : "secondary"}>
                          {alert.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "users":
        return (
          <div className="p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <h2 className="text-2xl font-light text-gray-900 mb-6">User Management</h2>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New User</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Enter full name" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Enter email" />
                      </div>
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="farmer">Farmer</SelectItem>
                            <SelectItem value="insurer">Insurer</SelectItem>
                            <SelectItem value="assessor">Assessor</SelectItem>
                            <SelectItem value="government">Government</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button className="w-full">Create User</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: "U001", name: "Jean Baptiste", email: "jean@example.com", role: "farmer", status: "active", lastLogin: "2024-03-20" },
                      { id: "U002", name: "Sarah Johnson", email: "sarah@agriinsurance.com", role: "insurer", status: "active", lastLogin: "2024-03-20" },
                      { id: "U003", name: "Michael Brown", email: "michael@fieldassessment.com", role: "assessor", status: "active", lastLogin: "2024-03-19" },
                      { id: "U004", name: "Dr. Alice Mukamana", email: "alice@minagri.gov.rw", role: "government", status: "active", lastLogin: "2024-03-18" },
                      { id: "U005", name: "System Admin", email: "admin@starhawk.com", role: "admin", status: "active", lastLogin: "2024-03-20" }
                    ].map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                            <Users className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <p className="text-sm text-gray-500">Last login: {user.lastLogin}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={user.status === "active" ? "default" : "secondary"}>
                            {user.status}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1 capitalize">{user.role}</p>
                          <div className="mt-2 space-x-2">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Button size="sm" variant="outline">Deactivate</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "system-logs":
        return (
          <div className="p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <h2 className="text-2xl font-light text-gray-900 mb-6">System Logs</h2>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent System Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { level: "INFO", message: "User login successful", user: "jean@example.com", time: "2024-03-20 14:30:25" },
                      { level: "WARN", message: "Failed login attempt", user: "unknown@example.com", time: "2024-03-20 14:25:10" },
                      { level: "INFO", message: "New policy created", user: "sarah@agriinsurance.com", time: "2024-03-20 14:20:15" },
                      { level: "ERROR", message: "Database connection timeout", user: "system", time: "2024-03-20 14:15:30" },
                      { level: "INFO", message: "System backup completed", user: "system", time: "2024-03-20 14:00:00" }
                    ].map((log, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant={log.level === "ERROR" ? "destructive" : log.level === "WARN" ? "default" : "secondary"}>
                            {log.level}
                          </Badge>
                          <div>
                            <p className="font-medium">{log.message}</p>
                            <p className="text-sm text-gray-500">{log.user} • {log.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <h2 className="text-2xl font-light text-gray-900 mb-6">System Settings</h2>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="siteName">Site Name</Label>
                        <Input id="siteName" defaultValue="STARHAWK" />
                      </div>
                      <div>
                        <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                        <Select defaultValue="false">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Enabled</SelectItem>
                            <SelectItem value="false">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="registrationEnabled">User Registration</Label>
                        <Select defaultValue="true">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Enabled</SelectItem>
                            <SelectItem value="false">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                        <Input id="maxFileSize" type="number" defaultValue="10" />
                      </div>
                    </div>
                    <Button>Save Settings</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                        <Input id="sessionTimeout" type="number" defaultValue="60" />
                      </div>
                      <div>
                        <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                        <Input id="maxLoginAttempts" type="number" defaultValue="5" />
                      </div>
                      <div>
                        <Label htmlFor="passwordMinLength">Password Min Length</Label>
                        <Input id="passwordMinLength" type="number" defaultValue="8" />
                      </div>
                      <div>
                        <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                        <Select defaultValue="false">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Enabled</SelectItem>
                            <SelectItem value="false">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button>Save Security Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <h2 className="text-2xl font-light text-gray-900 mb-6">System Notifications</h2>
            <div className="space-y-4">
              {[
                {
                  title: "System Maintenance Scheduled",
                  message: "Scheduled maintenance will occur on March 25, 2024 from 2:00 AM to 4:00 AM.",
                  time: "2 hours ago",
                  type: "info"
                },
                {
                  title: "High Server Load Alert",
                  message: "Server load has exceeded 80% for the past 30 minutes. Consider scaling resources.",
                  time: "1 day ago",
                  type: "warning"
                },
                {
                  title: "New User Registration",
                  message: "15 new users have registered in the past 24 hours.",
                  time: "3 days ago",
                  type: "success"
                },
                {
                  title: "Database Backup Completed",
                  message: "Daily database backup completed successfully. 2.4TB of data backed up.",
                  time: "1 week ago",
                  type: "info"
                }
              ].map((notification, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === 'warning' ? 'bg-yellow-500' :
                        notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <h3 className="font-medium">{notification.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <h2 className="text-2xl font-light text-gray-900 mb-6">Profile Settings</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="System Administrator" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="admin@starhawk.com" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" defaultValue="+250 123 456 789" />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input id="department" defaultValue="IT Department" />
                    </div>
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input id="position" defaultValue="System Administrator" />
                    </div>
                    <div>
                      <Label htmlFor="accessLevel">Access Level</Label>
                      <Input id="accessLevel" defaultValue="Super Admin" />
                    </div>
                  </div>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <div className="p-6"><h2 className="text-2xl font-light text-gray-900">Dashboard</h2></div>;
    }
  };

  return (
    <div className="flex w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <RoleSidebar
        role="admin"
        onPageChange={setActivePage}
        activePage={activePage}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};
