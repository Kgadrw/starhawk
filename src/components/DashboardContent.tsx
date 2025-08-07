/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

export function DashboardContent({ userRole }: { userRole: "admin" }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
        return <ClaimsPage userRole="admin" onNewClaim={handleNewClaim} claims={claims} onClaimAction={handleClaimAction} />;
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
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:relative z-50 h-full transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <AppSidebar 
          onPageChange={(page) => {
            setActivePage(page);
            setIsSidebarOpen(false);
          }} 
          activePage={activePage} 
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b bg-background">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <h1 className="text-lg font-semibold">STARHAWK</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
        
        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
