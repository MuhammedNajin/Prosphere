import { MessageProps } from "@/domain/interface/IChat";

export interface IGetChatUseCase {  
    execute(id: string, userId: string): Promise<MessageProps[]>
}


