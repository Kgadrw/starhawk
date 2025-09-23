import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      ],
      color: "bg-blue-500",
      image: "/api/placeholder/400/300"
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
      ],
      color: "bg-green-500",
      image: "/api/placeholder/400/300"
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
      ],
      color: "bg-orange-500",
      image: "/api/placeholder/400/300"
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
      ],
      color: "bg-purple-500",
      image: "/api/placeholder/400/300"
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
      ],
      color: "bg-indigo-500",
      image: "/api/placeholder/400/300"
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
      ],
      color: "bg-red-500",
      image: "/api/placeholder/400/300"
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Data Collection",
      description: "Gather satellite imagery, drone footage, weather data, and field information",
      icon: Globe
    },
    {
      step: "02",
      title: "AI Analysis",
      description: "Process data using machine learning algorithms for risk assessment",
      icon: Zap
    },
    {
      step: "03",
      title: "Risk Evaluation",
      description: "Generate comprehensive risk reports with actionable insights",
      icon: Shield
    },
    {
      step: "04",
      title: "Decision Support",
      description: "Provide recommendations for policy creation and claims processing",
      icon: CheckCircle
    }
  ];

  const benefits = [
    {
      title: "Reduced Processing Time",
      description: "90% faster claims processing compared to traditional methods",
      value: "90%",
      icon: Zap
    },
    {
      title: "Improved Accuracy",
      description: "AI-powered analysis reduces human error and improves assessment accuracy",
      value: "95%",
      icon: CheckCircle
    },
    {
      title: "Cost Savings",
      description: "Significant reduction in operational costs through automation",
      value: "60%",
      icon: BarChart3
    },
    {
      title: "Global Coverage",
      description: "Satellite technology enables monitoring of remote and inaccessible areas",
      value: "100%",
      icon: Globe
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-green-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Comprehensive AI-powered solutions for modern agricultural insurance,
              from risk assessment to claims processing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Get Started Today
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our suite of services covers every aspect of agricultural insurance,
            from initial risk assessment to final claims processing.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process ensures accurate risk assessment and efficient claims processing.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose STARHAWK?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Our AI-powered platform delivers measurable results and significant improvements
              in agricultural insurance operations.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="text-4xl font-bold mb-2">{benefit.value}</div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-blue-100">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Agricultural Insurance?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-300">
            Join leading insurers and government agencies who trust STARHAWK for
            their agricultural insurance needs. Get started today with a free consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              <Phone className="h-5 w-5 mr-2" />
              Schedule Consultation
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900">
              <Mail className="h-5 w-5 mr-2" />
              Contact Sales
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900">
              <MessageCircle className="h-5 w-5 mr-2" />
              Live Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
