"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload, UploadedFile } from "@/components/upload/FileUpload";
import { MapPicker } from "@/components/maps/MapPicker";
import { useState } from "react";
import { Calendar, MapPin, Upload, CheckCircle } from "lucide-react";

export type AssessmentInput = {
  season: "A" | "B" | "C";
  plantingDate: string;
  harvestEta: string;
  cropVariety: string;
  tilling: string;
  fertilizer: { type: string; schedule: string };
  irrigation: string;
  pestControl: string;
  comments: string;
  files: UploadedFile[];
  coords: [number, number];
  farmSize: number;
  soilType: string;
  previousCrop: string;
  expectedYield: number;
  riskFactors: string[];
};

interface AssessmentFormProps {
  onSubmit: (data: AssessmentInput) => void;
  initialData?: Partial<AssessmentInput>;
  isReadOnly?: boolean;
}

export function AssessmentForm({ onSubmit, initialData, isReadOnly = false }: AssessmentFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AssessmentInput>({
    defaultValues: {
      season: "A",
      coords: [30.1, -1.95],
      farmSize: 0,
      expectedYield: 0,
      riskFactors: [],
      ...initialData,
    }
  });

  const [qaChecklist, setQaChecklist] = useState({
    photosTaken: false,
    coordinatesVerified: false,
    farmerInterviewed: false,
    documentsCollected: false,
    riskFactorsAssessed: false,
  });

  const watchedValues = watch();

  const handleFileUpload = (files: UploadedFile[]) => {
    setValue("files", files);
  };

  const handleCoordinatesChange = (coords: [number, number]) => {
    setValue("coords", coords);
  };

  const handleRiskFactorChange = (factor: string, checked: boolean) => {
    const currentFactors = watchedValues.riskFactors || [];
    if (checked) {
      setValue("riskFactors", [...currentFactors, factor]);
    } else {
      setValue("riskFactors", currentFactors.filter(f => f !== factor));
    }
  };

  const isQaComplete = Object.values(qaChecklist).every(Boolean);

  const riskFactorOptions = [
    "Poor soil quality",
    "Inadequate irrigation",
    "Pest infestation history",
    "Disease susceptibility",
    "Weather exposure",
    "Theft risk",
    "Market access issues",
    "Storage limitations",
  ];

  if (isReadOnly) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Assessment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium">Season</Label>
                <p className="text-sm text-muted-foreground">{watchedValues.season}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Planting Date</Label>
                <p className="text-sm text-muted-foreground">{watchedValues.plantingDate}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Crop Variety</Label>
                <p className="text-sm text-muted-foreground">{watchedValues.cropVariety}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Expected Yield</Label>
                <p className="text-sm text-muted-foreground">{watchedValues.expectedYield} kg/ha</p>
              </div>
            </div>
            
            {watchedValues.comments && (
              <div>
                <Label className="text-sm font-medium">Comments</Label>
                <p className="text-sm text-muted-foreground">{watchedValues.comments}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="season">Season</Label>
                <Select value={watchedValues.season} onValueChange={(value) => setValue("season", value as "A" | "B" | "C")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Season A (March - July)</SelectItem>
                    <SelectItem value="B">Season B (September - January)</SelectItem>
                    <SelectItem value="C">Season C (Year-round)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="plantingDate">Planting Date</Label>
                <Input
                  id="plantingDate"
                  type="date"
                  {...register("plantingDate", { required: "Planting date is required" })}
                />
                {errors.plantingDate && (
                  <p className="text-sm text-red-500">{errors.plantingDate.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="harvestEta">Expected Harvest</Label>
                <Input
                  id="harvestEta"
                  type="date"
                  {...register("harvestEta", { required: "Harvest date is required" })}
                />
                {errors.harvestEta && (
                  <p className="text-sm text-red-500">{errors.harvestEta.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cropVariety">Crop Variety</Label>
                <Input
                  id="cropVariety"
                  placeholder="Enter crop variety"
                  {...register("cropVariety", { required: "Crop variety is required" })}
                />
                {errors.cropVariety && (
                  <p className="text-sm text-red-500">{errors.cropVariety.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="expectedYield">Expected Yield (kg/ha)</Label>
                <Input
                  id="expectedYield"
                  type="number"
                  placeholder="Enter expected yield"
                  {...register("expectedYield", { 
                    required: "Expected yield is required",
                    valueAsNumber: true,
                    min: { value: 0, message: "Yield must be positive" }
                  })}
                />
                {errors.expectedYield && (
                  <p className="text-sm text-red-500">{errors.expectedYield.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Farm Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Farm Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MapPicker
              value={watchedValues.coords}
              onChange={handleCoordinatesChange}
              className="h-64 w-full rounded-xl"
            />
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="farmSize">Farm Size (Hectares)</Label>
                <Input
                  id="farmSize"
                  type="number"
                  step="0.1"
                  placeholder="Enter farm size"
                  {...register("farmSize", { 
                    required: "Farm size is required",
                    valueAsNumber: true,
                    min: { value: 0.1, message: "Farm size must be at least 0.1 hectares" }
                  })}
                />
                {errors.farmSize && (
                  <p className="text-sm text-red-500">{errors.farmSize.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="soilType">Soil Type</Label>
                <Select value={watchedValues.soilType} onValueChange={(value) => setValue("soilType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clay">Clay</SelectItem>
                    <SelectItem value="sandy">Sandy</SelectItem>
                    <SelectItem value="loamy">Loamy</SelectItem>
                    <SelectItem value="rocky">Rocky</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Farming Practices */}
        <Card>
          <CardHeader>
            <CardTitle>Farming Practices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tilling">Tilling Method</Label>
                <Select value={watchedValues.tilling} onValueChange={(value) => setValue("tilling", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tilling method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conventional">Conventional</SelectItem>
                    <SelectItem value="conservation">Conservation</SelectItem>
                    <SelectItem value="no-till">No-till</SelectItem>
                    <SelectItem value="minimum">Minimum tillage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="previousCrop">Previous Crop</Label>
                <Input
                  id="previousCrop"
                  placeholder="Enter previous crop"
                  {...register("previousCrop")}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fertilizerType">Fertilizer Type</Label>
                <Input
                  id="fertilizerType"
                  placeholder="e.g., NPK, Organic, Urea"
                  {...register("fertilizer.type")}
                />
              </div>
              
              <div>
                <Label htmlFor="fertilizerSchedule">Fertilizer Schedule</Label>
                <Input
                  id="fertilizerSchedule"
                  placeholder="e.g., Every 2 weeks"
                  {...register("fertilizer.schedule")}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="irrigation">Irrigation Method</Label>
                <Select value={watchedValues.irrigation} onValueChange={(value) => setValue("irrigation", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select irrigation method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rainfed">Rainfed</SelectItem>
                    <SelectItem value="drip">Drip irrigation</SelectItem>
                    <SelectItem value="sprinkler">Sprinkler</SelectItem>
                    <SelectItem value="flood">Flood irrigation</SelectItem>
                    <SelectItem value="manual">Manual watering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="pestControl">Pest Control</Label>
                <Select value={watchedValues.pestControl} onValueChange={(value) => setValue("pestControl", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pest control method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chemical">Chemical pesticides</SelectItem>
                    <SelectItem value="organic">Organic methods</SelectItem>
                    <SelectItem value="biological">Biological control</SelectItem>
                    <SelectItem value="integrated">Integrated pest management</SelectItem>
                    <SelectItem value="none">No pest control</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Label>Risk Factors (Select all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {riskFactorOptions.map((factor) => (
                  <div key={factor} className="flex items-center space-x-2">
                    <Checkbox
                      id={factor}
                      checked={watchedValues.riskFactors?.includes(factor) || false}
                      onCheckedChange={(checked) => 
                        handleRiskFactorChange(factor, checked as boolean)
                      }
                    />
                    <Label htmlFor={factor} className="text-sm">
                      {factor}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Documentation & Evidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload
              onDone={handleFileUpload}
              accept="image/*,video/*,.pdf,.doc,.docx"
              maxFiles={20}
              maxSize={50}
            />
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter any additional observations, concerns, or recommendations..."
              className="min-h-[100px]"
              {...register("comments")}
            />
          </CardContent>
        </Card>

        {/* QA Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Quality Assurance Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(qaChecklist).map(([key, checked]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={checked}
                    onCheckedChange={(checked) => 
                      setQaChecklist(prev => ({ ...prev, [key]: checked as boolean }))
                    }
                  />
                  <Label htmlFor={key} className="text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </Label>
                </div>
              ))}
            </div>
            
            {!isQaComplete && (
              <p className="text-sm text-amber-600 mt-3">
                Please complete all checklist items before submitting
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Save Draft
          </Button>
          <Button 
            type="submit" 
            disabled={!isQaComplete}
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Submit Assessment
          </Button>
        </div>
      </form>
    </div>
  );
}
