import { IPlan } from "@/shared/types/plan.interface";

export interface IPlanRepository {
    createPlan(planDTO: IPlan): Promise<IPlan>
    get(): Promise<IPlan[] | null>
    getPlan(id: number): Promise<IPlan | null>
    editPlan(id: number, query: object): Promise<IPlan | null>
    deletePlan(id: number): Promise<void>
} 