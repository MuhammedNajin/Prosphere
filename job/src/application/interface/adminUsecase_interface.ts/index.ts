export interface IJobStatsUseCase{
    execute(): Promise<void>;
}


export default interface UseCase {
     jobStatsUseCase: JobStatsUseCase
}