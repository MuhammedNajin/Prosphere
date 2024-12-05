import { IPlan } from "@/shared/types/plan.interface";

export interface IPlanRepository {
    createPlan(planDTO: IPlan): Promise<void>
} 