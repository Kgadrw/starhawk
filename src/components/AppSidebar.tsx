import { useState } from "react";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Activity, 
  FileText, 
  Database, 
  Bell, 
  Settings, 
  Users 
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  onPageChange?: (page: string) => void;
  activePage?: string;
}

export function AppSidebar({ onPageChange, activePage = "dashboard" }: AppSidebarProps) {
  const { user, logout } = useAuth();
  
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
              <span className="text-primary-foreground font-bold text-sm">{user?.username?.slice(0,2).toUpperCase() || "JS"}</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{user?.username || "John Smith"}</h3>
              <p className="text-sm text-muted-foreground">Admin</p>
            </div>
          </div>
          <button
            className="mt-4 text-xs text-red-600 underline hover:text-red-800"
            onClick={logout}
          >
            Logout
          </button>
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
    </Sidebar>
  );
}
