import { ReactNode, useState, useEffect } from "react";
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
  Building2,
  Sun,
  Moon
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // Load dark mode preference from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

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
    // Always use gray-950 theme to match main background
    return "from-gray-950/90 to-gray-900/90 border-gray-800/30";
  };

  const getMainContentTheme = () => {
    // Always use dark theme like Chainex dashboard
    if (isDarkMode) {
      switch (userType) {
        case "farmer": return "from-green-50/90 to-emerald-50/90 border-green-200/30";
        case "assessor": return "from-orange-50/90 to-red-50/90 border-orange-200/30";
        case "insurer": return "from-blue-50/90 to-indigo-50/90 border-blue-200/30";
        case "admin": return "from-purple-50/90 to-violet-50/90 border-purple-200/30";
        case "government": return "from-indigo-50/90 to-blue-50/90 border-indigo-200/30";
        default: return "from-gray-50/90 to-slate-50/90 border-gray-200/30";
      }
    }
  };

  const getNavigationColors = () => {
    if (isDarkMode) {
      switch (userType) {
        case "farmer": return {
          active: "from-green-500/80 to-emerald-600/80 shadow-green-500/20",
          hover: "hover:text-green-400"
        };
        case "assessor": return {
          active: "from-orange-500/80 to-red-600/80 shadow-orange-500/20",
          hover: "hover:text-orange-400"
        };
        case "insurer": return {
          active: "from-blue-500/80 to-indigo-600/80 shadow-blue-500/20",
          hover: "hover:text-blue-400"
        };
        case "admin": return {
          active: "from-purple-500/80 to-violet-600/80 shadow-purple-500/20",
          hover: "hover:text-purple-400"
        };
        case "government": return {
          active: "from-indigo-500/80 to-blue-600/80 shadow-indigo-500/20",
          hover: "hover:text-indigo-400"
        };
        default: return {
          active: "from-gray-500/80 to-slate-600/80 shadow-gray-500/20",
          hover: "hover:text-gray-400"
        };
      }
    } else {
      switch (userType) {
        case "farmer": return {
          active: "from-green-400/80 to-emerald-500/80 shadow-green-200/50",
          hover: "hover:text-green-600"
        };
        case "assessor": return {
          active: "from-orange-400/80 to-red-500/80 shadow-orange-200/50",
          hover: "hover:text-orange-600"
        };
        case "insurer": return {
          active: "from-blue-400/80 to-indigo-500/80 shadow-blue-200/50",
          hover: "hover:text-blue-600"
        };
        case "admin": return {
          active: "from-purple-400/80 to-violet-500/80 shadow-purple-200/50",
          hover: "hover:text-purple-600"
        };
        case "government": return {
          active: "from-indigo-400/80 to-blue-500/80 shadow-indigo-200/50",
          hover: "hover:text-indigo-600"
        };
        default: return {
          active: "from-gray-400/80 to-slate-500/80 shadow-gray-200/50",
          hover: "hover:text-gray-600"
        };
      }
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
     <div className="min-h-screen bg-gray-950 flex relative">
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
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
              className="hover:bg-gray-800/10 text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-white/30 dark:border-gray-700/30">
            <div className="flex items-center space-x-3 p-3 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400/80 to-emerald-500/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{userName}</p>
                <p className="text-xs text-white/70 truncate">{getUserLabel()}</p>
              </div>
            </div>
          </div>


          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
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
                              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                                isActive
                                  ? `bg-gradient-to-r ${colors.active} backdrop-blur-sm text-white transform scale-105`
                                  : `text-white/80 hover:bg-gray-800/20 hover:text-white ${colors.hover} hover:backdrop-blur-sm`
                              }`}
                            >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-white/70'}`} />
                    <span>{item.label}</span>
                  </div>
                              {item.badge && item.badge > 0 && (
                                <Badge variant="secondary" className={`text-xs ${
                                  isActive 
                                    ? 'bg-gray-800 text-white' 
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
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/30 dark:border-gray-700/30">
            <div className="flex items-center space-x-2">
              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="flex-1 justify-center hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                )}
              </Button>
              
              {/* Logout Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex-1 justify-center hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 text-gray-600 dark:text-gray-300"
                  >
                    <LogOut className="h-4 w-4" />
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
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72 bg-gray-950">
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-40">
          <Button
            variant="ghost"
            size="sm"
            className="bg-gray-900/80 backdrop-blur-sm hover:bg-gray-800/90 shadow-lg rounded-2xl border border-gray-700/50"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5 text-white" />
          </Button>
        </div>

         {/* Page Content */}
         <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto bg-gray-950">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
