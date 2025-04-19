import { IChatRepository } from "@/domain/IRepository/IChatRepository";
import { NextFunction, Request, Response } from "express";
import { CreateConversationUseCase } from "@/application/usecase/chatUsecase/createConversation.usecase";
import { CreateMessageUseCase } from "@/application/usecase/chatUsecase/createMessage.usecase";
import { Message } from "@/domain/entity/chat.entity";
import { BadRequestError, NotificationType, ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { Producers } from "@/shared/interface/Producers";
import { ROLE } from "@/shared/enums/roleEnums";
export class CreateMessageController {
  constructor(private chatRepo: IChatRepository, private chatNotificationProducer: Producers['chatNotificationProducer'] ) {}

  public createMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { sender, receiver, content, id, conversationId, context, companyId } = req.body;
      console.log("req.body", req.body);
      const conversation = await new CreateConversationUseCase(
        this.chatRepo
      ).execute({ companyId,  context, sender, receiver, conversationId});

       
      if(!conversation) {
         throw new BadRequestError("Can't create conversation")
      } 

      const props = {
        _id: id,
        receiver,
        sender,
        conversation: conversation._id,
        content,
      };

      const messageDTO = new Message(props).toDTO();

      
      const message = await new CreateMessageUseCase(this.chatRepo).execute(
        messageDTO
      );
    console.log("conversation", conversation, context);
    
     const senderName = context === ROLE.Company ? conversation?.companyId?.name : message?.sender?.username;
      this.chatNotificationProducer.produce({
        recipient: receiver,
        data: message.id,
        title: `New Message from ${senderName}`,
        message: `${message?.sender?.username} sent you a message: "${message.content?.text?.slice(0, 50)}..."`,
        type: NotificationType.Message,
        actionUrl: `/chat?id=${message?.conversation}`
    });
    

      res
       .status(StatusCode.CREATED)
       .json(ResponseUtil.success(message));

    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
