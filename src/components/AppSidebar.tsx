import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Activity, 
  FileText, 
  Database, 
  Bell, 
  Settings, 
  Users,
  LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface AppSidebarProps {
  onPageChange?: (page: string) => void;
  activePage?: string;
}

export function AppSidebar({ onPageChange, activePage = "dashboard" }: AppSidebarProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };
  
  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
    { title: "Claims", icon: ClipboardList, key: "claims" },
    { title: "P&L Assessment", icon: Activity, key: "assessment" },
    { title: "Underwriting", icon: FileText, key: "underwriting" },
    { title: "Reports", icon: Database, key: "reports" },
    { title: "Notifications", icon: Bell, key: "notifications" },
    { title: "Settings", icon: Settings, key: "settings" },
    { title: "Profile", icon: Users, key: "profile" },
  ];

  return (
    <Sidebar className="w-64 border-r border-border bg-background" collapsible="none">
      <SidebarContent className="bg-background">
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {user?.email?.split('@')[0] || "User"}
              </h3>
              <p className="text-sm text-muted-foreground">Insurer</p>
            </div>
          </div>
        </div>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.key;
                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton 
                      asChild 
                      className={`w-full justify-start px-6 py-3 ${
                        isActive 
                          ? "bg-accent text-accent-foreground border-r-2 border-primary" 
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <button 
                        onClick={() => onPageChange?.(item.key)}
                        className="flex items-center space-x-3 w-full"
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {user && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex flex-col space-y-2 p-4 border-t border-border">
                <span className="text-sm text-muted-foreground truncate">
                  {user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="justify-start h-8"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}