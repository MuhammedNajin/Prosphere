import { MessageProps } from '@domain/interface/IChat'

export interface IChatRepository {

    createMessage(userDTO: MessageProps, userId: string): Promise<MessageProps>
} 