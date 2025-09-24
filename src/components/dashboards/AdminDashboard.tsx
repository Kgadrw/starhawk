import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BaseDashboard } from "./BaseDashboard";
import { DashboardPage, StatCard, DataTable, StatusBadge } from "./DashboardPage";
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

  const renderDashboard = () => (
    <DashboardPage title="Admin Panel" actions={
      <Button className="bg-gray-600 hover:bg-gray-700">
        <Settings className="h-4 w-4 mr-2" />
        System Settings
      </Button>
    }>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value="1,247" icon={<Users className="h-6 w-6 text-blue-600" />} change="+23 this week" changeType="positive" />
        <StatCard title="Active Sessions" value="89" icon={<Activity className="h-6 w-6 text-green-600" />} change="+12 from yesterday" changeType="positive" />
        <StatCard title="System Health" value="99.9%" icon={<Shield className="h-6 w-6 text-green-600" />} change="All systems operational" changeType="positive" />
        <StatCard title="Storage Used" value="2.4GB" icon={<Database className="h-6 w-6 text-orange-600" />} change="45% of capacity" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DataTable 
          headers={["Name", "Email", "Role", "Status", "Last Login"]}
          data={users}
          renderRow={(user) => (
            <tr key={user.id} className="border-b">
              <td className="py-3 px-4">{user.name}</td>
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4"><StatusBadge status={user.role} /></td>
              <td className="py-3 px-4"><StatusBadge status={user.status} /></td>
              <td className="py-3 px-4">{user.lastLogin}</td>
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
      </div>
    </DashboardPage>
  );

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return renderDashboard();
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