import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  BarChart3,
  FileText,
  AlertTriangle,
  CheckCircle,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  User,
  Shield,
  Building2
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  userType: "farmer" | "assessor" | "insurer" | "admin" | "government";
  userId: string;
  userName: string;
  navigationItems: Array<{
    id: string;
    label: string;
    icon: any;
    badge?: number;
  }>;
  activePage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
}

export default function DashboardLayout({
  children,
  userType,
  userId,
  userName,
  navigationItems,
  activePage,
  onPageChange,
  onLogout
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('userToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    
    // Call the custom logout handler if provided
    if (onLogout) {
      onLogout();
    }
    
    // Navigate back to role selection
    navigate('/role-selection');
  };

  const getUserIcon = () => {
    switch (userType) {
      case "farmer": return <User className="h-6 w-6" />;
      case "assessor": return <Shield className="h-6 w-6" />;
      case "insurer": return <Building2 className="h-6 w-6" />;
      case "admin": return <Settings className="h-6 w-6" />;
      case "government": return <BarChart3 className="h-6 w-6" />;
      default: return <User className="h-6 w-6" />;
    }
  };

  const getUserColor = () => {
    switch (userType) {
      case "farmer": return "bg-green-600";
      case "assessor": return "bg-orange-600";
      case "insurer": return "bg-blue-600";
      case "admin": return "bg-purple-600";
      case "government": return "bg-indigo-600";
      default: return "bg-gray-600";
    }
  };

  const getUserLabel = () => {
    switch (userType) {
      case "farmer": return "Farmer";
      case "assessor": return "Assessor";
      case "insurer": return "Insurer";
      case "admin": return "Admin";
      case "government": return "Government";
      default: return "User";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex relative">
      {/* Soft background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-blue-100/20 pointer-events-none"></div>
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-white/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Mobile Close Button */}
          <div className="flex justify-end p-4 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-white/30 bg-gradient-to-r from-green-50/60 to-emerald-50/60 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-800">{userName}</p>
              <p className="text-xs text-gray-500">{getUserLabel()}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              
              return (
                            <button
                              key={item.id}
                              onClick={() => {
                                onPageChange(item.id);
                                setSidebarOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                                isActive
                                  ? 'bg-gradient-to-r from-green-400/80 to-emerald-500/80 backdrop-blur-sm text-white shadow-lg shadow-green-200/50 transform scale-105'
                                  : 'text-gray-600 hover:bg-white/40 hover:text-green-600 hover:shadow-md hover:backdrop-blur-sm'
                              }`}
                            >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span>{item.label}</span>
                  </div>
                              {item.badge && item.badge > 0 && (
                                <Badge variant="secondary" className={`text-xs ${
                                  isActive 
                                    ? 'bg-white text-green-600' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {item.badge}
                                </Badge>
                              )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/30 bg-gradient-to-r from-gray-50/60 to-white/60 backdrop-blur-sm">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-red-50/60 hover:border-red-200/60 hover:text-red-600 transition-all duration-300 backdrop-blur-sm border-white/40"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to logout? You will be redirected to the role selection page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Top Header */}
        <header className="bg-white/60 backdrop-blur-xl shadow-lg shadow-blue-100/20 border-b border-white/30 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden mr-2 hover:bg-green-50/60 backdrop-blur-sm"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center space-x-2">
                  <Home className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-400">/</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {navigationItems.find(item => item.id === activePage)?.label || 'Dashboard'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="hover:bg-green-50/60 backdrop-blur-sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400/80 to-emerald-500/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md shadow-green-200/50">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 hidden sm:block">
                    {userName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
