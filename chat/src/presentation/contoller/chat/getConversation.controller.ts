import { IChatRepository } from "@/domain/IRepository/IChatRepository";
import { NextFunction, Request, Response } from "express";
import { GetConversationUseCase } from "@/application/usecase/chatUsecase/getConversation.usecase";
import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { ROLE } from "@/shared/enums/roleEnums";

export class GetConversationController {
  constructor(private chatRepo: IChatRepository) {}

  public getConversation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { context, companyId } = req.query;
      const { id } = req.params;
      
      
      console.log(" req ", req.query, req.params)

      let query = { context, companyId, userId: id};


      const conversations = await new GetConversationUseCase(
        this.chatRepo
      ).execute(query as { userId?: string, companyId?: string, context: string });

      res.status(StatusCode.OK).json(ResponseUtil.success(conversations));
    } catch (error) {
      next(error);
    }
  };
}
