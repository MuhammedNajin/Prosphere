import { IPlan } from "@/shared/types/plan.interface";


export interface ICreatePlanCase {
    execute(PlanDTO: IPlan): Promise<Iplan>
}