/* eslint-disable @typescript-eslint/no-explicit-any */
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/AppSidebar";
// import { DashboardContent } from "@/components/DashboardContent";

// const Index = () => {
//   return (
//     <SidebarProvider>
//       <div className="min-h-screen flex w-full">

//         <main className="flex-1 overflow-hidden">
//           <DashboardContent userRole="admin" />
//         </main>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default Index;

import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardContent } from "@/components/DashboardContent";
import { LoginForm } from "@/components/LoginForm";

const Index = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check for stored auth token and user data
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("user_data");

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data", e);
        localStorage.removeItem("user_data");
      }
    }
  }, []);

  const handleLogin = (accessToken: string, userData: any) => {
    setToken(accessToken);
    setUser(userData);
    localStorage.setItem("auth_token", accessToken);
    localStorage.setItem("user_data", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  };

  if (!token || !user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <main className="flex-1 overflow-hidden">
          <DashboardContent userRole={user.role ?? "admin"} />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
