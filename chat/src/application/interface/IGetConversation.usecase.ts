import { ConversationProps } from "@/domain/interface/IChat";

export interface IGetConversationUseCase {  
    execute(id: string): Promise<ConversationProps[]>
}


