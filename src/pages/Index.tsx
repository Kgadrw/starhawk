import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardContent } from "@/components/DashboardContent";
import { useAuth } from "@/components/AuthContext";

const Index = () => {
  const { user } = useAuth();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        
        <main className="flex-1 overflow-hidden">
          <DashboardContent userRole={user?.role || "admin"} />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
