import { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import CustomScrollbar from "@/components/ui/CustomScrollbar";
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

  // Remove dark mode - use light theme
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

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

  const getSidebarTheme = () => {
    // Use light theme for sidebar
    return "from-white to-gray-50 border-gray-200";
  };

  const getMainContentTheme = () => {
    // Always use dark theme like Chainex dashboard
    return "";
  };

  const getNavigationColors = () => {
    switch (userType) {
      case "farmer": return {
        active: "bg-green-50 text-green-700",
        hover: "hover:text-green-600"
      };
      case "assessor": return {
        active: "bg-orange-50 text-orange-700",
        hover: "hover:text-orange-600"
      };
      case "insurer": return {
        active: "bg-blue-50 text-blue-700",
        hover: "hover:text-blue-600"
      };
      case "admin": return {
        active: "bg-purple-50 text-purple-700",
        hover: "hover:text-purple-600"
      };
      case "government": return {
        active: "bg-indigo-50 text-indigo-700",
        hover: "hover:text-indigo-600"
      };
      default: return {
        active: "bg-gray-50 text-gray-700",
        hover: "hover:text-gray-600"
      };
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
     <div className="min-h-screen bg-gray-50 flex relative">
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-4 left-4 z-50 w-64 bg-gradient-to-br ${getSidebarTheme()} backdrop-blur-xl border rounded-3xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Mobile Close Button */}
          <div className="flex justify-end p-4 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100 text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3 p-3 rounded-xl">
              <div className={`w-10 h-10 ${getUserColor()} rounded-full flex items-center justify-center`}>
                <div className="text-white">
                  {getUserIcon()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                <p className="text-xs text-gray-600 truncate">{getUserLabel()}</p>
              </div>
            </div>
          </div>


          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <CustomScrollbar className="h-full">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              const colors = getNavigationColors();
              
              return (
                            <button
                              key={item.id}
                              onClick={() => {
                                onPageChange(item.id);
                                setSidebarOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-4 py-4 text-sm font-medium rounded-xl transition-all duration-300 ease-in-out ${
                                isActive
                                  ? `bg-green-50 text-green-700 shadow-sm border border-green-200`
                                  : `text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${colors.hover}`
                              }`}
                            >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-green-600' : 'text-gray-600'}`} />
                    <span>{item.label}</span>
                  </div>
                              {item.badge && item.badge > 0 && (
                                <Badge variant="secondary" className={`text-xs ${
                                  isActive 
                                    ? 'bg-green-600 text-white' 
                                    : userType === 'farmer' ? 'bg-green-100 text-green-700' :
                                      userType === 'assessor' ? 'bg-orange-100 text-orange-700' :
                                      userType === 'insurer' ? 'bg-blue-100 text-blue-700' :
                                      userType === 'admin' ? 'bg-purple-100 text-purple-700' :
                                      userType === 'government' ? 'bg-indigo-100 text-indigo-700' :
                                      'bg-gray-100 text-gray-700'
                                }`}>
                                  {item.badge}
                                </Badge>
                              )}
                </button>
              );
            })}
            </CustomScrollbar>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-center">
              {/* Logout Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-center hover:text-red-600 transition-all duration-300 text-gray-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
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
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72 bg-gray-50">
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-40">
          <Button
            variant="ghost"
            size="sm"
            className="bg-white backdrop-blur-sm hover:bg-gray-100 shadow-lg rounded-2xl border border-gray-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </Button>
        </div>

         {/* Page Content */}
         <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto bg-gray-50">
          <CustomScrollbar className="h-full">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </CustomScrollbar>
        </main>
      </div>
    </div>
  );
}
