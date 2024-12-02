import { User } from '@domain/entity/user.entity'
import { IChatRepository } from '@/domain/IRepository/IChatRepository';
import { MessageProps } from '@/domain/interface/IChat';
import { IGetConversationUseCase} from '@/application/interface/IGetConversation.usecase'


export class GetConversationUseCase implements IGetConversationUseCase {
  
     constructor(private chatRepo: IChatRepository) {}

     public async execute(id: string): Promise<MessageProps> {
        return await this.chatRepo.getConversation(id)
     }
}