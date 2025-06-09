
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Plus, Eye } from "lucide-react";

const claims = [
  { id: "CLM-2024-001", farmer: "John Mwangi", crop: "Maize", type: "Drought", location: "Kiambu", amount: "KSh 45,000", status: "Pending", date: "2024-01-15", priority: "High" },
  { id: "CLM-2024-002", farmer: "Mary Wanjiku", crop: "Beans", type: "Flood", location: "Nairobi", amount: "KSh 32,000", status: "Approved", date: "2024-01-14", priority: "Medium" },
  { id: "CLM-2024-003", farmer: "Peter Kamau", crop: "Coffee", type: "Pest", location: "Nyeri", amount: "KSh 78,000", status: "Under Review", date: "2024-01-13", priority: "High" },
  { id: "CLM-2024-004", farmer: "Susan Njeri", crop: "Tea", type: "Disease", location: "Kericho", amount: "KSh 56,000", status: "Rejected", date: "2024-01-12", priority: "Low" },
  { id: "CLM-2024-005", farmer: "David Ochieng", crop: "Rice", type: "Flood", location: "Kisumu", amount: "KSh 41,000", status: "Approved", date: "2024-01-11", priority: "Medium" },
];

const stats = [
  { title: "Total Claims", value: "2,451", change: "+12%", positive: true },
  { title: "Pending Review", value: "183", change: "+5%", positive: false },
  { title: "Approved", value: "1,892", change: "+8%", positive: true },
  { title: "Total Value", value: "KSh 12.4M", change: "+15%", positive: true },
];

export function ClaimsPage() {
  return (
    <div className="flex-1 h-full overflow-auto bg-background">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Claims Management</h1>
            <p className="text-muted-foreground">Track and manage insurance claims</p>
          </div>
          <Button className="self-start sm:self-auto">
            <Plus className="w-4 h-4 mr-2" />
            New Claim
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className={`text-xs ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle>All Claims</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Search claims..." className="pl-10 w-full sm:w-64" />
                </div>
                <Select>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Claim ID</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Farmer</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Crop</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Location</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((claim) => (
                    <tr key={claim.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-4 text-sm text-foreground font-medium">{claim.id}</td>
                      <td className="py-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium">{claim.farmer.split(' ').map(n => n[0]).join('')}</span>
                          </div>
                          <span className="text-foreground">{claim.farmer}</span>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-foreground">{claim.crop}</td>
                      <td className="py-4 text-sm text-foreground">{claim.type}</td>
                      <td className="py-4 text-sm text-foreground">{claim.location}</td>
                      <td className="py-4 text-sm text-foreground font-medium">{claim.amount}</td>
                      <td className="py-4 text-sm">
                        <Badge 
                          variant={
                            claim.status === "Approved" ? "default" : 
                            claim.status === "Pending" ? "secondary" : 
                            claim.status === "Under Review" ? "outline" : 
                            "destructive"
                          }
                        >
                          {claim.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-sm text-foreground">{claim.date}</td>
                      <td className="py-4 text-sm">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
