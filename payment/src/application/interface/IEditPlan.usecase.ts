import { IPlan } from "@/shared/types/plan.interface";


export interface IEditPlanCase {
    execute(id: number, PlanDTO: IPlan): Promise<IPlan | null>
}