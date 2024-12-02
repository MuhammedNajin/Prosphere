import { IChatRepository } from "@/domain/IRepository/IChatRepository";
import { NextFunction, Request, Response } from "express";
import { CreateConversationUseCase } from "@/application/usecase/chatUsecase/createConversation.usecase";
import { CreateMessageUseCase } from "@/application/usecase/chatUsecase/createMessage.usecase";
import { Message } from "@/domain/entity/chat.entity";
import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
export class CreateMessageController {
  constructor(private chatRepo: IChatRepository) {}

  public createMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { sender, receiver, content, id } = req.body;
      console.log("req.body", req.body);
      const conversation = await new CreateConversationUseCase(
        this.chatRepo
      ).execute(sender, receiver);
      const props = {
        _id: id,
        sender,
        conversation: conversation._id,
        content,
      };
      const messageDTO = new Message(props).toDTO();
      const message = await new CreateMessageUseCase(this.chatRepo).execute(
        messageDTO
      );

      res
       .status(StatusCode.CREATED)
       .json(ResponseUtil.success(message));

    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
