import { IChatRepository } from "@/domain/IRepository/IChatRepository";
import { NextFunction, Request, Response } from "express";
import { GetConversationUseCase } from "@/application/usecase/chatUsecase/getConversation.usecase";
import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { GetChatUseCase } from "@/application/usecase/chatUsecase/getChat.usecase";


export class GetChatController {
  
   constructor(private chatRepo: IChatRepository) {} 

   public getChat = async (req: Request, res: Response, next: NextFunction) => {
       try {

        const { conversationId } = req.params
        const { userId } = req.query
        console.log("userId", userId)
          const chat = await new GetChatUseCase(this.chatRepo).execute(conversationId, userId as string)
        res
         .status(StatusCode.OK)
         .json(ResponseUtil.success(chat));

       } catch (error) {
          next(error);
       }
   }
}