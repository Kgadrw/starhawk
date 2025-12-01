import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { 
  Menu, 
  X, 
  ArrowRight,
  Satellite
} from "lucide-react";

export function HomeNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
              <Satellite className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl text-gray-800 tracking-tight font-bold">
                STARHAWK
              </h1>
              <p className="text-green-600 text-xs">Agricultural Insurance</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                <NavigationMenuItem>
                  <Link 
                    to="/" 
                    className={`px-3 py-2 text-sm transition-colors ${
                      location.pathname === '/' 
                        ? 'text-green-600 underline underline-offset-4' 
                        : 'text-gray-800 hover:text-green-600 hover:bg-gray-50 rounded-lg'
                    }`}
                  >
                    Home
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link 
                    to="/services" 
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      location.pathname === '/services' 
                        ? 'text-green-600 underline underline-offset-4' 
                        : 'text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg'
                    }`}
                  >
                    Services
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link 
                    to="/team" 
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      location.pathname === '/team' 
                        ? 'text-green-600 underline underline-offset-4' 
                        : 'text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg'
                    }`}
                  >
                    Team
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-2 shadow-sm hover:shadow-md transition-all duration-300 text-sm font-medium"
              onClick={() => navigate("/role-selection")}
            >
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-gray-800 hover:text-gray-900 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <Link
                to="/"
                className={`block px-3 py-2 text-sm transition-colors ${
                  location.pathname === '/' 
                    ? 'text-green-600 underline underline-offset-4' 
                    : 'text-gray-800 hover:text-green-600 hover:bg-gray-50 rounded-lg'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/services"
                className={`block px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === '/services' 
                    ? 'text-green-600 underline underline-offset-4' 
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/team"
                className={`block px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === '/team' 
                    ? 'text-green-600 underline underline-offset-4' 
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Team
              </Link>
              <div className="px-3 pt-3 border-t border-gray-200">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-medium"
                  onClick={() => {
                    navigate("/role-selection");
                    setIsMenuOpen(false);
                  }}
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
