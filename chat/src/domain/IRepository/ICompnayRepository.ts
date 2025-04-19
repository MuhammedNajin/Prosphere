import { MESSAGE_STATUS } from '@/shared/enums/messageEnums';
import { ConversationProps, MessageProps } from '@domain/interface/IChat'

export interface ICompanyChatRepository {
    createMessage(userDTO: MessageProps): Promise<MessageProps>;
    findConversation(sender: string, receiver: string, companyId: string): Promise<ConversationProps>
    createNewConversation(sender: string, receiver: string, _id: string, companyId: string): Promise<ConversationProps>
    getConversation(id: string): Promise<void>
    updateConversation(id: string, mutation: object): Promise<void>
    getChat(conversationId: string): Promise<MessageProps>
    readMessage(conversationId: string, status: MESSAGE_STATUS, sender: string): Promise<void>
} 