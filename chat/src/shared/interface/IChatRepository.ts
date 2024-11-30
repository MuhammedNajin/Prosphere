import { ConversationProps, MessageProps } from '@domain/interface/IChat'

export interface IChatRepository {

    createMessage(userDTO: MessageProps): Promise<MessageProps>;
    findConversation(sender: string, receiver: string): Promise<ConversationProps>
    createNewConversation(sender: string, receiver: string): Promise<ConversationProps>
    getConversation(id: string): Promise<void>
    updateConversation(id: string, mutation: object): Promise<void>
    getChat(conversationId: string): Promise<MessageProps>
} 