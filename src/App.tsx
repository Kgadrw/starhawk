import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import { LoginPage } from "./pages/LoginPage";
import { FarmerDashboard } from "./components/dashboards/FarmerDashboard";
import { InsurerDashboard } from "./components/dashboards/InsurerDashboard";
import { AssessorDashboard } from "./components/dashboards/AssessorDashboard";
import { GovernmentDashboard } from "./components/dashboards/GovernmentDashboard";
import { AdminDashboard } from "./components/dashboards/AdminDashboard";
import Team from "./pages/Team";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Claim from "./pages/Claim";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/team" element={<Team />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/claim" element={<Claim />} />
              <Route path="/insurer" element={<LoginPage role="insurer" />} />
              <Route path="/assessor" element={<LoginPage role="assessor" />} />
              <Route path="/government" element={<LoginPage role="government" />} />
              <Route path="/admin" element={<LoginPage role="admin" />} />
              <Route path="/farmer" element={<LoginPage role="farmer" />} />
              <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
              <Route path="/insurer-dashboard" element={<InsurerDashboard />} />
              <Route path="/assessor-dashboard" element={<AssessorDashboard />} />
              <Route path="/government-dashboard" element={<GovernmentDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
