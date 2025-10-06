import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BaseDashboard } from "./BaseDashboard";
import { DashboardPage, StatCard, DataTable, StatusBadge } from "./DashboardPage";
import { GovernmentAnalyticsDashboard } from "../government/GovernmentAnalyticsDashboard";
import { NotificationManager } from "../notifications/NotificationManager";
import { EmailNotificationSystem } from "../notifications/EmailNotificationSystem";
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
  Cell,
  ComposedChart
} from 'recharts';
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
  Database,
  DollarSign,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Map
} from "lucide-react";

export const GovernmentDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  
  const regions = [
    { id: "R001", name: "Northern Province", farmers: 1250, policies: 890, claims: 45, coverage: 72.5, totalPremium: 890000000, status: "stable" },
    { id: "R002", name: "Southern Province", farmers: 2100, policies: 1650, claims: 78, coverage: 78.6, totalPremium: 1650000000, status: "stable" },
    { id: "R003", name: "Eastern Province", farmers: 1800, policies: 1200, claims: 92, coverage: 66.7, totalPremium: 1200000000, status: "high-risk" },
    { id: "R004", name: "Western Province", farmers: 1950, policies: 1420, claims: 65, coverage: 72.8, totalPremium: 1420000000, status: "stable" },
    { id: "R005", name: "Kigali City", farmers: 850, policies: 680, claims: 25, coverage: 80.0, totalPremium: 680000000, status: "excellent" }
  ];

  const cropData = [
    { crop: "Maize", farmers: 3200, policies: 2400, claims: 120, avgPremium: 350000, totalValue: 840000000 },
    { crop: "Rice", farmers: 1800, policies: 1350, claims: 85, avgPremium: 420000, totalValue: 567000000 },
    { crop: "Beans", farmers: 2100, policies: 1680, claims: 95, avgPremium: 280000, totalValue: 470400000 },
    { crop: "Coffee", farmers: 950, policies: 760, claims: 35, avgPremium: 650000, totalValue: 494000000 },
    { crop: "Tea", farmers: 750, policies: 600, claims: 28, avgPremium: 580000, totalValue: 348000000 }
  ];

  const monthlyData = [
    { month: "Jan", policies: 1200, claims: 85, premium: 1800000000 },
    { month: "Feb", policies: 1350, claims: 92, premium: 2025000000 },
    { month: "Mar", policies: 1480, claims: 78, premium: 2220000000 },
    { month: "Apr", policies: 1620, claims: 105, premium: 2430000000 },
    { month: "May", policies: 1750, claims: 88, premium: 2625000000 },
    { month: "Jun", policies: 1890, claims: 95, premium: 2835000000 }
  ];

  const renderDashboard = () => (
    <DashboardPage title="Government Analytics" actions={
      <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <Globe className="h-4 w-4 mr-2" />
        Generate Report
      </Button>
    }>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Farmers" value="7,950" icon={<Users className="h-6 w-6 text-blue-600" />} change="+245 this month" changeType="positive" />
        <StatCard title="Active Policies" value="5,900" icon={<FileText className="h-6 w-6 text-green-600" />} change="74.2% coverage" changeType="positive" />
        <StatCard title="Total Premiums" value="RWF 5.94B" icon={<DollarSign className="h-6 w-6 text-green-600" />} change="+15.8% this quarter" changeType="positive" />
        <StatCard title="Risk Level" value="Moderate" icon={<Shield className="h-6 w-6 text-yellow-600" />} change="1 high-risk province" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Claims" value="305" icon={<Activity className="h-6 w-6 text-orange-600" />} change="+8 this week" />
        <StatCard title="Claims Paid" value="RWF 1.2B" icon={<TrendingUp className="h-6 w-6 text-blue-600" />} change="+12% from last month" changeType="positive" />
        <StatCard title="Coverage Rate" value="74.2%" icon={<BarChart3 className="h-6 w-6 text-purple-600" />} change="National average" />
        <StatCard title="Regions Covered" value="5" icon={<MapPin className="h-6 w-6 text-green-600" />} change="All provinces" changeType="positive" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Rwanda Agricultural Insurance Coverage Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gradient-to-br from-green-50 via-blue-50 to-orange-50 rounded-lg relative overflow-hidden">
              {/* Interactive Map Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Map className="h-24 w-24 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Rwanda Map</h3>
                  <p className="text-gray-600 mb-4">Interactive coverage visualization</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                      <p className="font-medium">High Coverage</p>
                      <p className="text-xs text-gray-600">75%+</p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-lg">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                      <p className="font-medium">Medium Coverage</p>
                      <p className="text-xs text-gray-600">50-75%</p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-lg">
                      <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
                      <p className="font-medium">Low Coverage</p>
                      <p className="text-xs text-gray-600">&lt;50%</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2"></div>
                      <p className="font-medium">Claims Areas</p>
                      <p className="text-xs text-gray-600">Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Coverage by Province
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regions.map((region) => (
                <div key={region.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      region.coverage >= 75 ? 'bg-green-500' :
                      region.coverage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium">{region.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{region.coverage}%</div>
                      <div className="text-xs text-gray-500">{region.policies} policies</div>
                    </div>
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${
                          region.coverage >= 75 ? 'bg-green-500' :
                          region.coverage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${region.coverage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable 
        headers={["Province", "Farmers", "Policies", "Coverage", "Premium", "Claims", "Status"]}
        data={regions}
        renderRow={(region) => (
          <tr key={region.id} className="border-b">
            <td className="py-3 px-4 font-medium">{region.name}</td>
            <td className="py-3 px-4">{region.farmers.toLocaleString()}</td>
            <td className="py-3 px-4">{region.policies.toLocaleString()}</td>
            <td className="py-3 px-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">{region.coverage}%</span>
                <div className="w-16 h-2 bg-gray-200 rounded-full">
                  <div 
                    className={`h-2 rounded-full ${
                      region.coverage >= 75 ? 'bg-green-500' :
                      region.coverage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${region.coverage}%` }}
                  ></div>
                </div>
              </div>
            </td>
            <td className="py-3 px-4">RWF {(region.totalPremium / 1000000).toFixed(0)}M</td>
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
          <DashboardPage title="Agricultural Sector Overview" actions={
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileText className="h-4 w-4 mr-2" />
              Export Sector Report
            </Button>
          }>
            <div className="grid gap-6 lg:grid-cols-3">
              <StatCard title="Crop Insurance Coverage" value="74.2%" icon={<Shield className="h-6 w-6 text-green-600" />} change="+5.2% from last year" changeType="positive" />
              <StatCard title="Average Claim Amount" value="RWF 3,934,426" icon={<TrendingUp className="h-6 w-6 text-blue-600" />} change="+8.1% YoY" changeType="positive" />
              <StatCard title="Policy Renewal Rate" value="89%" icon={<FileText className="h-6 w-6 text-orange-600" />} change="+2.3% from last year" changeType="positive" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Crop Insurance Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={cropData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="crop" type="category" width={80} />
                        <Tooltip formatter={(value: number, name: string) => [value, name === 'policies' ? 'Policies' : 'Farmers']} />
                        <Bar dataKey="policies" fill="#3B82F6" name="policies" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Premium Revenue by Crop
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={cropData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="totalValue"
                          label={({ crop, totalValue }) => `${crop}: RWF ${(totalValue / 1000000).toFixed(0)}M`}
                        >
                          {cropData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'][index % 5]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `RWF ${(value / 1000000).toFixed(1)}M`} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DataTable 
              headers={["Crop", "Farmers", "Policies", "Avg Premium", "Total Value", "Claims", "Coverage Rate"]}
              data={cropData}
              renderRow={(crop) => (
                <tr key={crop.crop} className="border-b">
                  <td className="py-3 px-4 font-medium">{crop.crop}</td>
                  <td className="py-3 px-4">{crop.farmers.toLocaleString()}</td>
                  <td className="py-3 px-4">{crop.policies.toLocaleString()}</td>
                  <td className="py-3 px-4">RWF {crop.avgPremium.toLocaleString()}</td>
                  <td className="py-3 px-4">RWF {(crop.totalValue / 1000000).toFixed(0)}M</td>
                  <td className="py-3 px-4">{crop.claims}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{((crop.policies / crop.farmers) * 100).toFixed(1)}%</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${(crop.policies / crop.farmers) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            />
          </DashboardPage>
        );
      case "trends":
        return (
          <DashboardPage title="Market Trends & Analytics" actions={
            <div className="flex gap-2">
              <Button className="bg-green-600 hover:bg-green-700">
                <LineChartIcon className="h-4 w-4 mr-2" />
                Generate Trend Report
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <BarChart3 className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          }>
            <div className="grid gap-6 lg:grid-cols-3">
              <StatCard title="Policy Growth Rate" value="+18.5%" icon={<TrendingUp className="h-6 w-6 text-green-600" />} change="Monthly average" changeType="positive" />
              <StatCard title="Claims Trend" value="+8.2%" icon={<Activity className="h-6 w-6 text-orange-600" />} change="Compared to last quarter" />
              <StatCard title="Premium Growth" value="+22.3%" icon={<DollarSign className="h-6 w-6 text-blue-600" />} change="Year over year" changeType="positive" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChartIcon className="h-5 w-5" />
                    Monthly Policy Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `RWF ${(value / 1000000000).toFixed(1)}B`} />
                        <Tooltip 
                          formatter={(value: number, name: string) => {
                            if (name === 'policies') return [value, 'Policies'];
                            if (name === 'claims') return [value, 'Claims'];
                            return [`RWF ${(value / 1000000000).toFixed(1)}B`, 'Premium'];
                          }}
                        />
                        <Bar yAxisId="left" dataKey="policies" fill="#3B82F6" name="policies" />
                        <Line yAxisId="right" type="monotone" dataKey="premium" stroke="#10B981" strokeWidth={3} name="premium" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Premium Revenue Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `RWF ${(value / 1000000000).toFixed(1)}B`} />
                        <Tooltip 
                          formatter={(value: number, name: string) => [
                            `RWF ${(value / 1000000000).toFixed(1)}B`, 
                            name === 'premium' ? 'Premium Revenue' : 'Claims'
                          ]}
                        />
                        <Area type="monotone" dataKey="premium" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Monthly Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable 
                  headers={["Month", "Policies Issued", "Claims Filed", "Premium Collected", "Growth Rate"]}
                  data={monthlyData}
                  renderRow={(data) => (
                    <tr key={data.month} className="border-b">
                      <td className="py-3 px-4 font-medium">{data.month}</td>
                      <td className="py-3 px-4">{data.policies.toLocaleString()}</td>
                      <td className="py-3 px-4">{data.claims}</td>
                      <td className="py-3 px-4">RWF {(data.premium / 1000000000).toFixed(1)}B</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          data.month === 'Jun' ? 'bg-green-100 text-green-800' :
                          data.month === 'May' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {data.month === 'Jun' ? '+12.5%' : 
                           data.month === 'May' ? '+8.1%' : '+5.2%'}
                        </span>
                      </td>
                    </tr>
                  )}
                />
              </CardContent>
            </Card>
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
      case "analytics":
        return (
          <GovernmentAnalyticsDashboard />
        );
      case "notifications":
        return (
          <NotificationManager userType="government" userId="gov_001" />
        );
      case "email-notifications":
        return (
          <EmailNotificationSystem userRole="government" userId="gov_001" />
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