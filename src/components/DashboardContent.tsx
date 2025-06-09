
import { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { DashboardOverview } from "./pages/DashboardOverview";
import { ClaimsPage } from "./pages/ClaimsPage";
import { AssessmentPage } from "./pages/AssessmentPage";
import { UnderwritingPage } from "./pages/UnderwritingPage";
import { ReportsPage } from "./pages/ReportsPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ProfilePage } from "./pages/ProfilePage";

export function DashboardContent() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardOverview />;
      case "claims":
        return <ClaimsPage />;
      case "assessment":
        return <AssessmentPage />;
      case "underwriting":
        return <UnderwritingPage />;
      case "reports":
        return <ReportsPage />;
      case "notifications":
        return <NotificationsPage />;
      case "settings":
        return <SettingsPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex w-full">
      <AppSidebar onPageChange={setActivePage} activePage={activePage} />
      <div className="flex-1">
        {renderPage()}
      </div>
    </div>
  );
}
