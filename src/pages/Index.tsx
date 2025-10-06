import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight,
  Camera,
  Satellite,
  Brain,
  Wheat,
  Building2,
  BarChart3,
  MapPin,
  Settings,
  Shield,
  Database,
  Globe,
  TrendingUp,
  Sparkles,
  CheckCircle,
  Star,
  Users,
  Zap,
  Target
} from "lucide-react";

const Index = () => {
  return <HomePage />;
};

// Home Page Component
function HomePage() {

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

  const platformCapabilities = [
    {
      title: "Real-time Monitoring",
      description: "Continuous field surveillance with instant alerts and notifications"
    },
    {
      title: "Automated Claims",
      description: "AI-powered claim processing with drone verification and satellite validation"
    },
    {
      title: "Risk Assessment",
      description: "Comprehensive risk evaluation using historical data and predictive analytics"
    },
    {
      title: "Policy Management",
      description: "Dynamic policy adjustment based on real-time field conditions and risk factors"
    },
    {
      title: "Data Analytics",
      description: "Advanced analytics dashboard for insights and decision-making"
    },
    {
      title: "Insurance Claims",
      description: "Automated claim processing with drone verification"
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
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-xl opacity-20 animate-pulse delay-3000"></div>

      {/* Header */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">STARHAWK</h1>
                <p className="text-green-200 text-sm">Agricultural Insurance Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/role-selection" 
                className="text-white/80 hover:text-white transition-colors flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm"
              >
                <Users className="h-4 w-4" />
                <span>Get Started</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-white/90 text-sm font-medium">Revolutionary Agricultural Technology</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent leading-tight">
            Revolutionizing Agricultural
            <span className="block bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Insurance with AI</span>
            </h1>
          <p className="text-xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            STARHAWK combines drone surveillance, satellite analytics, and AI to provide 
            comprehensive agricultural insurance solutions for farmers, insurers, and governments.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/role-selection">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-10 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
              <Button 
                size="lg" 
                variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 px-10 py-4 rounded-2xl font-semibold text-lg backdrop-blur-sm"
              >
                Learn More
              </Button>
            </div>
              </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-white/90 text-sm font-medium">Advanced Technology</span>
            </div>
            <h2 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
              Technology Solutions
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Our platform integrates cutting-edge technology to deliver comprehensive 
              agricultural monitoring and insurance services.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-500 rounded-3xl group">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-500 shadow-lg">
                    <feature.icon className="h-10 w-10 text-white" />
      </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-green-200 transition-colors">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
                      ))}
                    </div>
          </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-white mb-2">10,000+</h3>
                <p className="text-white/70">Active Farmers</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-white mb-2">99.9%</h3>
                <p className="text-white/70">Uptime Guarantee</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-white mb-2">24/7</h3>
                <p className="text-white/70">Support Available</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-white mb-2">95%</h3>
                <p className="text-white/70">Claim Accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Showcase Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Camera className="h-4 w-4 text-yellow-400" />
              <span className="text-white/90 text-sm font-medium">Platform in Action</span>
            </div>
            <h2 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
              Our Technology
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              See how our drone technology and AI systems work together to provide 
              comprehensive agricultural monitoring and insurance solutions.
            </p>
        </div>

          {/* Technology Showcase */}
          <div className="grid gap-8 md:grid-cols-3 mb-20">
            <div className="group">
              <div className="aspect-video bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden mb-6 border border-white/20">
                <img 
                  src="/drone.png" 
                  alt="Drone surveillance system" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
        </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-200 transition-colors">Drone Surveillance</h3>
              <p className="text-white/70 leading-relaxed">High-resolution aerial imaging for comprehensive field monitoring</p>
        </div>
            
            <div className="group">
              <div className="aspect-video bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden mb-6 border border-white/20">
                <img 
                  src="/drone1.jpg" 
                  alt="Land surveying with drones" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-200 transition-colors">Land Surveying</h3>
              <p className="text-white/70 leading-relaxed">Precise field mapping and boundary detection for accurate assessments</p>
          </div>
            
            <div className="group">
              <div className="aspect-video bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden mb-6 border border-white/20">
                <img 
                  src="/drone2.jpeg" 
                  alt="Crop monitoring and analysis" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-200 transition-colors">Crop Analysis</h3>
              <p className="text-white/70 leading-relaxed">AI-powered crop health monitoring and yield prediction</p>
        </div>
      </div>

          {/* Platform Capabilities */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {platformCapabilities.map((capability, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-2xl group">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-200 transition-colors">{capability.title}</h3>
                  <p className="text-white/70 leading-relaxed">{capability.description}</p>
          </CardContent>
        </Card>
            ))}
              </div>
            </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-white/90 text-sm font-medium">Ready to Get Started?</span>
      </div>
            <h2 className="text-4xl font-bold text-white mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
              Join the Future of Agriculture
            </h2>
            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              Experience the power of AI-driven agricultural insurance. Get started today and transform your farming operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/role-selection">
              <Button 
                size="lg" 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-10 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                  Get Started Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 px-10 py-4 rounded-2xl font-semibold text-lg backdrop-blur-sm"
            >
                Learn More
                    </Button>
            </div>
                      </div>
                  </div>
      </section>
          </div>
        );
}

export default Index;
