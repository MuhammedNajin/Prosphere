import { IChatRepository } from "@/domain/IRepository/IChatRepository";
import { NextFunction, Request, Response } from "express";
import { GetConversationUseCase } from "@/application/usecase/chatUsecase/getConversation.usecase";
import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { GetChatUseCase } from "@/application/usecase/chatUsecase/getChat.usecase";
import { DeleteEveryOneUseCase } from "@/application/usecase/chatUsecase/deleteEveryOne.usecase";


export class DeleteForEveryChatController {
  
   constructor(private chatRepo: IChatRepository) {} 

   public delete = async (req: Request, res: Response, next: NextFunction) => {
       try {

        const { id } = req.params
           await new DeleteEveryOneUseCase(this.chatRepo).execute(id)
        res
         .status(StatusCode.OK)
         .json(ResponseUtil.success({ success: true }));

       } catch (error) {
          next(error);
       }
   }
}