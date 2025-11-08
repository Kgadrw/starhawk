import { Link } from "react-router-dom";
import { Satellite, Mail, Phone, MapPin } from "lucide-react";

export function FooterSection() {
  const footerLinks = {
    product: [
      { name: "Features", href: "/features" },
      { name: "Pricing", href: "/pricing" },
      { name: "API", href: "/api" },
      { name: "Documentation", href: "/docs" }
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "Press", href: "/press" }
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "Status", href: "/status" },
      { name: "Community", href: "/community" }
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" }
    ]
  };

  return (
    <footer className="relative z-10 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <Satellite className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">STARHAWK</h1>
                <p className="text-green-600 text-sm">Agricultural Insurance Platform</p>
              </div>
            </Link>
            <p className="text-gray-600 leading-relaxed mb-6 max-w-md">
              Revolutionizing agricultural insurance with AI-powered satellite monitoring, drone surveillance, and automated claims processing.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="h-4 w-4" />
                <span className="text-sm">contact@starhawk.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-600 text-sm">
              © 2024 STARHAWK. All rights reserved.
            </div>
            <div className="flex space-x-6">
              {footerLinks.legal.map((link) => (
                <Link 
                  key={link.name}
                  to={link.href} 
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
