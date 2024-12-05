
export interface ICreatePlanCase {
    execute(PlanDTO): Promise<void>
}