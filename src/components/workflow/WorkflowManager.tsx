import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  FileText, 
  MapPin, 
  BarChart3, 
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  Camera,
  Satellite,
  TrendingUp,
  Shield,
  Globe,
  Activity
} from "lucide-react";

interface WorkflowManagerProps {
  role: "insurer" | "government" | "assessor" | "admin";
}

export function WorkflowManager({ role }: WorkflowManagerProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const workflowSteps = [
    {
      id: "registration",
      title: "User Registration & Onboarding",
      description: "Farmer and Insurer registration process",
      icon: Users,
      color: "bg-blue-500",
      steps: [
        "Farmer Registration - Personal & Farm Details",
        "Insurer Onboarding - Company & System Integration",
        "Account Setup - Digital Profile Creation"
      ]
    },
    {
      id: "policy",
      title: "Insurance Policy Request Process",
      description: "Policy request initiation and routing",
      icon: FileText,
      color: "bg-green-500",
      steps: [
        "Request Initiation - Web Portal & USSD Access",
        "Request Routing - Automated Assignment",
        "Status Tracking - Real-time Updates"
      ]
    },
    {
      id: "assessment",
      title: "Risk/Loss Assessment Module",
      description: "Comprehensive risk and loss evaluation",
      icon: MapPin,
      color: "bg-orange-500",
      steps: [
        "Data Collection - Seasonal & Crop Information",
        "Risk Assessment - Documentation & Analysis",
        "Loss Assessment - Disaster & Damage Evaluation"
      ]
    },
    {
      id: "underwriting",
      title: "Underwriting Dashboard",
      description: "Risk assessment portal and decision support",
      icon: BarChart3,
      color: "bg-purple-500",
      steps: [
        "Risk Assessment Portal - Comprehensive Data Display",
        "Decision Support Tools - Risk Scoring & Analysis",
        "Monitoring System - Continuous Crop Surveillance"
      ]
    },
    {
      id: "analytics",
      title: "Government Analytics Dashboard",
      description: "Platform statistics and intelligence",
      icon: Globe,
      color: "bg-red-500",
      steps: [
        "Platform Statistics - User Metrics & Distribution",
        "Risk Intelligence - Threat Analysis & Identification",
        "Claims Analytics - Loss Management & Processing"
      ]
    }
  ];

  const monitoringStages = [
    {
      stage: "Planting",
      description: "Seed placement, soil conditions, weed density mapping",
      icon: MapPin,
      color: "bg-green-100 text-green-800",
      indicators: ["Seed Placement", "Soil Conditions", "Weed Density"]
    },
    {
      stage: "Germination",
      description: "Emergence rates, early growth patterns, crop health indicators",
      icon: TrendingUp,
      color: "bg-blue-100 text-blue-800",
      indicators: ["Emergence Rates", "Growth Patterns", "Health Indicators"]
    },
    {
      stage: "Vegetation",
      description: "Canopy development, nutrient uptake, disease and pest presence",
      icon: Activity,
      color: "bg-yellow-100 text-yellow-800",
      indicators: ["Canopy Development", "Nutrient Uptake", "Disease Detection"]
    },
    {
      stage: "Flowering",
      description: "Reproductive health, yield potential, growth rate comparisons",
      icon: CheckCircle,
      color: "bg-purple-100 text-purple-800",
      indicators: ["Reproductive Health", "Yield Potential", "Growth Comparisons"]
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">AI Agricultural Insurance Platform Workflow</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Comprehensive workflow system integrating user registration, policy management, 
          risk assessment, and analytics for modern agricultural insurance.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workflowSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Card key={step.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${step.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {step.steps.map((subStep, subIndex) => (
                    <div key={subIndex} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>{subStep}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderMonitoring = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Crop Monitoring System</h2>
        <p className="text-lg text-muted-foreground">
          Four-stage continuous crop surveillance with comprehensive data collection
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {monitoringStages.map((stage, index) => {
          const Icon = stage.icon;
          return (
            <Card key={stage.stage} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stage.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{stage.stage} Stage</CardTitle>
                    <p className="text-sm text-muted-foreground">{stage.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-semibold">Key Indicators:</h4>
                  <div className="grid gap-2">
                    {stage.indicators.map((indicator, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{indicator}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4">
                    View {stage.stage} Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderAssessmentForms = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Assessment Forms</h2>
        <p className="text-lg text-muted-foreground">
          Comprehensive data collection for risk and loss assessment
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Risk Assessment Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Seasonal & Crop Information</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>• Season type (A, B, C)</div>
                  <div>• Planting dates and harvest timeline</div>
                  <div>• Crop variety and seed specifications</div>
                  <div>• Tilling methods employed</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Agricultural Practices</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>• Fertilizer types and application schedules</div>
                  <div>• Irrigation systems and water availability</div>
                  <div>• Pest control measures implemented</div>
                </div>
              </div>
              <Button className="w-full">
                Start Risk Assessment
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Loss Assessment Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Disaster Documentation</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>• Disaster categorization (drought, flood, pest, disease)</div>
                  <div>• Damage extent mapping</div>
                  <div>• Financial loss calculations</div>
                  <div>• Photographic evidence compilation</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">File Upload System</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>• Multi-page satellite imagery</div>
                  <div>• Drone footage analysis reports</div>
                  <div>• Assessment comments and recommendations</div>
                </div>
              </div>
              <Button className="w-full">
                Start Loss Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Platform Analytics</h2>
        <p className="text-lg text-muted-foreground">
          Comprehensive statistics and intelligence for government oversight
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Farmers</span>
                <span className="font-bold">15,247</span>
              </div>
              <div className="flex justify-between">
                <span>Active Users</span>
                <span className="font-bold">12,890</span>
              </div>
              <div className="flex justify-between">
                <span>Policy Requests</span>
                <span className="font-bold">8,923</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Risk Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Weed Infestations</span>
                <Badge variant="destructive">High</Badge>
              </div>
              <div className="flex justify-between">
                <span>Disease Outbreaks</span>
                <Badge variant="secondary">Medium</Badge>
              </div>
              <div className="flex justify-between">
                <span>Weather Risks</span>
                <Badge variant="outline">Low</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Claims Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Claims</span>
                <span className="font-bold">1,456</span>
              </div>
              <div className="flex justify-between">
                <span>Approved</span>
                <span className="font-bold text-green-600">1,234</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Time</span>
                <span className="font-bold">3.2 days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          {renderOverview()}
        </TabsContent>
        
        <TabsContent value="monitoring" className="mt-6">
          {renderMonitoring()}
        </TabsContent>
        
        <TabsContent value="assessments" className="mt-6">
          {renderAssessmentForms()}
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          {renderAnalytics()}
        </TabsContent>
        
        <TabsContent value="workflow" className="mt-6">
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Complete Workflow Process</h2>
              <p className="text-lg text-muted-foreground">
                End-to-end workflow from registration to claims processing
              </p>
            </div>
            
            <div className="space-y-4">
              {workflowSteps.map((step, index) => (
                <Card key={step.id} className="relative">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${step.color}`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground mb-4">{step.description}</p>
                        <div className="space-y-2">
                          {step.steps.map((subStep, subIndex) => (
                            <div key={subIndex} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>{subStep}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
