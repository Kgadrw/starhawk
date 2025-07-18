import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Download, Calendar, TrendingUp, Users, DollarSign, FileBarChart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const monthlyData = [
  { month: "Jan", claims: 45, premiums: 120000, policies: 230 },
  { month: "Feb", claims: 52, premiums: 135000, policies: 245 },
  { month: "Mar", claims: 38, premiums: 110000, policies: 220 },
  { month: "Apr", claims: 65, premiums: 155000, policies: 280 },
  { month: "May", claims: 58, premiums: 145000, policies: 265 },
  { month: "Jun", claims: 72, premiums: 175000, policies: 320 },
];

const riskDistribution = [
  { name: "Low Risk", value: 45, color: "#10B981" },
  { name: "Medium Risk", value: 35, color: "#F59E0B" },
  { name: "High Risk", value: 20, color: "#EF4444" },
];

const claimsByType = [
  { type: "Drought", count: 125, percentage: 35 },
  { type: "Flood", count: 89, percentage: 25 },
  { type: "Pest", count: 67, percentage: 19 },
  { type: "Disease", count: 45, percentage: 13 },
  { type: "Other", count: 28, percentage: 8 },
];

export function ReportsPage() {
  const { toast } = useToast();
  const handleExport = () => toast({ title: "Exported!", description: "Reports exported." });
  const handleFilter = () => toast({ title: "Filter applied!", description: "Report filter applied." });

  return (
    <div className="flex-1 h-full overflow-auto bg-background">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="thisMonth">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="thisQuarter">This Quarter</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={handleFilter}>
              <Download className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <FileBarChart className="w-4 h-4 mr-2" />
                Total Claims
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">354</div>
              <p className="text-xs text-green-600">+12% from last period</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Premium Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">FRW 8.4M</div>
              <p className="text-xs text-green-600">+18% from last period</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Active Policies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">1,580</div>
              <p className="text-xs text-green-600">+8% from last period</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Claim Ratio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">22.4%</div>
              <p className="text-xs text-red-600">+2% from last period</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Line type="monotone" dataKey="claims" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="policies" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                {riskDistribution.map((item) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Premium Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Premium Revenue by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Bar dataKey="premiums" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Claims by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Claims by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {claimsByType.map((claim) => (
                <div key={claim.type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-sm font-medium text-foreground">{claim.type}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${claim.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {claim.count}
                    </span>
                    <span className="text-sm text-muted-foreground w-8 text-right">
                      {claim.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
