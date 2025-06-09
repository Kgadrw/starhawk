
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

interface AppSidebarProps {
  onPageChange?: (page: string) => void;
  activePage?: string;
}

export function AppSidebar({ onPageChange, activePage = "dashboard" }: AppSidebarProps) {
  return (
    <Sidebar className="w-64 border-r border-gray-200">
      <SidebarContent className="bg-white">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">JS</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">John Smith</h3>
              <p className="text-sm text-gray-500">Admin</p>
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
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" 
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <button 
                        onClick={() => onPageChange?.(item.key)}
                        className="flex items-center space-x-3"
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
