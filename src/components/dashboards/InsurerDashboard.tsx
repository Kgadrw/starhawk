import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RoleSidebar } from "@/components/RoleSidebar";
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
  Bell,
  Settings
} from "lucide-react";

export const InsurerDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <div className="space-y-6 p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Insurer Dashboard
              </h1>
              <p className="text-gray-500 font-light">Manage insurance policies and claims efficiently</p>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Policies</p>
                      <p className="text-3xl font-light text-blue-900">1,247</p>
                      <p className="text-xs text-blue-600">+12% this month</p>
                    </div>
                    <FileText className="h-12 w-12 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Active Claims</p>
                      <p className="text-3xl font-light text-green-900">89</p>
                      <p className="text-xs text-green-600">$2.3M in payouts</p>
                    </div>
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Pending Claims</p>
                      <p className="text-3xl font-light text-orange-900">23</p>
                      <p className="text-xs text-orange-600">$450K pending</p>
                    </div>
                    <Clock className="h-12 w-12 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Total Premium</p>
                      <p className="text-3xl font-light text-purple-900">$8.2M</p>
                      <p className="text-xs text-purple-600">+8% this quarter</p>
                    </div>
                    <TrendingUp className="h-12 w-12 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Recent Claims
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: "C001", farmer: "Jean Baptiste", crop: "Maize", amount: 5000, status: "pending", date: "2024-03-12" },
                      { id: "C002", farmer: "Marie Uwimana", crop: "Rice", amount: 3200, status: "approved", date: "2024-03-10" },
                      { id: "C003", farmer: "Paul Nkurunziza", crop: "Beans", amount: 1800, status: "reviewing", date: "2024-03-08" }
                    ].map((claim, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Claim #{claim.id}</p>
                          <p className="text-sm text-gray-500">{claim.farmer} - {claim.crop}</p>
                          <p className="text-sm text-gray-500">{claim.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${claim.amount.toLocaleString()}</p>
                          <Badge variant={claim.status === "approved" ? "default" : "secondary"}>
                            {claim.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    New Policies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: "P001", farmer: "Alice Mukamana", crop: "Maize", premium: 2500, coverage: 25000, date: "2024-03-15" },
                      { id: "P002", farmer: "John Nkurunziza", crop: "Rice", premium: 1800, coverage: 18000, date: "2024-03-14" },
                      { id: "P003", farmer: "Grace Uwimana", crop: "Beans", premium: 1200, coverage: 12000, date: "2024-03-13" }
                    ].map((policy, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Policy #{policy.id}</p>
                          <p className="text-sm text-gray-500">{policy.farmer} - {policy.crop}</p>
                          <p className="text-sm text-gray-500">{policy.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${policy.premium.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">${policy.coverage.toLocaleString()} coverage</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "policies":
        return (
          <div className="p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <h2 className="text-2xl font-light text-gray-900 mb-6">Policy Management</h2>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Policy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="farmer">Farmer Name</Label>
                        <Input id="farmer" placeholder="Enter farmer name" />
                      </div>
                      <div>
                        <Label htmlFor="crop">Crop Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select crop" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="maize">Maize</SelectItem>
                            <SelectItem value="rice">Rice</SelectItem>
                            <SelectItem value="beans">Beans</SelectItem>
                            <SelectItem value="wheat">Wheat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="coverage">Coverage Amount</Label>
                        <Input id="coverage" type="number" placeholder="Enter coverage amount" />
                      </div>
                      <div>
                        <Label htmlFor="premium">Premium Amount</Label>
                        <Input id="premium" type="number" placeholder="Enter premium amount" />
                      </div>
                    </div>
                    <Button className="w-full">Create Policy</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>All Policies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: "P001", farmer: "Jean Baptiste", crop: "Maize", premium: 2500, coverage: 25000, status: "active", date: "2024-03-15" },
                      { id: "P002", farmer: "Marie Uwimana", crop: "Rice", premium: 1800, coverage: 18000, status: "active", date: "2024-02-20" },
                      { id: "P003", farmer: "Paul Nkurunziza", crop: "Beans", premium: 1200, coverage: 12000, status: "pending", date: "2024-03-10" }
                    ].map((policy, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">Policy #{policy.id}</h3>
                            <p className="text-sm text-gray-500">{policy.farmer} - {policy.crop}</p>
                            <p className="text-sm text-gray-500">Created: {policy.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${policy.premium.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">${policy.coverage.toLocaleString()} coverage</p>
                          <Badge variant={policy.status === "active" ? "default" : "secondary"}>
                            {policy.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "claims":
        return (
          <div className="p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <h2 className="text-2xl font-light text-gray-900 mb-6">Claims Processing</h2>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: "C001", farmer: "Jean Baptiste", crop: "Maize", type: "Drought", amount: 5000, date: "2024-03-12", status: "pending" },
                      { id: "C002", farmer: "Marie Uwimana", crop: "Rice", type: "Flood", amount: 3200, date: "2024-03-10", status: "reviewing" },
                      { id: "C003", farmer: "Paul Nkurunziza", crop: "Beans", type: "Pest Attack", amount: 1800, date: "2024-03-08", status: "pending" }
                    ].map((claim, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">Claim #{claim.id}</h3>
                            <p className="text-sm text-gray-500">{claim.farmer} - {claim.crop}</p>
                            <p className="text-sm text-gray-500">{claim.type} • {claim.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${claim.amount.toLocaleString()}</p>
                          <Badge variant={claim.status === "reviewing" ? "default" : "secondary"}>
                            {claim.status}
                          </Badge>
                          <div className="mt-2 space-x-2">
                            <Button size="sm" variant="outline">Review</Button>
                            <Button size="sm">Approve</Button>
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
      case "analytics":
        return (
          <div className="p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <h2 className="text-2xl font-light text-gray-900 mb-6">Analytics & Reports</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Policy Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Maize Policies</span>
                      <span className="font-medium">45% of total</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rice Policies</span>
                      <span className="font-medium">30% of total</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Beans Policies</span>
                      <span className="font-medium">25% of total</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Claims by Region</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { region: "Northern Province", claims: 45, amount: 125000 },
                      { region: "Southern Province", claims: 32, amount: 89000 },
                      { region: "Eastern Province", claims: 28, amount: 76000 },
                      { region: "Western Province", claims: 35, amount: 98000 }
                    ].map((region, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{region.region}</p>
                          <p className="text-sm text-gray-500">{region.claims} claims</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${region.amount.toLocaleString()}</p>
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
            <h2 className="text-2xl font-light text-gray-900 mb-6">Notifications</h2>
            <div className="space-y-4">
              {[
                {
                  title: "New Claim Submitted",
                  message: "Jean Baptiste submitted a claim for drought damage on maize field.",
                  time: "2 hours ago",
                  type: "info"
                },
                {
                  title: "Policy Expiring Soon",
                  message: "15 policies will expire in the next 30 days.",
                  time: "1 day ago",
                  type: "warning"
                },
                {
                  title: "Claim Approved",
                  message: "Claim C002 for Marie Uwimana has been approved for $3,200.",
                  time: "3 days ago",
                  type: "success"
                },
                {
                  title: "Monthly Report Ready",
                  message: "March 2024 monthly report is now available for download.",
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
                      <Input id="name" defaultValue="Sarah Johnson" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="sarah@agriinsurance.com" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" defaultValue="+250 123 456 789" />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" defaultValue="AgriInsurance Ltd" />
                    </div>
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input id="position" defaultValue="Senior Underwriter" />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input id="department" defaultValue="Claims Processing" />
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
        role="insurer"
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
