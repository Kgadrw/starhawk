import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import { LoginPage } from "./pages/LoginPage";
import RoleSelection from "./pages/RoleSelection";
import FarmerRegistration from "./pages/FarmerRegistration";
import FarmerLogin from "./pages/FarmerLogin";
import AssessorLogin from "./pages/AssessorLogin";
import InsurerLogin from "./pages/InsurerLogin";
import FarmerDashboard from "./components/dashboards/FarmerDashboard";
import AssessorDashboard from "./components/dashboards/AssessorDashboard";
import InsurerDashboard from "./components/dashboards/InsurerDashboard";
import PolicyDetailsPage from "./components/insurer/PolicyDetailsPage";
import { PolicyRequestForm } from "./components/requests/PolicyRequestForm";
import { RiskAssessmentModule } from "./components/assessment/RiskAssessmentModule";
import { UnderwritingDashboard } from "./components/underwriting/UnderwritingDashboard";
import { GovernmentAnalyticsDashboard } from "./components/government/GovernmentAnalyticsDashboard";
import { NotificationManager } from "./components/notifications/NotificationManager";
import { PaymentIntegration } from "./components/payments/PaymentIntegration";
import { ClaimFilingSystem } from "./components/claims/ClaimFilingSystem";
import { PolicyCreationEngine } from "./components/policies/PolicyCreationEngine";
import { ContinuousMonitoringSystem } from "./components/monitoring/ContinuousMonitoringSystem";
import { EmailNotificationSystem } from "./components/notifications/EmailNotificationSystem";
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
              
              {/* Role Selection and Authentication Routes */}
              <Route path="/role-selection" element={<RoleSelection />} />
              <Route path="/farmer-register" element={<FarmerRegistration />} />
              <Route path="/farmer-login" element={<FarmerLogin />} />
              <Route path="/assessor-login" element={<AssessorLogin />} />
              <Route path="/insurer-login" element={<InsurerLogin />} />
              
              {/* Dashboard Routes */}
              <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
              <Route path="/assessor-dashboard" element={<AssessorDashboard />} />
              <Route path="/insurer-dashboard" element={<InsurerDashboard />} />
              
              {/* Policy Details Route */}
              <Route path="/policy-details/:policyId" element={<PolicyDetailsPage />} />
              
              {/* Enhanced Platform Routes */}
              {/* <Route path="/farmer-registration" element={<FarmerRegistration onComplete={() => {}} onCancel={() => {}} />} /> */}
              <Route path="/policy-request" element={<PolicyRequestForm farmerId="farmer_001" onSubmit={() => {}} onCancel={() => {}} />} />
              <Route path="/risk-assessment" element={<RiskAssessmentModule policyRequestId="req_001" farmerId="farmer_001" assessorId="assessor_001" onSubmit={() => {}} onCancel={() => {}} />} />
              <Route path="/underwriting" element={<UnderwritingDashboard underwriterId="underwriter_001" />} />
              <Route path="/government-analytics" element={<GovernmentAnalyticsDashboard />} />
              <Route path="/notifications" element={<NotificationManager userType="farmer" userId="farmer_001" />} />
              <Route path="/payments" element={<PaymentIntegration farmerId="farmer_001" amount={120000} currency="RWF" onPaymentSuccess={() => {}} onPaymentFailure={() => {}} />} />
              <Route path="/file-claim" element={<ClaimFilingSystem farmerId="farmer_001" onClaimSubmit={() => {}} onCancel={() => {}} />} />
              <Route path="/policy-creation" element={<PolicyCreationEngine assessmentId="assess_001" farmerId="farmer_001" cropType="Maize" farmSize={2.5} riskLevel="low" location="Nyagatare District" onPolicyCreated={() => {}} onCancel={() => {}} />} />
              <Route path="/monitoring" element={<ContinuousMonitoringSystem userRole="insurer" userId="insurer_001" />} />
              <Route path="/email-notifications" element={<EmailNotificationSystem userRole="government" userId="gov_001" />} />
              
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