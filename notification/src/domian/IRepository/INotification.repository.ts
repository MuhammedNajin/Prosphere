import { NotificationAttrs, NotificationDoc } from '@/shared/types/interface';
import { NotificationType } from '@muhammednajinnprosphere/common';

export interface INotificationRepository {
    createNotification(userDTO: NotificationAttrs): Promise<NotificationDoc>;
    getNotification(userId: string, type: NotificationType): Promise<NotificationDoc[] | null>
    readNotification(id: string): Promise<void>
    readNotifications(ids: string[]): Promise<void>
    deleteNotification(id: string): Promise<void>
    deleteBulkNotification(ids: string[]): Promise<void>
    getNotificationCount(userId: string): Promise<number>
} 