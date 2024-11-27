import { User } from '@domain/entity/user.entity'
import { IChatRepository } from '@/shared/interface/IChatRepository';
import { MessageProps } from '@/domain/interface/IChat';
import { ICreateMessageUseCase } from '@/application/interface/ICreateMessageUseCase';


export class CreateMessageUseCase implements ICreateMessageUseCase {
  
     constructor(private conversationRepo: IChatRepository) {}

     public async execute(coversationDTO: MessageProps): Promise<MessageProps> {
        return await this.conversationRepo.createMessage(coversationDTO)
     }
}