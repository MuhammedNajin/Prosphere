import { ROLE } from "../enums/roleEnums";

export interface CreateConversationArgs {
    sender: string; 
    receiver: string; 
    conversationId: string; 
    context: ROLE; 
    companyId: string;
}