import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  ResponsiveContainer
} from 'recharts';
import { 
  CheckCircle,
  Clock,
  MapPin,
  Shield,
  Wheat,
  Bell,
  FileText,
  AlertTriangle,
  BarChart3
} from "lucide-react";

export const FarmerDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  
  const policies = [
    { id: "1", crop: "Maize", status: "active", premium: 250000, coverage: 2500000, date: "2024-03-15", expiry: "2024-12-15", field: "Field A", hectares: 2.5 },
    { id: "2", crop: "Rice", status: "active", premium: 180000, coverage: 1800000, date: "2024-02-20", expiry: "2024-11-20", field: "Field B", hectares: 1.8 },
    { id: "3", crop: "Beans", status: "pending", premium: 120000, coverage: 1200000, date: "2024-03-10", expiry: "2024-10-10", field: "Field C", hectares: 1.2 },
    { id: "4", crop: "Coffee", status: "active", premium: 350000, coverage: 3500000, date: "2024-01-15", expiry: "2024-12-15", field: "Field D", hectares: 3.0 }
  ];

  const claims = [
    { id: "C001", crop: "Maize", type: "Drought Damage", amount: 500000, date: "2024-03-12", status: "pending", field: "Field A" },
    { id: "C002", crop: "Rice", type: "Flood Damage", amount: 320000, date: "2024-03-08", status: "approved", field: "Field B" },
    { id: "C003", crop: "Beans", type: "Pest Damage", amount: 180000, date: "2024-02-28", status: "completed", field: "Field C" }
  ];

  const fieldData = [
    { field: "Field A", crop: "Maize", size: "2.5 hectares", status: "Healthy", lastInspection: "2024-03-10", yield: "4.2 tons/ha" },
    { field: "Field B", crop: "Rice", size: "1.8 hectares", status: "Monitoring", lastInspection: "2024-03-08", yield: "3.8 tons/ha" },
    { field: "Field C", crop: "Beans", size: "1.2 hectares", status: "Healthy", lastInspection: "2024-03-05", yield: "2.1 tons/ha" },
    { field: "Field D", crop: "Coffee", size: "3.0 hectares", status: "Healthy", lastInspection: "2024-03-12", yield: "1.8 tons/ha" }
  ];

  const yieldData = [
    { month: 'Jan', maize: 3.8, rice: 3.2, beans: 1.8, coffee: 1.5 },
    { month: 'Feb', maize: 4.1, rice: 3.5, beans: 2.0, coffee: 1.6 },
    { month: 'Mar', maize: 4.2, rice: 3.8, beans: 2.1, coffee: 1.8 },
    { month: 'Apr', maize: 4.5, rice: 4.0, beans: 2.3, coffee: 1.9 },
    { month: 'May', maize: 4.8, rice: 4.2, beans: 2.5, coffee: 2.0 },
    { month: 'Jun', maize: 5.0, rice: 4.5, beans: 2.7, coffee: 2.1 }
  ];

  const financialData = [
    { month: 'Jan', premium: 900000, claims: 0, net: -900000 },
    { month: 'Feb', premium: 900000, claims: 320000, net: -580000 },
    { month: 'Mar', premium: 900000, claims: 680000, net: -220000 },
    { month: 'Apr', premium: 900000, claims: 500000, net: -400000 },
    { month: 'May', premium: 900000, claims: 180000, net: -720000 },
    { month: 'Jun', premium: 900000, claims: 0, net: -900000 }
  ];

  const renderDashboard = () => (
    <DashboardPage title="Farmer Dashboard" actions={
      <Button className="bg-green-600 hover:bg-green-700">
        <Wheat className="h-4 w-4 mr-2" />
        New Policy
      </Button>
    }>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Policies" value="3" icon={<CheckCircle className="h-6 w-6 text-green-600" />} change="RWF 9M total coverage" />
        <StatCard title="Pending Claims" value="1" icon={<Clock className="h-6 w-6 text-blue-600" />} change="RWF 500K claim amount" />
        <StatCard title="Fields Monitored" value="4" icon={<MapPin className="h-6 w-6 text-orange-600" />} change="8.5 hectares" />
        <StatCard title="Total Premiums" value="RWF 900K" icon={<Shield className="h-6 w-6 text-green-600" />} change="Annual payments" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DataTable 
          headers={["Crop", "Status", "Coverage", "Expiry"]}
          data={policies}
          renderRow={(policy) => (
            <tr key={policy.id} className="border-b">
              <td className="py-3 px-4">{policy.crop}</td>
              <td className="py-3 px-4"><StatusBadge status={policy.status} /></td>
              <td className="py-3 px-4">RWF {policy.coverage.toLocaleString()}</td>
              <td className="py-3 px-4">{policy.expiry}</td>
            </tr>
          )}
        />

        <DataTable 
          headers={["Claim ID", "Type", "Amount", "Status"]}
          data={claims}
          renderRow={(claim) => (
            <tr key={claim.id} className="border-b">
              <td className="py-3 px-4">{claim.id}</td>
              <td className="py-3 px-4">{claim.type}</td>
              <td className="py-3 px-4">RWF {claim.amount.toLocaleString()}</td>
              <td className="py-3 px-4"><StatusBadge status={claim.status} /></td>
            </tr>
          )}
        />
      </div>
    </DashboardPage>
  );

  const renderPolicies = () => (
    <DashboardPage title="Insurance Policies" actions={
      <Button className="bg-green-600 hover:bg-green-700">
        <Shield className="h-4 w-4 mr-2" />
        New Policy
      </Button>
    }>
      <DataTable 
        headers={["Crop", "Status", "Premium", "Coverage", "Date", "Expiry", "Actions"]}
        data={policies}
        renderRow={(policy) => (
          <tr key={policy.id} className="border-b">
            <td className="py-3 px-4">{policy.crop}</td>
            <td className="py-3 px-4"><StatusBadge status={policy.status} /></td>
            <td className="py-3 px-4">RWF {policy.premium.toLocaleString()}</td>
            <td className="py-3 px-4">RWF {policy.coverage.toLocaleString()}</td>
            <td className="py-3 px-4">{policy.date}</td>
            <td className="py-3 px-4">{policy.expiry}</td>
            <td className="py-3 px-4">
              <Button size="sm" variant="outline">View</Button>
            </td>
          </tr>
        )}
      />
    </DashboardPage>
  );

  const renderClaims = () => (
    <DashboardPage title="Claims Management" actions={
      <Button className="bg-blue-600 hover:bg-blue-700">
        <FileText className="h-4 w-4 mr-2" />
        File Claim
      </Button>
    }>
      <DataTable 
        headers={["Claim ID", "Crop", "Type", "Amount", "Date", "Status", "Actions"]}
        data={claims}
        renderRow={(claim) => (
          <tr key={claim.id} className="border-b">
            <td className="py-3 px-4">{claim.id}</td>
            <td className="py-3 px-4">{claim.crop}</td>
            <td className="py-3 px-4">{claim.type}</td>
            <td className="py-3 px-4">RWF {claim.amount.toLocaleString()}</td>
            <td className="py-3 px-4">{claim.date}</td>
            <td className="py-3 px-4"><StatusBadge status={claim.status} /></td>
            <td className="py-3 px-4">
              <Button size="sm" variant="outline">View</Button>
            </td>
          </tr>
        )}
      />
    </DashboardPage>
  );

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return renderDashboard();
      case "policies":
        return renderPolicies();
      case "claims":
        return renderClaims();
      case "monitoring":
        return (
          <DashboardPage title="Field Monitoring" actions={
            <Button className="bg-green-600 hover:bg-green-700">
              <MapPin className="h-4 w-4 mr-2" />
              Schedule Inspection
            </Button>
          }>
            <div className="grid gap-6 lg:grid-cols-2">
              <DataTable 
                headers={["Field", "Crop", "Size", "Status", "Last Inspection", "Yield"]}
                data={fieldData}
                renderRow={(field) => (
                  <tr key={field.field} className="border-b">
                    <td className="py-3 px-4 font-medium">{field.field}</td>
                    <td className="py-3 px-4">{field.crop}</td>
                    <td className="py-3 px-4">{field.size}</td>
                    <td className="py-3 px-4"><StatusBadge status={field.status} /></td>
                    <td className="py-3 px-4">{field.lastInspection}</td>
                    <td className="py-3 px-4">{field.yield}</td>
                  </tr>
                )}
              />
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">Low rainfall expected</span>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-800">Policy renewal due soon</span>
                  </div>
                </div>
              </div>
            </div>
          </DashboardPage>
        );
      case "reports":
        return (
          <DashboardPage title="Reports & Analytics" actions={
            <Button className="bg-blue-600 hover:bg-blue-700">
              <BarChart3 className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          }>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Crop Yield Trends</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={yieldData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${value} tons/ha`} />
                      <Tooltip formatter={(value: number, name: string) => [`${value} tons/ha`, name.charAt(0).toUpperCase() + name.slice(1)]} />
                      <Line type="monotone" dataKey="maize" stroke="#3B82F6" strokeWidth={2} name="maize" />
                      <Line type="monotone" dataKey="rice" stroke="#10B981" strokeWidth={2} name="rice" />
                      <Line type="monotone" dataKey="beans" stroke="#F59E0B" strokeWidth={2} name="beans" />
                      <Line type="monotone" dataKey="coffee" stroke="#8B5CF6" strokeWidth={2} name="coffee" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Financial Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-green-800">Total Premiums Paid</div>
                      <div className="text-sm text-green-600">Annual payments</div>
                    </div>
                    <div className="text-xl font-bold text-green-700">RWF 900,000</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium text-blue-800">Claims Received</div>
                      <div className="text-sm text-blue-600">Total claim amount</div>
                    </div>
                    <div className="text-xl font-bold text-blue-700">RWF 1,000,000</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div>
                      <div className="font-medium text-purple-800">Net Benefit</div>
                      <div className="text-sm text-purple-600">Savings from insurance</div>
                    </div>
                    <div className="text-xl font-bold text-purple-700">RWF 100,000</div>
                  </div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={financialData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `RWF ${(value / 1000000).toFixed(1)}M`} />
                      <Tooltip formatter={(value: number, name: string) => [`RWF ${value.toLocaleString()}`, name === 'premium' ? 'Premium Paid' : name === 'claims' ? 'Claims Received' : 'Net']} />
                      <Area type="monotone" dataKey="premium" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="claims" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </DashboardPage>
        );
      case "notifications":
        return (
          <DashboardPage title="Notifications">
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Weather Alert</p>
                    <p className="text-sm text-gray-600">Low rainfall expected in your area for the next 3 days.</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Bell className="h-4 w-4 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Policy Reminder</p>
                    <p className="text-sm text-gray-600">Your maize policy expires in 30 days.</p>
                    <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </DashboardPage>
        );
      case "profile":
        return (
          <DashboardPage title="Profile Settings">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <Button>Save Changes</Button>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="farmName">Farm Name</Label>
                  <Input id="farmName" defaultValue="Green Valley Farm" />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue="Iowa, USA" />
                </div>
                <div>
                  <Label htmlFor="farmSize">Farm Size (hectares)</Label>
                  <Input id="farmSize" type="number" defaultValue="12.5" />
                </div>
                <Button>Update Farm Info</Button>
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
      role="farmer" 
      activePage={activePage} 
      onPageChange={setActivePage}
    >
      {renderPage()}
    </BaseDashboard>
  );
};