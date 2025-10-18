import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardTheme } from "@/utils/dashboardTheme";
import { Button } from "@/components/ui/button";
// Form components removed - using simplified dashboard
import DashboardLayout from "../layout/DashboardLayout";
import AssessorNotifications from "../assessor/AssessorNotifications";
import AssessorProfileSettings from "../assessor/AssessorProfileSettings";
import RiskAssessmentSystem from "../assessor/RiskAssessmentSystem";
import ClaimAssessmentSystem from "../assessor/ClaimAssessmentSystem";
import CropMonitoringSystem from "../monitoring/CropMonitoringSystem";
import CurrentWeatherWidget from "../common/CurrentWeatherWidget";
import WeatherPage from "../assessor/WeatherPage";
// import StaticRwandaMap from "../common/StaticRwandaMap"; // Removed - not visible
import ErrorBoundary from "../common/ErrorBoundary";
// Chart imports removed - using simplified data display
import { 
  FileText, 
  Bell,
  User,
  BarChart3,
  Shield,
  Activity,
  Cloud
} from "lucide-react";

export default function AssessorDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [assessorId] = useState("ASS-001"); // This would come from auth context
  const [assessorName] = useState("Richard Nkurunziza"); // This would come from auth context
  
  // Dashboard data removed - keeping only essential functionality

// Helper functions removed - using simplified data display

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Top Row - Weather Widget and Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ErrorBoundary>
          <CurrentWeatherWidget 
            className={`${dashboardTheme.card} rounded-2xl shadow-lg shadow-blue-900/20`}
          />
        </ErrorBoundary>
        
        <div className={`${dashboardTheme.card} rounded-2xl shadow-lg shadow-blue-900/20 p-6`}>
          <h3 className="text-lg font-semibold text-white mb-2">Quick Actions</h3>
          <p className="text-white/70 text-sm">Dashboard widgets will be added here</p>
        </div>
        
        <div className={`${dashboardTheme.card} rounded-2xl shadow-lg shadow-blue-900/20 p-6`}>
          <h3 className="text-lg font-semibold text-white mb-2">Recent Activity</h3>
          <p className="text-white/70 text-sm">Recent assessments and activities</p>
        </div>
      </div>

      {/* Additional Dashboard Content */}
      <div className={`${dashboardTheme.card} rounded-2xl shadow-lg shadow-blue-900/20 p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">System Status</h3>
          <p className="text-white/70 text-sm">All systems operational</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">✓</div>
            <div className="text-sm text-white/70">Weather API</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">✓</div>
            <div className="text-sm text-white/70">Assessment System</div>
          </div>
        </div>
      </div>
    </div>
  );

// Complex assessment forms removed - using simplified dashboard

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return renderDashboard();
      case "weather": return <ErrorBoundary><WeatherPage /></ErrorBoundary>;
      case "risk-assessments": return <RiskAssessmentSystem />;
      case "claim-assessments": return <ClaimAssessmentSystem />;
      case "crop-monitoring": return <CropMonitoringSystem />;
      case "notifications": return <AssessorNotifications />;
      case "profile-settings": return <AssessorProfileSettings />;
      default: return renderDashboard();
    }
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "weather", label: "Weather", icon: Cloud },
    { id: "risk-assessments", label: "Risk Assessments", icon: Shield },
    { id: "claim-assessments", label: "Claim Assessments", icon: FileText },
    { id: "crop-monitoring", label: "Crop Monitoring", icon: Activity },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile-settings", label: "Profile Settings", icon: User }
  ];

  return (
    <DashboardLayout
      userType="assessor"
      userId={assessorId}
      userName="Richard Nkurunziza"
      navigationItems={navigationItems}
      activePage={activePage} 
      onPageChange={setActivePage}
      onLogout={() => {}}
    >
      {renderPage()}
    </DashboardLayout>
  );
}
