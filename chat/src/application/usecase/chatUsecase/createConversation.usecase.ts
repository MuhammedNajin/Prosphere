import { User } from "@domain/entity/user.entity";
import { IChatRepository } from "@/domain/IRepository/IChatRepository";
import { ConversationProps } from "@/domain/interface/IChat";
import { ICreateConversationUseCase } from "@/application/interface/ICreateConversation.usecase";

export class CreateConversationUseCase implements ICreateConversationUseCase {
  constructor(private chatRepo: IChatRepository) {}

  public async execute(
    sender: string,
    receiver: string
  ): Promise<ConversationProps> {
    try {

      const existingConversation = await this.chatRepo.findConversation(
        sender,
        receiver
      );
      if (existingConversation) {
       return existingConversation
      }

      return await this.chatRepo.createNewConversation(
         sender,
         receiver
       );

    } catch (error) {
      console.log(error, "createConversation");
    }
  }
}
