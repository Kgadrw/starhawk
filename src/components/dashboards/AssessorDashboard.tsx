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
  MapPin,
  FileText,
  BarChart3,
  Users,
  Bell,
  Settings,
  Camera,
  Activity,
  Shield
} from "lucide-react";

export const AssessorDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <div className="space-y-6 p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Assessor Dashboard
              </h1>
              <p className="text-gray-500 font-light">Conduct field assessments and evaluations</p>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Pending Assessments</p>
                      <p className="text-3xl font-light text-orange-900">12</p>
                      <p className="text-xs text-orange-600">Due this week</p>
                    </div>
                    <Clock className="h-12 w-12 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Completed Today</p>
                      <p className="text-3xl font-light text-green-900">5</p>
                      <p className="text-xs text-green-600">3 fields assessed</p>
                    </div>
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Fields</p>
                      <p className="text-3xl font-light text-blue-900">47</p>
                      <p className="text-xs text-blue-600">In your region</p>
                    </div>
                    <MapPin className="h-12 w-12 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">High Risk Fields</p>
                      <p className="text-3xl font-light text-purple-900">3</p>
                      <p className="text-xs text-purple-600">Need attention</p>
                    </div>
                    <AlertTriangle className="h-12 w-12 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-500" />
                    Pending Assessments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: "A001", farmer: "Jean Baptiste", field: "North Field - Maize", priority: "high", dueDate: "2024-03-20" },
                      { id: "A002", farmer: "Marie Uwimana", field: "South Field - Rice", priority: "medium", dueDate: "2024-03-22" },
                      { id: "A003", farmer: "Paul Nkurunziza", field: "East Field - Beans", priority: "low", dueDate: "2024-03-25" }
                    ].map((assessment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Assessment #{assessment.id}</p>
                          <p className="text-sm text-gray-500">{assessment.farmer} - {assessment.field}</p>
                          <p className="text-sm text-gray-500">Due: {assessment.dueDate}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={assessment.priority === "high" ? "destructive" : assessment.priority === "medium" ? "default" : "secondary"}>
                            {assessment.priority} priority
                          </Badge>
                          <div className="mt-2">
                            <Button size="sm">Start Assessment</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Recent Assessments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: "A004", farmer: "Alice Mukamana", field: "West Field - Maize", risk: "low", date: "2024-03-18" },
                      { id: "A005", farmer: "John Nkurunziza", field: "Central Field - Rice", risk: "medium", date: "2024-03-17" },
                      { id: "A006", farmer: "Grace Uwimana", field: "North Field - Beans", risk: "low", date: "2024-03-16" }
                    ].map((assessment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Assessment #{assessment.id}</p>
                          <p className="text-sm text-gray-500">{assessment.farmer} - {assessment.field}</p>
                          <p className="text-sm text-gray-500">{assessment.date}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={assessment.risk === "low" ? "default" : "secondary"}>
                            {assessment.risk} risk
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
      case "assessments":
        return (
          <div className="p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <h2 className="text-2xl font-light text-gray-900 mb-6">Field Assessments</h2>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Start New Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="farmer">Farmer Name</Label>
                        <Input id="farmer" placeholder="Enter farmer name" />
                      </div>
                      <div>
                        <Label htmlFor="field">Field Name</Label>
                        <Input id="field" placeholder="Enter field name" />
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
                        <Label htmlFor="assessmentType">Assessment Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="routine">Routine Inspection</SelectItem>
                            <SelectItem value="claim">Claim Assessment</SelectItem>
                            <SelectItem value="risk">Risk Evaluation</SelectItem>
                            <SelectItem value="premium">Premium Calculation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button className="w-full">Start Assessment</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assessment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: "A001", farmer: "Jean Baptiste", field: "North Field - Maize", type: "Routine", risk: "low", date: "2024-03-18", status: "completed" },
                      { id: "A002", farmer: "Marie Uwimana", field: "South Field - Rice", type: "Claim", risk: "medium", date: "2024-03-17", status: "completed" },
                      { id: "A003", farmer: "Paul Nkurunziza", field: "East Field - Beans", type: "Risk", risk: "high", date: "2024-03-16", status: "pending" }
                    ].map((assessment, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <MapPin className="h-6 w-6 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">Assessment #{assessment.id}</h3>
                            <p className="text-sm text-gray-500">{assessment.farmer} - {assessment.field}</p>
                            <p className="text-sm text-gray-500">{assessment.type} • {assessment.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={assessment.risk === "low" ? "default" : assessment.risk === "medium" ? "secondary" : "destructive"}>
                            {assessment.risk} risk
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">{assessment.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "field-maps":
        return (
          <div className="p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <h2 className="text-2xl font-light text-gray-900 mb-6">Field Maps & Location</h2>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Interactive Field Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Interactive field map</p>
                      <p className="text-sm text-gray-400">Click on fields to view details</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Field Status Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { field: "North Field - Maize", location: "Kigali, Rwanda", status: "Healthy", risk: "low", lastAssessment: "2024-03-18" },
                      { field: "South Field - Rice", location: "Kigali, Rwanda", status: "Good", risk: "low", lastAssessment: "2024-03-17" },
                      { field: "East Field - Beans", location: "Kigali, Rwanda", status: "Needs Attention", risk: "medium", lastAssessment: "2024-03-16" },
                      { field: "West Field - Maize", location: "Kigali, Rwanda", status: "Excellent", risk: "low", lastAssessment: "2024-03-15" }
                    ].map((field, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{field.field}</p>
                          <p className="text-sm text-gray-500">{field.location}</p>
                          <p className="text-sm text-gray-500">Last assessment: {field.lastAssessment}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={field.risk === "low" ? "default" : "secondary"}>
                            {field.risk} risk
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">{field.status}</p>
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
            <h2 className="text-2xl font-light text-gray-900 mb-6">Assessment Reports</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start">Weekly Assessment Summary</Button>
                    <Button className="w-full justify-start" variant="outline">Field Risk Analysis</Button>
                    <Button className="w-full justify-start" variant="outline">Crop Health Report</Button>
                    <Button className="w-full justify-start" variant="outline">Assessment Performance</Button>
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
                      { name: "March 2024 Assessment Summary", date: "2024-03-31", type: "Weekly" },
                      { name: "Field Risk Analysis Report", date: "2024-03-25", type: "Analysis" },
                      { name: "Crop Health Assessment", date: "2024-03-20", type: "Health" }
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
                  title: "New Assessment Assigned",
                  message: "You have been assigned to assess Jean Baptiste's maize field.",
                  time: "2 hours ago",
                  type: "info"
                },
                {
                  title: "Assessment Due Soon",
                  message: "Assessment A001 is due tomorrow. Please complete it on time.",
                  time: "1 day ago",
                  type: "warning"
                },
                {
                  title: "Assessment Completed",
                  message: "Your assessment for Marie Uwimana's rice field has been submitted.",
                  time: "3 days ago",
                  type: "success"
                },
                {
                  title: "Field Risk Alert",
                  message: "High risk detected in Paul Nkurunziza's bean field. Immediate assessment required.",
                  time: "1 week ago",
                  type: "warning"
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
                      <Input id="name" defaultValue="Michael Brown" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="michael@fieldassessment.com" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" defaultValue="+250 123 456 789" />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" defaultValue="Field Assessment Services" />
                    </div>
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input id="position" defaultValue="Senior Assessor" />
                    </div>
                    <div>
                      <Label htmlFor="region">Assigned Region</Label>
                      <Input id="region" defaultValue="Kigali Province" />
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
        role="assessor"
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
