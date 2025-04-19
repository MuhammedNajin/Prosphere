import { MessageProps } from "@/domain/interface/IChat";

export interface IDeleteMessageUseCase {  
    execute(id: string, userId: string): Promise<void>
}


