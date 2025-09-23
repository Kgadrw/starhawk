import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardContent } from "@/components/DashboardContent";
import { NavigationMenu } from "@/components/NavigationMenu";
import { GovernmentAnalytics } from "@/components/pages/GovernmentAnalytics";
import { RoleSidebar } from "@/components/RoleSidebar";
import { WorkflowManager } from "@/components/workflow/WorkflowManager";
import { ComprehensiveAssessmentForm } from "@/components/forms/ComprehensiveAssessmentForm";
import { StageTimeline, generateMockStages } from "@/components/monitoring/StageTimeline";
import { AssessmentForm } from "@/components/survey/AssessmentForm";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  FileText, 
  BarChart3, 
  MapPin, 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Activity,
  Shield,
  Database,
  Globe,
  TrendingUp,
  Building2,
  Settings,
  ArrowRight,
  Camera,
  Satellite,
  Brain
} from "lucide-react";

const Index = () => {
  const location = useLocation();
  
  console.log('Index - current pathname:', location.pathname);

  const handleAssessmentSubmit = (data: any) => {
    console.log("Assessment submitted:", data);
    // In real app, submit to API
  };


  // Handle role-specific routes
  if (location.pathname.startsWith("/insurer")) {
    return <InsurerDashboard />;
  }

  if (location.pathname.startsWith("/government")) {
    return <GovernmentDashboard />;
  }

  if (location.pathname.startsWith("/assessor")) {
    return <AssessorDashboard />;
  }

  if (location.pathname.startsWith("/admin")) {
    return <AdminDashboard />;
  }

  // Default: Show homepage for root path "/" and any other paths
  return <HomePage />;
};

// Home Page Component
function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Advanced data visualization and reporting for agricultural risk assessment"
    },
    {
      icon: MapPin,
      title: "Precision Mapping",
      description: "GPS-based farm mapping and satellite imagery analysis"
    },
    {
      icon: FileText,
      title: "Smart Claims",
      description: "AI-powered claim processing and automated damage assessment"
    },
    {
      icon: Users,
      title: "Multi-role Platform",
      description: "Comprehensive dashboard for insurers, assessors, government, and administrators"
    }
  ];

  const roleCards = [
    {
      role: "insurer",
      title: "Insurer Dashboard",
      description: "Manage insurance policies, process claims, and analyze risk portfolios",
      icon: Building2,
      color: "bg-blue-50 border-blue-200 text-blue-800",
      features: ["Policy Management", "Claims Processing", "Risk Analysis", "Portfolio Overview"]
    },
    {
      role: "government",
      title: "Government Analytics",
      description: "National overview, policy monitoring, and agricultural sector insights",
      icon: BarChart3,
      color: "bg-red-50 border-red-200 text-red-800",
      features: ["National Statistics", "Policy Monitoring", "Sector Analysis", "Trend Reports"]
    },
    {
      role: "assessor",
      title: "Assessor Tasks",
      description: "Conduct farm assessments, field surveys, and damage evaluations",
      icon: MapPin,
      color: "bg-orange-50 border-orange-200 text-orange-800",
      features: ["Field Assessments", "Damage Evaluation", "Report Generation", "Task Management"]
    },
    {
      role: "admin",
      title: "Admin Panel",
      description: "System administration, user management, and platform configuration",
      icon: Settings,
      color: "bg-gray-50 border-gray-200 text-gray-800",
      features: ["User Management", "System Settings", "Data Management", "Platform Control"]
    }
  ];

    return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section with Drone Background */}
      <div className="relative overflow-hidden bg-gray-900 text-white">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/bg.jpg')"
          }}
        ></div>
        
        {/* Overlay Gradient for Text Visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
        
        {/* Drone Images Overlay */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 opacity-20">
            <img 
              src="/drone.png" 
              alt="Drone" 
              className="w-full h-full object-cover rounded-lg transform rotate-12"
        />
      </div>
          <div className="absolute top-40 right-20 w-24 h-24 opacity-30">
            <img 
              src="/drone1.jpg" 
              alt="Drone" 
              className="w-full h-full object-cover rounded-lg transform -rotate-12"
            />
          </div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 opacity-25">
            <img 
              src="/drone2.jpeg" 
              alt="Drone" 
              className="w-full h-full object-cover rounded-lg transform rotate-45"
            />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              STARHAWK
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              AI-Powered Agricultural Insurance Platform
            </p>
            <p className="text-base text-gray-400 mb-12 max-w-2xl mx-auto">
              Advanced drone technology and satellite data analysis for intelligent risk assessment.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
                onClick={() => navigate("/insurer")}
              >
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-4"
                onClick={() => navigate("/services")}
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">15K+</div>
                <div className="text-sm text-gray-400">Farmers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">$2.4M</div>
                <div className="text-sm text-gray-400">Claims</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">99.9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-sm text-gray-400">Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and insights for modern agricultural insurance
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
    return (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
      </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Role Selection Section */}
      <div className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Role
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access specialized dashboards tailored to your specific needs and responsibilities
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {roleCards.map((role) => {
              const Icon = role.icon;
    return (
                <Card 
                  key={role.role}
                  className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 group"
                  onClick={() => navigate(`/${role.role}`)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${role.color}`}>
                      <Icon className="h-8 w-8" />
        </div>
                    <CardTitle className="text-xl">{role.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-6">
                      {role.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
      </div>
                      ))}
                    </div>
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                      Access Dashboard
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Technology Showcase */}
      <div className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powered by Advanced Technology
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform leverages cutting-edge drone technology, satellite imagery,
              and AI to provide unparalleled agricultural insurance solutions.
            </p>
        </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="relative overflow-hidden border-white/20 text-white">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/drone.png')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
              <CardContent className="relative p-8 h-80 flex flex-col justify-end">
                <h3 className="text-2xl font-bold mb-4">Drone Surveillance</h3>
                <p className="text-gray-200 mb-6 text-base">
                  High-resolution aerial imagery captured by advanced drones for precise
                  field monitoring and damage assessment.
                </p>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>• 4K resolution imaging</div>
                  <div>• Real-time data transmission</div>
                  <div>• Automated flight patterns</div>
                  <div>• Weather-resistant operation</div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-white/20 text-white">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/drone1.jpg')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
              <CardContent className="relative p-8 h-80 flex flex-col justify-end">
                <h3 className="text-2xl font-bold mb-4">Satellite Analysis</h3>
                <p className="text-gray-200 mb-6 text-base">
                  Advanced satellite imagery processing for large-scale agricultural
                  monitoring and risk assessment across vast areas.
                </p>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>• Multi-spectral analysis</div>
                  <div>• Global coverage</div>
                  <div>• Historical data comparison</div>
                  <div>• Weather pattern integration</div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-white/20 text-white">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/drone2.jpeg')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
              <CardContent className="relative p-8 h-80 flex flex-col justify-end">
                <h3 className="text-2xl font-bold mb-4">AI Intelligence</h3>
                <p className="text-gray-200 mb-6 text-base">
                  Machine learning algorithms that analyze data patterns to predict
                  risks and optimize insurance processes automatically.
                </p>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>• Predictive risk modeling</div>
                  <div>• Automated damage detection</div>
                  <div>• Pattern recognition</div>
                  <div>• Continuous learning</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Agricultural Insurance?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join the future of data-driven agricultural risk management.
            Choose your role above to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate("/insurer")}>
              Start as Insurer
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      <Footer />
      </div>
    );
};

// Government Dashboard Component
function GovernmentDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <GovernmentAnalytics />;
      case "monitoring":
    return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Policy Monitoring</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">15,247</p>
                        <p className="text-sm text-blue-600">Total Farmers</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">8,923</p>
                        <p className="text-sm text-green-600">Active Policies</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Policy Requests</span>
                        <span className="font-medium">1,456</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Approved</span>
                        <span className="font-medium text-green-600">1,234</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rejected</span>
                        <span className="font-medium text-red-600">222</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { region: "Kigali", farmers: 320, policies: 280, risk: "low" },
                      { region: "Eastern Province", farmers: 280, policies: 250, risk: "medium" },
                      { region: "Northern Province", farmers: 250, policies: 220, risk: "low" },
                      { region: "Southern Province", farmers: 220, policies: 180, risk: "high" },
                      { region: "Western Province", farmers: 180, policies: 160, risk: "medium" }
                    ].map((region, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{region.region}</p>
                          <p className="text-sm text-muted-foreground">{region.farmers} farmers, {region.policies} policies</p>
                        </div>
                        <Badge variant={region.risk === "high" ? "destructive" : region.risk === "medium" ? "secondary" : "outline"}>
                          {region.risk} risk
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
        </div>
      </div>
    );
      case "sector":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Sector Analysis</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Primary Threats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { threat: "Weed Infestations", level: "High", impact: "15% yield loss" },
                      { threat: "Disease Outbreaks", level: "Medium", impact: "8% yield loss" },
                      { threat: "Nutrient Deficiencies", level: "Medium", impact: "12% yield loss" },
                      { threat: "Weather Risks", level: "Low", impact: "5% yield loss" }
                    ].map((threat, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{threat.threat}</p>
                          <p className="text-sm text-muted-foreground">{threat.impact}</p>
                        </div>
                        <Badge variant={threat.level === "High" ? "destructive" : threat.level === "Medium" ? "secondary" : "outline"}>
                          {threat.level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Economic Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">$45.2M</p>
                      <p className="text-sm text-muted-foreground">Total Insured Area Value</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Premium Collection</span>
                        <span className="font-medium">$2.4M</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Claims Paid</span>
                        <span className="font-medium">$180K</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Net Revenue</span>
                        <span className="font-medium text-green-600">$2.22M</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Operational Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Assessment Time</span>
                        <span className="font-medium">2.3 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Claims Processing</span>
                        <span className="font-medium">3.2 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Technology Adoption</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>USSD Usage</span>
                        <span className="font-medium">22%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "trends":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Market Trends & Predictive Analytics</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Seasonal Activity Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-lg font-bold text-green-600">Peak</p>
                        <p className="text-sm text-green-600">Mar-Jun</p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-lg font-bold text-yellow-600">Medium</p>
                        <p className="text-sm text-yellow-600">Jul-Oct</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-lg font-bold text-blue-600">Low</p>
                        <p className="text-sm text-blue-600">Nov-Feb</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Peak Season Activity</span>
                        <span className="font-medium">85% of annual policies</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Claims Peak</span>
                        <span className="font-medium">Aug-Sep</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Risk Forecasting</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium">Drought Risk</p>
                          <p className="text-sm text-muted-foreground">Next 3 months</p>
                        </div>
                        <Badge variant="destructive">High</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div>
                          <p className="font-medium">Pest Risk</p>
                          <p className="text-sm text-muted-foreground">Next 6 months</p>
                        </div>
                        <Badge variant="secondary">Medium</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium">Flood Risk</p>
                          <p className="text-sm text-muted-foreground">Next 12 months</p>
                        </div>
                        <Badge variant="outline">Low</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "reports":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Government Reports</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Report Generation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start">National Agricultural Insurance Report</Button>
                    <Button className="w-full justify-start">Regional Performance Analysis</Button>
                    <Button className="w-full justify-start">Risk Assessment Summary</Button>
                    <Button className="w-full justify-start">Claims Processing Report</Button>
                    <Button className="w-full justify-start">Economic Impact Study</Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Data Export</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">Export to Excel</Button>
                    <Button className="w-full justify-start" variant="outline">Export to PDF</Button>
                    <Button className="w-full justify-start" variant="outline">Export to CSV</Button>
                    <Button className="w-full justify-start" variant="outline">API Data Access</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "settings":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">System Settings</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Platform Configuration</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>System Maintenance Mode</span>
                        <Button size="sm" variant="outline">Toggle</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Data Backup Frequency</span>
                        <Select defaultValue="daily">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "workflow":
        return <WorkflowManager role="government" />;
      default:
        return <GovernmentAnalytics />;
    }
  };

    return (
    <div className="flex w-full h-screen">
      <RoleSidebar 
        role="government" 
        onPageChange={setActivePage} 
        activePage={activePage} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {renderPage()}
        </div>
        </div>
      </div>
    );
  }

// Assessor Dashboard Component
function AssessorDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [assessments] = useState([
    {
      id: "1",
      farmerName: "Jean Baptiste",
      location: "Kigali, Rwanda",
      crop: "Maize",
      status: "pending",
      dueDate: "2024-03-20"
    },
    {
      id: "2", 
      farmerName: "Marie Claire",
      location: "Eastern Province",
      crop: "Rice",
      status: "in_progress",
      dueDate: "2024-03-22"
    }
  ]);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
  return (
          <div className="space-y-6 p-6">
      <div>
              <h1 className="text-3xl font-bold">Assessor Tasks</h1>
        <p className="text-muted-foreground">Your assigned farm assessments</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {assessments.map((assessment) => (
          <Card key={assessment.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{assessment.farmerName}</span>
                <Badge variant={assessment.status === "pending" ? "default" : "secondary"}>
                  {assessment.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {assessment.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Due: {assessment.dueDate}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  Crop: {assessment.crop}
                </div>
              </div>
              <div className="mt-4">
                <Button className="w-full">
                  {assessment.status === "pending" ? "Start Assessment" : "Continue Assessment"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Form</CardTitle>
        </CardHeader>
        <CardContent>
          <AssessmentForm onSubmit={console.log} />
        </CardContent>
      </Card>
    </div>
  );
      case "assessments":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Field Assessments</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Comprehensive risk evaluation including seasonal data, agricultural practices, and environmental factors.
                  </p>
                  <ComprehensiveAssessmentForm 
                    type="risk" 
                    onSubmit={(data) => console.log("Risk Assessment:", data)}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Loss Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Detailed loss evaluation for disaster claims including damage documentation and financial impact.
                  </p>
                  <ComprehensiveAssessmentForm 
                    type="loss" 
                    onSubmit={(data) => console.log("Loss Assessment:", data)}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "tasks":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">My Tasks</h2>
            <div className="space-y-4">
              {[
                { id: "T001", farmer: "Jean Baptiste", type: "Risk Assessment", priority: "high", due: "2024-03-20", status: "pending" },
                { id: "T002", farmer: "Marie Claire", type: "Loss Assessment", priority: "medium", due: "2024-03-22", status: "in_progress" },
                { id: "T003", farmer: "Paul Kagame", type: "Field Survey", priority: "low", due: "2024-03-25", status: "pending" }
              ].map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">Task #{task.id}</p>
                          <p className="text-sm text-muted-foreground">{task.farmer} - {task.type}</p>
                        </div>
                        <Badge variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "secondary" : "outline"}>
                          {task.priority}
                        </Badge>
                        <Badge variant={task.status === "pending" ? "outline" : "default"}>
                          {task.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Due: {task.due}</span>
                        <Button size="sm">Start</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case "reports":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Assessment Reports</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: "R001", farmer: "Jean Baptiste", type: "Risk Assessment", date: "2024-03-15", status: "completed" },
                      { id: "R002", farmer: "Marie Claire", type: "Loss Assessment", date: "2024-03-14", status: "completed" },
                      { id: "R003", farmer: "Paul Kagame", type: "Field Survey", date: "2024-03-13", status: "pending" }
                    ].map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Report #{report.id}</p>
                          <p className="text-sm text-muted-foreground">{report.farmer} - {report.type}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{report.date}</span>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Report Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start">Risk Assessment Template</Button>
                    <Button className="w-full justify-start">Loss Assessment Template</Button>
                    <Button className="w-full justify-start">Field Survey Template</Button>
                    <Button className="w-full justify-start">Custom Report Builder</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "history":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Completed Tasks</h2>
            <div className="space-y-4">
              {[
                { id: "H001", farmer: "Jean Baptiste", type: "Risk Assessment", completed: "2024-03-10", rating: "excellent" },
                { id: "H002", farmer: "Marie Claire", type: "Loss Assessment", completed: "2024-03-08", rating: "good" },
                { id: "H003", farmer: "Paul Kagame", type: "Field Survey", completed: "2024-03-05", rating: "excellent" }
              ].map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Task #{task.id}</p>
                        <p className="text-sm text-muted-foreground">{task.farmer} - {task.type}</p>
                        <p className="text-sm text-muted-foreground">Completed: {task.completed}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600">
                          {task.rating}
                        </Badge>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="Assessor Name" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="assessor@example.com" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" defaultValue="+250 123 456 789" />
                    </div>
                    <div>
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input id="specialization" defaultValue="Crop Assessment" />
                    </div>
                  </div>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "workflow":
        return <WorkflowManager role="assessor" />;
      default:
        return <div className="p-6"><h2 className="text-2xl font-bold">Dashboard</h2></div>;
    }
  };

  return (
    <div className="flex w-full h-screen">
      <div className="h-screen overflow-hidden">
        <RoleSidebar 
          role="assessor" 
          onPageChange={setActivePage} 
          activePage={activePage} 
        />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

// Insurer Dashboard Component
function InsurerDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [policies] = useState([
    {
      id: "1",
      farmerName: "Jean Baptiste",
      crop: "Maize",
      status: "active",
      premium: 5000,
      coverage: 50000,
      date: "2024-03-15"
    },
    {
      id: "2",
      farmerName: "Marie Claire",
      crop: "Rice",
      status: "pending",
      premium: 3000,
      coverage: 30000,
      date: "2024-03-10"
    }
  ]);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
  return (
    <div className="space-y-6">
      <div>
              <h1 className="text-3xl font-bold">Insurer Dashboard</h1>
              <p className="text-muted-foreground">Manage insurance policies and claims</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Policies</p>
                      <p className="text-2xl font-bold">1,247</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Claims</p>
                      <p className="text-2xl font-bold">23</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Premium</p>
                      <p className="text-2xl font-bold">$2.4M</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
                  <CardTitle>Recent Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
                    {policies.map((policy) => (
                      <div key={policy.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                          <p className="font-medium">{policy.farmerName} - {policy.crop}</p>
                          <p className="text-sm text-muted-foreground">{policy.date}</p>
                  </div>
                  <div className="text-right">
                          <p className="font-medium">${policy.premium.toLocaleString()}</p>
                          <Badge variant={policy.status === "active" ? "default" : "secondary"}>
                            {policy.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <StageTimeline stages={generateMockStages()} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
      case "policies":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Policy Management</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>New Policy Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { farmer: "Jean Baptiste", crop: "Maize", amount: 50000, status: "pending" },
                      { farmer: "Marie Claire", crop: "Rice", amount: 30000, status: "pending" },
                      { farmer: "Paul Kagame", crop: "Wheat", amount: 40000, status: "pending" }
                    ].map((policy, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{policy.farmer} - {policy.crop}</p>
                          <p className="text-sm text-muted-foreground">${policy.amount.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">Review</Button>
                          <Button size="sm" variant="outline">Approve</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Policy Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start">Crop Insurance Template</Button>
                    <Button className="w-full justify-start">Livestock Insurance Template</Button>
                    <Button className="w-full justify-start">Weather Insurance Template</Button>
                    <Button className="w-full justify-start">Create New Template</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "claims":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Claims Processing</h2>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: "C001", farmer: "Jean Baptiste", type: "Drought", amount: 25000, date: "2024-03-15", priority: "high" },
                      { id: "C002", farmer: "Marie Claire", type: "Pest Attack", amount: 15000, date: "2024-03-14", priority: "medium" },
                      { id: "C003", farmer: "Paul Kagame", type: "Flood", amount: 35000, date: "2024-03-13", priority: "high" }
                    ].map((claim) => (
                      <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium">Claim #{claim.id}</p>
                            <p className="text-sm text-muted-foreground">{claim.farmer} - {claim.type}</p>
                          </div>
                          <Badge variant={claim.priority === "high" ? "destructive" : "secondary"}>
                            {claim.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium">${claim.amount.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{claim.date}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm">Review</Button>
                            <Button size="sm" variant="outline">Process</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "risk":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Risk Analysis & Assessment</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment Portal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">12</p>
                        <p className="text-sm text-red-600">High Risk</p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">28</p>
                        <p className="text-sm text-yellow-600">Medium Risk</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">45</p>
                        <p className="text-sm text-green-600">Low Risk</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button className="w-full">View All Assessments</Button>
                      <Button className="w-full" variant="outline">Generate Risk Report</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      Start New Risk Assessment
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Risk Scoring Algorithm
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Historical Data Analysis
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Globe className="h-4 w-4 mr-2" />
                      Weather Pattern Integration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "portfolio":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Portfolio Overview</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">$2.4M</p>
                    <p className="text-sm text-muted-foreground">Total Premium</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">1,247</p>
                    <p className="text-sm text-muted-foreground">Active Policies</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-orange-600">$180K</p>
                    <p className="text-sm text-muted-foreground">Total Claims Paid</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "reports":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Analytics & Reports</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Report Generation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start">Monthly Risk Report</Button>
                    <Button className="w-full justify-start">Claims Analysis Report</Button>
                    <Button className="w-full justify-start">Portfolio Performance Report</Button>
                    <Button className="w-full justify-start">Weather Impact Analysis</Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Data Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">Risk Heat Map</Button>
                    <Button className="w-full justify-start" variant="outline">Claims Trend Chart</Button>
                    <Button className="w-full justify-start" variant="outline">Geographic Distribution</Button>
                    <Button className="w-full justify-start" variant="outline">Crop Performance Metrics</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "workflow":
        return <WorkflowManager role="insurer" />;
      default:
        return <div className="p-6"><h2 className="text-2xl font-bold">Dashboard</h2></div>;
    }
  };

  return (
    <div className="flex w-full h-screen">
      <RoleSidebar 
        role="insurer" 
        onPageChange={setActivePage} 
        activePage={activePage} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

// Admin Dashboard Component
function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Admin Control Center
                </h1>
                <p className="text-muted-foreground">Complete system administration and monitoring</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  System Online
                </Badge>
              </div>
            </div>

            {/* System Overview Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Users</p>
                      <p className="text-3xl font-bold text-blue-900">1,247</p>
                      <p className="text-xs text-blue-600">+12% from last month</p>
                    </div>
                    <Users className="h-12 w-12 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">System Health</p>
                      <p className="text-3xl font-bold text-green-900">99.9%</p>
                      <p className="text-xs text-green-600">Uptime this month</p>
                    </div>
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Active Sessions</p>
                      <p className="text-3xl font-bold text-orange-900">156</p>
                      <p className="text-xs text-orange-600">Currently online</p>
                    </div>
                    <Activity className="h-12 w-12 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Data Processed</p>
                      <p className="text-3xl font-bold text-purple-900">2.4TB</p>
                      <p className="text-xs text-purple-600">This month</p>
                    </div>
                    <Database className="h-12 w-12 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <Button variant="outline" className="justify-start h-auto p-4">
                      <Users className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Manage Users</div>
                        <div className="text-xs text-muted-foreground">Add, edit, or remove users</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4">
                      <Database className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">System Backup</div>
                        <div className="text-xs text-muted-foreground">Create system backup</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4">
                      <Shield className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Security Settings</div>
                        <div className="text-xs text-muted-foreground">Configure security policies</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    System Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">CPU Usage</span>
                      <span className="text-sm font-medium">23%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Memory Usage</span>
                      <span className="text-sm font-medium">67%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Storage</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "New user registered", user: "John Doe", time: "2 minutes ago", type: "success" },
                    { action: "System backup completed", user: "System", time: "1 hour ago", type: "info" },
                    { action: "Security alert resolved", user: "Admin", time: "3 hours ago", type: "warning" },
                    { action: "Database optimized", user: "System", time: "6 hours ago", type: "info" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">by {activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "users":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">User Management</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>User Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">1,247</p>
                        <p className="text-sm text-blue-600">Total Users</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">1,089</p>
                        <p className="text-sm text-green-600">Active Users</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Farmers</span>
                        <span className="font-medium">856</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Assessors</span>
                        <span className="font-medium">45</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Insurers</span>
                        <span className="font-medium">23</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Government</span>
                        <span className="font-medium">12</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>User Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start">Add New User</Button>
                    <Button className="w-full justify-start" variant="outline">Bulk Import Users</Button>
                    <Button className="w-full justify-start" variant="outline">Export User List</Button>
                    <Button className="w-full justify-start" variant="outline">User Permissions</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "system":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">System Settings</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Maintenance Mode</span>
                      <Button size="sm" variant="outline">Toggle</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>API Rate Limiting</span>
                      <Select defaultValue="medium">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Data Retention</span>
                      <Select defaultValue="7years">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1year">1 Year</SelectItem>
                          <SelectItem value="3years">3 Years</SelectItem>
                          <SelectItem value="7years">7 Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Performance Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Response Time</span>
                        <span className="font-medium">120ms</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Uptime</span>
                        <span className="font-medium">99.9%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '99%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Platform Analytics</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">2.4TB</p>
                    <p className="text-sm text-muted-foreground">Data Processed</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">156</p>
                    <p className="text-sm text-muted-foreground">Active Sessions</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-orange-600">45K</p>
                    <p className="text-sm text-muted-foreground">API Calls Today</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "security":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Security & Access</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Security Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>SSL Certificate</span>
                      <Badge variant="outline" className="text-green-600">Valid</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Firewall Status</span>
                      <Badge variant="outline" className="text-green-600">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last Security Scan</span>
                      <span className="text-sm text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Failed Login Attempts</span>
                      <span className="font-medium">3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Access Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start">Manage API Keys</Button>
                    <Button className="w-full justify-start" variant="outline">Role Permissions</Button>
                    <Button className="w-full justify-start" variant="outline">Audit Logs</Button>
                    <Button className="w-full justify-start" variant="outline">Security Policies</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "logs":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">System Logs</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { time: "14:32:15", level: "INFO", message: "User login successful", user: "admin@example.com" },
                    { time: "14:28:42", level: "WARN", message: "High memory usage detected", user: "system" },
                    { time: "14:25:18", level: "ERROR", message: "Database connection timeout", user: "system" },
                    { time: "14:20:33", level: "INFO", message: "Backup completed successfully", user: "system" }
                  ].map((log, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                      <span className="text-sm text-muted-foreground">{log.time}</span>
                      <Badge variant={log.level === "ERROR" ? "destructive" : log.level === "WARN" ? "secondary" : "outline"}>
                        {log.level}
                      </Badge>
                      <span className="flex-1">{log.message}</span>
                      <span className="text-sm text-muted-foreground">{log.user}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "backup":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Data Management</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Backup Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Last Backup</span>
                      <span className="text-sm text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Backup Size</span>
                      <span className="font-medium">2.1 GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Storage Used</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <Button className="w-full">Create Backup Now</Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Data Operations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start">Export All Data</Button>
                    <Button className="w-full justify-start" variant="outline">Import Data</Button>
                    <Button className="w-full justify-start" variant="outline">Data Cleanup</Button>
                    <Button className="w-full justify-start" variant="outline">Archive Old Data</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Platform Settings</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Platform Name</span>
                        <Input defaultValue="STARHAWK" className="w-48" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Default Language</span>
                        <Select defaultValue="en">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="rw">Kinyarwanda</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Time Zone</span>
                        <Select defaultValue="CAT">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CAT">CAT</SelectItem>
                            <SelectItem value="EAT">EAT</SelectItem>
                            <SelectItem value="UTC">UTC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "workflow":
        return <WorkflowManager role="admin" />;
      default:
        return <div className="p-6"><h2 className="text-2xl font-bold">Dashboard</h2></div>;
    }
  };

  return (
    <div className="flex w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <RoleSidebar 
        role="admin" 
        onPageChange={setActivePage} 
        activePage={activePage} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default Index;
