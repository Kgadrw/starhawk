import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BaseDashboard } from "./BaseDashboard";
import { DashboardPage, StatCard, DataTable, StatusBadge } from "./DashboardPage";
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
    { id: "1", crop: "Maize", status: "active", premium: 2500, coverage: 25000, date: "2024-03-15", expiry: "2024-12-15" },
    { id: "2", crop: "Rice", status: "active", premium: 1800, coverage: 18000, date: "2024-02-20", expiry: "2024-11-20" },
    { id: "3", crop: "Beans", status: "pending", premium: 1200, coverage: 12000, date: "2024-03-10", expiry: "2024-10-10" }
  ];

  const claims = [
    { id: "C001", crop: "Maize", type: "Drought Damage", amount: 5000, date: "2024-03-12", status: "pending" }
  ];

  const renderDashboard = () => (
    <DashboardPage title="Farmer Dashboard" actions={
      <Button className="bg-green-600 hover:bg-green-700">
        <Wheat className="h-4 w-4 mr-2" />
        New Policy
      </Button>
    }>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Policies" value="3" icon={<CheckCircle className="h-6 w-6 text-green-600" />} change="$45K total coverage" />
        <StatCard title="Pending Claims" value="1" icon={<Clock className="h-6 w-6 text-blue-600" />} change="$5K claim amount" />
        <StatCard title="Fields Monitored" value="5" icon={<MapPin className="h-6 w-6 text-orange-600" />} change="12.5 hectares" />
        <StatCard title="Risk Level" value="Low" icon={<Shield className="h-6 w-6 text-green-600" />} change="All systems normal" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DataTable 
          headers={["Crop", "Status", "Coverage", "Expiry"]}
          data={policies}
          renderRow={(policy) => (
            <tr key={policy.id} className="border-b">
              <td className="py-3 px-4">{policy.crop}</td>
              <td className="py-3 px-4"><StatusBadge status={policy.status} /></td>
              <td className="py-3 px-4">${policy.coverage.toLocaleString()}</td>
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
              <td className="py-3 px-4">${claim.amount.toLocaleString()}</td>
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
            <td className="py-3 px-4">${policy.premium.toLocaleString()}</td>
            <td className="py-3 px-4">${policy.coverage.toLocaleString()}</td>
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
            <td className="py-3 px-4">${claim.amount.toLocaleString()}</td>
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
          <DashboardPage title="Field Monitoring">
            <div className="grid gap-6 lg:grid-cols-2">
              <DataTable 
                headers={["Field", "Crop", "Size", "Status"]}
                data={[
                  { field: "Field A", crop: "Maize", size: "5.2 hectares", status: "Healthy" },
                  { field: "Field B", crop: "Rice", size: "3.8 hectares", status: "Healthy" },
                  { field: "Field C", crop: "Beans", size: "3.5 hectares", status: "Monitoring" }
                ]}
                renderRow={(field) => (
                  <tr key={field.field} className="border-b">
                    <td className="py-3 px-4">{field.field}</td>
                    <td className="py-3 px-4">{field.crop}</td>
                    <td className="py-3 px-4">{field.size}</td>
                    <td className="py-3 px-4"><StatusBadge status={field.status} /></td>
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
          <DashboardPage title="Reports & Analytics">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-12 w-12 text-gray-400" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Premiums Paid</span>
                  <span className="font-medium">$5,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Claims Received</span>
                  <span className="font-medium">$5,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Net Cost</span>
                  <span className="font-medium text-red-600">$500</span>
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