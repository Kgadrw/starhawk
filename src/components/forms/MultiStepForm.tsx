"use client";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useState } from "react";

const FarmerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(8, "Phone must be at least 8 characters"),
  upi: z.string().min(6, "UPI must be at least 6 characters"),
  farm: z.object({
    coords: z.tuple([z.number(), z.number()]),
    sizeHa: z.number().positive("Farm size must be positive"),
    ownershipDocUrl: z.string().url().optional(),
  }),
});

const InsurerSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  licenseNumber: z.string().min(5, "License number must be at least 5 characters"),
  contactPerson: z.string().min(2, "Contact person must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone must be at least 8 characters"),
  address: z.string().min(10, "Address must be at least 10 characters"),
});

export type FarmerInput = z.infer<typeof FarmerSchema>;
export type InsurerInput = z.infer<typeof InsurerSchema>;

interface MultiStepFormProps {
  type: "farmer" | "insurer";
  onSubmit: (data: FarmerInput | InsurerInput) => void;
  onBack?: () => void;
}

export function MultiStepForm({ type, onSubmit, onBack }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const farmerMethods = useForm<FarmerInput>({ 
    resolver: zodResolver(FarmerSchema),
    defaultValues: {
      farm: {
        coords: [30.1, -1.95], // Default to Rwanda coordinates
        sizeHa: 0,
      }
    }
  });
  
  const insurerMethods = useForm<InsurerInput>({ 
    resolver: zodResolver(InsurerSchema)
  });

  const methods = type === "farmer" ? farmerMethods : insurerMethods;
  const { handleSubmit, trigger, formState: { isValid } } = methods;

  const steps = type === "farmer" 
    ? [
        { title: "Personal Info", description: "Basic information" },
        { title: "Farm Location", description: "Map picker and coordinates" },
        { title: "Farm Details", description: "Size and ownership" },
        { title: "Review", description: "Confirm your information" }
      ]
    : [
        { title: "Company Info", description: "Business details" },
        { title: "Contact Details", description: "Contact information" },
        { title: "License & Address", description: "Verification documents" },
        { title: "Review", description: "Confirm your information" }
      ];

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (onBack) {
      onBack();
    }
  };

  const getFieldsForStep = (step: number): (keyof FarmerInput | keyof InsurerInput)[] => {
    if (type === "farmer") {
      switch (step) {
        case 0: return ["name", "phone", "upi"];
        case 1: return ["farm.coords"];
        case 2: return ["farm.sizeHa", "farm.ownershipDocUrl"];
        default: return [];
      }
    } else {
      switch (step) {
        case 0: return ["companyName", "licenseNumber"];
        case 1: return ["contactPerson", "email", "phone"];
        case 2: return ["address"];
        default: return [];
      }
    }
  };

  const renderStepContent = () => {
    if (type === "farmer") {
      return <FarmerStepContent step={currentStep} />;
    } else {
      return <InsurerStepContent step={currentStep} />;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="space-y-2">
            <CardTitle className="text-2xl">
              {type === "farmer" ? "Farmer" : "Insurer"} Onboarding
            </CardTitle>
            <p className="text-muted-foreground">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </p>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {renderStepContent()}
              
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {currentStep === 0 ? "Back" : "Previous"}
                </Button>
                
                {currentStep === steps.length - 1 ? (
                  <Button type="submit" className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Complete Registration
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}

// Farmer step components
function FarmerStepContent({ step }: { step: number }) {
  const { register, watch, setValue } = useForm<FarmerInput>();
  
  switch (step) {
    case 0:
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              {...register("name")}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <input
              {...register("phone")}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="+250 XXX XXX XXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">UPI ID</label>
            <input
              {...register("upi")}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your UPI ID"
            />
          </div>
        </div>
      );
    
    case 1:
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Farm Location</label>
            <p className="text-sm text-muted-foreground mb-4">
              Click on the map to select your farm location
            </p>
            <div className="h-64 w-full rounded-xl border bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Map Picker Component</p>
            </div>
          </div>
        </div>
      );
    
    case 2:
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Farm Size (Hectares)</label>
            <input
              {...register("farm.sizeHa", { valueAsNumber: true })}
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter farm size in hectares"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Ownership Document (Optional)</label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground">Upload ownership document</p>
            </div>
          </div>
        </div>
      );
    
    case 3:
      const formData = watch();
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Review Your Information</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Phone:</strong> {formData.phone}</p>
            <p><strong>UPI:</strong> {formData.upi}</p>
            <p><strong>Farm Size:</strong> {formData.farm?.sizeHa} hectares</p>
            <p><strong>Coordinates:</strong> {formData.farm?.coords?.join(", ")}</p>
          </div>
        </div>
      );
    
    default:
      return null;
  }
}

// Insurer step components
function InsurerStepContent({ step }: { step: number }) {
  const { register, watch } = useForm<InsurerInput>();
  
  switch (step) {
    case 0:
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Company Name</label>
            <input
              {...register("companyName")}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter company name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">License Number</label>
            <input
              {...register("licenseNumber")}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter insurance license number"
            />
          </div>
        </div>
      );
    
    case 1:
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Contact Person</label>
            <input
              {...register("contactPerson")}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter contact person name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              {...register("phone")}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="+250 XXX XXX XXX"
            />
          </div>
        </div>
      );
    
    case 2:
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <textarea
              {...register("address")}
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              placeholder="Enter company address"
            />
          </div>
        </div>
      );
    
    case 3:
      const formData = watch();
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Review Your Information</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Company:</strong> {formData.companyName}</p>
            <p><strong>License:</strong> {formData.licenseNumber}</p>
            <p><strong>Contact:</strong> {formData.contactPerson}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Phone:</strong> {formData.phone}</p>
            <p><strong>Address:</strong> {formData.address}</p>
          </div>
        </div>
      );
    
    default:
      return null;
  }
}
