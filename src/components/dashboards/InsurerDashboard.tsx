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
import { getUserProfile } from "@/services/usersAPI";
import { getPolicies } from "@/services/policiesApi";
import { getClaims } from "@/services/claimsApi";
import { getInsuranceRequests } from "@/services/farmsApi";
import assessmentsApiService, { createAssessment } from "@/services/assessmentsApi";
import { createPolicyFromAssessment } from "@/services/policiesApi";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  ArrowRight,
  Clock
} from "lucide-react";

export default function InsurerDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const { toast } = useToast();
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [claimsSummary, setClaimsSummary] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [policiesSummary, setPoliciesSummary] = useState({ total: 0, active: 0, expired: 0 });
  const [recentClaims, setRecentClaims] = useState<any[]>([]);
  const [recentPolicies, setRecentPolicies] = useState<any[]>([]);
  
  // Insurance Requests state
  const [insuranceRequests, setInsuranceRequests] = useState<any[]>([]);
  const [insuranceRequestsLoading, setInsuranceRequestsLoading] = useState(false);
  const [createAssessmentDialog, setCreateAssessmentDialog] = useState<{
    open: boolean;
    insuranceRequest: any | null;
  }>({ open: false, insuranceRequest: null });
  const [assessorId, setAssessorId] = useState("");
  const [assessmentNotes, setAssessmentNotes] = useState("");
  const [isCreatingAssessment, setIsCreatingAssessment] = useState(false);
  
  // Submitted Assessments state
  const [submittedAssessments, setSubmittedAssessments] = useState<any[]>([]);
  const [submittedAssessmentsLoading, setSubmittedAssessmentsLoading] = useState(false);
  const [createPolicyDialog, setCreatePolicyDialog] = useState<{
    open: boolean;
    assessment: any | null;
  }>({ open: false, assessment: null });
  const [coverageLevel, setCoverageLevel] = useState<"BASIC" | "STANDARD" | "PREMIUM">("STANDARD");
  const [policyStartDate, setPolicyStartDate] = useState("");
  const [policyEndDate, setPolicyEndDate] = useState("");
  const [isCreatingPolicy, setIsCreatingPolicy] = useState(false);
  
  // Get logged-in insurer data from localStorage
  const insurerId = getUserId() || "";
  const insurerPhone = getPhoneNumber() || "";
  const insurerEmail = getEmail() || "";
  // Use email or phone number as display name, or fallback to "Insurer"
  const insurerName = insurerEmail || insurerPhone || "Insurer";

  // State for Profile
  const [insurerProfile, setInsurerProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);


  useEffect(() => {
    if (activePage === 'insurance-requests') {
      loadInsuranceRequests();
    } else if (activePage === 'submitted-assessments') {
      loadSubmittedAssessments();
    } else if (activePage === 'dashboard' && insurerId) {
      loadInsurerProfile();
    }
  }, [activePage, insurerId]);

  const loadInsurerProfile = async () => {
    if (profileLoading) return;
    setProfileLoading(true);
    try {
      const profile = await getUserProfile();
      setInsurerProfile(profile.data || profile);
    } catch (err: any) {
      console.error('Failed to load insurer profile:', err);
    } finally {
      setProfileLoading(false);
    }
  };

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

  const loadInsuranceRequests = async () => {
    setInsuranceRequestsLoading(true);
    try {
      const response: any = await getInsuranceRequests(1, 100, 'PENDING');
      const requestsData = response.data || response || [];
      const requestsArray = Array.isArray(requestsData) ? requestsData : (requestsData.items || requestsData.results || []);
      setInsuranceRequests(requestsArray);
    } catch (err: any) {
      console.error('Failed to load insurance requests:', err);
      toast({
        title: 'Error loading insurance requests',
        description: err.message || 'Failed to load insurance requests',
        variant: 'destructive'
      });
    } finally {
      setInsuranceRequestsLoading(false);
    }
  };

  const handleCreateAssessment = async () => {
    if (!createAssessmentDialog.insuranceRequest || !assessorId) {
      toast({
        title: 'Validation Error',
        description: 'Please select an assessor',
        variant: 'destructive'
      });
      return;
    }

    setIsCreatingAssessment(true);
    try {
      const insuranceRequest = createAssessmentDialog.insuranceRequest;
      const farmId = insuranceRequest.farmId?._id || insuranceRequest.farmId || insuranceRequest.farm?._id;
      const insuranceRequestId = insuranceRequest._id || insuranceRequest.id;

      if (!farmId || !insuranceRequestId) {
        throw new Error('Missing farm ID or insurance request ID');
      }

      await assessmentsApiService.createAssessment({
        farmId,
        insuranceRequestId,
        assessorId,
        notes: assessmentNotes || undefined
      });

      toast({
        title: 'Success',
        description: 'Assessment created successfully and assigned to assessor',
      });

      setCreateAssessmentDialog({ open: false, insuranceRequest: null });
      setAssessorId("");
      setAssessmentNotes("");
      await loadInsuranceRequests();
    } catch (err: any) {
      console.error('Failed to create assessment:', err);
      toast({
        title: 'Error creating assessment',
        description: err.message || 'Failed to create assessment',
        variant: 'destructive'
      });
    } finally {
      setIsCreatingAssessment(false);
    }
  };

  const loadSubmittedAssessments = async () => {
    setSubmittedAssessmentsLoading(true);
    try {
      const response: any = await assessmentsApiService.getAllAssessments();
      const assessmentsData = response.data || response || [];
      const assessmentsArray = Array.isArray(assessmentsData) ? assessmentsData : (assessmentsData.items || assessmentsData.results || []);
      
      // Filter only submitted assessments
      const submitted = assessmentsArray.filter((assessment: any) => 
        (assessment.status || '').toUpperCase() === 'SUBMITTED'
      );
      setSubmittedAssessments(submitted);
    } catch (err: any) {
      console.error('Failed to load submitted assessments:', err);
      toast({
        title: 'Error loading assessments',
        description: err.message || 'Failed to load submitted assessments',
        variant: 'destructive'
      });
    } finally {
      setSubmittedAssessmentsLoading(false);
    }
  };

  const handleCreatePolicy = async () => {
    if (!createPolicyDialog.assessment || !policyStartDate || !policyEndDate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setIsCreatingPolicy(true);
    try {
      const assessmentId = createPolicyDialog.assessment._id || createPolicyDialog.assessment.id;
      
      // Convert dates to ISO format (YYYY-MM-DDTHH:mm:ssZ)
      // Start date: beginning of day (00:00:00Z)
      // End date: end of day (23:59:59Z)
      const startDateISO = new Date(policyStartDate + 'T00:00:00Z').toISOString();
      const endDateISO = new Date(policyEndDate + 'T23:59:59Z').toISOString();
      
      await createPolicyFromAssessment(
        assessmentId,
        coverageLevel,
        startDateISO,
        endDateISO
      );

      toast({
        title: 'Success',
        description: 'Policy created successfully from assessment',
      });

      setCreatePolicyDialog({ open: false, assessment: null });
      setCoverageLevel("STANDARD");
      setPolicyStartDate("");
      setPolicyEndDate("");
      await loadSubmittedAssessments();
      setActivePage('policy-management');
    } catch (err: any) {
      console.error('Failed to create policy:', err);
      toast({
        title: 'Error creating policy',
        description: err.message || 'Failed to create policy',
        variant: 'destructive'
      });
    } finally {
      setIsCreatingPolicy(false);
    }
  };

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




  const renderInsuranceRequests = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Insurance Requests</h2>
          <p className="text-gray-600">Review and create assessments for pending insurance requests</p>
        </div>
        <Button
          variant="outline"
          onClick={loadInsuranceRequests}
          disabled={insuranceRequestsLoading}
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          <ArrowRight className={`h-4 w-4 mr-2 ${insuranceRequestsLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {insuranceRequestsLoading ? (
        <Card className="bg-white border-gray-200">
          <CardContent className="p-12">
            <div className="text-center text-gray-600">Loading insurance requests...</div>
          </CardContent>
        </Card>
      ) : insuranceRequests.length === 0 ? (
        <Card className="bg-white border-gray-200">
          <CardContent className="p-12">
            <div className="text-center">
              <Shield className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg mb-2">No pending insurance requests</p>
              <p className="text-gray-500 text-sm">All insurance requests have been processed</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Pending Insurance Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Farm Name</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Crop Type</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Farmer</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Request Date</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Notes</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {insuranceRequests.map((request: any, index: number) => {
                    const farm = request.farmId || request.farm || {};
                    const farmer = request.farmerId || request.farmer || {};
                    return (
                      <tr
                        key={request._id || request.id || index}
                        className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-gray-50" : ""
                        }`}
                      >
                        <td className="py-4 px-6 text-gray-900 font-medium">
                          {farm.name || "N/A"}
                        </td>
                        <td className="py-4 px-6 text-gray-700">
                          {farm.cropType || farm.crop || "N/A"}
                        </td>
                        <td className="py-4 px-6 text-gray-700">
                          {farmer.name || farmer.email || farmer.phoneNumber || "N/A"}
                        </td>
                        <td className="py-4 px-6 text-gray-700">
                          {request.createdAt
                            ? new Date(request.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="py-4 px-6 text-gray-700">
                          <span className="text-sm">{request.notes || "—"}</span>
                        </td>
                        <td className="py-4 px-6">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCreateAssessmentDialog({ open: true, insuranceRequest: request })}
                            className="border-green-600 text-green-600 hover:bg-green-50"
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            Create Assessment
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderSubmittedAssessments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Submitted Assessments</h2>
          <p className="text-gray-600">Review submitted assessments and create policies</p>
        </div>
        <Button
          variant="outline"
          onClick={loadSubmittedAssessments}
          disabled={submittedAssessmentsLoading}
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          <ArrowRight className={`h-4 w-4 mr-2 ${submittedAssessmentsLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {submittedAssessmentsLoading ? (
        <Card className="bg-white border-gray-200">
          <CardContent className="p-12">
            <div className="text-center text-gray-600">Loading submitted assessments...</div>
          </CardContent>
        </Card>
      ) : submittedAssessments.length === 0 ? (
        <Card className="bg-white border-gray-200">
          <CardContent className="p-12">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg mb-2">No submitted assessments</p>
              <p className="text-gray-500 text-sm">Assessments will appear here once assessors submit them</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Ready for Policy Creation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Farm Name</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Crop Type</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Risk Score</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Submitted Date</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submittedAssessments.map((assessment: any, index: number) => {
                    const farm = assessment.farmId || assessment.farm || {};
                    return (
                      <tr
                        key={assessment._id || assessment.id || index}
                        className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-gray-50" : ""
                        }`}
                      >
                        <td className="py-4 px-6 text-gray-900 font-medium">
                          {farm.name || "N/A"}
                        </td>
                        <td className="py-4 px-6 text-gray-700">
                          {farm.cropType || farm.crop || "N/A"}
                        </td>
                        <td className="py-4 px-6 text-gray-700">
                          <Badge variant={assessment.riskScore < 50 ? "default" : assessment.riskScore < 75 ? "secondary" : "destructive"}>
                            {assessment.riskScore || "N/A"}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-gray-700">
                          {assessment.submittedAt || assessment.completedAt
                            ? new Date(assessment.submittedAt || assessment.completedAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="py-4 px-6">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCreatePolicyDialog({ open: true, assessment })}
                            className="border-green-600 text-green-600 hover:bg-green-50"
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            Create Policy
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const [policyKey, setPolicyKey] = useState(0);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return renderDashboard();
      case "insurance-requests": return renderInsuranceRequests();
      case "submitted-assessments": return renderSubmittedAssessments();
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
    { id: "insurance-requests", label: "Insurance Requests", icon: Shield },
    { id: "submitted-assessments", label: "Submitted Assessments", icon: CheckCircle },
    { id: "risk-reviews", label: "Risk Reviews", icon: Shield },
    { id: "claim-reviews", label: "Claim Reviews", icon: FileText },
    { id: "policy-management", label: "Policy Management", icon: CheckCircle },
    { id: "risk-assessments", label: "Risk Assessments", icon: AlertTriangle },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile-settings", label: "Profile Settings", icon: Settings }
  ];

  // Get display name from profile if available
  const displayName = insurerProfile 
    ? (insurerProfile.firstName && insurerProfile.lastName 
        ? `${insurerProfile.firstName} ${insurerProfile.lastName}`.trim()
        : insurerProfile.name || insurerProfile.firstName || insurerProfile.lastName || insurerName)
    : insurerName;

  return (
    <DashboardLayout
      userType="insurer"
      userId={insurerId}
      userName={displayName}
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

      {/* Create Assessment Dialog */}
      <Dialog open={createAssessmentDialog.open} onOpenChange={(open) => 
        setCreateAssessmentDialog({ ...createAssessmentDialog, open })
      }>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Create Assessment</DialogTitle>
            <DialogDescription className="text-gray-600">
              Assign an assessor to evaluate this insurance request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {createAssessmentDialog.insuranceRequest && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="text-sm">
                  <span className="text-gray-600">Farm: </span>
                  <span className="font-medium text-gray-900">
                    {(createAssessmentDialog.insuranceRequest.farmId || createAssessmentDialog.insuranceRequest.farm)?.name || "N/A"}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Crop Type: </span>
                  <span className="font-medium text-gray-900">
                    {(createAssessmentDialog.insuranceRequest.farmId || createAssessmentDialog.insuranceRequest.farm)?.cropType || "N/A"}
                  </span>
                </div>
              </div>
            )}
            <div>
              <Label className="text-gray-700">Assessor ID *</Label>
              <Input
                value={assessorId}
                onChange={(e) => setAssessorId(e.target.value)}
                placeholder="Enter assessor ID"
                className="mt-2 border-gray-300"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Enter the ID of the assessor to assign</p>
            </div>
            <div>
              <Label className="text-gray-700">Notes (Optional)</Label>
              <Textarea
                value={assessmentNotes}
                onChange={(e) => setAssessmentNotes(e.target.value)}
                placeholder="Add any notes for the assessor..."
                className="mt-2 border-gray-300"
                rows={4}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setCreateAssessmentDialog({ open: false, insuranceRequest: null });
                  setAssessorId("");
                  setAssessmentNotes("");
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateAssessment}
                disabled={isCreatingAssessment || !assessorId}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isCreatingAssessment ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Create Assessment
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Policy Dialog */}
      <Dialog open={createPolicyDialog.open} onOpenChange={(open) => 
        setCreatePolicyDialog({ ...createPolicyDialog, open })
      }>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Create Policy from Assessment</DialogTitle>
            <DialogDescription className="text-gray-600">
              Create an insurance policy based on the submitted assessment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {createPolicyDialog.assessment && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="text-sm">
                  <span className="text-gray-600">Farm: </span>
                  <span className="font-medium text-gray-900">
                    {(createPolicyDialog.assessment.farmId || createPolicyDialog.assessment.farm)?.name || "N/A"}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Risk Score: </span>
                  <span className="font-medium text-gray-900">
                    {createPolicyDialog.assessment.riskScore || "N/A"}
                  </span>
                </div>
              </div>
            )}
            <div>
              <Label className="text-gray-700">Coverage Level *</Label>
              <Select value={coverageLevel} onValueChange={(value: "BASIC" | "STANDARD" | "PREMIUM") => setCoverageLevel(value)}>
                <SelectTrigger className="mt-2 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BASIC">Basic</SelectItem>
                  <SelectItem value="STANDARD">Standard</SelectItem>
                  <SelectItem value="PREMIUM">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-700">Start Date *</Label>
              <Input
                type="date"
                value={policyStartDate}
                onChange={(e) => setPolicyStartDate(e.target.value)}
                className="mt-2 border-gray-300"
                required
              />
            </div>
            <div>
              <Label className="text-gray-700">End Date *</Label>
              <Input
                type="date"
                value={policyEndDate}
                onChange={(e) => setPolicyEndDate(e.target.value)}
                className="mt-2 border-gray-300"
                required
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setCreatePolicyDialog({ open: false, assessment: null });
                  setCoverageLevel("STANDARD");
                  setPolicyStartDate("");
                  setPolicyEndDate("");
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreatePolicy}
                disabled={isCreatingPolicy || !policyStartDate || !policyEndDate}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isCreatingPolicy ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Create Policy
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
