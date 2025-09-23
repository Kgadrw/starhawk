import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin,
  Shield,
  Users,
  Briefcase,
  FileText,
  MessageCircle,
  ArrowRight,
  ChevronDown
} from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const services = [
    {
      title: "Risk Assessment",
      description: "AI-powered risk evaluation using satellite imagery and drone data",
      icon: Shield,
      href: "/services/risk-assessment"
    },
    {
      title: "Claims Processing",
      description: "Automated claims processing with real-time damage assessment",
      icon: FileText,
      href: "/services/claims"
    },
    {
      title: "Crop Monitoring",
      description: "4-stage continuous crop surveillance and health monitoring",
      icon: Users,
      href: "/services/monitoring"
    },
    {
      title: "Policy Management",
      description: "Comprehensive policy creation and management tools",
      icon: Briefcase,
      href: "/services/policies"
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Technology Officer",
      expertise: "AI & Machine Learning"
    },
    {
      name: "Michael Chen",
      role: "Head of Agriculture",
      expertise: "Crop Science & Risk Assessment"
    },
    {
      name: "Dr. Aisha Patel",
      role: "Data Science Director",
      expertise: "Satellite Imagery Analysis"
    },
    {
      name: "James Wilson",
      role: "Product Manager",
      expertise: "Insurance Technology"
    }
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+250 123 456 789</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>info@starhawk.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Kigali, Rwanda</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-primary-foreground/80">Welcome to STARHAWK</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                STARHAWK
              </h1>
              <p className="text-xs text-muted-foreground">AI Agricultural Insurance</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors">
                    Home
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[500px]">
                      {services.map((service) => {
                        const Icon = service.icon;
                        return (
                          <NavigationMenuLink key={service.title} asChild>
                            <Link
                              to={service.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="h-5 w-5 text-primary" />
                                <div>
                                  <div className="text-sm font-medium leading-none">{service.title}</div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                                    {service.description}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        );
                      })}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">
                    Team
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px]">
                      <div className="text-sm font-medium mb-2">Our Expert Team</div>
                      {teamMembers.map((member, index) => (
                        <NavigationMenuLink key={index} asChild>
                          <div className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">{member.name}</div>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                            <p className="text-xs text-primary">{member.expertise}</p>
                          </div>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/contact" className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors">
                    Contact
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/claim" className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors">
                    File a Claim
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Login
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate("/insurer")}>
                  <Shield className="h-4 w-4 mr-2" />
                  Insurer Login
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/government")}>
                  <Users className="h-4 w-4 mr-2" />
                  Government Login
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/assessor")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Assessor Login
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/admin")}>
                  <Briefcase className="h-4 w-4 mr-2" />
                  Admin Login
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <Link
                to="/"
                className="block px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <div className="px-3 py-2">
                <div className="text-sm font-medium mb-2">Services</div>
                <div className="space-y-2 ml-4">
                  {services.map((service) => (
                    <Link
                      key={service.title}
                      to={service.href}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                to="/team"
                className="block px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Team
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/claim"
                className="block px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                File a Claim
              </Link>
              <div className="px-3 py-2 space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600">
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
