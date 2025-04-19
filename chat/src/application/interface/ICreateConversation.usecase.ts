import { ConversationProps } from "@/domain/interface/IChat";
import { CreateConversationArgs } from "@/shared/interface/chat";


export interface ICreateConversationUseCase {
    execute(data: CreateConversationArgs): Promise<ConversationProps>
}