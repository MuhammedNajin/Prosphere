import { IGetNotificationUseCase } from "@application/interface/IGetNotification.usecase";
import { NotificationDoc } from "@/shared/types/interface";
import { INotificationRepository } from "@/domian/IRepository/INotification.repository";
import { NotificationType } from "@muhammednajinnprosphere/common";
import { IGetNotificationCountUseCase } from "../interface/IGetNotificationCount.usecase";

export class GetNotificationCountUseCase implements IGetNotificationCountUseCase {
  constructor(private chatRepo: INotificationRepository) {}

  public async execute(
    userId: string,
  ): Promise<number | null> {

    try {

      return await this.chatRepo.getNotificationCount(userId);

    } catch (error) {
      console.log(error, "createConversation");
      throw error;
    }
  }
}
