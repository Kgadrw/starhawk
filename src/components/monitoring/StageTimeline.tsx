"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MonitoringStage } from "@/types/api";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Camera, 
  MapPin, 
  TrendingUp,
  Calendar,
  BarChart3,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StageTimelineProps {
  stages: MonitoringStage[];
  onStageClick?: (stageId: string) => void;
  className?: string;
}

export function StageTimeline({ stages, onStageClick, className }: StageTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      case "pending":
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200";
      case "in_progress":
        return "bg-blue-50 border-blue-200";
      case "pending":
        return "bg-gray-50 border-gray-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Crop Monitoring Timeline</h2>
        <Badge variant="outline" className="flex items-center gap-1">
          <BarChart3 className="h-4 w-4" />
          {stages.filter(s => s.status === "completed").length} of {stages.length} completed
        </Badge>
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => (
          <Card 
            key={stage.name} 
            className={cn(
              "transition-all duration-200 hover:shadow-md cursor-pointer",
              getStatusColor(stage.status)
            )}
            onClick={() => onStageClick?.(stage.name)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-current">
                    <span className="text-sm font-bold text-current">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{stage.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Updated {formatDate(stage.lastUpdated)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(stage.status)}
                  <Badge 
                    variant={stage.status === "completed" ? "default" : "secondary"}
                    className={cn(
                      stage.status === "completed" && "bg-green-100 text-green-800",
                      stage.status === "in_progress" && "bg-blue-100 text-blue-800"
                    )}
                  >
                    {stage.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* KPIs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stage.kpis.map((kpi, kpiIndex) => (
                  <div key={kpiIndex} className="bg-white/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        {kpi.label}
                      </span>
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      {kpi.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Images Gallery */}
              {stage.images && stage.images.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <ImageIcon className="h-4 w-4" />
                    <span>Recent Images ({stage.images.length})</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {stage.images.slice(0, 3).map((image, imgIndex) => (
                      <div 
                        key={imgIndex}
                        className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden"
                      >
                        <Camera className="h-6 w-6 text-muted-foreground" />
                      </div>
                    ))}
                    {stage.images.length > 3 && (
                      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">
                          +{stage.images.length - 3} more
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {stage.notes && (
                <div className="bg-white/50 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">
                    <strong>Notes:</strong> {stage.notes}
                  </p>
                </div>
              )}

              {/* Progress Bar for In-Progress Stages */}
              {stage.status === "in_progress" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                >
                  <Camera className="h-4 w-4 mr-1" />
                  Add Images
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall Progress */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Overall Progress</h3>
              <span className="text-sm text-muted-foreground">
                {stages.filter(s => s.status === "completed").length} of {stages.length} stages
              </span>
            </div>
            <Progress 
              value={(stages.filter(s => s.status === "completed").length / stages.length) * 100} 
              className="h-3"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Planting</span>
              <span>Harvest</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Mock data generator for testing
export function generateMockStages(): MonitoringStage[] {
  return [
    {
      name: "Planting",
      kpis: [
        { label: "Seeds Planted", value: "1,200" },
        { label: "Germination Rate", value: "95%" },
        { label: "Soil Moisture", value: "78%" },
        { label: "Temperature", value: "24°C" }
      ],
      lastUpdated: "2024-03-15T08:00:00Z",
      status: "completed",
      images: [
        { name: "planting_1.jpg", url: "/mock-url" },
        { name: "planting_2.jpg", url: "/mock-url" }
      ],
      notes: "Excellent soil preparation and seed placement. All seeds planted within optimal timeframe."
    },
    {
      name: "Germination",
      kpis: [
        { label: "Germination Rate", value: "92%" },
        { label: "Plant Density", value: "4.2/m²" },
        { label: "Soil Moisture", value: "82%" },
        { label: "Growth Stage", value: "VE" }
      ],
      lastUpdated: "2024-03-25T10:30:00Z",
      status: "completed",
      images: [
        { name: "germination_1.jpg", url: "/mock-url" },
        { name: "germination_2.jpg", url: "/mock-url" },
        { name: "germination_3.jpg", url: "/mock-url" }
      ],
      notes: "Strong germination with uniform emergence. Minor gaps noted in section 3."
    },
    {
      name: "Vegetation",
      kpis: [
        { label: "Plant Height", value: "45cm" },
        { label: "Leaf Count", value: "8-10" },
        { label: "NDVI Index", value: "0.78" },
        { label: "Pest Pressure", value: "Low" }
      ],
      lastUpdated: "2024-04-10T14:15:00Z",
      status: "in_progress",
      images: [
        { name: "vegetation_1.jpg", url: "/mock-url" },
        { name: "vegetation_2.jpg", url: "/mock-url" }
      ],
      notes: "Healthy vegetative growth. Monitoring for pest activity."
    },
    {
      name: "Flowering",
      kpis: [
        { label: "Flower Count", value: "N/A" },
        { label: "Pollen Shed", value: "N/A" },
        { label: "NDVI Index", value: "N/A" },
        { label: "Weather Risk", value: "Medium" }
      ],
      lastUpdated: "2024-04-15T09:00:00Z",
      status: "pending",
      images: [],
      notes: "Awaiting flowering stage. Expected in 5-7 days based on current growth rate."
    }
  ];
}
