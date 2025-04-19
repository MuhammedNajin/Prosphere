import { User } from "@domain/entity/user.entity";
import { IChatRepository } from "@/domain/IRepository/IChatRepository";
import { ConversationProps } from "@/domain/interface/IChat";
import { ICreateConversationUseCase } from "@/application/interface/ICreateConversation.usecase";
import { ROLE } from "@/shared/enums/roleEnums";
import { CreateConversationArgs } from "@/shared/interface/chat";

export class CreateConversationUseCase implements ICreateConversationUseCase {
  constructor(private chatRepo: IChatRepository) {}

  public async execute({
    sender,
    receiver,
    conversationId,
    context,
    companyId: id,
  }: CreateConversationArgs): Promise<ConversationProps> {
    try {
    
      const companyId = context === ROLE.Company ? id : null;


      console.log("params ", sender, receiver, conversationId, context, id)
      
      const existingConversation = await this.chatRepo.findConversation(
        sender,
        receiver,
        context,
        companyId,
        conversationId
      );

      console.log("existing converstation", existingConversation)
      if (existingConversation) {
        return existingConversation;
      }

      return await this.chatRepo.createNewConversation(
        sender,
        receiver,
        conversationId,
        context,
        companyId
      );
    } catch (error) {
      console.log("!!!!!!!!!!!!!!!!!!!!!!!@@@@@@@@@@@@@@@@@@@@@@@@$$$$$$$$$$$#############");
      
      console.log("createConversationfhuhdufgewfgyewyfgeywfew", error);
      throw error;
    }
  }
}
