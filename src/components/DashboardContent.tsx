import { useState, useEffect } from "react";
import { AppSidebar } from "./AppSidebar";
import { DashboardOverview } from "./pages/DashboardOverview";
import { ClaimsPage } from "./pages/ClaimsPage";
import { AssessmentPage } from "./pages/AssessmentPage";
import { UnderwritingPage } from "./pages/UnderwritingPage";
import { ReportsPage } from "./pages/ReportsPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ProfilePage } from "./pages/ProfilePage";

export function DashboardContent({ userRole }: { userRole: "admin" | "farmer" }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [claims, setClaims] = useState<any[]>(() => {
    const stored = localStorage.getItem("claims");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("claims", JSON.stringify(claims));
  }, [claims]);

  const handleNewClaim = (claim: any) => {
    setClaims(prev => [claim, ...prev]);
  };

  const handleClaimAction = (id: string, action: "approve" | "reject" | "flag") => {
    setClaims(prev => prev.map(c => c.id === id ? { ...c, status: action === "approve" ? "Approved" : action === "reject" ? "Rejected" : "Flagged" } : c));
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardOverview />;
      case "claims":
        return <ClaimsPage userRole={userRole} onNewClaim={handleNewClaim} claims={claims} onClaimAction={handleClaimAction} />;
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
    <div className="flex w-full h-screen">
      <AppSidebar onPageChange={setActivePage} activePage={activePage} />
      <div className="flex-1 overflow-hidden">
        {renderPage()}
      </div>
    </div>
  );
}
