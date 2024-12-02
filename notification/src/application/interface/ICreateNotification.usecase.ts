import { NotificationAttrs, NotificationDoc } from "@/shared/types/interface";

export interface ICreateNotificationUseCase {
    execute(notificationDto: NotificationAttrs): Promise<NotificationDoc | null>
}