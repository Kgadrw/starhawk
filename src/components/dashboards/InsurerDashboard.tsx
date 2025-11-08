import { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import InsurerNotifications from "../insurer/InsurerNotifications";
import InsurerProfileSettings from "../insurer/InsurerProfileSettings";
import ClaimReviewPage from "../insurer/ClaimReviewPage";
import ClaimsTable from "../insurer/ClaimsTable";
import PolicyManagement from "../insurer/PolicyManagement";
import CreatePolicyPage from "../insurer/CreatePolicyPage";
import RiskReviewManagement from "../insurer/RiskReviewManagement";
import RiskAssessmentSystem from "../assessor/RiskAssessmentSystem";
import { getUserId, getPhoneNumber, getEmail, isAuthenticated, getToken } from "@/services/authAPI";
import { getPolicies } from "@/services/policiesApi";
import { getClaims } from "@/services/claimsApi";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3,
  Bell,
  Settings,
  Shield,
  FileText,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  ArrowRight
} from "lucide-react";

export default function InsurerDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const { toast } = useToast();
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [claimsSummary, setClaimsSummary] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [policiesSummary, setPoliciesSummary] = useState({ total: 0, active: 0, expired: 0 });
  const [recentClaims, setRecentClaims] = useState<any[]>([]);
  const [recentPolicies, setRecentPolicies] = useState<any[]>([]);
  
  // Get logged-in insurer data from localStorage
  const insurerId = getUserId() || "";
  const insurerPhone = getPhoneNumber() || "";
  const insurerEmail = getEmail() || "";
  // Use email or phone number as display name, or fallback to "Insurer"
  const insurerName = insurerEmail || insurerPhone || "Insurer";


  useEffect(() => {
    if (activePage !== 'dashboard') return;
    
    // Check authentication before making API calls
    if (!isAuthenticated() || !getToken()) {
      console.warn('⚠️ Not authenticated, redirecting to login...');
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      return;
    }
    
    const load = async () => {
      setLoadingSummary(true);
      try {
        const [claimsResp, policiesResp] = await Promise.allSettled([
          getClaims(),
          getPolicies()
        ]);

        if (claimsResp.status === 'fulfilled') {
          const claimsData = (claimsResp.value as any).data || claimsResp.value || [];
          const claimsArray = Array.isArray(claimsData) ? claimsData : (claimsData.items || claimsData.results || []);
          const safeClaims = Array.isArray(claimsArray) ? claimsArray : [];
          const total = safeClaims.length;
          const pending = safeClaims.filter((c: any) => (c.status || '').toLowerCase() === 'pending').length;
          const approved = safeClaims.filter((c: any) => (c.status || '').toLowerCase() === 'approved').length;
          const rejected = safeClaims.filter((c: any) => (c.status || '').toLowerCase() === 'rejected').length;
          setClaimsSummary({ total, pending, approved, rejected });
          setRecentClaims(safeClaims.slice(0, 5));
        } else {
          toast({ title: 'Failed to load claims', description: String(claimsResp.reason), variant: 'destructive' });
        }

        if (policiesResp.status === 'fulfilled') {
          const policiesData = (policiesResp.value as any).data || policiesResp.value || [];
          const policiesArray = Array.isArray(policiesData) ? policiesData : (policiesData.items || policiesData.results || []);
          const safePolicies = Array.isArray(policiesArray) ? policiesArray : [];
          const total = safePolicies.length;
          const active = safePolicies.filter((p: any) => (p.status || '').toLowerCase() === 'active').length;
          const expired = safePolicies.filter((p: any) => (p.status || '').toLowerCase() === 'expired').length;
          setPoliciesSummary({ total, active, expired });
          setRecentPolicies(safePolicies.slice(0, 5));
        } else {
          toast({ title: 'Failed to load policies', description: String(policiesResp.reason), variant: 'destructive' });
        }
      } finally {
        setLoadingSummary(false);
      }
    };
    load();
  }, [activePage]);

  const StatCard = ({ icon: Icon, title, value, delta, deltaPositive }: { icon: any, title: string, value: string | number, delta?: string, deltaPositive?: boolean }) => (
    <Card className="bg-white border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {delta && (
          <p className={`text-xs mt-1 ${deltaPositive ? 'text-green-600' : 'text-red-600'}`}>{delta}</p>
        )}
      </CardContent>
    </Card>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FileText} title="Total Claims" value={claimsSummary.total} />
        <StatCard icon={AlertTriangle} title="Pending" value={claimsSummary.pending} />
        <StatCard icon={CheckCircle} title="Approved" value={claimsSummary.approved} />
        <StatCard icon={TrendingDown} title="Rejected" value={claimsSummary.rejected} />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="md:col-span-2 bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-gray-900">Recent Claims</CardTitle>
            <Button variant="secondary" size="sm" onClick={() => setActivePage('claim-reviews')} className="text-gray-700">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {loadingSummary ? (
              <div className="text-sm text-gray-600">Loading...</div>
            ) : recentClaims.length === 0 ? (
              <div className="text-sm text-gray-600">No claims available.</div>
            ) : (
              <div className="space-y-3">
                {recentClaims.map((c: any) => (
                  <div key={c.id || c._id} className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="capitalize text-gray-700 border-gray-300">{(c.status || 'unknown').toLowerCase()}</Badge>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{c.policyNumber || c.policyId || '—'}</div>
                        <div className="text-xs text-gray-600">{c.lossEventType || 'Claim'}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setActivePage('claim-reviews')} className="text-gray-700 hover:text-gray-900">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Total</div>
              <div className="font-semibold text-gray-900">{policiesSummary.total}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Active</div>
              <div className="font-semibold text-green-600">{policiesSummary.active}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Expired</div>
              <div className="font-semibold text-red-600">{policiesSummary.expired}</div>
            </div>
            <div className="pt-2">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => setActivePage('policy-management')}>Manage Policies</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );




  const [policyKey, setPolicyKey] = useState(0);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return renderDashboard();
      case "risk-reviews": return <RiskReviewManagement />;
      case "claim-reviews": return <ClaimsTable />;
      case "claim-review-detail": return <ClaimReviewPage />;
      case "policy-management": return <PolicyManagement key={policyKey} onNavigateToCreate={() => setActivePage('create-policy')} />;
      case "create-policy": return <CreatePolicyPage onBack={() => { setActivePage('policy-management'); setPolicyKey(prev => prev + 1); }} onSuccess={() => { setActivePage('policy-management'); setPolicyKey(prev => prev + 1); }} />;
      case "risk-assessments": return <RiskAssessmentSystem />;
      case "notifications": return <InsurerNotifications />;
      case "profile-settings": return <InsurerProfileSettings />;
      default: return renderDashboard();
    }
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "risk-reviews", label: "Risk Reviews", icon: Shield },
    { id: "claim-reviews", label: "Claim Reviews", icon: FileText },
    { id: "policy-management", label: "Policy Management", icon: CheckCircle },
    { id: "risk-assessments", label: "Risk Assessments", icon: AlertTriangle },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile-settings", label: "Profile Settings", icon: Settings }
  ];

  return (
    <DashboardLayout
      userType="insurer"
      userId={insurerId}
      userName={insurerName}
      navigationItems={navigationItems}
      activePage={activePage}
      onPageChange={setActivePage}
      onLogout={() => {
        // Clear localStorage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.removeItem('phoneNumber');
        localStorage.removeItem('email');
        window.location.href = '/insurer-login';
      }}
    >
      {renderPage()}
    </DashboardLayout>
  );
}
