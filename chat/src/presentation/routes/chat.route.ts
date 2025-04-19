import express, { Router } from "express";
import { CreateMessageController } from "../contoller/chat/createMessage.controller";
import { IChatRepository } from "@/domain/IRepository/IChatRepository";
import { GetConversationController } from "../contoller/chat/getConversation.controller";
import { GetChatController } from "../contoller/chat/getChat.controller";
import { Producers } from "@/shared/interface/Producers";
import { DeleteForEveryChatController } from "../contoller/chat/deleteForEveryOne.controller";
import { DeleteMessageController } from "../contoller/chat/deleteMessage.controller";

class ChatRouter {
  public router: Router;
  private createMessage;
  private getConversation;
  private getChat;
  private deleteEveryOne;
  private delete;
  constructor(private chatRepo: IChatRepository, private producers: Producers) {
    this.router = Router();
    this.createMessage = new CreateMessageController(
      this.chatRepo,
      producers.chatNotificationProducer
    ).createMessage;
    this.getConversation = new GetConversationController(
      this.chatRepo
    ).getConversation;
    this.getChat = new GetChatController(this.chatRepo).getChat;
    this.deleteEveryOne = new DeleteForEveryChatController(
      this.chatRepo
    ).delete;
    this.delete = new DeleteMessageController(this.chatRepo).delete;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/messages", this.createMessage);
    this.router.put("/messages/:id", this.delete);
    this.router.delete("/messages/:id", this.deleteEveryOne);
    this.router.get("/conversation/:id", this.getConversation);
    this.router.get("/:conversationId", this.getChat);
  }
}

export default ChatRouter;
