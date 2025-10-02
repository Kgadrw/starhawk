import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Cell,
  Legend,
  RadialBarChart,
  RadialBar
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
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ExternalLink,
  FileText as FileTextIcon,
  Maximize2,
  Minimize2
} from "lucide-react";

export const InsurerDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [expandedClaims, setExpandedClaims] = useState<Set<string>>(new Set());
  const [currentClaimIndex, setCurrentClaimIndex] = useState(0);
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [policyDetailsOpen, setPolicyDetailsOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
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
    { 
      id: "P001", 
      client: "John Doe", 
      crop: "Maize", 
      premium: 250000, 
      coverage: 2500000, 
      status: "active", 
      date: "2024-03-15",
      farmer: {
        name: "John Doe",
        id: "F001",
        phone: "+250 788 123 456",
        email: "john.doe@email.com",
        location: "Northern Province, Musanze District",
        farmSize: 5.2,
        experience: "15 years",
        previousClaims: 2
      },
      policyDetails: {
        startDate: "2024-03-15",
        endDate: "2025-03-15",
        deductible: 100000,
        coverageType: "Comprehensive",
        riskLevel: "Medium",
        premiumFrequency: "Annual"
      }
    },
    { 
      id: "P002", 
      client: "Jane Smith", 
      crop: "Rice", 
      premium: 180000, 
      coverage: 1800000, 
      status: "active", 
      date: "2024-02-20",
      farmer: {
        name: "Jane Smith",
        id: "F002",
        phone: "+250 789 234 567",
        email: "jane.smith@email.com",
        location: "Eastern Province, Rwamagana District",
        farmSize: 3.8,
        experience: "8 years",
        previousClaims: 1
      },
      policyDetails: {
        startDate: "2024-02-20",
        endDate: "2025-02-20",
        deductible: 50000,
        coverageType: "Basic",
        riskLevel: "Low",
        premiumFrequency: "Annual"
      }
    },
    { 
      id: "P003", 
      client: "Bob Wilson", 
      crop: "Beans", 
      premium: 120000, 
      coverage: 1200000, 
      status: "pending", 
      date: "2024-03-10",
      farmer: {
        name: "Bob Wilson",
        id: "F003",
        phone: "+250 790 345 678",
        email: "bob.wilson@email.com",
        location: "Western Province, Rubavu District",
        farmSize: 2.1,
        experience: "5 years",
        previousClaims: 0
      },
      policyDetails: {
        startDate: "2024-03-10",
        endDate: "2025-03-10",
        deductible: 75000,
        coverageType: "Standard",
        riskLevel: "High",
        premiumFrequency: "Annual"
      }
    }
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

  // Risk Assessment Data
  const weatherData = [
    { date: '2024-03-01', temperature: 28, humidity: 65, rainfall: 0, windSpeed: 12, riskLevel: 'Low' },
    { date: '2024-03-02', temperature: 30, humidity: 58, rainfall: 0, windSpeed: 15, riskLevel: 'Low' },
    { date: '2024-03-03', temperature: 32, humidity: 45, rainfall: 0, windSpeed: 18, riskLevel: 'Medium' },
    { date: '2024-03-04', temperature: 35, humidity: 38, rainfall: 0, windSpeed: 22, riskLevel: 'High' },
    { date: '2024-03-05', temperature: 33, humidity: 42, rainfall: 0, windSpeed: 20, riskLevel: 'High' },
    { date: '2024-03-06', temperature: 29, humidity: 55, rainfall: 5, windSpeed: 16, riskLevel: 'Medium' },
    { date: '2024-03-07', temperature: 26, humidity: 72, rainfall: 15, windSpeed: 14, riskLevel: 'Low' }
  ];

  const satelliteData = [
    { region: 'Northern', vegetation: 85, moisture: 72, temperature: 28, riskScore: 18, alerts: 2 },
    { region: 'Southern', vegetation: 78, moisture: 68, temperature: 30, riskScore: 19, alerts: 3 },
    { region: 'Eastern', vegetation: 45, moisture: 35, temperature: 35, riskScore: 39, alerts: 8 },
    { region: 'Western', vegetation: 92, moisture: 85, temperature: 26, riskScore: 16, alerts: 1 },
    { region: 'Kigali', vegetation: 88, moisture: 75, temperature: 29, riskScore: 14, alerts: 1 }
  ];

  const riskAlerts = [
    { id: 'RA001', type: 'Drought Risk', severity: 'High', region: 'Eastern Province', message: 'Prolonged dry spell detected. 15+ days without rainfall.', timestamp: '2024-03-15 14:30', status: 'active' },
    { id: 'RA002', type: 'Flood Risk', severity: 'Medium', region: 'Western Province', message: 'Heavy rainfall expected in next 48 hours.', timestamp: '2024-03-15 10:15', status: 'monitoring' },
    { id: 'RA003', type: 'Pest Alert', severity: 'Low', region: 'Northern Province', message: 'Increased pest activity detected in maize fields.', timestamp: '2024-03-14 16:45', status: 'resolved' }
  ];

  // Crop Monitoring Data
  const cropFields = [
    { id: 'F001', farmer: 'John Doe', crop: 'Maize', location: 'Northern Province', area: 2.5, growthStage: 'Flowering', health: 85, lastUpdate: '2024-03-15 08:30' },
    { id: 'F002', farmer: 'Jane Smith', crop: 'Rice', location: 'Eastern Province', area: 1.8, growthStage: 'Maturity', health: 92, lastUpdate: '2024-03-15 09:15' },
    { id: 'F003', farmer: 'Peter Kimani', crop: 'Beans', location: 'Western Province', area: 1.2, growthStage: 'Vegetative', health: 78, lastUpdate: '2024-03-15 07:45' },
    { id: 'F004', farmer: 'Alice Johnson', crop: 'Maize', location: 'Southern Province', area: 3.2, growthStage: 'Germination', health: 95, lastUpdate: '2024-03-15 10:20' }
  ];

  const cropHealthData = [
    { date: '2024-03-01', healthy: 85, stressed: 12, diseased: 3 },
    { date: '2024-03-02', healthy: 87, stressed: 10, diseased: 3 },
    { date: '2024-03-03', healthy: 84, stressed: 13, diseased: 3 },
    { date: '2024-03-04', healthy: 82, stressed: 15, diseased: 3 },
    { date: '2024-03-05', healthy: 80, stressed: 17, diseased: 3 },
    { date: '2024-03-06', healthy: 83, stressed: 14, diseased: 3 },
    { date: '2024-03-07', healthy: 86, stressed: 11, diseased: 3 }
  ];

  const growthStages = [
    { stage: 'Germination', fields: 12, avgHealth: 95, riskLevel: 'Low' },
    { stage: 'Vegetative', fields: 28, avgHealth: 88, riskLevel: 'Low' },
    { stage: 'Flowering', fields: 35, avgHealth: 82, riskLevel: 'Medium' },
    { stage: 'Maturity', fields: 18, avgHealth: 90, riskLevel: 'Low' },
    { stage: 'Harvest', fields: 8, avgHealth: 85, riskLevel: 'Low' }
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

  const openClaimsSlide = (claimIndex: number = 0) => {
    setCurrentClaimIndex(claimIndex);
    // Navigate to claims page with specific claim focused
    setActivePage("claims");
  };

  const nextClaim = () => {
    setCurrentClaimIndex((prev) => (prev + 1) % filteredClaims.length);
  };

  const prevClaim = () => {
    setCurrentClaimIndex((prev) => (prev - 1 + filteredClaims.length) % filteredClaims.length);
  };

  const openDocumentViewer = (document: any) => {
    setSelectedDocument(document);
    setDocumentViewerOpen(true);
  };

  const openPolicyDetails = (policyId: string) => {
    const policy = policies.find(p => p.id === policyId);
    if (policy) {
      setSelectedPolicy(policy);
      setPolicyDetailsOpen(true);
    }
  };

  const openClaimDetail = (claim: any) => {
    setSelectedClaim(claim);
    setActivePage("claim-detail");
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
              <button
                onClick={() => openPolicyDetails(claim.policyDetails.policyId)}
                className="font-mono text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
              >
                {claim.policyDetails.policyId}
                <ExternalLink className="h-3 w-3" />
              </button>
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
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openDocumentViewer(doc)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => downloadDocument(doc.name)}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
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
    <DashboardPage title="Claim Assessment" actions={
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
      {/* Claims Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard title="Total Claims" value="23" icon={<AlertTriangle className="h-6 w-6 text-orange-600" />} change="+3 this week" />
        <StatCard title="Pending Review" value="8" icon={<Clock className="h-6 w-6 text-yellow-600" />} change="2 high priority" />
        <StatCard title="Approved Claims" value="12" icon={<CheckCircle className="h-6 w-6 text-green-600" />} change="+5 this month" changeType="positive" />
        <StatCard title="Total Value" value="RWF 1.2M" icon={<DollarSign className="h-6 w-6 text-blue-600" />} change="+15% from last month" changeType="positive" />
      </div>
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

      {/* Claims Analytics */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Claims by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={[
                      { name: 'Pending', value: 8, color: '#F59E0B', fill: 'url(#pendingGradient)' },
                      { name: 'Under Review', value: 3, color: '#3B82F6', fill: 'url(#reviewGradient)' },
                      { name: 'Approved', value: 12, color: '#10B981', fill: 'url(#approvedGradient)' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={2}
                    paddingAngle={2}
                  >
                    {[
                      { name: 'Pending', value: 8, color: '#F59E0B' },
                      { name: 'Under Review', value: 3, color: '#3B82F6' },
                      { name: 'Approved', value: 12, color: '#10B981' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string) => [value, name]}
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  />
                  <defs>
                    <linearGradient id="pendingGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#D97706" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="reviewGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#1D4ED8" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="approvedGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#059669" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Claims Trend Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={[
                  { month: 'Jan', claims: 15, approved: 12, rejected: 3 },
                  { month: 'Feb', claims: 18, approved: 14, rejected: 4 },
                  { month: 'Mar', claims: 23, approved: 12, rejected: 2 },
                  { month: 'Apr', claims: 20, approved: 16, rejected: 4 },
                  { month: 'May', claims: 25, approved: 18, rejected: 7 },
                  { month: 'Jun', claims: 23, approved: 12, rejected: 3 }
                ]}>
                  <defs>
                    <linearGradient id="claimsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="approvedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="rejectedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#DC2626" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '14px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    }}
                    formatter={(value: number, name: string) => [
                      value, 
                      name === 'claims' ? 'Total Claims' : 
                      name === 'approved' ? 'Approved' : 'Rejected'
                    ]}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    iconType="rect"
                    wrapperStyle={{
                      fontSize: '14px',
                      fontWeight: '500',
                      paddingBottom: '10px'
                    }}
                  />
                  <Bar dataKey="claims" fill="url(#claimsGradient)" name="claims" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="approved" fill="url(#approvedGradient)" name="approved" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="rejected" fill="url(#rejectedGradient)" name="rejected" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Claims Slide View */}
      <div className="space-y-6">
        {/* Slide Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={prevClaim}
              disabled={filteredClaims.length <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              {currentClaimIndex + 1} of {filteredClaims.length} claims
            </span>
            <Button
              variant="outline"
              onClick={nextClaim}
              disabled={filteredClaims.length <= 1}
            >
              Next
              <ChevronRightIcon className="h-4 w-4 ml-2" />
            </Button>
          </div>
          
          {/* Slide Indicators */}
          <div className="flex gap-2">
            {filteredClaims.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentClaimIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentClaimIndex ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Current Claim Display */}
        {filteredClaims.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredClaims.slice(currentClaimIndex, currentClaimIndex + 3).map((claim, index) => (
              <Card 
                key={claim.id} 
                className={`overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  index === 0 ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => openClaimDetail(claim)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedClaims.has(claim.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleClaimSelection(claim.id);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{claim.id}</h3>
                        <p className="text-sm text-gray-600">{claim.client} • {claim.crop}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          claim.priority === 'high' ? 'destructive' : 
                          claim.priority === 'medium' ? 'default' : 'secondary'
                        }
                      >
                        {claim.priority}
                      </Badge>
                      <StatusBadge status={claim.status} />
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold text-lg text-green-600">
                        RWF {claim.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Crop className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{claim.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LocationIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm truncate">{claim.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{claim.assessor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{claim.date}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        openClaimDetail(claim);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                    {claim.status === 'pending' && (
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateClaimStatus(claim.id, 'approved');
                        }}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            updateClaimStatus(claim.id, 'approved');
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-red-600 hover:bg-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateClaimStatus(claim.id, 'rejected');
                          }}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          updateClaimStatus(claim.id, 'pending_payment');
                        }}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Process Payment
                      </Button>
                    )}
                    {claim.status === 'pending_payment' && (
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateClaimStatus(claim.id, 'completed');
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredClaims.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No claims found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </DashboardPage>
  );

  const renderClaimDetail = () => (
    <DashboardPage 
      title={`Claim Details - ${selectedClaim?.id || 'Loading...'}`} 
      actions={
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setActivePage("claims")}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Claims
          </Button>
          {selectedClaim && (
            <>
              <Button 
                variant="outline"
                onClick={() => updateClaimStatus(selectedClaim.id, 'under_review')}
              >
                <Edit className="h-4 w-4 mr-2" />
                Review
              </Button>
              {selectedClaim.status === 'pending' && (
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => updateClaimStatus(selectedClaim.id, 'approved')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              )}
              {selectedClaim.status === 'under_review' && (
                <>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => updateClaimStatus(selectedClaim.id, 'approved')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => updateClaimStatus(selectedClaim.id, 'rejected')}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}
              {selectedClaim.status === 'approved' && (
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => updateClaimStatus(selectedClaim.id, 'pending_payment')}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Process Payment
                </Button>
              )}
              {selectedClaim.status === 'pending_payment' && (
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => updateClaimStatus(selectedClaim.id, 'completed')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              )}
            </>
          )}
        </div>
      }
    >
      {selectedClaim && (
        <div className="space-y-6">
          {/* Claim Header */}
          <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div>
                <h3 className="text-2xl font-bold">{selectedClaim.id}</h3>
                <p className="text-gray-600">{selectedClaim.client} • {selectedClaim.crop}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={
                    selectedClaim.priority === 'high' ? 'destructive' : 
                    selectedClaim.priority === 'medium' ? 'default' : 'secondary'
                  }
                >
                  {selectedClaim.priority} priority
                </Badge>
                <StatusBadge status={selectedClaim.status} />
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">
                RWF {selectedClaim.amount.toLocaleString()}
              </div>
              <div className="text-gray-600">{selectedClaim.date}</div>
            </div>
          </div>

          {/* Claim Details */}
          <ClaimDetails claim={selectedClaim} />
        </div>
      )}
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
      case "claim-detail":
        return renderClaimDetail();
      case "risk":
        return (
          <DashboardPage title="Risk Assessment" actions={
            <div className="flex gap-2">
              <Button className="bg-red-600 hover:bg-red-700">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Generate Risk Report
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          }>
            {/* Risk Assessment Overview Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <StatCard title="Active Alerts" value="3" icon={<AlertTriangle className="h-6 w-6 text-red-600" />} change="1 new today" />
              <StatCard title="High Risk Areas" value="1" icon={<MapPin className="h-6 w-6 text-orange-600" />} change="Eastern Province" />
              <StatCard title="Weather Risk" value="Medium" icon={<TrendingUp className="h-6 w-6 text-yellow-600" />} change="Drought conditions" />
              <StatCard title="Overall Risk" value="Low" icon={<Shield className="h-6 w-6 text-green-600" />} change="Stable conditions" />
            </div>

            {/* Risk Assessment Analytics */}
            <div className="grid gap-6 lg:grid-cols-2 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Risk Level Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={[
                            { name: 'Low Risk', value: 40, color: '#10B981', fill: 'url(#riskLowGradient)' },
                            { name: 'Medium Risk', value: 35, color: '#F59E0B', fill: 'url(#riskMediumGradient)' },
                            { name: 'High Risk', value: 25, color: '#EF4444', fill: 'url(#riskHighGradient)' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                          stroke="#fff"
                          strokeWidth={2}
                          paddingAngle={2}
                        >
                          {[
                            { name: 'Low Risk', value: 40, color: '#10B981' },
                            { name: 'Medium Risk', value: 35, color: '#F59E0B' },
                            { name: 'High Risk', value: 25, color: '#EF4444' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number, name: string) => [`${value}%`, name]}
                          contentStyle={{
                            backgroundColor: '#1f2937',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '14px'
                          }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          iconType="circle"
                          wrapperStyle={{
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        />
                        <defs>
                          <linearGradient id="riskLowGradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#059669" stopOpacity={1}/>
                          </linearGradient>
                          <linearGradient id="riskMediumGradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#D97706" stopOpacity={1}/>
                          </linearGradient>
                          <linearGradient id="riskHighGradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#DC2626" stopOpacity={1}/>
                          </linearGradient>
                        </defs>
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Risk Trend Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={[
                        { month: 'Jan', lowRisk: 45, mediumRisk: 30, highRisk: 25 },
                        { month: 'Feb', lowRisk: 42, mediumRisk: 32, highRisk: 26 },
                        { month: 'Mar', lowRisk: 40, mediumRisk: 35, highRisk: 25 },
                        { month: 'Apr', lowRisk: 38, mediumRisk: 37, highRisk: 25 },
                        { month: 'May', lowRisk: 35, mediumRisk: 40, highRisk: 25 },
                        { month: 'Jun', lowRisk: 40, mediumRisk: 35, highRisk: 25 }
                      ]}>
                        <defs>
                          <linearGradient id="lowRiskTrendGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#059669" stopOpacity={0.6}/>
                          </linearGradient>
                          <linearGradient id="mediumRiskTrendGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#D97706" stopOpacity={0.6}/>
                          </linearGradient>
                          <linearGradient id="highRiskTrendGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#DC2626" stopOpacity={0.6}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#64748b' }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#64748b' }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1f2937',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '14px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                          }}
                          formatter={(value: number, name: string) => [
                            `${value}%`, 
                            name === 'lowRisk' ? 'Low Risk' : 
                            name === 'mediumRisk' ? 'Medium Risk' : 'High Risk'
                          ]}
                        />
                        <Legend 
                          verticalAlign="top" 
                          height={36}
                          iconType="rect"
                          wrapperStyle={{
                            fontSize: '14px',
                            fontWeight: '500',
                            paddingBottom: '10px'
                          }}
                        />
                        <Bar dataKey="lowRisk" fill="url(#lowRiskTrendGradient)" name="lowRisk" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="mediumRisk" fill="url(#mediumRiskTrendGradient)" name="mediumRisk" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="highRisk" fill="url(#highRiskTrendGradient)" name="highRisk" radius={[4, 4, 0, 0]} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Claims Under Risk Assessment - Slide View */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Claims Under Risk Assessment
                </CardTitle>
                <p className="text-sm text-gray-600">Claims currently being evaluated for risk factors and potential impact</p>
              </CardHeader>
              <CardContent>
                {(() => {
                  const claimsUnderAssessment = filteredClaims.filter(claim => claim.status === 'under_review' || claim.status === 'pending');
                  
                  if (claimsUnderAssessment.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">No claims under assessment</h3>
                        <p className="text-gray-500">All claims have been processed or no new claims require risk assessment.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-6">
                      {/* Slide Navigation */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 sm:gap-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentClaimIndex(Math.max(0, currentClaimIndex - 1))}
                            disabled={currentClaimIndex === 0}
                            className="flex items-center gap-1 sm:gap-2"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Previous</span>
                            <span className="sm:hidden">Prev</span>
                          </Button>
                          <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                            {currentClaimIndex + 1} of {claimsUnderAssessment.length} claims
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentClaimIndex(Math.min(claimsUnderAssessment.length - 1, currentClaimIndex + 1))}
                            disabled={currentClaimIndex === claimsUnderAssessment.length - 1}
                            className="flex items-center gap-1 sm:gap-2"
                          >
                            <span className="hidden sm:inline">Next</span>
                            <span className="sm:hidden">Next</span>
                            <ChevronRightIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Slide Indicators */}
                        <div className="flex gap-1 sm:gap-2 overflow-x-auto max-w-full">
                          {claimsUnderAssessment.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentClaimIndex(index)}
                              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors flex-shrink-0 ${
                                index === currentClaimIndex ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Current Claim Display */}
                      {claimsUnderAssessment[currentClaimIndex] && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                          {claimsUnderAssessment.slice(currentClaimIndex, currentClaimIndex + 3).map((claim, index) => (
                            <Card 
                              key={claim.id} 
                              className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${
                                index === 0 ? 'ring-2 ring-blue-500' : ''
                              }`}
                            >
                              <div className="p-4 lg:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                      claim.priority === 'high' ? 'bg-red-500' : 
                                      claim.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}></div>
                                    <div className="min-w-0 flex-1">
                                      <h3 className="font-semibold text-base lg:text-lg truncate">{claim.id}</h3>
                                      <p className="text-xs sm:text-sm text-gray-600 truncate">{claim.client} • {claim.crop}</p>
                                    </div>
                                  </div>
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <Badge 
                                      variant={
                                        claim.priority === 'high' ? 'destructive' : 
                                        claim.priority === 'medium' ? 'default' : 'secondary'
                                      }
                                      className="text-xs"
                                    >
                                      {claim.priority}
                                    </Badge>
                                    <StatusBadge status={claim.status} />
                                  </div>
                                </div>
                                
                                <div className="space-y-2 lg:space-y-3 mb-4">
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-600 text-sm">Amount:</span>
                                    <span className="font-semibold text-base lg:text-lg text-green-600">
                                      RWF {claim.amount.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Crop className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm truncate">{claim.type}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <LocationIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm truncate">{claim.location}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm truncate">{claim.assessor}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm">{claim.date}</span>
                                  </div>
                                </div>

                                {/* Risk Assessment Metrics */}
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                  <div className="bg-red-50 p-2 rounded text-center">
                                    <div className="text-xs text-red-600 font-medium">Area</div>
                                    <div className="text-xs sm:text-sm font-bold text-red-700">{claim.damageAssessment.affectedArea}ha</div>
                                  </div>
                                  <div className="bg-orange-50 p-2 rounded text-center">
                                    <div className="text-xs text-orange-600 font-medium">Loss</div>
                                    <div className="text-xs sm:text-sm font-bold text-orange-700">{claim.damageAssessment.yieldLoss}%</div>
                                  </div>
                                  <div className="bg-blue-50 p-2 rounded text-center">
                                    <div className="text-xs text-blue-600 font-medium">Risk</div>
                                    <div className="text-xs sm:text-sm font-bold text-blue-700">
                                      {claim.priority === 'high' ? '85' : 
                                       claim.priority === 'medium' ? '65' : '45'}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => openClaimDetail(claim)}
                                    className="flex-1 sm:flex-none"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    <span className="hidden sm:inline">Review</span>
                                    <span className="sm:hidden">View</span>
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
                                    onClick={() => updateClaimStatus(claim.id, 'approved')}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    <span className="hidden sm:inline">Approve</span>
                                    <span className="sm:hidden">OK</span>
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none"
                                    onClick={() => updateClaimStatus(claim.id, 'rejected')}
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    <span className="hidden sm:inline">Flag Risk</span>
                                    <span className="sm:hidden">Flag</span>
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Weather Monitoring */}
            <div className="grid gap-6 lg:grid-cols-2 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Weather Risk Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={weatherData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="temperature" stroke="#EF4444" strokeWidth={2} name="Temperature (°C)" />
                        <Line type="monotone" dataKey="humidity" stroke="#3B82F6" strokeWidth={2} name="Humidity (%)" />
                        <Line type="monotone" dataKey="rainfall" stroke="#10B981" strokeWidth={2} name="Rainfall (mm)" />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Regional Risk Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={satelliteData}>
                        <defs>
                          <linearGradient id="vegetationGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#059669" stopOpacity={0.6}/>
                          </linearGradient>
                          <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.6}/>
                          </linearGradient>
                          <linearGradient id="riskScoreGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#DC2626" stopOpacity={0.6}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="region" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#64748b' }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#64748b' }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1f2937',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '14px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                          }}
                          formatter={(value: number, name: string) => [
                            value, 
                            name === 'vegetation' ? 'Vegetation (%)' : 
                            name === 'moisture' ? 'Moisture (%)' : 'Risk Score'
                          ]} 
                        />
                        <Legend 
                          verticalAlign="top" 
                          height={36}
                          iconType="rect"
                          wrapperStyle={{
                            fontSize: '14px',
                            fontWeight: '500',
                            paddingBottom: '10px'
                          }}
                        />
                        <Bar dataKey="vegetation" fill="url(#vegetationGradient)" name="vegetation" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="moisture" fill="url(#moistureGradient)" name="moisture" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="riskScore" fill="url(#riskScoreGradient)" name="riskScore" radius={[4, 4, 0, 0]} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Alerts */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Active Risk Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskAlerts.map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === 'High' ? 'bg-red-50 border-red-500' :
                      alert.severity === 'Medium' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-green-50 border-green-500'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            alert.severity === 'High' ? 'bg-red-500' :
                            alert.severity === 'Medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}></div>
                          <div>
                            <div className="font-medium">{alert.type}</div>
                            <div className="text-sm text-gray-600">{alert.region}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            alert.severity === 'High' ? 'destructive' :
                            alert.severity === 'Medium' ? 'default' : 'secondary'
                          }>
                            {alert.severity}
                          </Badge>
                          <Badge variant={alert.status === 'active' ? 'default' : 'secondary'}>
                            {alert.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">{alert.message}</p>
                      <div className="mt-2 text-xs text-gray-500">{alert.timestamp}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Satellite Data Analysis */}
            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Satellite Imagery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img src="/drone.png" alt="Satellite view" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Last Update:</span>
                        <span>2024-03-15 14:30</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Resolution:</span>
                        <span>10m per pixel</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coverage:</span>
                        <span>Rwanda</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Risk Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={[
                            { name: 'Low Risk', value: 40, color: '#10B981', fill: 'url(#lowRiskGradient)' },
                            { name: 'Medium Risk', value: 35, color: '#F59E0B', fill: 'url(#mediumRiskGradient)' },
                            { name: 'High Risk', value: 25, color: '#EF4444', fill: 'url(#highRiskGradient)' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={90}
                          dataKey="value"
                          stroke="#fff"
                          strokeWidth={2}
                          paddingAngle={2}
                        >
                          {[
                            { name: 'Low Risk', value: 40, color: '#10B981' },
                            { name: 'Medium Risk', value: 35, color: '#F59E0B' },
                            { name: 'High Risk', value: 25, color: '#EF4444' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number, name: string) => [`${value}%`, name]}
                          contentStyle={{
                            backgroundColor: '#1f2937',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '14px'
                          }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          iconType="circle"
                          wrapperStyle={{
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        />
                        <defs>
                          <linearGradient id="lowRiskGradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#059669" stopOpacity={1}/>
                          </linearGradient>
                          <linearGradient id="mediumRiskGradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#D97706" stopOpacity={1}/>
                          </linearGradient>
                          <linearGradient id="highRiskGradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#DC2626" stopOpacity={1}/>
                          </linearGradient>
                        </defs>
                      </RechartsPieChart>
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
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <div className="font-medium text-red-800">High Risk Areas</div>
                        <div className="text-sm text-red-600">Eastern Province</div>
                      </div>
                      <div className="text-xl font-bold text-red-700">1</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <div className="font-medium text-yellow-800">Medium Risk Areas</div>
                        <div className="text-sm text-yellow-600">Northern, Southern</div>
                      </div>
                      <div className="text-xl font-bold text-yellow-700">2</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
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
      case "crop-monitoring":
        return (
          <DashboardPage title="Crop Monitoring" actions={
            <div className="flex gap-2">
              <Button className="bg-green-600 hover:bg-green-700">
                <Crop className="h-4 w-4 mr-2" />
                Add Field
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          }>
            {/* Crop Overview Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <StatCard title="Total Fields" value="91" icon={<Crop className="h-6 w-6 text-green-600" />} change="+3 this week" changeType="positive" />
              <StatCard title="Healthy Crops" value="86%" icon={<CheckCircle className="h-6 w-6 text-green-600" />} change="+2% from last week" changeType="positive" />
              <StatCard title="Fields at Risk" value="12" icon={<AlertTriangle className="h-6 w-6 text-orange-600" />} change="3 new alerts" />
              <StatCard title="Avg Growth Stage" value="Flowering" icon={<TrendingUp className="h-6 w-6 text-blue-600" />} change="35 fields" />
            </div>

            {/* Field Health Overview */}
            <div className="grid gap-6 lg:grid-cols-2 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Crop Health Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={cropHealthData}>
                        <defs>
                          <linearGradient id="healthyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#059669" stopOpacity={0.3}/>
                          </linearGradient>
                          <linearGradient id="stressedGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#D97706" stopOpacity={0.3}/>
                          </linearGradient>
                          <linearGradient id="diseasedGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#DC2626" stopOpacity={0.3}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#64748b' }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#64748b' }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1f2937',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '14px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                          }}
                          formatter={(value: number, name: string) => [
                            `${value}%`, 
                            name === 'healthy' ? 'Healthy' : 
                            name === 'stressed' ? 'Stressed' : 'Diseased'
                          ]}
                        />
                        <Legend 
                          verticalAlign="top" 
                          height={36}
                          iconType="rect"
                          wrapperStyle={{
                            fontSize: '14px',
                            fontWeight: '500',
                            paddingBottom: '10px'
                          }}
                        />
                        <Area type="monotone" dataKey="healthy" stackId="1" stroke="#10B981" fill="url(#healthyGradient)" name="Healthy" strokeWidth={2} />
                        <Area type="monotone" dataKey="stressed" stackId="2" stroke="#F59E0B" fill="url(#stressedGradient)" name="Stressed" strokeWidth={2} />
                        <Area type="monotone" dataKey="diseased" stackId="3" stroke="#EF4444" fill="url(#diseasedGradient)" name="Diseased" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crop className="h-5 w-5" />
                    Growth Stage Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={growthStages}>
                        <defs>
                          <linearGradient id="fieldsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.6}/>
                          </linearGradient>
                          <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#059669" stopOpacity={0.6}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="stage" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#64748b' }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#64748b' }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1f2937',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '14px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                          }}
                          formatter={(value: number, name: string) => [
                            value, 
                            name === 'fields' ? 'Fields' : 
                            name === 'avgHealth' ? 'Avg Health (%)' : 'Risk Level'
                          ]} 
                        />
                        <Legend 
                          verticalAlign="top" 
                          height={36}
                          iconType="rect"
                          wrapperStyle={{
                            fontSize: '14px',
                            fontWeight: '500',
                            paddingBottom: '10px'
                          }}
                        />
                        <Bar dataKey="fields" fill="url(#fieldsGradient)" name="fields" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="avgHealth" fill="url(#healthGradient)" name="avgHealth" radius={[4, 4, 0, 0]} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Field Monitoring Table */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Field Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Field ID</th>
                        <th className="text-left py-3 px-4">Farmer</th>
                        <th className="text-left py-3 px-4">Crop</th>
                        <th className="text-left py-3 px-4">Location</th>
                        <th className="text-left py-3 px-4">Area (ha)</th>
                        <th className="text-left py-3 px-4">Growth Stage</th>
                        <th className="text-left py-3 px-4">Health</th>
                        <th className="text-left py-3 px-4">Last Update</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cropFields.map((field) => (
                        <tr key={field.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono">{field.id}</td>
                          <td className="py-3 px-4">{field.farmer}</td>
                          <td className="py-3 px-4">{field.crop}</td>
                          <td className="py-3 px-4 text-sm">{field.location}</td>
                          <td className="py-3 px-4">{field.area}</td>
                          <td className="py-3 px-4">
                            <Badge variant={
                              field.growthStage === 'Flowering' ? 'default' :
                              field.growthStage === 'Maturity' ? 'secondary' : 'outline'
                            }>
                              {field.growthStage}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${
                                field.health >= 90 ? 'bg-green-500' :
                                field.health >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}></div>
                              <span className="font-medium">{field.health}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{field.lastUpdate}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Camera className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Real-time Monitoring */}
            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Drone Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img src="/drone1.jpg" alt="Field view" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Field:</span>
                        <span>F001 - Maize</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Captured:</span>
                        <span>2024-03-15 08:30</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Health Score:</span>
                        <span className="font-medium text-green-600">85%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Field Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                      <div className="font-medium text-red-800">Water Stress Detected</div>
                      <div className="text-sm text-red-600">Field F003 - Beans</div>
                      <div className="text-xs text-gray-500">2 hours ago</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                      <div className="font-medium text-yellow-800">Pest Activity</div>
                      <div className="text-sm text-yellow-600">Field F001 - Maize</div>
                      <div className="text-xs text-gray-500">4 hours ago</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <div className="font-medium text-green-800">Optimal Growth</div>
                      <div className="text-sm text-green-600">Field F002 - Rice</div>
                      <div className="text-xs text-gray-500">6 hours ago</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Growth Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">35</div>
                      <div className="text-sm text-blue-600">Fields in Flowering</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">86%</div>
                      <div className="text-sm text-green-600">Average Health</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">12</div>
                      <div className="text-sm text-orange-600">Fields at Risk</div>
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
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={premiumData}>
                        <defs>
                          <linearGradient id="premiumGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.3}/>
                          </linearGradient>
                          <linearGradient id="claimsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#DC2626" stopOpacity={0.3}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#64748b' }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#64748b' }}
                          tickFormatter={(value) => `RWF ${(value / 1000000000).toFixed(1)}B`} 
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1f2937',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '14px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                          }}
                          formatter={(value: number, name: string) => [
                            `RWF ${(value / 1000000000).toFixed(1)}B`, 
                            name === 'collected' ? 'Premium Collected' : 'Claims Paid'
                          ]}
                        />
                        <Legend 
                          verticalAlign="top" 
                          height={36}
                          iconType="rect"
                          wrapperStyle={{
                            fontSize: '14px',
                            fontWeight: '500',
                            paddingBottom: '10px'
                          }}
                        />
                        <Area type="monotone" dataKey="collected" stackId="1" stroke="#3B82F6" fill="url(#premiumGradient)" name="collected" strokeWidth={2} />
                        <Area type="monotone" dataKey="claims" stackId="2" stroke="#EF4444" fill="url(#claimsGradient)" name="claims" strokeWidth={2} />
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
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={riskData}>
                        <defs>
                          <linearGradient id="policiesGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.6}/>
                          </linearGradient>
                          <linearGradient id="claimsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#DC2626" stopOpacity={0.6}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="region" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#64748b' }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#64748b' }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1f2937',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '14px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                          }}
                          formatter={(value: number, name: string) => [
                            value, 
                            name === 'policies' ? 'Policies' : 
                            name === 'claims' ? 'Claims' : 'Risk Score'
                          ]} 
                        />
                        <Legend 
                          verticalAlign="top" 
                          height={36}
                          iconType="rect"
                          wrapperStyle={{
                            fontSize: '14px',
                            fontWeight: '500',
                            paddingBottom: '10px'
                          }}
                        />
                        <Bar dataKey="policies" fill="url(#policiesGradient)" name="policies" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="claims" fill="url(#claimsGradient)" name="claims" radius={[4, 4, 0, 0]} />
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


  // Document Viewer Modal
  const DocumentViewer = () => (
    <Dialog open={documentViewerOpen} onOpenChange={setDocumentViewerOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{selectedDocument?.name}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadDocument(selectedDocument?.name)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDocumentViewerOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          {selectedDocument && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileTextIcon className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">{selectedDocument.name}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Type: {selectedDocument.type} • Size: {selectedDocument.size}
                </div>
              </div>
              
              {/* Document Preview Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Document Preview
                </h3>
                <p className="text-gray-500 mb-4">
                  {selectedDocument.type === 'PDF' 
                    ? 'PDF preview would be displayed here'
                    : selectedDocument.type === 'ZIP'
                    ? 'ZIP file contents would be listed here'
                    : 'Document content would be displayed here'
                  }
                </p>
                <Button
                  variant="outline"
                  onClick={() => downloadDocument(selectedDocument.name)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download to View
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  // Policy Details Modal
  const PolicyDetailsModal = () => (
    <Dialog open={policyDetailsOpen} onOpenChange={setPolicyDetailsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Policy Details - {selectedPolicy?.id}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPolicyDetailsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          {selectedPolicy && (
            <div className="space-y-6">
              {/* Policy Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Policy Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Policy ID:</span>
                        <span className="font-mono">{selectedPolicy.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Coverage Type:</span>
                        <span className="font-medium">{selectedPolicy.policyDetails.coverageType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Coverage Amount:</span>
                        <span className="font-medium">RWF {selectedPolicy.coverage.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Premium:</span>
                        <span className="font-medium">RWF {selectedPolicy.premium.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deductible:</span>
                        <span className="font-medium">RWF {selectedPolicy.policyDetails.deductible.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk Level:</span>
                        <Badge variant={
                          selectedPolicy.policyDetails.riskLevel === 'High' ? 'destructive' :
                          selectedPolicy.policyDetails.riskLevel === 'Medium' ? 'default' : 'secondary'
                        }>
                          {selectedPolicy.policyDetails.riskLevel}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start Date:</span>
                        <span className="font-medium">{selectedPolicy.policyDetails.startDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">End Date:</span>
                        <span className="font-medium">{selectedPolicy.policyDetails.endDate}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Farmer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Farmer Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{selectedPolicy.farmer.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Farmer ID:</span>
                        <span className="font-mono">{selectedPolicy.farmer.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedPolicy.farmer.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedPolicy.farmer.email}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium text-sm">{selectedPolicy.farmer.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Farm Size:</span>
                        <span className="font-medium">{selectedPolicy.farmer.farmSize} hectares</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium">{selectedPolicy.farmer.experience}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Previous Claims:</span>
                        <span className="font-medium">{selectedPolicy.farmer.previousClaims}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Crop Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crop className="h-5 w-5" />
                    Crop Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedPolicy.crop}</div>
                      <div className="text-sm text-blue-600">Crop Type</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedPolicy.farmer.farmSize} ha</div>
                      <div className="text-sm text-green-600">Farm Size</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{selectedPolicy.policyDetails.riskLevel}</div>
                      <div className="text-sm text-orange-600">Risk Level</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );


  return (
    <BaseDashboard 
      role="insurer" 
      activePage={activePage} 
      onPageChange={setActivePage}
    >
      {renderPage()}
      <DocumentViewer />
      <PolicyDetailsModal />
    </BaseDashboard>
  );
};