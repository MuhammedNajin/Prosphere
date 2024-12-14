import { PlanType } from "@/shared/types/enums";
import { IPlanFeaturesLimit } from "@/shared/types/plan.interface";


export class PlanEntity {
    readonly id: number;
    readonly name: string;
    readonly price: number;
    readonly type: PlanType;
    readonly durationInDays: number;
    readonly featuresLimit: IPlanFeaturesLimit;
    readonly features: string[];
  
    constructor(props: Omit<PlanEntity, 'id'>) {
      Object.assign(this, props);
      Object.freeze(this);
    }
  
    static create(props: Omit<PlanEntity, 'id'>): PlanEntity {
      const plan = new PlanEntity(props);
      return Object.freeze(plan);
    }

  }