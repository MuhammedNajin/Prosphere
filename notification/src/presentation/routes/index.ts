import express, { Router } from 'express';
import { INotificationRepository } from '@/domian/IRepository/INotification.repository';
import NotificationRouter from './notification.router';


class AppRouter {
    public router: Router;
    private notificationRoute;
    constructor(private notificationRepo: INotificationRepository) {
        this.router = Router();
        this.notificationRoute = new NotificationRouter(this.notificationRepo).router
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.use((req, res, next) => {
            console.log(req.method, req.url)
            next()
          })
        this.router.use(this.notificationRoute);
    }

}

export default AppRouter;