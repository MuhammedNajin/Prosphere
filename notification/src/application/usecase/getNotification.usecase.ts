import { IGetNotificationUseCase } from "@application/interface/IGetNotification.usecase";
import { NotificationDoc } from "@/shared/types/interface";
import { INotificationRepository } from "@/domian/IRepository/INotification.repository";
import { NotificationType } from "@muhammednajinnprosphere/common";

export class GetNotificationUseCase implements IGetNotificationUseCase {
  constructor(private chatRepo: INotificationRepository) {}

  public async execute(
    userId: string,
    type: NotificationType
  ): Promise<NotificationDoc[] | null> {

    try {

      return await this.chatRepo.getNotification(userId, type);

    } catch (error) {
        
      console.log(error, "createConversation");
      throw error;
    }
  }
}
