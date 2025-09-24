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
  MapPin,
  Shield,
  Wheat,
  Bell,
  DollarSign,
  Droplets,
  Sun,
  Wind,
  Camera,
  FileText,
  AlertTriangle,
  BarChart3,
  Users
} from "lucide-react";

export const FarmerDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [policies] = useState([
    {
      id: "1",
      crop: "Maize",
      status: "active",
      premium: 2500,
      coverage: 25000,
      date: "2024-03-15",
      expiry: "2024-12-15"
    },
    {
      id: "2",
      crop: "Rice",
      status: "active",
      premium: 1800,
      coverage: 18000,
      date: "2024-02-20",
      expiry: "2024-11-20"
    },
    {
      id: "3",
      crop: "Beans",
      status: "pending",
      premium: 1200,
      coverage: 12000,
      date: "2024-03-10",
      expiry: "2024-10-10"
    }
  ]);

  const [claims] = useState([
    {
      id: "C001",
      crop: "Maize",
      type: "Drought Damage",
      amount: 5000,
      date: "2024-03-12",
      status: "pending"
    }
  ]);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <div className="space-y-6 p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Farmer Dashboard
              </h1>
              <p className="text-gray-500 font-light">Welcome back! Here's your farm overview</p>
            </div>

            {/* Farm Overview Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Active Policies</p>
                      <p className="text-3xl font-light text-green-900">3</p>
                      <p className="text-xs text-green-600">$45K total coverage</p>
                    </div>
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Pending Claims</p>
                      <p className="text-3xl font-light text-blue-900">1</p>
                      <p className="text-xs text-blue-600">$5K claim amount</p>
                    </div>
                    <Clock className="h-12 w-12 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Fields Monitored</p>
                      <p className="text-3xl font-light text-orange-900">5</p>
                      <p className="text-xs text-orange-600">12.5 hectares</p>
                    </div>
                    <MapPin className="h-12 w-12 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Risk Level</p>
                      <p className="text-3xl font-light text-purple-900">Low</p>
                      <p className="text-xs text-purple-600">Good conditions</p>
                    </div>
                    <Shield className="h-12 w-12 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weather & Field Status */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-yellow-500" />
                    Weather Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Sun className="h-6 w-6 text-yellow-600" />
                        <div>
                          <p className="font-medium">Today</p>
                          <p className="text-sm text-gray-500">Sunny, 28°C</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-600">Good</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Droplets className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="font-medium">Tomorrow</p>
                          <p className="text-sm text-gray-500">Light rain, 24°C</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-blue-600">Moderate</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Wind className="h-6 w-6 text-gray-600" />
                        <div>
                          <p className="font-medium">Day After</p>
                          <p className="text-sm text-gray-500">Cloudy, 26°C</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-gray-600">Good</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wheat className="h-5 w-5 text-green-500" />
                    Field Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { field: "North Field - Maize", status: "Healthy", area: "3.2 ha", risk: "low" },
                      { field: "South Field - Rice", status: "Good", area: "2.8 ha", risk: "low" },
                      { field: "East Field - Beans", status: "Needs Attention", area: "1.5 ha", risk: "medium" },
                      { field: "West Field - Maize", status: "Excellent", area: "4.0 ha", risk: "low" },
                      { field: "Central Field - Rice", status: "Good", area: "1.0 ha", risk: "low" }
                    ].map((field, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{field.field}</p>
                          <p className="text-sm text-gray-500">{field.area} • {field.status}</p>
                        </div>
                        <Badge variant={field.risk === "low" ? "outline" : "secondary"}>
                          {field.risk} risk
                        </Badge>
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
            <h2 className="text-2xl font-light text-gray-900 mb-6">My Insurance Policies</h2>
            <div className="grid gap-6">
              {policies.map((policy) => (
                <Card key={policy.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Wheat className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">{policy.crop} Insurance</h3>
                          <p className="text-sm text-gray-500">Policy #{policy.id} • Expires {policy.expiry}</p>
                          <p className="text-sm text-gray-500">Coverage: ${policy.coverage.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium">${policy.premium.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Annual Premium</p>
                        <Badge variant={policy.status === "active" ? "default" : "secondary"}>
                          {policy.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case "claims":
        return (
          <div className="p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <h2 className="text-2xl font-light text-gray-900 mb-6">Claims Management</h2>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>File New Claim</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
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
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="damage">Damage Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select damage type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="drought">Drought</SelectItem>
                            <SelectItem value="flood">Flood</SelectItem>
                            <SelectItem value="pest">Pest Attack</SelectItem>
                            <SelectItem value="disease">Disease</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="amount">Estimated Loss Amount</Label>
                      <Input id="amount" type="number" placeholder="Enter amount" />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input id="description" placeholder="Describe the damage" />
                    </div>
                    <Button className="w-full">Submit Claim</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {claims.map((claim) => (
                      <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Claim #{claim.id}</p>
                          <p className="text-sm text-gray-500">{claim.crop} - {claim.type}</p>
                          <p className="text-sm text-gray-500">Filed: {claim.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${claim.amount.toLocaleString()}</p>
                          <Badge variant={claim.status === "pending" ? "secondary" : "default"}>
                            {claim.status}
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
      case "monitoring":
        return (
          <div className="p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <h2 className="text-2xl font-light text-gray-900 mb-6">Field Monitoring</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Drone Surveillance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Live drone feed</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline">Start Survey</Button>
                      <Button variant="outline">View History</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Field Health Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { field: "North Field", health: "95%", status: "Excellent" },
                      { field: "South Field", health: "87%", status: "Good" },
                      { field: "East Field", health: "72%", status: "Fair" },
                      { field: "West Field", health: "91%", status: "Very Good" }
                    ].map((field, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{field.field}</p>
                          <p className="text-sm text-gray-500">{field.status}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{field.health}</p>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: field.health }}
                            ></div>
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
      case "reports":
        return (
          <div className="p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <h2 className="text-2xl font-light text-gray-900 mb-6">Farm Reports</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start">Monthly Farm Summary</Button>
                    <Button className="w-full justify-start" variant="outline">Crop Performance Report</Button>
                    <Button className="w-full justify-start" variant="outline">Weather Impact Analysis</Button>
                    <Button className="w-full justify-start" variant="outline">Insurance Claims History</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "March 2024 Farm Summary", date: "2024-03-31", type: "Monthly" },
                      { name: "Maize Performance Report", date: "2024-03-25", type: "Crop" },
                      { name: "Weather Impact Analysis", date: "2024-03-20", type: "Weather" }
                    ].map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-sm text-gray-500">{report.date} • {report.type}</p>
                        </div>
                        <Button size="sm" variant="outline">View</Button>
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
                  title: "Weather Alert",
                  message: "Heavy rain expected tomorrow. Consider covering your crops.",
                  time: "2 hours ago",
                  type: "warning"
                },
                {
                  title: "Policy Renewal",
                  message: "Your maize insurance policy expires in 30 days.",
                  time: "1 day ago",
                  type: "info"
                },
                {
                  title: "Claim Update",
                  message: "Your drought damage claim has been approved for $5,000.",
                  time: "3 days ago",
                  type: "success"
                },
                {
                  title: "Field Assessment",
                  message: "Drone survey completed for North Field. Health: 95%",
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
                      <Input id="name" defaultValue="Jean Baptiste" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="jean@example.com" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" defaultValue="+250 123 456 789" />
                    </div>
                    <div>
                      <Label htmlFor="farm">Farm Name</Label>
                      <Input id="farm" defaultValue="Green Valley Farm" />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" defaultValue="Kigali, Rwanda" />
                    </div>
                    <div>
                      <Label htmlFor="size">Farm Size (hectares)</Label>
                      <Input id="size" type="number" defaultValue="12.5" />
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
        role="farmer"
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
