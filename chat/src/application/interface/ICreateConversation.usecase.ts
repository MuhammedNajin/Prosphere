import { ConversationProps } from "@/domain/interface/IChat";


export interface ICreateConversationUseCase {
    execute(sender: string, receiver: string, conversationId: string): Promise<ConversationProps>
}