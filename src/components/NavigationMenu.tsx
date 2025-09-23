"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Building2, 
  MapPin, 
  FileText, 
  BarChart3, 
  Settings,
  LogOut,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function NavigationMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const roleDashboards = [
    {
      role: "farmer",
      title: "Farmer Dashboard",
      description: "Manage your insurance policies and claims",
      icon: User,
      path: "/farmer",
      color: "bg-green-50 border-green-200 text-green-800"
    },
    {
      role: "insurer",
      title: "Insurer Dashboard", 
      description: "Manage insurance policies and claims",
      icon: Building2,
      path: "/insurer",
      color: "bg-blue-50 border-blue-200 text-blue-800"
    },
    {
      role: "surveyor",
      title: "Surveyor Tasks",
      description: "Conduct farm assessments and surveys",
      icon: MapPin,
      path: "/surveyor",
      color: "bg-orange-50 border-orange-200 text-orange-800"
    },
    {
      role: "underwriter",
      title: "Underwriter Dashboard",
      description: "Review and approve risk assessments",
      icon: FileText,
      path: "/underwriter",
      color: "bg-purple-50 border-purple-200 text-purple-800"
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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted/50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Agri-Insurance Platform</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}! Choose your role to access the appropriate dashboard.
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Current Role Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Current Role: {user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1)}</h3>
                <p className="text-sm text-muted-foreground">Email: {user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role Dashboards Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roleDashboards.map((dashboard) => {
            const Icon = dashboard.icon;
            const isCurrentRole = user?.role === dashboard.role;
            
            return (
              <Card 
                key={dashboard.role}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isCurrentRole ? 'ring-2 ring-primary' : 'hover:scale-105'
                }`}
                onClick={() => handleRoleSwitch(dashboard.path)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${dashboard.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    {isCurrentRole && (
                      <div className="text-xs font-medium text-primary">Current</div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-lg mb-2">{dashboard.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{dashboard.description}</p>
                  <Button 
                    variant={isCurrentRole ? "default" : "outline"} 
                    className="w-full flex items-center gap-2"
                  >
                    {isCurrentRole ? "Current Dashboard" : "Switch to Dashboard"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2">
              <Button 
                variant="outline" 
                onClick={() => navigate("/onboarding/farmer")}
                className="justify-start"
              >
                <User className="h-4 w-4 mr-2" />
                Register as Farmer
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/onboarding/insurer")}
                className="justify-start"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Register as Insurer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
