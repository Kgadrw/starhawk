"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Calendar, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  Clock
} from "lucide-react";
import { Assessment } from "@/types/api";
import { cn } from "@/lib/utils";

interface RiskCardProps {
  assessment: Assessment;
  onViewDetails: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDownload: (id: string) => void;
}

export function RiskCard({ 
  assessment, 
  onViewDetails, 
  onApprove, 
  onReject, 
  onDownload 
}: RiskCardProps) {
  const riskScore = assessment.riskScore || 0;
  const riskLevel = riskScore >= 80 ? "high" : riskScore >= 50 ? "medium" : "low";
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "high": return <AlertTriangle className="h-4 w-4" />;
      case "medium": return <Clock className="h-4 w-4" />;
      case "low": return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800";
      case "submitted": return "bg-blue-100 text-blue-800";
      case "returned": return "bg-yellow-100 text-yellow-800";
      case "final": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">
              {assessment.farmerName}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{assessment.coords[0].toFixed(4)}, {assessment.coords[1].toFixed(4)}</span>
            </div>
          </div>
          <Badge className={cn("text-xs", getStatusColor(assessment.qaStatus))}>
            {assessment.qaStatus}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Risk Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Risk Score</span>
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              getRiskColor(riskLevel)
            )}>
              {getRiskIcon(riskLevel)}
              {riskScore}/100
            </div>
          </div>
          <Progress 
            value={riskScore} 
            className="h-2"
            // @ts-ignore - custom color based on risk level
            style={{
              '--progress-background': riskLevel === 'high' ? '#ef4444' : 
                                     riskLevel === 'medium' ? '#f59e0b' : '#10b981'
            }}
          />
        </div>

        {/* Key Information */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Season:</span>
            <span className="font-medium">{assessment.season}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Crop:</span>
            <span className="font-medium">{assessment.cropVariety}</span>
          </div>
        </div>

        {/* Risk Flags */}
        {assessment.flags && assessment.flags.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-red-600">Risk Flags:</span>
            <div className="flex flex-wrap gap-1">
              {assessment.flags.slice(0, 3).map((flag, index) => (
                <Badge key={index} variant="destructive" className="text-xs">
                  {flag}
                </Badge>
              ))}
              {assessment.flags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{assessment.flags.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Files Count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Files: {assessment.files.length}</span>
          {assessment.files.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {assessment.files.filter(f => f.type.startsWith('image/')).length} photos
            </Badge>
          )}
        </div>

        {/* Timeline */}
        <div className="text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Created: {formatDate(assessment.createdAt)}</span>
            <span>Updated: {formatDate(assessment.updatedAt)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(assessment.id)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload(assessment.id)}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>

        {/* Decision Buttons */}
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onReject(assessment.id)}
            className="flex-1"
            disabled={assessment.qaStatus === 'final'}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Reject
          </Button>
          <Button
            size="sm"
            onClick={() => onApprove(assessment.id)}
            className="flex-1"
            disabled={assessment.qaStatus === 'final'}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Approve
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Risk comparison component for historical data
export function RiskComparison({ 
  current, 
  historical 
}: { 
  current: number; 
  historical: number[] 
}) {
  const avgHistorical = historical.reduce((a, b) => a + b, 0) / historical.length;
  const trend = current > avgHistorical ? 'up' : 'down';
  const change = Math.abs(current - avgHistorical);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">vs Historical Avg</span>
        <div className="flex items-center gap-1">
          {trend === 'up' ? (
            <TrendingUp className="h-4 w-4 text-red-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-green-500" />
          )}
          <span className={cn(
            "font-medium",
            trend === 'up' ? "text-red-600" : "text-green-600"
          )}>
            {change.toFixed(1)} pts
          </span>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        Current: {current} | Avg: {avgHistorical.toFixed(1)}
      </div>
    </div>
  );
}
