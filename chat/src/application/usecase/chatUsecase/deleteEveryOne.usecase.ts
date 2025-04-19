import { User } from '@domain/entity/user.entity'
import { IChatRepository } from '@/domain/IRepository/IChatRepository';
import { MessageProps } from '@/domain/interface/IChat';
import { IDeleteEveryOneUseCase } from '@/application/interface/IDeleteEveryOne.usecase';


export class DeleteEveryOneUseCase implements IDeleteEveryOneUseCase {
  
     constructor(private chatRepo: IChatRepository) {}

     public async execute(id: string): Promise<void> {
         await this.chatRepo.deleteForEveryOne(id)
     }
}