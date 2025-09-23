"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Building2, 
  MapPin, 
  FileText, 
  BarChart3, 
  Settings,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function NavigationMenu() {
  const navigate = useNavigate();

  const roleDashboards = [
    {
      role: "insurer",
      title: "Insurer Dashboard", 
      description: "Manage insurance policies and claims",
      icon: Building2,
      path: "/insurer",
      color: "bg-blue-50 border-blue-200 text-blue-800"
    },
    {
      role: "government",
      title: "Government Analytics",
      description: "National overview and analytics",
      icon: BarChart3,
      path: "/government",
      color: "bg-red-50 border-red-200 text-red-800"
    },
    {
      role: "assessor",
      title: "Assessor Tasks",
      description: "Conduct farm assessments and surveys",
      icon: MapPin,
      path: "/assessor",
      color: "bg-orange-50 border-orange-200 text-orange-800"
    },
    {
      role: "admin",
      title: "Admin Panel",
      description: "System administration and settings",
      icon: Settings,
      path: "/admin",
      color: "bg-gray-50 border-gray-200 text-gray-800"
    }
  ];

  const handleRoleSwitch = (path: string) => {
    console.log('Navigating to:', path);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-muted/50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">AI Agri-Insurance Platform</h1>
          <p className="text-muted-foreground">
            Choose your role to access the appropriate dashboard.
          </p>
        </div>

        {/* Role Dashboards Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {roleDashboards.map((dashboard) => {
            const Icon = dashboard.icon;
            
            return (
              <Card 
                key={dashboard.role}
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
                onClick={() => handleRoleSwitch(dashboard.path)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-center">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${dashboard.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-lg mb-2 text-center">{dashboard.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 text-center">{dashboard.description}</p>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoleSwitch(dashboard.path);
                    }}
                  >
                    Access Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Click on any role card above to access that dashboard</p>
              <p>• Each role has its own specialized interface and features</p>
              <p>• You can switch between different role dashboards anytime</p>
              <p>• No login required - direct access to all features</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
