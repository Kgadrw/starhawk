import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import InsurerNotifications from "../insurer/InsurerNotifications";
import InsurerProfileSettings from "../insurer/InsurerProfileSettings";
import ClaimReviewPage from "../insurer/ClaimReviewPage";
import ClaimsTable from "../insurer/ClaimsTable";
import PolicyManagement from "../insurer/PolicyManagement";
import RiskReviewManagement from "../insurer/RiskReviewManagement";
import RiskAssessmentSystem from "../assessor/RiskAssessmentSystem";
import CropMonitoringSystem from "../monitoring/CropMonitoringSystem";
import SatelliteStatistics from "../insurer/SatelliteStatistics";
import WeatherForecast from "../insurer/WeatherForecast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3,
  Bell,
  Settings,
  Shield,
  Activity,
  FileText,
  CheckCircle,
  AlertTriangle,
  Satellite,
  CloudRain
} from "lucide-react";

export default function InsurerDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [insurerId] = useState("INS-001"); // This would come from auth context
  const [insurerName] = useState("Rwanda Insurance Company"); // This would come from auth context


  const renderDashboard = () => (
    <Tabs defaultValue="satellite" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2 mb-6 bg-gray-800/50">
        <TabsTrigger value="satellite" className="data-[state=active]:bg-blue-600">
          <Satellite className="h-4 w-4 mr-2" />
          Satellite Analytics
        </TabsTrigger>
        <TabsTrigger value="weather" className="data-[state=active]:bg-blue-600">
          <CloudRain className="h-4 w-4 mr-2" />
          Weather Forecast
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="satellite" className="mt-0">
        <SatelliteStatistics />
      </TabsContent>
      
      <TabsContent value="weather" className="mt-0">
        <WeatherForecast />
      </TabsContent>
    </Tabs>
  );




  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return renderDashboard();
      case "risk-reviews": return <RiskReviewManagement />;
      case "claim-reviews": return <ClaimsTable />;
      case "claim-review-detail": return <ClaimReviewPage />;
      case "policy-management": return <PolicyManagement />;
      case "risk-assessments": return <RiskAssessmentSystem />;
      case "crop-monitoring": return <CropMonitoringSystem />;
      case "notifications": return <InsurerNotifications />;
      case "profile-settings": return <InsurerProfileSettings />;
      default: return renderDashboard();
    }
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "risk-reviews", label: "Risk Reviews", icon: Shield },
    { id: "claim-reviews", label: "Claim Reviews", icon: FileText },
    { id: "policy-management", label: "Policy Management", icon: CheckCircle },
    { id: "risk-assessments", label: "Risk Assessments", icon: AlertTriangle },
    { id: "crop-monitoring", label: "Crop Monitoring", icon: Activity },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile-settings", label: "Profile Settings", icon: Settings }
  ];

  return (
    <DashboardLayout
      userType="insurer"
      userId={insurerId}
      userName="Insurance Company"
      navigationItems={navigationItems}
      activePage={activePage}
      onPageChange={setActivePage}
      onLogout={() => {}}
    >
      {renderPage()}
    </DashboardLayout>
  );
}
