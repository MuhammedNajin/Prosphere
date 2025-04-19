import { NotificationDoc } from "@/shared/types/interface";
import { NotificationType } from "@muhammednajinnprosphere/common";

export interface IGetNotificationUseCase {
    execute(userId: string, type: NotificationType): Promise<NotificationDoc[] | null>
}