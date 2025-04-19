import { User } from '@domain/entity/user.entity'
import { IChatRepository } from '@/domain/IRepository/IChatRepository';
import { MessageProps } from '@/domain/interface/IChat';
import { IGetChatUseCase} from '@/application/interface/IGetChat.usecase'


export class GetChatUseCase implements IGetChatUseCase {
  
     constructor(private chatRepo: IChatRepository) {}

     public async execute(conversationId: string, userId: string): Promise<MessageProps[]> {
        return await this.chatRepo.getChat(conversationId, userId)
     }
}