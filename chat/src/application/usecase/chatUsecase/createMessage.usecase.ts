import { IChatRepository } from '@/domain/IRepository/IChatRepository';
import { MessageProps } from '@/domain/interface/IChat';
import { ICreateMessageUseCase } from '@/application/interface/ICreateMessage.usecase';


export class CreateMessageUseCase implements ICreateMessageUseCase {
  
     constructor(private chatRepo: IChatRepository) {}

     public async execute(coversationDTO: MessageProps): Promise<MessageProps> {
        const message = await this.chatRepo.createMessage(coversationDTO)
        console.log("message", message);
       const conversation = await this.chatRepo.updateConversation(message.conversation, { lastMessage: message._id });
        return message;
     }
}