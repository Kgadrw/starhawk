
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const claims = [
  { id: "PCL-2025-001", farmer: "James Kamau", type: "Crop Damage", location: "Kiambu", status: "Pending", date: "Jan 15, 2025" },
  { id: "PCL-2025-002", farmer: "Maria Jansen", type: "Flood Damage", location: "Nairobi", status: "Approved", date: "Jan 14, 2025" },
  { id: "PCL-2025-003", farmer: "David Ochieng", type: "Drought", location: "Machakos", status: "Rejected", date: "Jan 13, 2025" },
  { id: "PCL-2025-004", farmer: "Sarah Wanjiku", type: "Pest Damage", location: "Murang'a", status: "Under Review", date: "Jan 12, 2025" },
];

export function ClaimsPage() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-600">Claims Analysis</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">+ Submit New Claim</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Machine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">43</div>
            <p className="text-xs text-gray-600">2 farming reports</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Upgraded Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,562</div>
            <p className="text-xs text-gray-600">12 active complaints</p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">AI Detection Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              <li>✓ Severe crop lodging detected</li>
              <li>✓ Wind damage pattern identified</li>
              <li>✓ Affected area: 120 acres</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Historical Data and Recommendations */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Historical Data</CardTitle>
            <p className="text-sm text-gray-600">Previous Claims</p>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Climate Volatility Score</p>
                  <p className="text-2xl font-bold text-green-600">60%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Validated validation and historical data are present</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Recommendations</h4>
                <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                  <p className="text-sm">Based on the analysis and historical data that best match the claim period risk management...</p>
                  <div className="mt-2 flex space-x-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">Approve</Button>
                    <Button size="sm" variant="outline">Reject</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Risk Score</p>
              <div className="text-2xl font-bold text-blue-600">721/100</div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Verification</p>
              <Badge className="bg-green-100 text-green-800">GOOD</Badge>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Weather Risk</p>
              <Badge className="bg-orange-100 text-orange-800">Medium</Badge>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Risk Risk</p>
              <Badge className="bg-red-100 text-red-800">High</Badge>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Location Risk</p>
              <div className="h-24 bg-green-100 rounded flex items-center justify-center">
                <span className="text-sm text-gray-600">Map View</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Claims Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Claims</CardTitle>
          <div className="flex space-x-2">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
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
                {claims.map((claim) => (
                  <tr key={claim.id} className="border-b">
                    <td className="py-3 text-sm">{claim.id}</td>
                    <td className="py-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        <span>{claim.farmer}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm">{claim.type}</td>
                    <td className="py-3 text-sm">{claim.location}</td>
                    <td className="py-3 text-sm">
                      <Badge 
                        variant={
                          claim.status === "Approved" ? "default" : 
                          claim.status === "Rejected" ? "destructive" : 
                          "secondary"
                        }
                      >
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
