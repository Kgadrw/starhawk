import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight,
  Eye,
  User,
  MapPin,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  FileText
} from "lucide-react";

interface Claim {
  id: string;
  farmerId: string;
  farmerName: string;
  policyId: string;
  cropType: string;
  claimAmount: number;
  status: string;
  filedDate: string;
  incidentDate: string;
  description: string;
  location: string;
  assessorId: string;
  assessorName: string;
  priority: string;
}

export default function ClaimsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock claims data
  const claims: Claim[] = [
    {
      id: "CLM-001",
      farmerId: "FMR-0247",
      farmerName: "Jean Baptiste",
      policyId: "POL-001",
      cropType: "Maize",
      claimAmount: 150000,
      status: "pending_review",
      filedDate: "2024-10-02",
      incidentDate: "2024-09-28",
      description: "Drought damage affecting 60% of crop due to prolonged dry season. Significant yield loss observed in the northern section of the farm.",
      location: "Nyagatare District, Eastern Province",
      assessorId: "ASS-001",
      assessorName: "Richard Nkurunziza",
      priority: "high"
    },
    {
      id: "CLM-002",
      farmerId: "FMR-0248",
      farmerName: "Marie Uwimana",
      policyId: "POL-002",
      cropType: "Rice",
      claimAmount: 200000,
      status: "pending_review",
      filedDate: "2024-10-04",
      incidentDate: "2024-10-01",
      description: "Flood damage from heavy rainfall causing waterlogging and crop loss in low-lying areas of the rice field.",
      location: "Gatsibo District, Eastern Province",
      assessorId: "ASS-002",
      assessorName: "Grace Mukamana",
      priority: "medium"
    },
    {
      id: "CLM-003",
      farmerId: "FMR-0249",
      farmerName: "Paul Kagame",
      policyId: "POL-003",
      cropType: "Potatoes",
      claimAmount: 180000,
      status: "under_investigation",
      filedDate: "2024-10-05",
      incidentDate: "2024-10-02",
      description: "Pest infestation causing significant damage to potato crops. Requires further investigation and assessment.",
      location: "Musanze District, Northern Province",
      assessorId: "ASS-003",
      assessorName: "John Doe",
      priority: "high"
    },
    {
      id: "CLM-004",
      farmerId: "FMR-0250",
      farmerName: "Grace Mukamana",
      policyId: "POL-004",
      cropType: "Beans",
      claimAmount: 120000,
      status: "approved",
      filedDate: "2024-09-28",
      incidentDate: "2024-09-25",
      description: "Hail damage affecting 40% of bean crops. Assessment completed and approved for payment.",
      location: "Huye District, Southern Province",
      assessorId: "ASS-004",
      assessorName: "Jane Smith",
      priority: "low"
    },
    {
      id: "CLM-005",
      farmerId: "FMR-0251",
      farmerName: "Joseph Nkurunziza",
      policyId: "POL-005",
      cropType: "Coffee",
      claimAmount: 300000,
      status: "rejected",
      filedDate: "2024-09-30",
      incidentDate: "2024-09-27",
      description: "Claim rejected due to insufficient evidence of damage. Farmer may resubmit with additional documentation.",
      location: "Rubavu District, Western Province",
      assessorId: "ASS-005",
      assessorName: "Peter Wilson",
      priority: "medium"
    },
    {
      id: "CLM-006",
      farmerId: "FMR-0252",
      farmerName: "Sarah Uwimana",
      policyId: "POL-006",
      cropType: "Cassava",
      claimAmount: 95000,
      status: "pending_review",
      filedDate: "2024-10-06",
      incidentDate: "2024-10-03",
      description: "Disease outbreak affecting cassava plants. Requires immediate assessment and treatment recommendations.",
      location: "Rwamagana District, Eastern Province",
      assessorId: "ASS-006",
      assessorName: "Alice Brown",
      priority: "high"
    }
  ];

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
      case "rejected": return <AlertTriangle className="h-4 w-4" />;
      case "under_investigation": return <Eye className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const nextClaim = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === claims.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevClaim = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? claims.length - 1 : prevIndex - 1
    );
  };

  const goToClaim = (index: number) => {
    setCurrentIndex(index);
  };

  const currentClaim = claims[currentIndex];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Claims Review</h2>
          <p className="text-gray-600">Browse through claims for review and decision making</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {currentIndex + 1} of {claims.length}
          </Badge>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Arrows */}
        <Button
          variant="outline"
          size="sm"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg"
          onClick={prevClaim}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg"
          onClick={nextClaim}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Claim Card */}
        <Card className="mx-12 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <CardTitle className="text-xl">{currentClaim.id}</CardTitle>
                  <p className="text-sm text-gray-600">Filed on {currentClaim.filedDate}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(currentClaim.priority)}>
                    {currentClaim.priority} priority
                  </Badge>
                  <Badge className={getStatusColor(currentClaim.status)}>
                    {getStatusIcon(currentClaim.status)}
                    <span className="ml-1 capitalize">{currentClaim.status.replace('_', ' ')}</span>
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Claim Overview */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column - Claim Details */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Claim Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Claim Amount:</span>
                      <span className="font-semibold text-green-600">
                        {currentClaim.claimAmount.toLocaleString()} RWF
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Policy ID:</span>
                      <span className="font-medium">{currentClaim.policyId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Crop Type:</span>
                      <span className="font-medium">{currentClaim.cropType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Incident Date:</span>
                      <span className="font-medium">{currentClaim.incidentDate}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Farmer Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{currentClaim.farmerName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">ID: {currentClaim.farmerId}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{currentClaim.location}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="outline">
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column - Assessment & Actions */}
              <div className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Assessment Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{currentClaim.assessorName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">ID: {currentClaim.assessorId}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Button size="sm" variant="outline">
                      <Phone className="h-3 w-3 mr-1" />
                      Contact Assessor
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {currentClaim.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-4 border-t">
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  // Navigate to detailed claim review page
                  window.location.href = `/claim-review/${currentClaim.id}`;
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Review Full Details
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                View Documents
              </Button>
              <Button variant="outline">
                <MapPin className="h-4 w-4 mr-2" />
                View Location
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2">
        {claims.map((_, index) => (
          <button
            key={index}
            onClick={() => goToClaim(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex 
                ? "bg-blue-600" 
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {claims.filter(c => c.status === 'pending_review').length}
            </div>
            <p className="text-sm text-gray-600">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {claims.filter(c => c.status === 'under_investigation').length}
            </div>
            <p className="text-sm text-gray-600">Under Investigation</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {claims.filter(c => c.status === 'approved').length}
            </div>
            <p className="text-sm text-gray-600">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {claims.filter(c => c.status === 'rejected').length}
            </div>
            <p className="text-sm text-gray-600">Rejected</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
