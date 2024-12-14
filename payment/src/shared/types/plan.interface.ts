import { PlanType } from "./enums";
import { ISubscription } from "./subscription.interface";
export interface IPlanFeaturesLimit {
  jobPostLimit: number;
  resumeAccess: number;
  videoCallLimit: number;
  candidateNotes: boolean;
}

export interface IPlan {
  id: number;
  name: string;
  price: number;
  type: PlanType;
  durationInDays: number;
  featuresLimit: IPlanFeaturesLimit;
  features: string[];
  isActive: boolean;
}