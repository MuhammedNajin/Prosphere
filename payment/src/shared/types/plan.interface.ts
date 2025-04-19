import { PlanType } from "./enums";

export interface IPlanFeaturesLimit {
  jobPostLimit: number;
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
  createdAt: Date;
  updatedAt: Date;
}