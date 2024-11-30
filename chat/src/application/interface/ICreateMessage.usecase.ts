import { ConversationProps } from "@/domain/interface/IChat";

export interface ICreateMessageUseCase {
    
    execute(CoversationDTO: ConversationProps): Promise<ConversationProps>
}


