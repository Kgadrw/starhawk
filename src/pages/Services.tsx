import { HomeNavbar } from "@/components/layout/HomeNavbar";
import { FooterSection } from "@/components/home/FooterSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomScrollbar from "@/components/ui/CustomScrollbar";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Shield, 
  FileText, 
  Camera,
  Satellite,
  BarChart3,
  Briefcase,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle
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
      <div className="bg-white relative min-h-screen">
        <HomeNavbar />
      
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-gradient-to-br from-green-50 via-white to-emerald-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-700 mb-6"
            >
              Comprehensive
              <br />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Solutions
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10"
            >
              AI-powered agricultural insurance solutions that revolutionize risk assessment, claims processing, and policy management for the modern farming industry.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/role-selection">
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started Today
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-8 py-6 rounded-full font-semibold text-lg transition-all duration-300"
              >
                Schedule Demo
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 group">
                      <CardHeader className="pb-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-7 w-7 text-green-600" />
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-700 mb-2">
                          {service.title}
                        </CardTitle>
                        <p className="text-gray-600 leading-relaxed">
                          {service.description}
                        </p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ul className="space-y-2.5 mb-6">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button 
                          variant="ghost"
                          className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          Learn More
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-700 mb-4"
            >
              Ready to Transform Your
              <br />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Agricultural Insurance?
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto"
            >
              Join leading insurers and government agencies who trust STARHAWK for their agricultural insurance needs. Get started today with a free consultation.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Phone className="h-5 w-5 mr-2" />
                Schedule Consultation
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-8 py-6 rounded-full font-semibold text-lg transition-all duration-300"
              >
                <Mail className="h-5 w-5 mr-2" />
                Contact Sales
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-8 py-6 rounded-full font-semibold text-lg transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Live Chat
              </Button>
            </motion.div>
          </div>
        </section>

        <FooterSection />
      </div>
    </CustomScrollbar>
  );
}
