
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const chartData = [
  { name: "Jan", value: 65 },
  { name: "Feb", value: 85 },
  { name: "Mar", value: 45 },
  { name: "Apr", value: 95 },
  { name: "May", value: 75 },
  { name: "Jun", value: 55 },
  { name: "Jul", value: 85 },
  { name: "Aug", value: 65 },
  { name: "Sep", value: 95 },
  { name: "Oct", value: 75 },
  { name: "Nov", value: 85 },
  { name: "Dec", value: 95 },
];

const riskData = [
  { name: "Low Risk", value: 45, color: "#10B981" },
  { name: "Medium Risk", value: 30, color: "#F59E0B" },
  { name: "High Risk", value: 25, color: "#EF4444" },
];

const recentClaims = [
  { id: "PCL-2024-001", type: "Crop Damage", location: "Kiambu", status: "Pending", date: "Jan 15, 2024" },
  { id: "PCL-2024-002", type: "Flood Damage", location: "Nairobi", status: "Approved", date: "Jan 14, 2024" },
];

export function DashboardOverview() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hi, Welcome back</h1>
          <p className="text-gray-600">Insurer Dashboard</p>
        </div>
        <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center">
          <span className="text-2xl">👨‍💼</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,451</div>
            <p className="text-xs text-green-600">+1% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Claims Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,392</div>
            <p className="text-xs text-green-600">+8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76.4%</div>
            <p className="text-xs text-red-600">-2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">Medium</div>
            <p className="text-xs text-gray-600">Moderate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Zone Map */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Risk Zone Map</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Filter</Button>
              <Button variant="outline" size="sm">Export</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-green-100 rounded-lg flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-yellow-200 to-red-200 rounded-lg opacity-70"></div>
              <span className="text-gray-600 z-10">Interactive Risk Map</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Alerts</CardTitle>
            <Button variant="link" size="sm">View All</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">High Risk Alert</p>
                <p className="text-xs text-gray-600">Flood warning in Kiambu. 3 farms exposed</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Pest Alert</p>
                <p className="text-xs text-gray-600">Potential locust outbreak in Eastern Province</p>
                <p className="text-xs text-gray-500">3 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Weather Alert</p>
                <p className="text-xs text-gray-600">Heavy rainfall expected in Western Region</p>
                <p className="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Claims */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Claims</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Filter</Button>
            <Button variant="outline" size="sm">Export</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Claim ID</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Farmer</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Type</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Location</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentClaims.map((claim) => (
                  <tr key={claim.id} className="border-b">
                    <td className="py-3 text-sm">{claim.id}</td>
                    <td className="py-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        <span>James Kamau</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm">{claim.type}</td>
                    <td className="py-3 text-sm">{claim.location}</td>
                    <td className="py-3 text-sm">
                      <Badge variant={claim.status === "Approved" ? "default" : "secondary"}>
                        {claim.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm">{claim.date}</td>
                    <td className="py-3 text-sm">
                      <Button variant="link" size="sm">View</Button>
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
}
