import { IGetNotificationUseCase } from "@application/interface/IGetNotification.usecase";
import { NotificationDoc } from "@/shared/types/interface";
import { INotificationRepository } from "@/domian/IRepository/INotification.repository";

import { IReadNotificationsUseCase } from "../interface/IReadNotifications.usecase";

export class ReadNotificationsUseCase implements IReadNotificationsUseCase {
  constructor(private chatRepo: INotificationRepository) {}

  public async execute(ids: string[]): Promise<void> {
    try {

      await this.chatRepo.readNotifications(ids);

    } catch (error) {
      console.log(error, "createConversation");
      throw error;
    }
  }
}
