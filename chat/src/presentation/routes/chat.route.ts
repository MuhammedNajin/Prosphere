import express, { Router } from 'express';
import { CreateMessageController } from '../contoller/createMessage.controller';
import { IChatRepository } from '@/shared/interface/IChatRepository';

class ChatRouter {
    public router: Router;
    private createMessage;
    constructor(private chatRepo: IChatRepository) {
        this.router = Router();
        this.createMessage = new CreateMessageController(chatRepo).createMessage
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/message', this.createMessage);
    }

}

export default ChatRouter;