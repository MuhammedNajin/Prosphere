import { NotificationAttrs, NotificationDoc } from '@/shared/types/interface';

export interface INotificationRepository {
    createNotification(userDTO: NotificationAttrs): Promise<NotificationDoc>;
} 