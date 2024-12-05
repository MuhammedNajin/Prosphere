
export enum PlanType {
    BASIC = 'basic',
    PREMIUM = 'premium'
}

export interface IPlan {
  id: number;
  name: string;
  price: number;
  type: PlanType;
  durationInDays: number;
  jobPostLimit: number;
  features: string[];
}


export class PlanFeaturesLimit {
    JobPostLimit: number;
    resumeAccess: number;
    videoCallLimit: number;
  
    constructor(props: PlanFeaturesLimit) {
      Object.assign(this, props);
    }
  }