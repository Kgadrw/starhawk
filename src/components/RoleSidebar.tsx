import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Building2, 
  MapPin, 
  BarChart3, 
  Settings,
  Users,
  FileText,
  Calendar,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Activity,
  Shield,
  Database,
  Globe,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

interface RoleSidebarProps {
  role: "insurer" | "government" | "assessor" | "admin";
  onPageChange: (page: string) => void;
  activePage?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function RoleSidebar({ role, onPageChange, activePage = "dashboard", isOpen = true, onToggle }: RoleSidebarProps) {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const roleConfig = {
    insurer: {
      title: "Insurer Dashboard",
      icon: Building2,
      color: "bg-blue-500",
      menuItems: [
        { id: "dashboard", label: "Dashboard", icon: Home, description: "Overview & Analytics" },
        { id: "policies", label: "Policies", icon: FileText, description: "Policy Management" },
        { id: "claims", label: "Claims", icon: AlertTriangle, description: "Claims Processing" },
        { id: "risk", label: "Risk Analysis", icon: TrendingUp, description: "Risk Assessment" },
        { id: "portfolio", label: "Portfolio", icon: BarChart3, description: "Portfolio Overview" },
        { id: "reports", label: "Reports", icon: FileText, description: "Analytics & Reports" }
      ],
      stats: [
        { label: "Active Policies", value: "1,247", icon: CheckCircle, color: "text-green-600" },
        { label: "Pending Claims", value: "23", icon: Clock, color: "text-yellow-600" },
        { label: "Total Premium", value: "$2.4M", icon: TrendingUp, color: "text-blue-600" }
      ]
    },
    government: {
      title: "Government Analytics",
      icon: BarChart3,
      color: "bg-red-500",
      menuItems: [
        { id: "dashboard", label: "Overview", icon: Home, description: "National Statistics" },
        { id: "monitoring", label: "Monitoring", icon: Activity, description: "Policy Monitoring" },
        { id: "sector", label: "Sector Analysis", icon: BarChart3, description: "Agricultural Sector" },
        { id: "trends", label: "Trends", icon: TrendingUp, description: "Market Trends" },
        { id: "reports", label: "Reports", icon: FileText, description: "Government Reports" },
        { id: "settings", label: "Settings", icon: Settings, description: "System Settings" }
      ],
      stats: [
        { label: "Total Farmers", value: "15,247", icon: Users, color: "text-blue-600" },
        { label: "Active Policies", value: "8,923", icon: CheckCircle, color: "text-green-600" },
        { label: "Claims Processed", value: "1,456", icon: FileText, color: "text-orange-600" }
      ]
    },
    assessor: {
      title: "Assessor Tasks",
      icon: MapPin,
      color: "bg-orange-500",
      menuItems: [
        { id: "dashboard", label: "Dashboard", icon: Home, description: "Task Overview" },
        { id: "assessments", label: "Assessments", icon: MapPin, description: "Field Assessments" },
        { id: "tasks", label: "My Tasks", icon: Calendar, description: "Assigned Tasks" },
        { id: "reports", label: "Reports", icon: FileText, description: "Assessment Reports" },
        { id: "history", label: "History", icon: Clock, description: "Completed Tasks" },
        { id: "settings", label: "Settings", icon: Settings, description: "Profile Settings" }
      ],
      stats: [
        { label: "Pending Tasks", value: "12", icon: Clock, color: "text-yellow-600" },
        { label: "Completed", value: "89", icon: CheckCircle, color: "text-green-600" },
        { label: "This Month", value: "23", icon: Calendar, color: "text-blue-600" }
      ]
    },
    admin: {
      title: "Admin Panel",
      icon: Settings,
      color: "bg-gray-500",
      menuItems: [
        { id: "dashboard", label: "Dashboard", icon: Home, description: "System Overview" },
        { id: "users", label: "Users", icon: Users, description: "User Management" },
        { id: "system", label: "System", icon: Database, description: "System Settings" },
        { id: "analytics", label: "Analytics", icon: BarChart3, description: "Platform Analytics" },
        { id: "security", label: "Security", icon: Shield, description: "Security & Access" },
        { id: "logs", label: "Logs", icon: FileText, description: "System Logs" },
        { id: "backup", label: "Backup", icon: Database, description: "Data Management" },
        { id: "settings", label: "Settings", icon: Settings, description: "Platform Settings" }
      ],
      stats: [
        { label: "Total Users", value: "1,247", icon: Users, color: "text-blue-600" },
        { label: "System Health", value: "99.9%", icon: CheckCircle, color: "text-green-600" },
        { label: "Active Sessions", value: "156", icon: Activity, color: "text-orange-600" }
      ]
    }
  };

  const config = roleConfig[role];
  const Icon = config.icon;

  const handlePageChange = (page: string) => {
    onPageChange(page);
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative z-50 h-full transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-80 bg-white border-r border-gray-200 flex flex-col
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color} text-white`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">{config.title}</h2>
                <p className="text-sm text-muted-foreground capitalize">{role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-2">
            {config.stats.map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`text-lg font-semibold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {config.menuItems.map((item) => {
              const ItemIcon = item.icon;
              const isActive = activePage === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start h-auto p-3 ${
                    isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  }`}
                  onClick={() => handlePageChange(item.id)}
                >
                  <ItemIcon className="h-4 w-4 mr-3" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>
    </>
  );
}
