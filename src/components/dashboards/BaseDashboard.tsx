import { ReactNode } from "react";
import { RoleSidebar } from "@/components/RoleSidebar";

interface BaseDashboardProps {
  role: string;
  children: ReactNode;
  activePage: string;
  onPageChange: (page: string) => void;
}

export const BaseDashboard = ({ 
  role, 
  children, 
  activePage, 
  onPageChange 
}: BaseDashboardProps) => {
  return (
    <div className="flex h-screen bg-gray-950">
      <RoleSidebar 
        role={role} 
        activePage={activePage} 
        onPageChange={onPageChange} 
      />
      <div className="flex-1 overflow-auto bg-gray-950">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
