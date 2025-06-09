
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const assessments = [
  { id: "INA-2025-001", farmer: "John Smith", location: "Nairobi East", date: "Jan 15", status: "Pending", priority: "HIGH" },
  { id: "INA-2025-002", farmer: "Sarah Johnson", location: "Kiambu Central", date: "Jan 14", status: "Approved", priority: "MEDIUM" },
  { id: "INA-2025-003", farmer: "David Wilson", location: "Machakos West", date: "Jan 13", status: "Pending", priority: "LOW" },
];

export function AssessmentPage() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Field Assessment</h1>
          <p className="text-gray-600">Farm Location</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Field Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-gray-600">2 months locations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-gray-600">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">High Risk Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 Days</div>
            <p className="text-xs text-gray-600">Next assessment</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">Upgraded Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 Days</div>
            <p className="text-xs text-gray-600">Average time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assessment Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Map</CardTitle>
            <p className="text-sm text-gray-600">Crop Types</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cropType">Crop Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Maize" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maize">Maize</SelectItem>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="rice">Rice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="inspector">Inspector Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Verified" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Farm History</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Previous crop insurance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Good damage patterns identified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm">Affected area: 120 acres</span>
                  </div>
                </div>
              </div>

              <div>
                <Label>Field Photos</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Button variant="outline">📷 Upload Photos</Button>
                  <p className="text-sm text-gray-500 mt-2">Drag & drop photos or click to browse</p>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  placeholder="Enter assessment details..."
                  className="mt-1"
                />
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">Submit Assessment</Button>
            </div>
          </CardContent>
        </Card>

        {/* Risk Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Risk Probability</p>
              <div className="text-2xl font-bold">2%</div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Risk Analysis</p>
              <div className="h-32 bg-green-100 rounded flex items-center justify-center">
                <span className="text-sm text-gray-600">Satellite Image</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Crop Condition</span>
                <Badge className="bg-green-100 text-green-800">Good</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Weather Risk</span>
                <Badge className="bg-orange-100 text-orange-800">Medium</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Soil Risk</span>
                <Badge className="bg-red-100 text-red-800">High</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Assessments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Assessments</CardTitle>
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
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Assessment ID</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Farmer</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Location</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Priority</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((assessment) => (
                  <tr key={assessment.id} className="border-b">
                    <td className="py-3 text-sm">{assessment.id}</td>
                    <td className="py-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        <span>{assessment.farmer}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm">{assessment.location}</td>
                    <td className="py-3 text-sm">{assessment.date}</td>
                    <td className="py-3 text-sm">
                      <Badge variant={assessment.status === "Approved" ? "default" : "secondary"}>
                        {assessment.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm">
                      <Badge 
                        variant={
                          assessment.priority === "HIGH" ? "destructive" : 
                          assessment.priority === "MEDIUM" ? "secondary" : 
                          "outline"
                        }
                      >
                        {assessment.priority}
                      </Badge>
                    </td>
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
