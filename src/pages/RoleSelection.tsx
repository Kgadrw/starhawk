import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const roles = [
    {
      title: "Farmer Portal",
      description: "Register your farm, request insurance, and manage your policies",
      icon: User,
      gradient: "from-green-500 to-emerald-600",
      hoverGradient: "from-green-600 to-emerald-700",
      href: "/farmer-register",
      features: ["Register & Get Farmer ID", "Request Insurance", "File Claims", "Track Policy Status"],
      badge: "Most Popular"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full blur-xl opacity-20 animate-pulse delay-2000"></div>

      {/* Header */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Crop Insurance Claim System</h1>
                <p className="text-green-200 text-sm">Digital insurance made easy for every farmer</p>
              </div>
            </div>
            <Link 
              to="/" 
              className="text-white/80 hover:text-white transition-colors flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
        <div className="grid gap-8 md:grid-cols-3 mb-20">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <Link key={index} to={role.href} className="block group">
                <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-500 rounded-3xl cursor-pointer h-full relative overflow-hidden">
                  {/* Card Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${role.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Badge */}
                  {role.badge && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>{role.badge}</span>
                      </div>
                    </div>
                  )}

                  <CardHeader className="pb-6 relative z-10">
                    <div className="flex items-center justify-center mb-6">
                      <div className={`w-24 h-24 bg-gradient-to-r ${role.gradient} rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-2xl`}>
                        <Icon className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center text-white group-hover:text-green-200 transition-colors">
                      {role.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 relative z-10">
                    <p className="text-white/80 text-center mb-8 leading-relaxed">
                      {role.description}
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-3 mb-8">
                      {role.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-white/70">
                          <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className={`w-full bg-gradient-to-r ${role.gradient} hover:${role.hoverGradient} text-white py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 group-hover:scale-105`}
                    >
                      Access Portal
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">10,000+</h3>
              <p className="text-white/70">Active Farmers</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">99.9%</h3>
              <p className="text-white/70">Uptime Guarantee</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">24/7</h3>
              <p className="text-white/70">Support Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
