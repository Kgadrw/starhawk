"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { GovMetrics } from "@/types/api";
import { 
  Users, 
  TrendingUp, 
  MapPin, 
  DollarSign, 
  BarChart3, 
  PieChart,
  Download,
  RefreshCw,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

export function GovernmentAnalytics() {
  const [metrics, setMetrics] = useState<GovMetrics | null>(null);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [dateRange, setDateRange] = useState("6months");
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in real app, fetch from API
  useEffect(() => {
    const mockMetrics: GovMetrics = {
      totals: {
        farmers: 1250,
        active: 1180,
        requests: { pending: 45, approved: 890, rejected: 65 }
      },
      geography: [
        { region: "Kigali", farmerCount: 320, riskLevel: "low" },
        { region: "Eastern Province", farmerCount: 280, riskLevel: "medium" },
        { region: "Northern Province", farmerCount: 250, riskLevel: "low" },
        { region: "Southern Province", farmerCount: 220, riskLevel: "high" },
        { region: "Western Province", farmerCount: 180, riskLevel: "medium" }
      ],
      claims: {
        submitted: 156,
        processed: 142,
        approved: 128,
        rejected: 14,
        avgProcessingDays: 12.5,
        payoutsUSD: 245000
      }
    };

    setTimeout(() => {
      setMetrics(mockMetrics);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Mock chart data
  const trendData = [
    { month: "Jan", farmers: 1200, claims: 12, payouts: 18000 },
    { month: "Feb", farmers: 1220, claims: 18, payouts: 25000 },
    { month: "Mar", farmers: 1240, claims: 25, payouts: 32000 },
    { month: "Apr", farmers: 1250, claims: 22, payouts: 28000 },
    { month: "May", farmers: 1250, claims: 30, payouts: 35000 },
    { month: "Jun", farmers: 1250, claims: 28, payouts: 33000 }
  ];

  const riskDistributionData = [
    { name: "Low Risk", value: 45, color: "#10b981" },
    { name: "Medium Risk", value: 35, color: "#f59e0b" },
    { name: "High Risk", value: 20, color: "#ef4444" }
  ];

  const regionData = metrics?.geography.map(region => ({
    name: region.region,
    farmers: region.farmerCount,
    riskLevel: region.riskLevel
  })) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Government Analytics</h1>
          <p className="text-muted-foreground">
            National overview of agricultural insurance program
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {metrics?.geography.map(region => (
                  <SelectItem key={region.region} value={region.region}>
                    {region.region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seasons</SelectItem>
                <SelectItem value="A">Season A</SelectItem>
                <SelectItem value="B">Season B</SelectItem>
                <SelectItem value="C">Season C</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Farmers</p>
                <p className="text-2xl font-bold">{metrics?.totals.farmers.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +4.2% from last month
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Policies</p>
                <p className="text-2xl font-bold">{metrics?.totals.active.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +2.1% from last month
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Claims</p>
                <p className="text-2xl font-bold">{metrics?.claims.submitted}</p>
                <p className="text-xs text-blue-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {metrics?.claims.avgProcessingDays} days avg processing
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Payouts</p>
                <p className="text-2xl font-bold">${metrics?.claims.payoutsUSD.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +8.5% from last month
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="claims">Claims Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Risk Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Risk Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={riskDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {riskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  {riskDistributionData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Regional Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Regional Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="farmers" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regional Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.geography.map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                      <div>
                        <h3 className="font-semibold">{region.region}</h3>
                        <p className="text-sm text-muted-foreground">
                          {region.farmerCount} farmers
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={region.riskLevel === "high" ? "destructive" : 
                              region.riskLevel === "medium" ? "default" : "secondary"}
                    >
                      {region.riskLevel} risk
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Program Growth Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="farmers" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Farmers"
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="claims" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Claims"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="claims" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {metrics?.claims.approved}
                </div>
                <div className="text-sm text-muted-foreground">Approved Claims</div>
                <div className="text-xs text-green-600 mt-1">
                  {((metrics?.claims.approved || 0) / (metrics?.claims.processed || 1) * 100).toFixed(1)}% approval rate
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {metrics?.claims.rejected}
                </div>
                <div className="text-sm text-muted-foreground">Rejected Claims</div>
                <div className="text-xs text-red-600 mt-1">
                  {((metrics?.claims.rejected || 0) / (metrics?.claims.processed || 1) * 100).toFixed(1)}% rejection rate
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {metrics?.claims.avgProcessingDays}
                </div>
                <div className="text-sm text-muted-foreground">Avg Processing Days</div>
                <div className="text-xs text-blue-600 mt-1">
                  Target: 10 days
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
