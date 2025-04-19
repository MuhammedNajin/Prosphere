import { IGetCommentUseCase} from '../../interface/jobUsecase_interface'
import {  IComment } from '@domain/interface/IEntity'
import { IJobRepository } from '@domain/interface/IJobRepository'


export class GetCommentUseCase implements IGetCommentUseCase {
  
  constructor(private jobRepository: IJobRepository) {}

  async execute(jobId: string): Promise<IComment[]> {
    return await this.jobRepository.getComment(jobId)
  }
}
