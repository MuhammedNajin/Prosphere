import { IChatRepository } from "@/shared/interface/IChatRepository";
import { NextFunction, Request, Response } from "express";



export class CreateMessageController {
  
   constructor(chatRepo: IChatRepository) {} 

   public createMessage = async (req: Request, res: Response, next: NextFunction) => {
       try {
           
       } catch (error) {
          
       }
   }
}