import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BaseDashboard } from "./BaseDashboard";
import { DashboardPage, StatCard, DataTable, StatusBadge } from "./DashboardPage";
import { 
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  FileText,
  Bell,
  Activity,
  Shield,
  Globe,
  Database
} from "lucide-react";

export const GovernmentDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  
  const regions = [
    { id: "R001", name: "Northern Region", farmers: 1250, policies: 890, claims: 45, status: "stable" },
    { id: "R002", name: "Central Region", farmers: 2100, policies: 1650, claims: 78, status: "stable" },
    { id: "R003", name: "Southern Region", farmers: 1800, policies: 1200, claims: 92, status: "high-risk" }
  ];

  const renderDashboard = () => (
    <DashboardPage title="Government Analytics" actions={
      <Button className="bg-red-600 hover:bg-red-700">
        <Globe className="h-4 w-4 mr-2" />
        Generate Report
      </Button>
    }>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Farmers" value="5,150" icon={<Users className="h-6 w-6 text-blue-600" />} change="+245 this month" changeType="positive" />
        <StatCard title="Active Policies" value="3,740" icon={<FileText className="h-6 w-6 text-green-600" />} change="+12% coverage" changeType="positive" />
        <StatCard title="Total Claims" value="215" icon={<Activity className="h-6 w-6 text-orange-600" />} change="+8 this week" />
        <StatCard title="Risk Level" value="Moderate" icon={<Shield className="h-6 w-6 text-yellow-600" />} change="3 high-risk areas" />
      </div>

      <DataTable 
        headers={["Region", "Farmers", "Policies", "Claims", "Status"]}
        data={regions}
        renderRow={(region) => (
          <tr key={region.id} className="border-b">
            <td className="py-3 px-4">{region.name}</td>
            <td className="py-3 px-4">{region.farmers.toLocaleString()}</td>
            <td className="py-3 px-4">{region.policies.toLocaleString()}</td>
            <td className="py-3 px-4">{region.claims}</td>
            <td className="py-3 px-4"><StatusBadge status={region.status} /></td>
          </tr>
        )}
      />
    </DashboardPage>
  );

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return renderDashboard();
      case "monitoring":
        return (
          <DashboardPage title="National Monitoring">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-12 w-12 text-gray-400" />
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
      case "sector":
        return (
          <DashboardPage title="Agricultural Sector Overview">
            <div className="grid gap-6 lg:grid-cols-3">
              <StatCard title="Crop Insurance Coverage" value="72.5%" icon={<Shield className="h-6 w-6 text-green-600" />} change="+5.2% from last year" changeType="positive" />
              <StatCard title="Average Claim Amount" value="$3,250" icon={<TrendingUp className="h-6 w-6 text-blue-600" />} change="+8.1% YoY" changeType="positive" />
              <StatCard title="Policy Renewal Rate" value="89%" icon={<FileText className="h-6 w-6 text-orange-600" />} change="+2.3% from last year" changeType="positive" />
            </div>
          </DashboardPage>
        );
      case "trends":
        return (
          <DashboardPage title="Market Trends">
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
      case "reports":
        return (
          <DashboardPage title="Government Reports" actions={
            <Button className="bg-red-600 hover:bg-red-700">
              <FileText className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          }>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-800">Monthly Agricultural Report - March 2024</span>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">Insurance Coverage Analysis - Q1 2024</span>
                </div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-orange-800">Risk Assessment Summary - Regional</span>
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
      role="government" 
      activePage={activePage} 
      onPageChange={setActivePage}
    >
      {renderPage()}
    </BaseDashboard>
  );
};