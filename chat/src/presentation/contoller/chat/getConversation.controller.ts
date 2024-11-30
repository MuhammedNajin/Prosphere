import { IChatRepository } from "@/shared/interface/IChatRepository";
import { NextFunction, Request, Response } from "express";
import { GetConversationUseCase } from "@/application/usecase/chatUsecase/getConversation.usecase";
import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";


export class GetConversationController {
  
   constructor(private chatRepo: IChatRepository) {} 

   public getConversation = async (req: Request, res: Response, next: NextFunction) => {
       try {

        const { id } = req.params
          const conversations = await new GetConversationUseCase(this.chatRepo).execute(id)
        res
         .status(StatusCode.CREATED)
         .json(ResponseUtil.success(conversations));

       } catch (error) {
          next(error);
       }
   }
}