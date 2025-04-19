import { ILikeJobUseCase } from '../../interface/jobUsecase_interface'
import { IJobRepository } from '@domain/interface/IJobRepository'


export class LikeJobUseCase implements ILikeJobUseCase {
  
  constructor(private commentRepository: IJobRepository) {}

 async execute(jobId: string, userId: string): Promise<unknown> {
     return await this.commentRepository.jobLikeToggle(jobId, userId)
 }
}
