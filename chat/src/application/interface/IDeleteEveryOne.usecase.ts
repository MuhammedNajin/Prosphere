import { MessageProps } from "@/domain/interface/IChat";

export interface IDeleteEveryOneUseCase {  
    execute(id: string): Promise<void>
}


