import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    { id: "P001", client: "John Doe", crop: "Maize", premium: 250000, coverage: 2500000, status: "active", date: "2024-03-15" },
    { id: "P002", client: "Jane Smith", crop: "Rice", premium: 180000, coverage: 1800000, status: "active", date: "2024-02-20" },
    { id: "P003", client: "Bob Wilson", crop: "Beans", premium: 120000, coverage: 1200000, status: "pending", date: "2024-03-10" }
  ];

  const claims = [
    { id: "C001", client: "John Doe", crop: "Maize", type: "Drought Damage", amount: 500000, status: "pending", date: "2024-03-12" },
    { id: "C002", client: "Jane Smith", crop: "Rice", type: "Flood Damage", amount: 320000, status: "approved", date: "2024-03-08" }
  ];

  const premiumData = [
    { month: 'Jan', collected: 1800000000, claims: 450000000 },
    { month: 'Feb', collected: 2025000000, claims: 380000000 },
    { month: 'Mar', collected: 2220000000, claims: 520000000 },
    { month: 'Apr', collected: 2430000000, claims: 420000000 },
    { month: 'May', collected: 2625000000, claims: 380000000 },
    { month: 'Jun', collected: 2835000000, claims: 450000000 }
  ];

  const riskData = [
    { region: 'Northern', policies: 45, claims: 8, riskScore: 18 },
    { region: 'Southern', policies: 62, claims: 12, riskScore: 19 },
    { region: 'Eastern', policies: 38, claims: 15, riskScore: 39 },
    { region: 'Western', policies: 55, claims: 9, riskScore: 16 },
    { region: 'Kigali', policies: 42, claims: 6, riskScore: 14 }
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
        <StatCard title="Total Premium" value="RWF 2.4B" icon={<TrendingUp className="h-6 w-6 text-green-600" />} change="+8.5% from last month" changeType="positive" />
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
              <td className="py-3 px-4">RWF {policy.premium.toLocaleString()}</td>
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
              <td className="py-3 px-4">RWF {claim.amount.toLocaleString()}</td>
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
            <td className="py-3 px-4">RWF {policy.premium.toLocaleString()}</td>
            <td className="py-3 px-4">RWF {policy.coverage.toLocaleString()}</td>
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
            <td className="py-3 px-4">RWF {claim.amount.toLocaleString()}</td>
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
          <DashboardPage title="Risk Assessment" actions={
            <Button className="bg-red-600 hover:bg-red-700">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Generate Risk Report
            </Button>
          }>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Risk Analysis by Region
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={riskData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="region" />
                        <YAxis />
                        <Tooltip formatter={(value: number, name: string) => [value, name === 'policies' ? 'Policies' : name === 'claims' ? 'Claims' : 'Risk Score']} />
                        <Bar dataKey="policies" fill="#3B82F6" name="policies" />
                        <Bar dataKey="claims" fill="#EF4444" name="claims" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Risk Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div>
                        <div className="font-medium text-red-800">High Risk Areas</div>
                        <div className="text-sm text-red-600">Eastern Province</div>
                      </div>
                      <div className="text-xl font-bold text-red-700">1</div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                      <div>
                        <div className="font-medium text-yellow-800">Medium Risk Areas</div>
                        <div className="text-sm text-yellow-600">Northern, Southern</div>
                      </div>
                      <div className="text-xl font-bold text-yellow-700">2</div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-medium text-green-800">Low Risk Areas</div>
                        <div className="text-sm text-green-600">Western, Kigali</div>
                      </div>
                      <div className="text-xl font-bold text-green-700">2</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DashboardPage>
        );
      case "portfolio":
        return (
          <DashboardPage title="Portfolio Overview">
            <div className="grid gap-6 lg:grid-cols-3">
              <StatCard title="Total Portfolio Value" value="RWF 15.2B" icon={<TrendingUp className="h-6 w-6 text-green-600" />} change="+12.5% YoY" changeType="positive" />
              <StatCard title="Active Policies" value="156" icon={<FileText className="h-6 w-6 text-blue-600" />} change="+8 this month" changeType="positive" />
              <StatCard title="Claims Ratio" value="3.2%" icon={<AlertTriangle className="h-6 w-6 text-orange-600" />} change="Below industry average" changeType="positive" />
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Premium Collection Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={premiumData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `RWF ${(value / 1000000000).toFixed(1)}B`} />
                        <Tooltip 
                          formatter={(value: number, name: string) => [
                            `RWF ${(value / 1000000000).toFixed(1)}B`, 
                            name === 'collected' ? 'Premium Collected' : 'Claims Paid'
                          ]}
                        />
                        <Area type="monotone" dataKey="collected" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="claims" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Regional Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={riskData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="region" />
                        <YAxis />
                        <Tooltip formatter={(value: number, name: string) => [value, name === 'policies' ? 'Policies' : name === 'claims' ? 'Claims' : 'Risk Score']} />
                        <Bar dataKey="policies" fill="#3B82F6" name="policies" />
                        <Bar dataKey="claims" fill="#EF4444" name="claims" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
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