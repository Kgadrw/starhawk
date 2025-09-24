import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  BarChart3, 
  MapPin, 
  Settings,
  ArrowRight,
  Camera,
  Satellite,
  Brain,
  Wheat,
  Building2,
  Database,
  Globe,
  TrendingUp,
  Shield
} from "lucide-react";

const Index = () => {
  const location = useLocation();
  
  console.log('Index - current pathname:', location.pathname);

  const handleAssessmentSubmit = (data: any) => {
    console.log("Assessment submitted:", data);
    // In real app, submit to API
  };

  // Default: Show homepage for root path "/" and any other paths
  return <HomePage />;
};

// Home Page Component
function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Camera,
      title: "Drone Surveillance",
      description: "Advanced aerial monitoring with high-resolution imaging and real-time data collection for comprehensive field analysis."
    },
    {
      icon: Satellite,
      title: "Satellite Analytics",
      description: "Leverage satellite imagery and AI-powered analysis to monitor crop health, weather patterns, and field conditions."
    },
    {
      icon: Brain,
      title: "AI Risk Assessment",
      description: "Intelligent risk evaluation using machine learning algorithms to predict and prevent agricultural losses."
    },
    {
      icon: Shield,
      title: "Smart Insurance",
      description: "Data-driven insurance solutions that provide fair coverage based on real-time field monitoring and risk assessment."
    }
  ];

  const roleCards = [
    {
      title: "Farmer Portal",
      description: "Manage your farm, monitor crops, and access insurance services",
      icon: Wheat,
      color: "bg-green-500",
      href: "/farmer"
    },
    {
      title: "Insurer Dashboard",
      description: "Manage policies, process claims, and analyze risk data",
      icon: Building2,
      color: "bg-blue-500",
      href: "/insurer"
    },
    {
      title: "Government Analytics",
      description: "National agricultural insights and policy monitoring",
      icon: BarChart3,
      color: "bg-red-500",
      href: "/government"
    },
    {
      title: "Assessor Portal",
      description: "Conduct field assessments and risk evaluations",
      icon: MapPin,
      color: "bg-orange-500",
      href: "/assessor"
    },
    {
      title: "Admin Panel",
      description: "System administration and user management",
      icon: Settings,
      color: "bg-gray-500",
      href: "/admin"
    }
  ];

  const platformCapabilities = [
    {
      title: "Real-time Monitoring",
      description: "24/7 field surveillance with instant alerts"
    },
    {
      title: "Weather Integration",
      description: "Advanced weather forecasting and risk modeling"
    },
    {
      title: "Crop Health Analysis",
      description: "AI-powered disease and pest detection"
    },
    {
      title: "Yield Prediction",
      description: "Accurate harvest forecasting using satellite data"
    },
    {
      title: "Risk Assessment",
      description: "Comprehensive risk evaluation and mitigation"
    },
    {
      title: "Insurance Claims",
      description: "Automated claim processing with drone verification"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-cover bg-center bg-no-repeat py-24 px-4" style={{ backgroundImage: 'url(/bg.jpg)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/80 to-white/90"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
            Revolutionizing Agricultural
            <span className="block text-gray-600">Insurance with Technology</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
            STARHAWK combines drone surveillance, satellite analytics, and AI to provide 
            comprehensive agricultural insurance solutions for farmers, insurers, and governments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full font-medium"
              onClick={() => navigate("/farmer")}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full font-medium"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
              Advanced Technology Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Our platform integrates cutting-edge technology to deliver comprehensive 
              agricultural monitoring and insurance services.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 font-light leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Showcase Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
              Our Platform in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              See how our drone technology and AI systems work together to provide 
              comprehensive agricultural monitoring and insurance solutions.
            </p>
          </div>
          
          {/* Drone Images */}
          <div className="grid gap-8 md:grid-cols-3 mb-16">
            <div className="group">
              <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden mb-4">
                <img 
                  src="/drone.png" 
                  alt="Drone surveillance system" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Drone Surveillance</h3>
              <p className="text-gray-600 font-light">High-resolution aerial imaging for comprehensive field monitoring</p>
            </div>
            
            <div className="group">
              <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden mb-4">
                <img 
                  src="/drone1.jpg" 
                  alt="Land surveying with drones" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Land Surveying</h3>
              <p className="text-gray-600 font-light">Precise field mapping and boundary detection for accurate assessments</p>
            </div>
            
            <div className="group">
              <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden mb-4">
                <img 
                  src="/drone2.jpeg" 
                  alt="Crop monitoring and analysis" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Crop Analysis</h3>
              <p className="text-gray-600 font-light">AI-powered crop health monitoring and yield prediction</p>
            </div>
          </div>

          {/* Platform Capabilities */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {platformCapabilities.map((capability, index) => (
              <Card key={index} className="bg-gray-50 border-0 hover:bg-gray-100 transition-colors duration-300 rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{capability.title}</h3>
                  <p className="text-gray-600 font-light">{capability.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
              Choose Your Role
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Access specialized dashboards designed for your specific needs and responsibilities.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            {roleCards.map((role, index) => (
              <Card 
                key={index} 
                className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl cursor-pointer group"
                onClick={() => navigate(role.href)}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 ${role.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <role.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                        {role.title}
                      </h3>
                      <p className="text-gray-600 font-light leading-relaxed mb-4">
                        {role.description}
                      </p>
                      <div className="flex items-center text-gray-500 group-hover:text-gray-700 transition-colors">
                        <span className="text-sm font-medium">Access Dashboard</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Showcase */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
              Powered by Innovation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Our technology stack combines the latest in AI, satellite imagery, 
              and drone technology to deliver unmatched agricultural insights.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="bg-gray-50 border-0 hover:bg-gray-100 transition-colors duration-300 rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Database className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Big Data Analytics</h3>
                <p className="text-gray-600 font-light">
                  Process massive datasets from satellites, drones, and IoT sensors 
                  to generate actionable insights for agricultural decision-making.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 border-0 hover:bg-gray-100 transition-colors duration-300 rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Globe className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Global Coverage</h3>
                <p className="text-gray-600 font-light">
                  Monitor agricultural activities across vast regions with 
                  satellite coverage and local drone networks for comprehensive insights.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 border-0 hover:bg-gray-100 transition-colors duration-300 rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Predictive Analytics</h3>
                <p className="text-gray-600 font-light">
                  Advanced machine learning models predict weather patterns, 
                  crop yields, and potential risks to optimize insurance coverage.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-6 tracking-tight">
            Ready to Transform Agriculture?
          </h2>
          <p className="text-xl text-gray-600 mb-8 font-light">
            Join thousands of farmers, insurers, and agricultural professionals 
            who trust STARHAWK for their agricultural monitoring and insurance needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full font-medium"
              onClick={() => navigate("/farmer")}
            >
              Start Your Journey
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full font-medium"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Index;
