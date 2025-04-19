import express, { Router } from 'express';
import ChatRoute from './chat.route';
import { IChatRepository } from '@/domain/IRepository/IChatRepository';
import { Producers } from '@/shared/interface/Producers';

class AppRouter {
    public router: Router;
    private chatRoute;
    constructor(private chatRepo: IChatRepository, private producers: Producers) {
        this.router = Router();
        this.chatRoute = new ChatRoute(this.chatRepo, producers).router
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.use('/api/v1/chat', this.chatRoute);
    }

}

export default AppRouter;