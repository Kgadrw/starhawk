import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardContent } from "@/components/DashboardContent";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        
        <main className="flex-1 overflow-hidden">
          <DashboardContent />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
