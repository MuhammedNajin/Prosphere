import { NotificationDoc } from "@/shared/types/interface";

export interface IReadNotificationUseCase {
    execute(id: string): Promise<void>
}