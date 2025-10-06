import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft,
  FileText, 
  User, 
  MapPin, 
  Calendar,
  DollarSign,
  Camera,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  Building2,
  Crop,
  TrendingUp,
  Shield
} from "lucide-react";

export default function ClaimReviewPage() {
  const [selectedClaim, setSelectedClaim] = useState("CLM-002");
  const [reviewDecision, setReviewDecision] = useState("");
  const [reviewComments, setReviewComments] = useState("");
  const [approvedAmount, setApprovedAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock claim data
  const claims = [
    {
      id: "CLM-002",
      farmerId: "FMR-0247",
      farmerName: "Jean Baptiste",
      policyId: "POL-001",
      cropType: "Maize",
      claimAmount: 150000,
      filedDate: "2024-10-02",
      incidentDate: "2024-09-28",
      status: "pending_review",
      description: "Drought damage affecting 60% of crop due to prolonged dry season. Significant yield loss observed in the northern section of the farm.",
      location: "Nyagatare District, Eastern Province",
      farmSize: 2.5,
      assessorId: "ASS-001",
      assessorName: "Richard Nkurunziza",
      assessmentDate: "2024-10-03",
      assessmentNotes: "Field inspection confirmed drought damage. Soil moisture levels critically low. Crop health assessment shows 60% damage in affected areas.",
      photos: [
        { id: 1, url: "/api/placeholder/400/300", description: "Drought-affected maize field" },
        { id: 2, url: "/api/placeholder/400/300", description: "Close-up of damaged crops" },
        { id: 3, url: "/api/placeholder/400/300", description: "Soil condition assessment" }
      ],
      documents: [
        { id: 1, name: "Field Assessment Report", type: "PDF", size: "2.3 MB" },
        { id: 2, name: "Weather Data Report", type: "PDF", size: "1.8 MB" },
        { id: 3, name: "Soil Analysis", type: "PDF", size: "1.2 MB" }
      ],
      policyDetails: {
        coverage: 250000,
        premium: 15000,
        deductible: 10000,
        startDate: "2024-01-15",
        endDate: "2024-12-31"
      }
    },
    {
      id: "CLM-003",
      farmerId: "FMR-0248",
      farmerName: "Marie Uwimana",
      policyId: "POL-002",
      cropType: "Rice",
      claimAmount: 200000,
      filedDate: "2024-10-04",
      incidentDate: "2024-10-01",
      status: "pending_review",
      description: "Flood damage from heavy rainfall causing waterlogging and crop loss in low-lying areas of the rice field.",
      location: "Gatsibo District, Eastern Province",
      farmSize: 1.8,
      assessorId: "ASS-002",
      assessorName: "Grace Mukamana",
      assessmentDate: "2024-10-05",
      assessmentNotes: "Flood damage confirmed. Water levels exceeded normal thresholds. Rice plants showing signs of water stress and root damage.",
      photos: [
        { id: 1, url: "/api/placeholder/400/300", description: "Flooded rice field" },
        { id: 2, url: "/api/placeholder/400/300", description: "Waterlogged crops" }
      ],
      documents: [
        { id: 1, name: "Flood Assessment Report", type: "PDF", size: "3.1 MB" },
        { id: 2, name: "Weather Station Data", type: "PDF", size: "2.2 MB" }
      ],
      policyDetails: {
        coverage: 200000,
        premium: 12000,
        deductible: 8000,
        startDate: "2024-02-01",
        endDate: "2024-12-31"
      }
    }
  ];

  const currentClaim = claims.find(claim => claim.id === selectedClaim);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_review": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "under_investigation": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending_review": return <Clock className="h-4 w-4" />;
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "rejected": return <XCircle className="h-4 w-4" />;
      case "under_investigation": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewDecision || !reviewComments) {
      alert("Please provide both decision and comments");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    
    alert(`Claim ${reviewDecision} successfully!`);
    // Reset form
    setReviewDecision("");
    setReviewComments("");
    setApprovedAmount("");
  };

  const renderClaimSummary = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Claim Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="text-sm font-medium text-gray-600">Claim ID</Label>
            <p className="text-lg font-semibold">{currentClaim?.id}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Status</Label>
            <div className="mt-1">
              <Badge className={getStatusColor(currentClaim?.status || "")}>
                {getStatusIcon(currentClaim?.status || "")}
                <span className="ml-1 capitalize">{currentClaim?.status?.replace('_', ' ')}</span>
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="text-sm font-medium text-gray-600">Claim Amount</Label>
            <p className="text-lg font-semibold text-green-600">
              {currentClaim?.claimAmount.toLocaleString()} RWF
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Filed Date</Label>
            <p className="text-lg">{currentClaim?.filedDate}</p>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-600">Description</Label>
          <p className="text-gray-700 mt-1">{currentClaim?.description}</p>
        </div>
      </CardContent>
    </Card>
  );

  const renderFarmerInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Farmer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="text-sm font-medium text-gray-600">Farmer Name</Label>
            <p className="text-lg font-semibold">{currentClaim?.farmerName}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Farmer ID</Label>
            <p className="text-lg">{currentClaim?.farmerId}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="text-sm font-medium text-gray-600">Location</Label>
            <p className="text-gray-700">{currentClaim?.location}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Farm Size</Label>
            <p className="text-gray-700">{currentClaim?.farmSize} hectares</p>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Call Farmer
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderPolicyInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Policy Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="text-sm font-medium text-gray-600">Policy ID</Label>
            <p className="text-lg font-semibold">{currentClaim?.policyId}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Crop Type</Label>
            <p className="text-lg">{currentClaim?.cropType}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label className="text-sm font-medium text-gray-600">Coverage</Label>
            <p className="text-lg font-semibold text-blue-600">
              {currentClaim?.policyDetails.coverage.toLocaleString()} RWF
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Premium</Label>
            <p className="text-lg">{currentClaim?.policyDetails.premium.toLocaleString()} RWF</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Deductible</Label>
            <p className="text-lg">{currentClaim?.policyDetails.deductible.toLocaleString()} RWF</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="text-sm font-medium text-gray-600">Policy Start</Label>
            <p className="text-gray-700">{currentClaim?.policyDetails.startDate}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Policy End</Label>
            <p className="text-gray-700">{currentClaim?.policyDetails.endDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderAssessmentInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Assessment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="text-sm font-medium text-gray-600">Assessor</Label>
            <p className="text-lg font-semibold">{currentClaim?.assessorName}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Assessment Date</Label>
            <p className="text-lg">{currentClaim?.assessmentDate}</p>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-600">Assessment Notes</Label>
          <p className="text-gray-700 mt-1">{currentClaim?.assessmentNotes}</p>
        </div>

        <div className="flex space-x-4">
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Call Assessor
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message Assessor
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderPhotos = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="h-5 w-5 mr-2" />
          Field Photos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {currentClaim?.photos.map((photo) => (
            <div key={photo.id} className="space-y-2">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={photo.url} 
                  alt={photo.description}
                  className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                />
              </div>
              <p className="text-sm text-gray-600 text-center">{photo.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderDocuments = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Supporting Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {currentClaim?.documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-sm text-gray-500">{doc.type} • {doc.size}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderReviewForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Claim Review Decision
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reviewDecision">Decision</Label>
          <Select value={reviewDecision} onValueChange={setReviewDecision}>
            <SelectTrigger>
              <SelectValue placeholder="Select decision" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approved">Approve Claim</SelectItem>
              <SelectItem value="rejected">Reject Claim</SelectItem>
              <SelectItem value="partial_approval">Partial Approval</SelectItem>
              <SelectItem value="requires_more_info">Requires More Information</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {reviewDecision === "partial_approval" && (
          <div className="space-y-2">
            <Label htmlFor="approvedAmount">Approved Amount (RWF)</Label>
            <Input
              id="approvedAmount"
              type="number"
              value={approvedAmount}
              onChange={(e) => setApprovedAmount(e.target.value)}
              placeholder="Enter approved amount"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="reviewComments">Review Comments</Label>
          <Textarea
            id="reviewComments"
            value={reviewComments}
            onChange={(e) => setReviewComments(e.target.value)}
            placeholder="Provide detailed comments about your decision..."
            rows={4}
          />
        </div>

        <div className="flex space-x-4">
          <Button 
            onClick={handleSubmitReview}
            disabled={isSubmitting || !reviewDecision || !reviewComments}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
          <Button variant="outline">
            Save as Draft
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Claims
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Claim Review</h2>
            <p className="text-gray-600">Review and make decisions on insurance claims</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={selectedClaim} onValueChange={setSelectedClaim}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {claims.map((claim) => (
                <SelectItem key={claim.id} value={claim.id}>
                  {claim.id} - {claim.farmerName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Alert for pending review */}
      {currentClaim?.status === "pending_review" && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This claim is pending review. Please review all information and make a decision.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Claim Details */}
        <div className="lg:col-span-2 space-y-6">
          {renderClaimSummary()}
          {renderFarmerInfo()}
          {renderPolicyInfo()}
          {renderAssessmentInfo()}
          {renderPhotos()}
          {renderDocuments()}
        </div>

        {/* Right Column - Review Form */}
        <div className="space-y-6">
          {renderReviewForm()}
          
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                View Full Assessment Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="h-4 w-4 mr-2" />
                View Field Location
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Follow-up Visit
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact All Parties
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
