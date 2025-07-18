import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, TrendingUp, AlertTriangle, CheckCircle, Clock, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const applications = [
  {
    id: "UW-2024-001",
    farmer: "Samuel Kiprotich",
    crop: "Coffee",
    location: "Nyeri",
    coverage: "FRW 150,000",
    premium: "FRW 7,500",
    riskScore: 75,
    status: "Under Review",
    submittedDate: "2024-01-15",
    agent: "Mary Wanjiru"
  },
  {
    id: "UW-2024-002",
    farmer: "Grace Muthoni",
    crop: "Tea",
    location: "Kericho",
    coverage: "FRW 200,000",
    premium: "FRW 10,000",
    riskScore: 45,
    status: "Approved",
    submittedDate: "2024-01-14",
    agent: "John Mwangi"
  },
  {
    id: "UW-2024-003",
    farmer: "Peter Kamau",
    crop: "Maize",
    location: "Nakuru",
    coverage: "FRW 80,000",
    premium: "FRW 4,800",
    riskScore: 85,
    status: "Requires Review",
    submittedDate: "2024-01-13",
    agent: "Susan Njeri"
  }
];

const getRiskColor = (score: number) => {
  if (score <= 30) return "text-green-600";
  if (score <= 70) return "text-yellow-600";
  return "text-red-600";
};

const getRiskLevel = (score: number) => {
  if (score <= 30) return "Low";
  if (score <= 70) return "Medium";
  return "High";
};

export function UnderwritingPage() {
  const { toast } = useToast();
  const [applicationsList, setApplicationsList] = useState(applications);

  const handleExport = () => toast({ title: "Exported!", description: "Applications exported to Excel format." });
  const handleNewApp = () => toast({ title: "New Application!", description: "Opening new application form." });

  const handleReviewApplication = (appId: string) => {
    toast({ 
      title: "Reviewing Application", 
      description: `Opening detailed review for application ${appId}.` 
    });
  };

  const handleViewDetails = (appId: string) => {
    toast({ 
      title: "Viewing Details", 
      description: `Opening comprehensive details for application ${appId}.` 
    });
  };

  const handleApproveApplication = (appId: string) => {
    setApplicationsList(prev => 
      prev.map(app => 
        app.id === appId 
          ? { ...app, status: "Approved" }
          : app
      )
    );
    toast({ 
      title: "Application Approved", 
      description: `Application ${appId} has been approved successfully.` 
    });
  };

  const handleRejectApplication = (appId: string) => {
    setApplicationsList(prev => 
      prev.map(app => 
        app.id === appId 
          ? { ...app, status: "Rejected" }
          : app
      )
    );
    toast({ 
      title: "Application Rejected", 
      description: `Application ${appId} has been rejected.` 
    });
  };

  const handleFlagForReview = (appId: string) => {
    setApplicationsList(prev => 
      prev.map(app => 
        app.id === appId 
          ? { ...app, status: "Requires Review" }
          : app
      )
    );
    toast({ 
      title: "Application Flagged", 
      description: `Application ${appId} has been flagged for additional review.` 
    });
  };

  return (
    <div className="flex-1 h-full overflow-auto bg-background">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Underwriting</h1>
            <p className="text-muted-foreground">Risk assessment and policy approval</p>
          </div>
          <Button onClick={handleNewApp}>
            <Plus className="w-4 h-4 mr-2" />
            New Application
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">24</div>
              <p className="text-xs text-orange-600">Requires attention</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">156</div>
              <p className="text-xs text-green-600">+12% this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Total Premium
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">FRW 2.4M</div>
              <p className="text-xs text-green-600">+18% this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                High Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">8</div>
              <p className="text-xs text-red-600">Needs special review</p>
            </CardContent>
          </Card>
        </div>

        {/* Risk Assessment Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Low Risk (0-30)</span>
                  <span className="text-green-600">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Medium Risk (31-70)</span>
                  <span className="text-yellow-600">35%</span>
                </div>
                <Progress value={35} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>High Risk (71-100)</span>
                  <span className="text-red-600">20%</span>
                </div>
                <Progress value={20} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Processing Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Average Processing Time</span>
                </div>
                <span className="text-sm font-medium">3.2 days</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Approval Rate</span>
                </div>
                <span className="text-sm font-medium">87%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm">Rejection Rate</span>
                </div>
                <span className="text-sm font-medium">13%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <Button variant="outline" size="sm" type="button" onClick={handleExport}>Export</Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Application ID</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Farmer</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Crop</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Location</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Coverage</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Premium</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Risk Score</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applicationsList.map((app) => (
                    <tr key={app.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-4 text-sm text-foreground font-medium">{app.id}</td>
                      <td className="py-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium">{app.farmer.split(' ').map(n => n[0]).join('')}</span>
                          </div>
                          <div>
                            <div className="text-foreground">{app.farmer}</div>
                            <div className="text-xs text-muted-foreground">Agent: {app.agent}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-foreground">{app.crop}</td>
                      <td className="py-4 text-sm text-foreground">{app.location}</td>
                      <td className="py-4 text-sm text-foreground font-medium">{app.coverage}</td>
                      <td className="py-4 text-sm text-foreground">{app.premium}</td>
                      <td className="py-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${getRiskColor(app.riskScore)}`}>
                            {app.riskScore}
                          </span>
                          <Badge variant="outline" className={getRiskColor(app.riskScore)}>
                            {getRiskLevel(app.riskScore)}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 text-sm">
                        <Badge 
                          variant={
                            app.status === "Approved" ? "default" : 
                            app.status === "Under Review" ? "secondary" : 
                            "destructive"
                          }
                        >
                          {app.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-sm">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleReviewApplication(app.id)}
                          >
                            Review
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewDetails(app.id)}
                          >
                            Details
                          </Button>
                          {app.status === "Under Review" && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleApproveApplication(app.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                Approve
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleRejectApplication(app.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Reject
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleFlagForReview(app.id)}
                                className="text-orange-600 hover:text-orange-700"
                              >
                                Flag
                              </Button>
                            </>
                          )}
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
