import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BaseDashboard } from "./BaseDashboard";
import { DashboardPage, StatCard, DataTable, StatusBadge } from "./DashboardPage";
import { 
  LineChart as RechartsLineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Building2,
  FileText,
  BarChart3,
  Users,
  MapPin,
  Bell,
  ChevronDown,
  ChevronRight,
  Eye,
  Edit,
  Camera,
  MapPin as LocationIcon,
  Calendar,
  DollarSign,
  User,
  Crop,
  Shield,
  FileImage,
  Download,
  Send,
  Search,
  Filter,
  X
} from "lucide-react";

export const InsurerDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [expandedClaims, setExpandedClaims] = useState<Set<string>>(new Set());
  const [claims, setClaims] = useState([
    {
      id: "C001",
      client: "John Doe",
      clientId: "P001",
      crop: "Maize",
      type: "Drought Damage",
      amount: 500000,
      status: "pending",
      date: "2024-03-12",
      location: "Northern Province, Musanze District",
      coordinates: { lat: -1.9441, lng: 29.8739 },
      description: "Severe drought conditions affecting 2.5 hectares of maize crop. Estimated 60% yield loss due to prolonged dry spell.",
      damageAssessment: {
        affectedArea: 2.5,
        yieldLoss: 60,
        estimatedLoss: 500000,
        photos: ["/drone1.jpg", "/drone2.jpeg"],
        droneImages: ["/drone.png"],
        satelliteData: "Sentinel-2 imagery confirms drought stress indicators"
      },
      policyDetails: {
        policyId: "P001",
        coverage: 2500000,
        deductible: 100000,
        premium: 250000
      },
      timeline: [
        { date: "2024-03-12", action: "Claim submitted", status: "completed" },
        { date: "2024-03-13", action: "Initial review", status: "completed" },
        { date: "2024-03-14", action: "Field assessment scheduled", status: "pending" },
        { date: "2024-03-15", action: "Assessment completed", status: "in_progress" }
      ],
      documents: [
        { name: "Claim Form", type: "PDF", size: "2.3 MB" },
        { name: "Damage Photos", type: "ZIP", size: "15.2 MB" },
        { name: "Weather Report", type: "PDF", size: "1.1 MB" }
      ],
      assessor: "Alice Johnson",
      priority: "high"
    },
    {
      id: "C002",
      client: "Jane Smith",
      clientId: "P002",
      crop: "Rice",
      type: "Flood Damage",
      amount: 320000,
      status: "approved",
      date: "2024-03-08",
      location: "Eastern Province, Rwamagana District",
      coordinates: { lat: -1.9482, lng: 30.4346 },
      description: "Flash flooding caused by heavy rainfall damaged rice paddies. Waterlogged fields resulted in significant crop loss.",
      damageAssessment: {
        affectedArea: 1.8,
        yieldLoss: 45,
        estimatedLoss: 320000,
        photos: ["/drone1.jpg"],
        droneImages: ["/drone.png"],
        satelliteData: "Landsat-8 imagery shows flood extent and duration"
      },
      policyDetails: {
        policyId: "P002",
        coverage: 1800000,
        deductible: 50000,
        premium: 180000
      },
      timeline: [
        { date: "2024-03-08", action: "Claim submitted", status: "completed" },
        { date: "2024-03-09", action: "Initial review", status: "completed" },
        { date: "2024-03-10", action: "Field assessment", status: "completed" },
        { date: "2024-03-11", action: "Approval", status: "completed" },
        { date: "2024-03-12", action: "Payment processed", status: "completed" }
      ],
      documents: [
        { name: "Claim Form", type: "PDF", size: "2.1 MB" },
        { name: "Flood Assessment", type: "PDF", size: "3.4 MB" },
        { name: "Weather Data", type: "CSV", size: "0.8 MB" }
      ],
      assessor: "Bob Wilson",
      priority: "medium"
    },
    {
      id: "C003",
      client: "Peter Kimani",
      clientId: "P004",
      crop: "Beans",
      type: "Pest Infestation",
      amount: 180000,
      status: "under_review",
      date: "2024-03-14",
      location: "Western Province, Rubavu District",
      coordinates: { lat: -1.6967, lng: 29.2250 },
      description: "Bean fly infestation affecting 1.2 hectares of bean crop. Significant damage to leaves and pods observed.",
      damageAssessment: {
        affectedArea: 1.2,
        yieldLoss: 35,
        estimatedLoss: 180000,
        photos: ["/drone2.jpeg"],
        droneImages: ["/drone1.jpg"],
        satelliteData: "High-resolution imagery shows pest damage patterns"
      },
      policyDetails: {
        policyId: "P004",
        coverage: 1200000,
        deductible: 75000,
        premium: 120000
      },
      timeline: [
        { date: "2024-03-14", action: "Claim submitted", status: "completed" },
        { date: "2024-03-15", action: "Initial review", status: "completed" },
        { date: "2024-03-16", action: "Field assessment", status: "in_progress" }
      ],
      documents: [
        { name: "Claim Form", type: "PDF", size: "1.9 MB" },
        { name: "Pest Analysis", type: "PDF", size: "2.7 MB" }
      ],
      assessor: "Sarah Mwangi",
      priority: "low"
    }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedClaims, setSelectedClaims] = useState<Set<string>>(new Set());

  const policies = [
    { id: "P001", client: "John Doe", crop: "Maize", premium: 250000, coverage: 2500000, status: "active", date: "2024-03-15" },
    { id: "P002", client: "Jane Smith", crop: "Rice", premium: 180000, coverage: 1800000, status: "active", date: "2024-02-20" },
    { id: "P003", client: "Bob Wilson", crop: "Beans", premium: 120000, coverage: 1200000, status: "pending", date: "2024-03-10" }
  ];

  const premiumData = [
    { month: 'Jan', collected: 1800000000, claims: 450000000 },
    { month: 'Feb', collected: 2025000000, claims: 380000000 },
    { month: 'Mar', collected: 2220000000, claims: 520000000 },
    { month: 'Apr', collected: 2430000000, claims: 420000000 },
    { month: 'May', collected: 2625000000, claims: 380000000 },
    { month: 'Jun', collected: 2835000000, claims: 450000000 }
  ];

  const riskData = [
    { region: 'Northern', policies: 45, claims: 8, riskScore: 18 },
    { region: 'Southern', policies: 62, claims: 12, riskScore: 19 },
    { region: 'Eastern', policies: 38, claims: 15, riskScore: 39 },
    { region: 'Western', policies: 55, claims: 9, riskScore: 16 },
    { region: 'Kigali', policies: 42, claims: 6, riskScore: 14 }
  ];

  const toggleClaimExpansion = (claimId: string) => {
    const newExpanded = new Set(expandedClaims);
    if (newExpanded.has(claimId)) {
      newExpanded.delete(claimId);
    } else {
      newExpanded.add(claimId);
    }
    setExpandedClaims(newExpanded);
  };

  const updateClaimStatus = (claimId: string, newStatus: string) => {
    setClaims(prevClaims => 
      prevClaims.map(claim => {
        if (claim.id === claimId) {
          const updatedClaim = { ...claim, status: newStatus };
          
          // Add timeline entry for status change
          const timelineEntry = {
            date: new Date().toISOString().split('T')[0],
            action: getStatusAction(newStatus),
            status: 'completed'
          };
          
          updatedClaim.timeline = [...claim.timeline, timelineEntry];
          
          return updatedClaim;
        }
        return claim;
      })
    );
  };

  const getStatusAction = (status: string) => {
    switch (status) {
      case 'under_review': return 'Moved to review';
      case 'approved': return 'Claim approved';
      case 'rejected': return 'Claim rejected';
      case 'pending_payment': return 'Payment processing';
      case 'completed': return 'Claim completed';
      default: return 'Status updated';
    }
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || claim.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || claim.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const downloadDocument = (documentName: string) => {
    console.log(`Downloading document: ${documentName}`);
    alert(`Downloading ${documentName}...`);
  };

  const exportClaims = () => {
    const csvContent = [
      ['Claim ID', 'Client', 'Crop', 'Type', 'Amount', 'Status', 'Date', 'Priority'],
      ...filteredClaims.map(claim => [
        claim.id,
        claim.client,
        claim.crop,
        claim.type,
        claim.amount.toString(),
        claim.status,
        claim.date,
        claim.priority
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'claims_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleClaimSelection = (claimId: string) => {
    const newSelected = new Set(selectedClaims);
    if (newSelected.has(claimId)) {
      newSelected.delete(claimId);
    } else {
      newSelected.add(claimId);
    }
    setSelectedClaims(newSelected);
  };

  const selectAllClaims = () => {
    setSelectedClaims(new Set(filteredClaims.map(claim => claim.id)));
  };

  const clearSelection = () => {
    setSelectedClaims(new Set());
  };

  const bulkUpdateStatus = (newStatus: string) => {
    selectedClaims.forEach(claimId => {
      updateClaimStatus(claimId, newStatus);
    });
    setSelectedClaims(new Set());
  };

  const ClaimDetails = ({ claim }: { claim: any }) => (
    <div className="bg-gray-50 p-6 rounded-lg space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Client Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Client:</span>
              <span className="font-medium">{claim.client}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Policy ID:</span>
              <span className="font-mono text-sm">{claim.policyDetails.policyId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Coverage:</span>
              <span className="font-medium">RWF {claim.policyDetails.coverage.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Deductible:</span>
              <span className="font-medium">RWF {claim.policyDetails.deductible.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Crop className="h-5 w-5" />
              Crop Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Crop Type:</span>
              <span className="font-medium">{claim.crop}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Damage Type:</span>
              <span className="font-medium">{claim.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium text-sm">{claim.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Assessor:</span>
              <span className="font-medium">{claim.assessor}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Damage Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Damage Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{claim.damageAssessment.affectedArea} ha</div>
              <div className="text-sm text-red-600">Affected Area</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{claim.damageAssessment.yieldLoss}%</div>
              <div className="text-sm text-orange-600">Yield Loss</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">RWF {claim.damageAssessment.estimatedLoss.toLocaleString()}</div>
              <div className="text-sm text-green-600">Estimated Loss</div>
            </div>
          </div>
          <p className="text-gray-700 mb-4">{claim.description}</p>
          <div className="text-sm text-gray-600">
            <strong>Satellite Data:</strong> {claim.damageAssessment.satelliteData}
          </div>
        </CardContent>
      </Card>

      {/* Images and Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Damage Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {claim.damageAssessment.photos.map((photo: string, index: number) => (
                <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img src={photo} alt={`Damage photo ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Drone Images</h4>
              <div className="grid grid-cols-1 gap-2">
                {claim.damageAssessment.droneImages.map((image: string, index: number) => (
                  <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img src={image} alt={`Drone image ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileImage className="h-5 w-5" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {claim.documents.map((doc: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium text-sm">{doc.name}</div>
                      <div className="text-xs text-gray-500">{doc.type} • {doc.size}</div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => downloadDocument(doc.name)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Claim Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {claim.timeline.map((event: any, index: number) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${
                  event.status === 'completed' ? 'bg-green-500' : 
                  event.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                }`}></div>
                <div className="flex-1">
                  <div className="font-medium">{event.action}</div>
                  <div className="text-sm text-gray-500">{event.date}</div>
                </div>
                <Badge variant={event.status === 'completed' ? 'default' : 'secondary'}>
                  {event.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDashboard = () => (
    <DashboardPage title="Insurer Dashboard" actions={
      <Button className="bg-blue-600 hover:bg-blue-700">
        <Building2 className="h-4 w-4 mr-2" />
        New Policy
      </Button>
    }>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Policies" value="156" icon={<FileText className="h-6 w-6 text-blue-600" />} change="+12 this month" changeType="positive" />
        <StatCard title="Active Claims" value="23" icon={<Clock className="h-6 w-6 text-orange-600" />} change="3 pending review" />
        <StatCard title="Total Premium" value="RWF 2.4B" icon={<TrendingUp className="h-6 w-6 text-green-600" />} change="+8.5% from last month" changeType="positive" />
        <StatCard title="Risk Score" value="Low" icon={<CheckCircle className="h-6 w-6 text-green-600" />} change="All regions stable" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DataTable 
          headers={["Client", "Crop", "Premium", "Status"]}
          data={policies}
          renderRow={(policy) => (
            <tr key={policy.id} className="border-b">
              <td className="py-3 px-4">{policy.client}</td>
              <td className="py-3 px-4">{policy.crop}</td>
              <td className="py-3 px-4">RWF {policy.premium.toLocaleString()}</td>
              <td className="py-3 px-4"><StatusBadge status={policy.status} /></td>
            </tr>
          )}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Claims</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActivePage("claims")}
            >
              View All
            </Button>
          </div>
          {filteredClaims.slice(0, 3).map((claim) => (
            <Card key={claim.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    claim.priority === 'high' ? 'bg-red-500' : 
                    claim.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <div>
                    <div className="font-medium">{claim.id}</div>
                    <div className="text-sm text-gray-600">{claim.client} • {claim.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-semibold">RWF {claim.amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{claim.date}</div>
                  </div>
                  <StatusBadge status={claim.status} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardPage>
  );

  const renderPolicies = () => (
    <DashboardPage title="Policy Management" actions={
      <Button className="bg-blue-600 hover:bg-blue-700">
        <FileText className="h-4 w-4 mr-2" />
        New Policy
      </Button>
    }>
      <DataTable 
        headers={["Policy ID", "Client", "Crop", "Premium", "Coverage", "Status", "Date", "Actions"]}
        data={policies}
        renderRow={(policy) => (
          <tr key={policy.id} className="border-b">
            <td className="py-3 px-4">{policy.id}</td>
            <td className="py-3 px-4">{policy.client}</td>
            <td className="py-3 px-4">{policy.crop}</td>
            <td className="py-3 px-4">RWF {policy.premium.toLocaleString()}</td>
            <td className="py-3 px-4">RWF {policy.coverage.toLocaleString()}</td>
            <td className="py-3 px-4"><StatusBadge status={policy.status} /></td>
            <td className="py-3 px-4">{policy.date}</td>
            <td className="py-3 px-4">
              <Button size="sm" variant="outline">View</Button>
            </td>
          </tr>
        )}
      />
    </DashboardPage>
  );

  const renderClaims = () => (
    <DashboardPage title="Claims Processing" actions={
      <div className="flex gap-2">
        <Button className="bg-orange-600 hover:bg-orange-700">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Process Claims
        </Button>
        <Button variant="outline" onClick={exportClaims}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    }>
      {/* Search and Filter Controls */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedClaims.size === filteredClaims.length && filteredClaims.length > 0}
              onChange={selectedClaims.size === filteredClaims.length ? clearSelection : selectAllClaims}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-600">Select All</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search claims..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setPriorityFilter("all");
            }}
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredClaims.length} of {claims.length} claims
          </div>
          {selectedClaims.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedClaims.size} selected
              </span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => bulkUpdateStatus('under_review')}
              >
                Move to Review
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => bulkUpdateStatus('approved')}
              >
                Approve All
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={clearSelection}
              >
                Clear Selection
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {filteredClaims.map((claim) => (
          <Card key={claim.id} className="overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedClaims.has(claim.id)}
                    onChange={() => toggleClaimSelection(claim.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleClaimExpansion(claim.id)}
                    className="p-1"
                  >
                    {expandedClaims.has(claim.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  <div>
                    <h3 className="font-semibold text-lg">{claim.id}</h3>
                    <p className="text-sm text-gray-600">{claim.client} • {claim.crop}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold text-lg">RWF {claim.amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{claim.date}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        claim.priority === 'high' ? 'destructive' : 
                        claim.priority === 'medium' ? 'default' : 'secondary'
                      }
                    >
                      {claim.priority} priority
                    </Badge>
                    <StatusBadge status={claim.status} />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Crop className="h-4 w-4 text-gray-500" />
                  <span>{claim.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <LocationIcon className="h-4 w-4 text-gray-500" />
                  <span className="truncate">{claim.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{claim.assessor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{claim.date}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => toggleClaimExpansion(claim.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {expandedClaims.has(claim.id) ? 'Hide Details' : 'View Details'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => updateClaimStatus(claim.id, 'under_review')}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Review
                </Button>
                {claim.status === 'pending' && (
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => updateClaimStatus(claim.id, 'approved')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                )}
                {claim.status === 'under_review' && (
                  <>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => updateClaimStatus(claim.id, 'approved')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => updateClaimStatus(claim.id, 'rejected')}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                {claim.status === 'approved' && (
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => updateClaimStatus(claim.id, 'pending_payment')}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Process Payment
                  </Button>
                )}
                {claim.status === 'pending_payment' && (
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => updateClaimStatus(claim.id, 'completed')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>

            {expandedClaims.has(claim.id) && (
              <div className="border-t">
                <ClaimDetails claim={claim} />
              </div>
            )}
          </Card>
        ))}
      </div>
    </DashboardPage>
  );

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return renderDashboard();
      case "policies":
        return renderPolicies();
      case "claims":
        return renderClaims();
      case "risk":
        return (
          <DashboardPage title="Risk Assessment" actions={
            <Button className="bg-red-600 hover:bg-red-700">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Generate Risk Report
            </Button>
          }>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Risk Analysis by Region
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={riskData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="region" />
                        <YAxis />
                        <Tooltip formatter={(value: number, name: string) => [value, name === 'policies' ? 'Policies' : name === 'claims' ? 'Claims' : 'Risk Score']} />
                        <Bar dataKey="policies" fill="#3B82F6" name="policies" />
                        <Bar dataKey="claims" fill="#EF4444" name="claims" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Risk Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div>
                        <div className="font-medium text-red-800">High Risk Areas</div>
                        <div className="text-sm text-red-600">Eastern Province</div>
                      </div>
                      <div className="text-xl font-bold text-red-700">1</div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                      <div>
                        <div className="font-medium text-yellow-800">Medium Risk Areas</div>
                        <div className="text-sm text-yellow-600">Northern, Southern</div>
                      </div>
                      <div className="text-xl font-bold text-yellow-700">2</div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-medium text-green-800">Low Risk Areas</div>
                        <div className="text-sm text-green-600">Western, Kigali</div>
                      </div>
                      <div className="text-xl font-bold text-green-700">2</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DashboardPage>
        );
      case "portfolio":
        return (
          <DashboardPage title="Portfolio Overview">
            <div className="grid gap-6 lg:grid-cols-3">
              <StatCard title="Total Portfolio Value" value="RWF 15.2B" icon={<TrendingUp className="h-6 w-6 text-green-600" />} change="+12.5% YoY" changeType="positive" />
              <StatCard title="Active Policies" value="156" icon={<FileText className="h-6 w-6 text-blue-600" />} change="+8 this month" changeType="positive" />
              <StatCard title="Claims Ratio" value="3.2%" icon={<AlertTriangle className="h-6 w-6 text-orange-600" />} change="Below industry average" changeType="positive" />
            </div>
          </DashboardPage>
        );
      case "reports":
        return (
          <DashboardPage title="Reports & Analytics" actions={
            <Button className="bg-blue-600 hover:bg-blue-700">
              <BarChart3 className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          }>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Premium Collection Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={premiumData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `RWF ${(value / 1000000000).toFixed(1)}B`} />
                        <Tooltip 
                          formatter={(value: number, name: string) => [
                            `RWF ${(value / 1000000000).toFixed(1)}B`, 
                            name === 'collected' ? 'Premium Collected' : 'Claims Paid'
                          ]}
                        />
                        <Area type="monotone" dataKey="collected" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="claims" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Regional Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={riskData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="region" />
                        <YAxis />
                        <Tooltip formatter={(value: number, name: string) => [value, name === 'policies' ? 'Policies' : name === 'claims' ? 'Claims' : 'Risk Score']} />
                        <Bar dataKey="policies" fill="#3B82F6" name="policies" />
                        <Bar dataKey="claims" fill="#EF4444" name="claims" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DashboardPage>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <BaseDashboard 
      role="insurer" 
      activePage={activePage} 
      onPageChange={setActivePage}
    >
      {renderPage()}
    </BaseDashboard>
  );
};