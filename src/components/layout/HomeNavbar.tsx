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
    <nav className="fixed top-3 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-3">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 backdrop-blur-md border border-green-500 rounded-xl shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <Satellite className="h-6 w-6 text-white" />
            <div>
              <h1 className="text-xl font-semibold text-white tracking-tight">
                STARHAWK
              </h1>
              <p className="text-green-100 text-xs font-medium">Agricultural Insurance Platform</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-5">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link 
                    to="/" 
                    className={`px-2.5 py-1.5 text-xs font-medium transition-colors rounded-lg ${
                      location.pathname === '/' 
                        ? 'text-white bg-white/20 shadow-sm' 
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Home
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link 
                    to="/services" 
                    className={`px-2.5 py-1.5 text-xs font-medium transition-colors rounded-lg ${
                      location.pathname === '/services' 
                        ? 'text-white bg-white/20 shadow-sm' 
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Services
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link 
                    to="/team" 
                    className={`px-2.5 py-1.5 text-xs font-medium transition-colors rounded-lg ${
                      location.pathname === '/team' 
                        ? 'text-white bg-white/20 shadow-sm' 
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Team
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link 
                    to="/contact" 
                    className={`px-2.5 py-1.5 text-xs font-medium transition-colors rounded-lg ${
                      location.pathname === '/contact' 
                        ? 'text-white bg-white/20 shadow-sm' 
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Contact
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden lg:flex items-center gap-2.5">
            <Button 
              className="bg-white text-green-600 hover:bg-green-50 rounded-full px-5 py-2.5 shadow-sm hover:shadow-md transition-all duration-300 text-sm font-medium"
              onClick={() => navigate("/role-selection")}
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:text-white hover:bg-white/10 border-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/20 py-5 px-4">
            <div className="space-y-4">
              <Link
                to="/"
                className={`block px-2.5 py-1.5 text-xs font-medium transition-colors rounded-lg ${
                  location.pathname === '/' 
                    ? 'text-white bg-white/20 shadow-sm' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/services"
                className={`block px-2.5 py-1.5 text-xs font-medium transition-colors rounded-lg ${
                  location.pathname === '/services' 
                    ? 'text-white bg-white/20 shadow-sm' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/team"
                className={`block px-2.5 py-1.5 text-xs font-medium transition-colors rounded-lg ${
                  location.pathname === '/team' 
                    ? 'text-white bg-white/20 shadow-sm' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Team
              </Link>
              <Link
                to="/contact"
                className={`block px-2.5 py-1.5 text-xs font-medium transition-colors rounded-lg ${
                  location.pathname === '/contact' 
                    ? 'text-white bg-white/20 shadow-sm' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="px-2.5 pt-3 border-t border-white/20">
                <Button 
                  className="w-full bg-white text-green-600 hover:bg-green-50 rounded-full text-sm font-medium"
                  onClick={() => {
                    navigate("/role-selection");
                    setIsMenuOpen(false);
                  }}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
