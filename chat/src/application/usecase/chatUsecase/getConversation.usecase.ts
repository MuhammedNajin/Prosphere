import { IChatRepository } from '@/domain/IRepository/IChatRepository';
import { MessageProps } from '@/domain/interface/IChat';
import { IGetConversationUseCase} from '@/application/interface/IGetConversation.usecase'


export class GetConversationUseCase implements IGetConversationUseCase {
  
     constructor(private chatRepo: IChatRepository) {}

     public async execute(queryParams: { userId?: string, companyId?: string }): Promise<MessageProps> {
        return await this.chatRepo.getConversation(queryParams)
     }
}