import { INotificationRepository } from '@/domian/IRepository/INotification.repository';
import express, { Router } from 'express';
import { GetNotificationController } from '../controller/getNotification.controller';
import { ReadNotificationController } from '../controller/readNotificationController';
import { DeleteNotificationController } from '../controller/deleteNotification.controller';
import { GetNotificationCountController } from '../controller/getNotificationCount.controller';
import { DeleteBulkNotificationController } from '../controller/bulkDelete.controller';
import { ReadNotificationsController } from '../controller/readNotifications.controller';


class NotificationRouter {
    public router: Router;
    private getNotification
    private readNotification;
    private deleteNotification;
    private getNotificationCount;
    private deleteBulkNotification;
    private readNotifications
    constructor(private notificationRepo: INotificationRepository) {
        this.router = Router();
        this.getNotification = new GetNotificationController(this.notificationRepo).getNotification;
        this.readNotification = new ReadNotificationController(this.notificationRepo).readNotification;
        this.deleteNotification = new DeleteNotificationController(this.notificationRepo).deleteNotification;
        this.getNotificationCount = new GetNotificationCountController(this.notificationRepo).getNotificationCount;
        this.deleteBulkNotification = new DeleteBulkNotificationController(this.notificationRepo).deleteBulkNotification;
        this.readNotifications = new ReadNotificationsController(this.notificationRepo).readNotifications
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.use((req, res, next) => {
          console.log(req.method, req.url)
          next()
        })
        
        this.router.get('/notifications/:userId', this.getNotification);
        this.router.get('/notifications/unread/:userId', this.getNotificationCount)
        this.router.put('/notifications/read-all', this.readNotifications)
        this.router.put('/notifications/:id', this.readNotification);
        this.router.delete('/notifications/:id', this.deleteNotification);
        this.router.put('/notifications', this.deleteBulkNotification);
    }

}

export default NotificationRouter;