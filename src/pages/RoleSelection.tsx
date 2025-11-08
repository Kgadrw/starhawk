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
      description: "Register your farm, request insurance, and manage your policies",
      icon: User,
      gradient: "from-green-500 to-emerald-600",
      hoverGradient: "from-green-600 to-emerald-700",
      href: null, // No href for farmer portal, will use modal
      features: ["Register & Get Farmer ID", "Request Insurance", "File Claims", "Track Policy Status"],
      badge: "Most Popular",
      isModal: true
    },
    {
      title: "Assessor Portal", 
      description: "Conduct field assessments and risk evaluations",
      icon: MapPin,
      gradient: "from-orange-500 to-amber-600",
      hoverGradient: "from-orange-600 to-amber-700",
      href: "/assessor-login",
      features: ["Risk Assessments", "Field Surveys", "Loss Evaluations", "Report Submission"]
    },
    {
      title: "Insurer Portal",
      description: "Manage policies, process claims, and analyze risk data",
      icon: Building2,
      gradient: "from-blue-500 to-indigo-600",
      hoverGradient: "from-blue-600 to-indigo-700",
      href: "/insurer-login",
      features: ["Policy Management", "Claim Processing", "Risk Analysis", "Payment Processing"]
    },
    {
      title: "Government Portal",
      description: "Analytics, monitoring, and policy oversight for government officials",
      icon: Building2,
      gradient: "from-purple-500 to-blue-600",
      hoverGradient: "from-purple-600 to-blue-700",
      href: "/government-login",
      features: ["National Analytics", "Regional Monitoring", "Policy Oversight", "Trend Analysis"]
    },
    {
      title: "Admin Portal",
      description: "System administration and user management",
      icon: Shield,
      gradient: "from-red-500 to-orange-600",
      hoverGradient: "from-red-600 to-orange-700",
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full mb-6 shadow-sm">
            <Sparkles className="h-4 w-4 text-green-600" />
            <span className="text-gray-700 text-sm font-medium">Choose Your Portal</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gray-900">Welcome to </span>
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">the Future</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Select your role to access the appropriate portal and begin your journey with our cutting-edge digital insurance platform.
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                <Card className={`bg-white border-2 ${role.borderColor} hover:shadow-xl transition-all duration-300 rounded-3xl cursor-pointer h-full relative overflow-hidden group`}>
                  {/* Badge */}
                  {role.badge && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-md">
                        <Star className="h-3 w-3 fill-white" />
                        <span>{role.badge}</span>
                      </div>
                    </div>
                  )}

                  <CardHeader className="pb-6 relative z-10 pt-8">
                    <div className="flex items-center justify-center mb-6">
                      <div className={`w-24 h-24 bg-gradient-to-br ${role.iconBg} border-2 ${role.borderColor} rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                        <Icon className={`h-12 w-12 ${role.iconColor} group-hover:scale-110 transition-all duration-300`} />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center text-gray-900 group-hover:text-green-600 transition-colors">
                      {role.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 relative z-10 px-6 pb-6">
                    <p className="text-gray-600 text-center mb-6 leading-relaxed">
                      {role.description}
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-3 mb-8">
                      {role.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-gray-700">
                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3.5 rounded-xl font-semibold text-base shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]"
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
                  <Card className={`bg-white border-2 ${role.borderColor} hover:shadow-xl transition-all duration-300 rounded-3xl cursor-pointer h-full relative overflow-hidden group`}>
                  {/* Badge */}
                  {role.badge && (
                    <div className="absolute top-4 right-4 z-10">
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-md">
                        <Star className="h-3 w-3 fill-white" />
                        <span>{role.badge}</span>
                      </div>
                    </div>
                  )}

                  <CardHeader className="pb-6 relative z-10 pt-8">
                    <div className="flex items-center justify-center mb-6">
                        <div className={`w-24 h-24 bg-gradient-to-br ${role.iconBg} border-2 ${role.borderColor} rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                          <Icon className={`h-12 w-12 ${role.iconColor} group-hover:scale-110 transition-all duration-300`} />
                      </div>
                    </div>
                      <CardTitle className="text-2xl font-bold text-center text-gray-900 group-hover:text-green-600 transition-colors">
                      {role.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 relative z-10 px-6 pb-6">
                      <p className="text-gray-600 text-center mb-6 leading-relaxed">
                      {role.description}
                    </p>
                    
                    {/* Features List */}
                      <div className="space-y-3 mb-8">
                      {role.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-sm text-gray-700">
                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            </div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3.5 rounded-xl font-semibold text-base shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]"
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
