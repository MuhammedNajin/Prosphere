import { ConversationProps } from "@/domain/interface/IChat";

export interface IGetConversationUseCase {  
    execute(queryParams: { userId?: string, companyId?: string }): Promise<ConversationProps[]>
}


