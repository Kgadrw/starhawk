"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RiskCard, RiskComparison } from "@/components/underwriter/RiskCard";
import { Assessment } from "@/types/api";
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  MapPin
} from "lucide-react";

export function UnderwriterDashboard() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in real app, fetch from API
  useEffect(() => {
    const mockAssessments: Assessment[] = [
      {
        id: "1",
        requestId: "req-1",
        farmerId: "farmer-1",
        farmerName: "Jean Baptiste",
        season: "A",
        plantingDate: "2024-03-15",
        harvestEta: "2024-07-15",
        cropVariety: "Maize Hybrid",
        practices: {
          tilling: "conventional",
          fertilizer: { type: "NPK", schedule: "Every 3 weeks" },
          irrigation: "rainfed",
          pestControl: "chemical"
        },
        files: [
          { name: "farm_photo_1.jpg", url: "/mock-url", type: "image/jpeg", size: 1024000 },
          { name: "soil_test.pdf", url: "/mock-url", type: "application/pdf", size: 512000 }
        ],
        comments: "Good soil quality, adequate irrigation setup",
        qaStatus: "submitted",
        riskScore: 75,
        flags: ["High rainfall risk", "Pest history"],
        coords: [30.1234, -1.9876],
        createdAt: "2024-03-10T10:00:00Z",
        updatedAt: "2024-03-12T14:30:00Z"
      },
      {
        id: "2",
        requestId: "req-2",
        farmerId: "farmer-2",
        farmerName: "Marie Claire",
        season: "B",
        plantingDate: "2024-09-01",
        harvestEta: "2024-12-15",
        cropVariety: "Rice",
        practices: {
          tilling: "conservation",
          fertilizer: { type: "Organic", schedule: "Monthly" },
          irrigation: "drip",
          pestControl: "integrated"
        },
        files: [
          { name: "rice_field.jpg", url: "/mock-url", type: "image/jpeg", size: 2048000 },
          { name: "irrigation_setup.jpg", url: "/mock-url", type: "image/jpeg", size: 1536000 }
        ],
        comments: "Excellent farming practices, low risk profile",
        qaStatus: "submitted",
        riskScore: 25,
        flags: [],
        coords: [30.2345, -1.8765],
        createdAt: "2024-08-28T09:15:00Z",
        updatedAt: "2024-08-30T11:45:00Z"
      },
      {
        id: "3",
        requestId: "req-3",
        farmerId: "farmer-3",
        farmerName: "Paul Nkurunziza",
        season: "A",
        plantingDate: "2024-03-20",
        harvestEta: "2024-07-20",
        cropVariety: "Beans",
        practices: {
          tilling: "minimum",
          fertilizer: { type: "Urea", schedule: "Bi-weekly" },
          irrigation: "manual",
          pestControl: "chemical"
        },
        files: [
          { name: "beans_field.jpg", url: "/mock-url", type: "image/jpeg", size: 1024000 }
        ],
        comments: "Small farm, basic setup, moderate risk",
        qaStatus: "returned",
        riskScore: 60,
        flags: ["Limited irrigation", "Small farm size"],
        coords: [30.3456, -1.7654],
        createdAt: "2024-03-18T14:20:00Z",
        updatedAt: "2024-03-20T16:10:00Z"
      }
    ];

    setTimeout(() => {
      setAssessments(mockAssessments);
      setFilteredAssessments(mockAssessments);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter assessments
  useEffect(() => {
    let filtered = assessments;

    if (searchTerm) {
      filtered = filtered.filter(assessment =>
        assessment.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.cropVariety.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(assessment => assessment.qaStatus === statusFilter);
    }

    if (riskFilter !== "all") {
      filtered = filtered.filter(assessment => {
        const riskScore = assessment.riskScore || 0;
        switch (riskFilter) {
          case "low": return riskScore < 50;
          case "medium": return riskScore >= 50 && riskScore < 80;
          case "high": return riskScore >= 80;
          default: return true;
        }
      });
    }

    setFilteredAssessments(filtered);
  }, [assessments, searchTerm, statusFilter, riskFilter]);

  const handleViewDetails = (id: string) => {
    console.log("View details for assessment:", id);
    // Navigate to detailed view
  };

  const handleApprove = (id: string) => {
    setAssessments(prev => 
      prev.map(a => a.id === id ? { ...a, qaStatus: "final" as const } : a)
    );
  };

  const handleReject = (id: string) => {
    setAssessments(prev => 
      prev.map(a => a.id === id ? { ...a, qaStatus: "returned" as const } : a)
    );
  };

  const handleDownload = (id: string) => {
    console.log("Download assessment:", id);
    // Trigger PDF download
  };

  const getStats = () => {
    const total = assessments.length;
    const pending = assessments.filter(a => a.qaStatus === "submitted").length;
    const approved = assessments.filter(a => a.qaStatus === "final").length;
    const returned = assessments.filter(a => a.qaStatus === "returned").length;
    const avgRisk = assessments.reduce((sum, a) => sum + (a.riskScore || 0), 0) / total || 0;

    return { total, pending, approved, returned, avgRisk };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Risk Assessment Queue</h1>
          <p className="text-muted-foreground">
            Review and approve farm assessments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Assessments</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Risk Score</p>
                <p className="text-2xl font-bold">{stats.avgRisk.toFixed(0)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by farmer name or crop variety..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
                <SelectItem value="final">Final</SelectItem>
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low Risk (&lt;50)</SelectItem>
                <SelectItem value="medium">Medium Risk (50-80)</SelectItem>
                <SelectItem value="high">High Risk (&gt;80)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assessments Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredAssessments.map((assessment) => (
          <RiskCard
            key={assessment.id}
            assessment={assessment}
            onViewDetails={handleViewDetails}
            onApprove={handleApprove}
            onReject={handleReject}
            onDownload={handleDownload}
          />
        ))}
      </div>

      {filteredAssessments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No assessments found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or check back later for new assessments.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
