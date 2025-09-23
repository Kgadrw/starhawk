"use client";
import { CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatusStep {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed" | "error";
  timestamp?: string;
}

interface StatusTrackerProps {
  steps: StatusStep[];
  currentStep?: number;
  className?: string;
}

export function StatusTracker({ steps, currentStep, className }: StatusTrackerProps) {
  const getStepIcon = (step: StatusStep, index: number) => {
    const isCurrent = currentStep === index;
    const isCompleted = step.status === "completed";
    const isError = step.status === "error";
    const isInProgress = step.status === "in_progress" || isCurrent;

    if (isError) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    if (isCompleted) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (isInProgress) {
      return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
    }
    return <Clock className="h-5 w-5 text-muted-foreground" />;
  };

  const getStepStatus = (step: StatusStep, index: number) => {
    const isCurrent = currentStep === index;
    const isCompleted = step.status === "completed";
    const isError = step.status === "error";
    const isInProgress = step.status === "in_progress" || isCurrent;

    if (isError) return "error";
    if (isCompleted) return "completed";
    if (isInProgress) return "in_progress";
    return "pending";
  };

  return (
    <div className={cn("w-full", className)}>
      <ol className="relative">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(step, index);
          const isLast = index === steps.length - 1;

          return (
            <li key={step.id} className="relative pb-8">
              {!isLast && (
                <div
                  className={cn(
                    "absolute left-2.5 top-8 h-full w-0.5",
                    stepStatus === "completed" || stepStatus === "error"
                      ? "bg-green-200"
                      : "bg-muted"
                  )}
                />
              )}
              
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border-2",
                    stepStatus === "completed"
                      ? "border-green-500 bg-green-50"
                      : stepStatus === "error"
                      ? "border-red-500 bg-red-50"
                      : stepStatus === "in_progress"
                      ? "border-blue-500 bg-blue-50"
                      : "border-muted-foreground bg-background"
                  )}
                >
                  {getStepIcon(step, index)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3
                      className={cn(
                        "text-sm font-medium",
                        stepStatus === "completed"
                          ? "text-green-900"
                          : stepStatus === "error"
                          ? "text-red-900"
                          : stepStatus === "in_progress"
                          ? "text-blue-900"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </h3>
                    {step.timestamp && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(step.timestamp).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  {step.description && (
                    <p
                      className={cn(
                        "text-xs mt-1",
                        stepStatus === "completed"
                          ? "text-green-700"
                          : stepStatus === "error"
                          ? "text-red-700"
                          : stepStatus === "in_progress"
                          ? "text-blue-700"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// Predefined step configurations for different workflows
export const POLICY_REQUEST_STEPS: StatusStep[] = [
  {
    id: "submitted",
    title: "Request Submitted",
    description: "Your policy request has been submitted and is under review",
    status: "completed",
  },
  {
    id: "assigned",
    title: "Surveyor Assigned",
    description: "A surveyor has been assigned to assess your farm",
    status: "in_progress",
  },
  {
    id: "assessment",
    title: "Farm Assessment",
    description: "Surveyor is conducting on-site assessment",
    status: "pending",
  },
  {
    id: "underwriting",
    title: "Underwriting Review",
    description: "Risk assessment and policy approval process",
    status: "pending",
  },
  {
    id: "approved",
    title: "Policy Approved",
    description: "Your policy has been approved and is now active",
    status: "pending",
  },
];

export const CLAIM_STEPS: StatusStep[] = [
  {
    id: "submitted",
    title: "Claim Submitted",
    description: "Your claim has been submitted and is under review",
    status: "completed",
  },
  {
    id: "verification",
    title: "Damage Verification",
    description: "Surveyor is verifying the reported damage",
    status: "in_progress",
  },
  {
    id: "assessment",
    title: "Loss Assessment",
    description: "Detailed assessment of crop damage and losses",
    status: "pending",
  },
  {
    id: "approval",
    title: "Claim Approval",
    description: "Claim is being reviewed for approval",
    status: "pending",
  },
  {
    id: "payment",
    title: "Payment Processed",
    description: "Payment has been processed and sent to your account",
    status: "pending",
  },
];
