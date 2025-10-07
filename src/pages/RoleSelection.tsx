import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HomeNavbar } from "@/components/layout/HomeNavbar";
import { FooterSection } from "@/components/home/FooterSection";
import { FarmerRegistrationModal } from "@/components/modals/FarmerRegistrationModal";
import CustomScrollbar from "@/components/ui/CustomScrollbar";
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
    }
  ];

  return (
    <CustomScrollbar>
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen">
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
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-white/90 text-sm font-medium">Choose Your Portal</span>
          </div>
          <h2 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
            Welcome to the Future
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Select your role to access the appropriate portal and begin your journey with our cutting-edge digital insurance platform.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {roles.map((role, index) => {
            const Icon = role.icon;
            
            if (role.isModal) {
              return (
                <div key={index} className="block group cursor-pointer" onClick={() => setIsFarmerModalOpen(true)}>
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 rounded-2xl cursor-pointer h-full relative overflow-hidden">
                  {/* Badge */}
                  {role.badge && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1 border border-white/20">
                        <Star className="h-3 w-3" />
                        <span>{role.badge}</span>
                      </div>
                    </div>
                  )}

                  <CardHeader className="pb-6 relative z-10">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500">
                        <Icon className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-center text-white group-hover:text-green-200 transition-colors">
                      {role.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 relative z-10">
                    <p className="text-white/80 text-center mb-6 leading-relaxed text-sm">
                      {role.description}
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-2 mb-6">
                      {role.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-xs text-white/70">
                          <CheckCircle className="h-3 w-3 text-green-400 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 rounded-xl font-medium text-base backdrop-blur-sm transition-all duration-300 group-hover:scale-105"
                    >
                      Register Now
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
              );
            } else {
              return (
                <Link key={index} to={role.href} className="block group">
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 rounded-2xl cursor-pointer h-full relative overflow-hidden">
                    {/* Badge */}
                    {role.badge && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1 border border-white/20">
                          <Star className="h-3 w-3" />
                          <span>{role.badge}</span>
                        </div>
                      </div>
                    )}

                    <CardHeader className="pb-6 relative z-10">
                      <div className="flex items-center justify-center mb-6">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500">
                          <Icon className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-center text-white group-hover:text-green-200 transition-colors">
                        {role.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 relative z-10">
                      <p className="text-white/80 text-center mb-6 leading-relaxed text-sm">
                        {role.description}
                      </p>
                      
                      {/* Features List */}
                      <div className="space-y-2 mb-6">
                        {role.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-xs text-white/70">
                            <CheckCircle className="h-3 w-3 text-green-400 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button 
                        className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 rounded-xl font-medium text-base backdrop-blur-sm transition-all duration-300 group-hover:scale-105"
                      >
                        Access Portal
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
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
