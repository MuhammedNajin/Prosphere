import { MESSAGE_STATUS } from '@/shared/enums/messageEnums';
import { ConversationProps, MessageProps } from '@domain/interface/IChat'

export interface IChatRepository {
    createMessage(userDTO: MessageProps): Promise<MessageProps>;
    findConversation(sender: string, receiver: string, context: string, companyId: string | null, conversationId: string): Promise<ConversationProps>
    createNewConversation(sender: string, receiver: string, _id: string, context: string, companyId: string | null): Promise<ConversationProps>
    getConversation(queryParams: { userId?: string, companyId?: string }): Promise<void>
    updateConversation(id: string, mutation: object): Promise<void>
    getChat(conversationId: string, userId: string): Promise<MessageProps>
    readMessage(conversationId: string, status: MESSAGE_STATUS, sender: string): Promise<void>
    deleteForEveryOne(id: string): Promise<void>;
    delete(_id: string, userId: string): Promise<void>;
} 