import { IChatRepository } from "@/domain/IRepository/IChatRepository";
import { NextFunction, Request, Response } from "express";
import { GetConversationUseCase } from "@/application/usecase/chatUsecase/getConversation.usecase";
import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { DeleteMessageUseCase } from "@/application/usecase/chatUsecase/deleteMessage.usecase";


export class DeleteMessageController {
  
   constructor(private chatRepo: IChatRepository) {} 

   public delete = async (req: Request, res: Response, next: NextFunction) => {
       try {

        const { id } = req.params
        const { userId } = req.body;
            console.log("userId", userId)
           await new DeleteMessageUseCase(this.chatRepo).execute(id, userId)

        res
         .status(StatusCode.OK)
         .json(ResponseUtil.success({ success: true }));

       } catch (error) {
          next(error);
       }
   }
}