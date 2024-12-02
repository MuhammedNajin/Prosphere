import express, { Router } from 'express';
import { CreateMessageController } from '../contoller/chat/createMessage.controller';
import { IChatRepository } from '@/domain/IRepository/IChatRepository';
import { GetConversationController } from '../contoller/chat/getConversation.controller';
import { GetChatController } from '../contoller/chat/getChat.controller';

class ChatRouter {
    public router: Router;
    private createMessage;
    private getConversation;
    private getChat
    constructor(private chatRepo: IChatRepository) {
        this.router = Router();
        this.createMessage = new CreateMessageController(this.chatRepo).createMessage;
        this.getConversation = new GetConversationController(this.chatRepo).getConversation;
        this.getChat = new GetChatController(this.chatRepo).getChat
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/message', this.createMessage);
        this.router.get('/conversation/:id', this.getConversation)
        this.router.get('/:conversationId', this.getChat)
    }

}

export default ChatRouter;