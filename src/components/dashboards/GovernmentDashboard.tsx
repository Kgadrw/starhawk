import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RoleSidebar } from "@/components/RoleSidebar";
import { 
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  FileText,
  Bell,
  Settings,
  Activity,
  Shield,
  Globe,
  Database
} from "lucide-react";

export const GovernmentDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <div className="space-y-6 p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Government Analytics
              </h1>
              <p className="text-gray-500 font-light">National agricultural insights and monitoring</p>
            </div>

            {/* National Statistics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Total Farmers</p>
                      <p className="text-3xl font-light text-red-900">2,847</p>
                      <p className="text-xs text-red-600">+5% this quarter</p>
                    </div>
                    <Users className="h-12 w-12 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Active Policies</p>
                      <p className="text-3xl font-light text-blue-900">1,247</p>
                      <p className="text-xs text-blue-600">$12.5M coverage</p>
                    </div>
                    <FileText className="h-12 w-12 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Total Claims</p>
                      <p className="text-3xl font-light text-green-900">89</p>
                      <p className="text-xs text-green-600">$2.3M paid out</p>
                    </div>
                    <TrendingUp className="h-12 w-12 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Coverage Rate</p>
                      <p className="text-3xl font-light text-purple-900">43.8%</p>
                      <p className="text-xs text-purple-600">Of total farmers</p>
                    </div>
                    <Shield className="h-12 w-12 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Regional Overview */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    Regional Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { region: "Northern Province", farmers: 650, policies: 520, claims: 45, coverage: 80.0 },
                      { region: "Southern Province", farmers: 720, policies: 580, claims: 32, coverage: 80.6 },
                      { region: "Eastern Province", farmers: 480, policies: 380, claims: 28, coverage: 79.2 },
                      { region: "Western Province", farmers: 650, policies: 520, claims: 35, coverage: 80.0 },
                      { region: "Kigali City", farmers: 347, policies: 280, claims: 15, coverage: 80.7 }
                    ].map((region, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{region.region}</p>
                          <p className="text-sm text-gray-500">{region.farmers} farmers • {region.policies} policies</p>
                          <p className="text-sm text-gray-500">{region.claims} claims</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{region.coverage}%</p>
                          <p className="text-xs text-gray-500">coverage</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-500" />
                    Crop Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Maize</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rice</span>
                      <span className="font-medium">30%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Beans</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: "20%" }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Other</span>
                      <span className="font-medium">5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: "5%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <h2 className="text-2xl font-light text-gray-900 mb-6">National Analytics</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Policy Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Q1 2024</span>
                      <span className="font-medium">1,180 policies</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Q2 2024</span>
                      <span className="font-medium">1,247 policies</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Q3 2024</span>
                      <span className="font-medium">1,312 policies</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Q4 2024</span>
                      <span className="font-medium">1,380 policies</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Claims Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Drought Claims</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Flood Claims</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Pest/Disease</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: "20%" }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Other</span>
                      <span className="font-medium">10%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-500 h-2 rounded-full" style={{ width: "10%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "reports":
        return (
          <div className="p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <h2 className="text-2xl font-light text-gray-900 mb-6">National Reports</h2>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generate National Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="reportType">Report Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly Summary</SelectItem>
                            <SelectItem value="quarterly">Quarterly Analysis</SelectItem>
                            <SelectItem value="annual">Annual Report</SelectItem>
                            <SelectItem value="regional">Regional Comparison</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="period">Period</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2024-q1">Q1 2024</SelectItem>
                            <SelectItem value="2024-q2">Q2 2024</SelectItem>
                            <SelectItem value="2024-q3">Q3 2024</SelectItem>
                            <SelectItem value="2024-q4">Q4 2024</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button className="w-full">Generate Report</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Q3 2024 National Agricultural Insurance Report", date: "2024-09-30", type: "Quarterly", status: "completed" },
                      { name: "September 2024 Monthly Summary", date: "2024-09-30", type: "Monthly", status: "completed" },
                      { name: "Regional Performance Analysis", date: "2024-09-25", type: "Analysis", status: "completed" },
                      { name: "Q4 2024 National Report", date: "2024-12-31", type: "Quarterly", status: "generating" }
                    ].map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <FileText className="h-6 w-6 text-red-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">{report.name}</h3>
                            <p className="text-sm text-gray-500">{report.date} • {report.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={report.status === "completed" ? "default" : "secondary"}>
                            {report.status}
                          </Badge>
                          <div className="mt-2">
                            <Button size="sm" variant="outline">View</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "policy-management":
        return (
          <div className="p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <h2 className="text-2xl font-light text-gray-900 mb-6">Policy Management</h2>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>National Policy Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="maxCoverage">Maximum Coverage per Farmer</Label>
                        <Input id="maxCoverage" type="number" defaultValue="50000" />
                      </div>
                      <div>
                        <Label htmlFor="premiumRate">Base Premium Rate (%)</Label>
                        <Input id="premiumRate" type="number" defaultValue="10" />
                      </div>
                      <div>
                        <Label htmlFor="deductible">Standard Deductible</Label>
                        <Input id="deductible" type="number" defaultValue="500" />
                      </div>
                      <div>
                        <Label htmlFor="coveragePeriod">Coverage Period (months)</Label>
                        <Input id="coveragePeriod" type="number" defaultValue="12" />
                      </div>
                    </div>
                    <Button>Update Policy Settings</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Policy Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { region: "Northern Province", policies: 520, farmers: 650, coverage: 80.0, avgPremium: 2200 },
                      { region: "Southern Province", policies: 580, farmers: 720, coverage: 80.6, avgPremium: 2100 },
                      { region: "Eastern Province", policies: 380, farmers: 480, coverage: 79.2, avgPremium: 2300 },
                      { region: "Western Province", policies: 520, farmers: 650, coverage: 80.0, avgPremium: 2150 },
                      { region: "Kigali City", policies: 280, farmers: 347, coverage: 80.7, avgPremium: 2400 }
                    ].map((region, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="text-lg font-medium">{region.region}</h3>
                          <p className="text-sm text-gray-500">{region.policies} policies • {region.farmers} farmers</p>
                          <p className="text-sm text-gray-500">Coverage: {region.coverage}%</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${region.avgPremium.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">avg premium</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <h2 className="text-2xl font-light text-gray-900 mb-6">System Notifications</h2>
            <div className="space-y-4">
              {[
                {
                  title: "National Coverage Target Reached",
                  message: "Agricultural insurance coverage has reached 43.8% of total farmers nationwide.",
                  time: "2 hours ago",
                  type: "success"
                },
                {
                  title: "Regional Performance Alert",
                  message: "Eastern Province shows lower coverage rates compared to other regions.",
                  time: "1 day ago",
                  type: "warning"
                },
                {
                  title: "Monthly Report Generated",
                  message: "September 2024 monthly agricultural insurance report is now available.",
                  time: "3 days ago",
                  type: "info"
                },
                {
                  title: "Policy Update Required",
                  message: "Review and update national policy settings for Q4 2024.",
                  time: "1 week ago",
                  type: "info"
                }
              ].map((notification, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === 'warning' ? 'bg-yellow-500' :
                        notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <h3 className="font-medium">{notification.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <h2 className="text-2xl font-light text-gray-900 mb-6">Profile Settings</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="Dr. Alice Mukamana" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="alice@minagri.gov.rw" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" defaultValue="+250 123 456 789" />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input id="department" defaultValue="Ministry of Agriculture" />
                    </div>
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input id="position" defaultValue="Director of Agricultural Policy" />
                    </div>
                    <div>
                      <Label htmlFor="level">Access Level</Label>
                      <Input id="level" defaultValue="National" />
                    </div>
                  </div>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <div className="p-6"><h2 className="text-2xl font-light text-gray-900">Dashboard</h2></div>;
    }
  };

  return (
    <div className="flex w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <RoleSidebar
        role="government"
        onPageChange={setActivePage}
        activePage={activePage}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};
