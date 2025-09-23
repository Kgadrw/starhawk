import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardContent } from "@/components/DashboardContent";
import { LoginForm } from "@/components/LoginForm";
import { NavigationMenu } from "@/components/NavigationMenu";
import { MultiStepForm } from "@/components/forms/MultiStepForm";
import { UnderwriterDashboard } from "@/components/pages/UnderwriterDashboard";
import { GovernmentAnalytics } from "@/components/pages/GovernmentAnalytics";
import { StageTimeline, generateMockStages } from "@/components/monitoring/StageTimeline";
import { AssessmentForm } from "@/components/survey/AssessmentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FileText, 
  BarChart3, 
  MapPin, 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

const Index = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  console.log('Index - isAuthenticated:', isAuthenticated, 'user:', user);

  const handleFarmerOnboarding = (data: any) => {
    console.log("Farmer onboarding data:", data);
    // In real app, submit to API and redirect
  };

  const handleInsurerOnboarding = (data: any) => {
    console.log("Insurer onboarding data:", data);
    // In real app, submit to API and redirect
  };

  const handleAssessmentSubmit = (data: any) => {
    console.log("Assessment submitted:", data);
    // In real app, submit to API
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Handle onboarding routes
  if (location.pathname === "/onboarding/farmer") {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center p-4">
        <MultiStepForm 
          type="farmer" 
          onSubmit={handleFarmerOnboarding}
          onBack={() => window.history.back()}
        />
      </div>
    );
  }

  if (location.pathname === "/onboarding/insurer") {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center p-4">
        <MultiStepForm 
          type="insurer" 
          onSubmit={handleInsurerOnboarding}
          onBack={() => window.history.back()}
        />
      </div>
    );
  }

  // Handle role-specific routes
  if (location.pathname.startsWith("/underwriter")) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <UnderwriterDashboard />
        </div>
      </div>
    );
  }

  if (location.pathname.startsWith("/government")) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <GovernmentAnalytics />
        </div>
      </div>
    );
  }

  if (location.pathname.startsWith("/surveyor")) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <SurveyorDashboard />
        </div>
      </div>
    );
  }

  if (location.pathname.startsWith("/farmer")) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <FarmerDashboard />
        </div>
      </div>
    );
  }

  // Default navigation menu for authenticated users
  return <NavigationMenu />;
};

// Surveyor Dashboard Component
function SurveyorDashboard() {
  const [assessments] = useState([
    {
      id: "1",
      farmerName: "Jean Baptiste",
      location: "Kigali, Rwanda",
      crop: "Maize",
      status: "pending",
      dueDate: "2024-03-20"
    },
    {
      id: "2", 
      farmerName: "Marie Claire",
      location: "Eastern Province",
      crop: "Rice",
      status: "in_progress",
      dueDate: "2024-03-22"
    }
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Surveyor Tasks</h1>
        <p className="text-muted-foreground">Your assigned farm assessments</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {assessments.map((assessment) => (
          <Card key={assessment.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{assessment.farmerName}</span>
                <Badge variant={assessment.status === "pending" ? "default" : "secondary"}>
                  {assessment.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {assessment.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Due: {assessment.dueDate}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  Crop: {assessment.crop}
                </div>
              </div>
              <div className="mt-4">
                <Button className="w-full">
                  {assessment.status === "pending" ? "Start Assessment" : "Continue Assessment"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Form</CardTitle>
        </CardHeader>
        <CardContent>
          <AssessmentForm onSubmit={console.log} />
        </CardContent>
      </Card>
    </div>
  );
}

// Farmer Dashboard Component
function FarmerDashboard() {
  const [requests] = useState([
    {
      id: "1",
      type: "Policy Request",
      status: "approved",
      amount: 50000,
      date: "2024-03-15"
    },
    {
      id: "2",
      type: "Claim",
      status: "pending",
      amount: 25000,
      date: "2024-03-10"
    }
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
        <p className="text-muted-foreground">Manage your insurance policies and claims</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Policies</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Claims</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Payouts</p>
                <p className="text-2xl font-bold">$75,000</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{request.type}</p>
                    <p className="text-sm text-muted-foreground">{request.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${request.amount.toLocaleString()}</p>
                    <Badge variant={request.status === "approved" ? "default" : "secondary"}>
                      {request.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crop Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <StageTimeline stages={generateMockStages()} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Index;
