import { IJobStatsUseCase } from '@/application/interface/adminUsecase_interface.ts';
import { IAddCommentUseCase } from '../../interface/jobUsecase_interface'
import {  IComment } from '@domain/interface/IEntity'
import { IJobRepository } from '@/domain/interface/IJobRepository';



export class JobStatsUseCase  implements IJobStatsUseCase {
  
  constructor(private jobRepository: IJobRepository) {}

  async execute(): Promise<void> {
    return await this.jobRepository.getJobStats()
  }
}
