import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HomeNavbar } from "@/components/layout/HomeNavbar";
import { FooterSection } from "@/components/home/FooterSection";
import { FarmerRegistrationModal } from "@/components/modals/FarmerRegistrationModal";
import CustomScrollbar from "@/components/ui/CustomScrollbar";
import { motion } from "framer-motion";
import { 
  User, 
  Building2, 
  MapPin, 
  ArrowRight,
  Shield,
  Sparkles,
  CheckCircle,
  Star
} from "lucide-react";

export default function RoleSelection() {
  const [isFarmerModalOpen, setIsFarmerModalOpen] = useState(false);

  const roles = [
    {
      title: "Farmer Portal",
      description: "Register your farm, request insurance, and manage policies",
      icon: User,
      features: ["Register & Get Farmer ID", "Request Insurance", "File Claims", "Track Policy Status"],
      badge: "Most Popular",
      isModal: true
    },
    {
      title: "Assessor Portal", 
      description: "Conduct field assessments and risk evaluations",
      icon: MapPin,
      href: "/assessor-login",
      features: ["Risk Assessments", "Field Surveys", "Loss Evaluations", "Report Submission"]
    },
    {
      title: "Insurer Portal",
      description: "Manage policies, process claims, and analyze risk data",
      icon: Building2,
      href: "/insurer-login",
      features: ["Policy Management", "Claim Processing", "Risk Analysis", "Payment Processing"]
    },
    {
      title: "Government Portal",
      description: "Analytics, monitoring, and policy oversight for government officials",
      icon: Building2,
      href: "/government-login",
      features: ["National Analytics", "Regional Monitoring", "Policy Oversight", "Trend Analysis"]
    },
    {
      title: "Admin Portal",
      description: "System administration and user management",
      icon: Shield,
      href: "/admin-login",
      features: ["User Management", "System Configuration", "Security Controls", "Activity Monitoring"],
      badge: "Admin Only"
    }
  ];

  return (
    <CustomScrollbar>
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        {/* Navigation */}
        <HomeNavbar />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-70 flex items-center justify-center">
        <img
          src="/lines.png"
          alt="Grid lines"
          className="w-3/4 h-3/4 object-contain"
        />
      </div>
      
      {/* Bottom Corner Lines */}
      <div className="absolute bottom-0 left-0 opacity-60">
        <img
          src="/lines2.png"
          alt="Bottom left lines"
          className="w-[32rem] h-[32rem]"
        />
              </div>
      <div className="absolute bottom-0 right-0 opacity-60">
        <img
          src="/lines2.png"
          alt="Bottom right lines"
          className="w-[32rem] h-[32rem]"
        />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-24 pb-14">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full mb-4 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-green-600" />
            <span className="text-green-700 text-xs font-medium">Choose Your Portal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-green-700 mb-4">
            Welcome to the Future
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Select your role to access the right workspace and tools.
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role, index) => {
            const Icon = role.icon;
            
            if (role.isModal) {
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="block group cursor-pointer" 
                  onClick={() => setIsFarmerModalOpen(true)}
                >
                <Card className={`bg-white border border-gray-200 hover:shadow-lg transition-all duration-250 rounded-2xl h-full relative overflow-hidden`}>
                  {/* Badge */}
                  {role.badge && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="bg-gray-900 text-white text-[10px] uppercase tracking-wide px-2 py-1 rounded-full shadow-sm">
                        {role.badge}
                      </div>
                    </div>
                  )}

                  <CardHeader className="pb-4 relative z-10 pt-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-250`}>
                        <Icon className={`h-8 w-8 text-gray-600`} />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-semibold text-center text-gray-900">
                      {role.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 relative z-10 px-5 pb-5">
                    <p className="text-gray-600 text-center mb-4 leading-relaxed text-sm">
                      {role.description}
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-3 mb-8">
                      {role.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-xs text-gray-700">
                          <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                            <CheckCircle className="h-2.5 w-2.5 text-gray-500" />
                          </div>
                          <span className="text-green-700 text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className="w-full bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-lg font-medium text-sm shadow-sm transition-all duration-250"
                    >
                      Register Now
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
              );
            } else {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <Link to={role.href} className="block group">
                  <Card className={`bg-white border border-gray-200 hover:shadow-lg transition-all duration-250 rounded-2xl h-full relative overflow-hidden`}>
                  {/* Badge */}
                  {role.badge && (
                    <div className="absolute top-3 right-3 z-10">
                        <div className="bg-gray-900 text-white text-[10px] uppercase tracking-wide px-2 py-1 rounded-full shadow-sm">
                        {role.badge}
                      </div>
                    </div>
                  )}

                  <CardHeader className="pb-4 relative z-10 pt-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-250`}>
                        <Icon className={`h-8 w-8 text-gray-600`} />
                      </div>
                    </div>
                      <CardTitle className="text-xl font-semibold text-center text-gray-900">
                      {role.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 relative z-10 px-5 pb-5">
                      <p className="text-gray-600 text-center mb-4 leading-relaxed text-sm">
                      {role.description}
                    </p>
                    
                    {/* Features List */}
                      <div className="space-y-3 mb-8">
                      {role.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-xs text-gray-700">
                            <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                              <CheckCircle className="h-2.5 w-2.5 text-gray-500" />
                            </div>
                          <span className="text-green-700 text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                        className="w-full bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-lg font-medium text-sm shadow-sm transition-all duration-250"
                    >
                      Access Portal
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
              </motion.div>
            );
            }
          })}
        </div>

              </div>

        {/* Footer */}
        <FooterSection />

        {/* Farmer Registration Modal */}
        <FarmerRegistrationModal 
          isOpen={isFarmerModalOpen} 
          onClose={() => setIsFarmerModalOpen(false)} 
        />
            </div>
    </CustomScrollbar>
  );
}
