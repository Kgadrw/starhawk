import { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import InsurerNotifications from "../insurer/InsurerNotifications";
import InsurerProfileSettings from "../insurer/InsurerProfileSettings";
import ClaimReviewPage from "../insurer/ClaimReviewPage";
import ClaimsTable from "../insurer/ClaimsTable";
import PolicyManagement from "../insurer/PolicyManagement";
import RiskReviewManagement from "../insurer/RiskReviewManagement";
import RiskAssessmentSystem from "../assessor/RiskAssessmentSystem";
import CropMonitoringSystem from "../monitoring/CropMonitoringSystem";
import SatelliteStatistics from "../insurer/SatelliteStatistics";
import WeatherForecast from "../insurer/WeatherForecast";
import { getUserId, getPhoneNumber, getEmail } from "@/services/authAPI";
import { getPolicies } from "@/services/policiesApi";
import { getClaims } from "@/services/claimsApi";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3,
  Bell,
  Settings,
  Shield,
  Activity,
  FileText,
  CheckCircle,
  AlertTriangle,
  Satellite,
  CloudRain,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Eye,
  ArrowRight,
  Calendar,
  MapPin,
  Percent
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

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
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
        <Icon className="h-4 w-4 text-blue-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {delta && (
          <p className={`text-xs mt-1 ${deltaPositive ? 'text-emerald-400' : 'text-red-400'}`}>{delta}</p>
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
        <Card className="md:col-span-2 bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Claims</CardTitle>
            <Button variant="secondary" size="sm" onClick={() => setActivePage('claim-reviews')}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {loadingSummary ? (
              <div className="text-sm text-gray-400">Loading...</div>
            ) : recentClaims.length === 0 ? (
              <div className="text-sm text-gray-400">No claims available.</div>
            ) : (
              <div className="space-y-3">
                {recentClaims.map((c: any) => (
                  <div key={c.id || c._id} className="flex items-center justify-between border-b border-gray-800 pb-2">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="capitalize">{(c.status || 'unknown').toLowerCase()}</Badge>
                      <div className="text-sm">
                        <div className="font-medium">{c.policyNumber || c.policyId || '—'}</div>
                        <div className="text-xs text-gray-400">{c.lossEventType || 'Claim'}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setActivePage('claim-reviews')}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle>Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-300">Total</div>
              <div className="font-semibold">{policiesSummary.total}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-300">Active</div>
              <div className="font-semibold text-emerald-400">{policiesSummary.active}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-300">Expired</div>
              <div className="font-semibold text-red-400">{policiesSummary.expired}</div>
            </div>
            <div className="pt-2">
              <Button className="w-full" onClick={() => setActivePage('policy-management')}>Manage Policies</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="satellite" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6 bg-gray-800/50">
          <TabsTrigger value="satellite" className="data-[state=active]:bg-blue-600">
            <Satellite className="h-4 w-4 mr-2" />
            Satellite Analytics
          </TabsTrigger>
          <TabsTrigger value="weather" className="data-[state=active]:bg-blue-600">
            <CloudRain className="h-4 w-4 mr-2" />
            Weather Forecast
          </TabsTrigger>
        </TabsList>
        <TabsContent value="satellite" className="mt-0">
          <SatelliteStatistics />
        </TabsContent>
        <TabsContent value="weather" className="mt-0">
          <WeatherForecast />
        </TabsContent>
      </Tabs>
    </div>
  );




  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return renderDashboard();
      case "risk-reviews": return <RiskReviewManagement />;
      case "claim-reviews": return <ClaimsTable />;
      case "claim-review-detail": return <ClaimReviewPage />;
      case "policy-management": return <PolicyManagement />;
      case "risk-assessments": return <RiskAssessmentSystem />;
      case "crop-monitoring": return <CropMonitoringSystem />;
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
    { id: "crop-monitoring", label: "Crop Monitoring", icon: Activity },
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
