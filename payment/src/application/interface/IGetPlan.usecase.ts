import { IPlan } from "@/shared/types/plan.interface";

export interface IGetPlanUseCase {
    execute(): Promise<IPlan[] | null>
}