import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BaseDashboard } from "./BaseDashboard";
import { DashboardPage, StatCard, DataTable, StatusBadge } from "./DashboardPage";
import { 
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Building2,
  FileText,
  BarChart3,
  Users,
  MapPin,
  Bell
} from "lucide-react";

export const InsurerDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  
  const policies = [
    { id: "P001", client: "John Doe", crop: "Maize", premium: 2500, coverage: 25000, status: "active", date: "2024-03-15" },
    { id: "P002", client: "Jane Smith", crop: "Rice", premium: 1800, coverage: 18000, status: "active", date: "2024-02-20" },
    { id: "P003", client: "Bob Wilson", crop: "Beans", premium: 1200, coverage: 12000, status: "pending", date: "2024-03-10" }
  ];

  const claims = [
    { id: "C001", client: "John Doe", crop: "Maize", type: "Drought Damage", amount: 5000, status: "pending", date: "2024-03-12" },
    { id: "C002", client: "Jane Smith", crop: "Rice", type: "Flood Damage", amount: 3200, status: "approved", date: "2024-03-08" }
  ];

  const renderDashboard = () => (
    <DashboardPage title="Insurer Dashboard" actions={
      <Button className="bg-blue-600 hover:bg-blue-700">
        <Building2 className="h-4 w-4 mr-2" />
        New Policy
      </Button>
    }>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Policies" value="156" icon={<FileText className="h-6 w-6 text-blue-600" />} change="+12 this month" changeType="positive" />
        <StatCard title="Active Claims" value="23" icon={<Clock className="h-6 w-6 text-orange-600" />} change="3 pending review" />
        <StatCard title="Total Premium" value="$2.4M" icon={<TrendingUp className="h-6 w-6 text-green-600" />} change="+8.5% from last month" changeType="positive" />
        <StatCard title="Risk Score" value="Low" icon={<CheckCircle className="h-6 w-6 text-green-600" />} change="All regions stable" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DataTable 
          headers={["Client", "Crop", "Premium", "Status"]}
          data={policies}
          renderRow={(policy) => (
            <tr key={policy.id} className="border-b">
              <td className="py-3 px-4">{policy.client}</td>
              <td className="py-3 px-4">{policy.crop}</td>
              <td className="py-3 px-4">${policy.premium.toLocaleString()}</td>
              <td className="py-3 px-4"><StatusBadge status={policy.status} /></td>
            </tr>
          )}
        />

        <DataTable 
          headers={["Claim ID", "Client", "Type", "Amount", "Status"]}
          data={claims}
          renderRow={(claim) => (
            <tr key={claim.id} className="border-b">
              <td className="py-3 px-4">{claim.id}</td>
              <td className="py-3 px-4">{claim.client}</td>
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
    <DashboardPage title="Policy Management" actions={
      <Button className="bg-blue-600 hover:bg-blue-700">
        <FileText className="h-4 w-4 mr-2" />
        New Policy
      </Button>
    }>
      <DataTable 
        headers={["Policy ID", "Client", "Crop", "Premium", "Coverage", "Status", "Date", "Actions"]}
        data={policies}
        renderRow={(policy) => (
          <tr key={policy.id} className="border-b">
            <td className="py-3 px-4">{policy.id}</td>
            <td className="py-3 px-4">{policy.client}</td>
            <td className="py-3 px-4">{policy.crop}</td>
            <td className="py-3 px-4">${policy.premium.toLocaleString()}</td>
            <td className="py-3 px-4">${policy.coverage.toLocaleString()}</td>
            <td className="py-3 px-4"><StatusBadge status={policy.status} /></td>
            <td className="py-3 px-4">{policy.date}</td>
            <td className="py-3 px-4">
              <Button size="sm" variant="outline">View</Button>
            </td>
          </tr>
        )}
      />
    </DashboardPage>
  );

  const renderClaims = () => (
    <DashboardPage title="Claims Processing" actions={
      <Button className="bg-orange-600 hover:bg-orange-700">
        <AlertTriangle className="h-4 w-4 mr-2" />
        Process Claims
      </Button>
    }>
      <DataTable 
        headers={["Claim ID", "Client", "Crop", "Type", "Amount", "Date", "Status", "Actions"]}
        data={claims}
        renderRow={(claim) => (
          <tr key={claim.id} className="border-b">
            <td className="py-3 px-4">{claim.id}</td>
            <td className="py-3 px-4">{claim.client}</td>
            <td className="py-3 px-4">{claim.crop}</td>
            <td className="py-3 px-4">{claim.type}</td>
            <td className="py-3 px-4">${claim.amount.toLocaleString()}</td>
            <td className="py-3 px-4">{claim.date}</td>
            <td className="py-3 px-4"><StatusBadge status={claim.status} /></td>
            <td className="py-3 px-4">
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Review</Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">Approve</Button>
              </div>
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
      case "risk":
        return (
          <DashboardPage title="Risk Assessment">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-12 w-12 text-gray-400" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">High Risk Areas</span>
                  <span className="font-medium text-red-600">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Medium Risk Areas</span>
                  <span className="font-medium text-yellow-600">7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Low Risk Areas</span>
                  <span className="font-medium text-green-600">12</span>
                </div>
              </div>
            </div>
          </DashboardPage>
        );
      case "portfolio":
        return (
          <DashboardPage title="Portfolio Overview">
            <div className="grid gap-6 lg:grid-cols-3">
              <StatCard title="Total Portfolio Value" value="$15.2M" icon={<TrendingUp className="h-6 w-6 text-green-600" />} change="+12.5% YoY" changeType="positive" />
              <StatCard title="Active Policies" value="156" icon={<FileText className="h-6 w-6 text-blue-600" />} change="+8 this month" changeType="positive" />
              <StatCard title="Claims Ratio" value="3.2%" icon={<AlertTriangle className="h-6 w-6 text-orange-600" />} change="Below industry average" changeType="positive" />
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
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-12 w-12 text-gray-400" />
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
      role="insurer" 
      activePage={activePage} 
      onPageChange={setActivePage}
    >
      {renderPage()}
    </BaseDashboard>
  );
};