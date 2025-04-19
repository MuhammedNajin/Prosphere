import { IJobsSeenUseCase } from "../../interface/jobUsecase_interface";
import { IJobRepository } from "@domain/interface/IJobRepository";

export class JobSeenUseCase implements IJobsSeenUseCase {
  constructor(private jobRepository: IJobRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    return this.jobRepository.jobSeen(id, userId);
  }
}
