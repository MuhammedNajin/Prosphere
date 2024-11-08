import { IAddCommentUseCase } from '../../interface/jobUsecase_interface'
import {  IComment } from '@domain/interface/IEntity'
import { IJobRepository } from '@domain/interface/IJobRepository'


export class AddCommentUseCase implements IAddCommentUseCase {
  
  constructor(private commentRepository: IJobRepository) {}

  async execute(comment: IComment): Promise<IComment | null> {
    return await this.commentRepository.addComment(comment);    
  }
}
