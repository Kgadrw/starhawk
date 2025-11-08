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
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-7xl px-4">
      {/* Rounded Navbar Container */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 backdrop-blur-md border border-green-500 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <Satellite className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                STARHAWK
              </h1>
              <p className="text-green-100 text-sm font-medium">Agricultural Insurance Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link 
                    to="/" 
                    className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
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
                    className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
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
                    className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
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
                    className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
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

          {/* Action Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Button 
              className="bg-white text-green-600 hover:bg-green-50 rounded-full px-6 shadow-md hover:shadow-lg transition-all duration-300 font-medium"
              onClick={() => navigate("/role-selection")}
            >
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:text-white hover:bg-white/10 border-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/20 py-6 px-6">
            <div className="space-y-6">
              <Link
                to="/"
                className={`block px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
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
                className={`block px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
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
                className={`block px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
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
                className={`block px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                  location.pathname === '/contact' 
                    ? 'text-white bg-white/20 shadow-sm' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="px-3 py-2 pt-4 border-t border-white/20">
                <Button 
                  className="w-full bg-white text-green-600 hover:bg-green-50 rounded-full font-medium"
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
