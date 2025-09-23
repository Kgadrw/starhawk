import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  ArrowRight,
  Globe,
  FileText,
  Users,
  Briefcase
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Team", href: "/team" },
    { name: "Contact", href: "/contact" },
    { name: "File a Claim", href: "/claim" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" }
  ];

  const services = [
    { name: "Risk Assessment", href: "/services/risk-assessment" },
    { name: "Claims Processing", href: "/services/claims" },
    { name: "Crop Monitoring", href: "/services/monitoring" },
    { name: "Policy Management", href: "/services/policies" },
    { name: "Drone Surveillance", href: "/services/drone" },
    { name: "Satellite Analysis", href: "/services/satellite" }
  ];

  const platforms = [
    { name: "Insurer Portal", href: "/insurer", icon: Shield },
    { name: "Government Analytics", href: "/government", icon: Users },
    { name: "Assessor Tasks", href: "/assessor", icon: FileText },
    { name: "Admin Panel", href: "/admin", icon: Briefcase }
  ];

  const socialLinks = [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "Instagram", href: "#", icon: Instagram }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">STARHAWK</h3>
                <p className="text-sm text-gray-400">AI Agricultural Insurance</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Revolutionizing agricultural insurance through cutting-edge AI technology, 
              real-time data analysis, and intelligent risk assessment for modern farming.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                    asChild
                  >
                    <a href={social.href} aria-label={social.name}>
                      <Icon className="h-5 w-5" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Our Services</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Access & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Platform Access</h4>
            <div className="space-y-2">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <Link
                    key={platform.name}
                    to={platform.href}
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    {platform.name}
                  </Link>
                );
              })}
            </div>

            <div className="pt-4">
              <h4 className="text-lg font-semibold mb-3">Newsletter</h4>
              <p className="text-sm text-gray-300 mb-3">
                Stay updated with the latest in agricultural insurance technology.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="grid gap-4 md:grid-cols-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Phone className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-300">+250 123 456 789</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Mail className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-300">info@starhawk.com</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <MapPin className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-300">Kigali, Rwanda</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © {currentYear} STARHAWK. All rights reserved. | AI Agricultural Insurance Platform
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
