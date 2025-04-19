import { User } from '@domain/entity/user.entity'
import { IChatRepository } from '@/domain/IRepository/IChatRepository';
import { MessageProps } from '@/domain/interface/IChat';
import { IDeleteMessageUseCase } from '@/application/interface/IDeleteMessage.usecase';


export class DeleteMessageUseCase implements IDeleteMessageUseCase {
  
     constructor(private chatRepo: IChatRepository) {}

     public async execute(id: string, userId: string): Promise<void> {
         await this.chatRepo.delete(id, userId);
     }
}