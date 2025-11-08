import { HomeNavbar } from "@/components/layout/HomeNavbar";
import { FooterSection } from "@/components/home/FooterSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomScrollbar from "@/components/ui/CustomScrollbar";
import { motion } from "framer-motion";
import { 
  Shield, 
  FileText, 
  Users, 
  Briefcase,
  Camera,
  Satellite,
  BarChart3,
  Globe,
  Zap,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  Sparkles
} from "lucide-react";

export default function Services() {
  const services = [
    {
      title: "AI-Powered Risk Assessment",
      description: "Advanced machine learning algorithms analyze satellite imagery, weather data, and historical patterns to provide accurate risk evaluation.",
      icon: Shield,
      features: [
        "Satellite imagery analysis",
        "Weather pattern prediction",
        "Historical data correlation",
        "Real-time risk scoring",
        "Automated report generation"
      ]
    },
    {
      title: "Drone Surveillance & Monitoring",
      description: "Comprehensive 4-stage crop monitoring using advanced drone technology for precise field assessment and health tracking.",
      icon: Camera,
      features: [
        "High-resolution aerial imagery",
        "4-stage crop monitoring",
        "Disease detection algorithms",
        "Growth pattern analysis",
        "Real-time field updates"
      ]
    },
    {
      title: "Automated Claims Processing",
      description: "Streamlined claims processing with AI-powered damage assessment, reducing processing time from weeks to days.",
      icon: FileText,
      features: [
        "Instant damage assessment",
        "Automated claim validation",
        "Photo evidence analysis",
        "Fast payout processing",
        "Fraud detection algorithms"
      ]
    },
    {
      title: "Policy Management System",
      description: "Comprehensive policy creation, management, and monitoring tools for insurers and government agencies.",
      icon: Briefcase,
      features: [
        "Custom policy templates",
        "Automated underwriting",
        "Policy performance tracking",
        "Renewal management",
        "Compliance monitoring"
      ]
    },
    {
      title: "Satellite Data Analysis",
      description: "Advanced satellite imagery processing for large-scale agricultural monitoring and risk assessment.",
      icon: Satellite,
      features: [
        "Multi-spectral analysis",
        "Vegetation health indices",
        "Crop yield prediction",
        "Drought monitoring",
        "Flood risk assessment"
      ]
    },
    {
      title: "Government Analytics Dashboard",
      description: "Comprehensive analytics and reporting tools for government oversight and policy development.",
      icon: BarChart3,
      features: [
        "National statistics",
        "Regional performance analysis",
        "Policy impact assessment",
        "Economic impact studies",
        "Predictive analytics"
      ]
    }
  ];

  return (
    <CustomScrollbar>
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 relative">
        {/* Navigation */}
        <HomeNavbar />
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">
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
            className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[32rem] lg:h-[32rem]"
          />
        </div>
        <div className="absolute bottom-0 right-0 opacity-60">
          <img
            src="/lines2.png"
            alt="Bottom right lines"
            className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[32rem] lg:h-[32rem]"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16 sm:pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              <span className="text-gray-900/90 text-xs sm:text-sm font-medium">Our Services</span>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2"
          >
            <span className="text-gray-900">Comprehensive </span>
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Solutions</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4"
          >
            <span className="text-green-700">AI-powered agricultural insurance solutions</span> <span className="text-gray-900/80">that revolutionize risk assessment, 
            claims processing, and policy management for the modern farming industry.</span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
          >
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 border-0 text-gray-900 shadow-lg shadow-green-500/30 rounded-3xl px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium duration-500 ease-out hover:scale-105 hover:-translate-y-1"
            >
                Get Started Today
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
              </Button>
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 border-0 text-gray-900 shadow-lg shadow-green-500/30 rounded-3xl px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium duration-500 ease-out hover:scale-105 hover:-translate-y-1"
            >
                Schedule Demo
              </Button>
          </motion.div>
          </div>
        </div>

      {/* Services Section */}
      <div className="relative z-10 py-12 sm:py-16 lg:py-20">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-70 flex items-center justify-center">
          <img
            src="/lines.png"
            alt="Grid lines"
            className="w-3/4 h-3/4 object-contain"
          />
        </div>

        <div className="absolute bottom-0 left-0 opacity-60">
          <img
            src="/lines2.png"
            alt="Bottom left lines"
            className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-[32rem] xl:h-[32rem]"
          />
        </div>
        <div className="absolute bottom-0 right-0 opacity-60">
          <img
            src="/lines2.png"
            alt="Bottom right lines"
            className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-[32rem] xl:h-[32rem]"
          />
      </div>

      {/* Services Grid */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group bg-white border border-gray-200 hover:bg-white/10 transition-all duration-500 rounded-2xl h-full">
                  <CardHeader className="pb-4 sm:pb-6 p-4 sm:p-6">
                    <div className="flex items-center justify-center mb-4 sm:mb-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-50 border border-green-200 border border-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500">
                        <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-900" />
                      </div>
                  </div>
                    <CardTitle className={`text-lg sm:text-xl font-bold text-center ${index % 2 === 0 ? 'text-green-600' : 'text-gray-900'} group-hover:text-green-600 transition-colors leading-tight`}>
                      {service.title}
                    </CardTitle>
                </CardHeader>
                  <CardContent className="pt-0 p-4 sm:p-6">
                    <p className={`${index % 2 === 0 ? 'text-green-700' : 'text-gray-900/70'} text-center mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base`}>
                      {service.description}
                    </p>
                    
                    <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start space-x-2 sm:space-x-3">
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-900/80 text-xs sm:text-sm leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 border-0 text-gray-900 shadow-lg shadow-green-500/30 rounded-3xl py-2.5 sm:py-3 font-medium duration-500 ease-out hover:scale-105 hover:-translate-y-1 text-sm sm:text-base"
                    >
                    Learn More
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
              </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-tight px-2"
          >
            <span className="text-gray-900">Ready to Transform Your </span>
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Agricultural Insurance?</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4"
          >
            <span className="text-green-700">Join leading insurers and government agencies</span> <span className="text-gray-900/80">who trust STARHAWK for
            their agricultural insurance needs. Get started today with a free consultation.</span>
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
          >
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 border-0 text-gray-900 shadow-lg shadow-green-500/30 rounded-3xl px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg font-medium duration-500 ease-out hover:scale-105 hover:-translate-y-1"
            >
              <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Schedule Consultation
            </Button>
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 border-0 text-gray-900 shadow-lg shadow-green-500/30 rounded-3xl px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg font-medium duration-500 ease-out hover:scale-105 hover:-translate-y-1"
            >
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Contact Sales
            </Button>
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 border-0 text-gray-900 shadow-lg shadow-green-500/30 rounded-3xl px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg font-medium duration-500 ease-out hover:scale-105 hover:-translate-y-1"
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Live Chat
            </Button>
          </motion.div>
        </div>
      </div>

        {/* Footer */}
        <FooterSection />
    </div>
    </CustomScrollbar>
  );
}
