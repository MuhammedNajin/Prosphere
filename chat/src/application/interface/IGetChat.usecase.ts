import { MessageProps } from "@/domain/interface/IChat";

export interface IGetChatUseCase {  
    execute(id: string): Promise<MessageProps[]>
}


