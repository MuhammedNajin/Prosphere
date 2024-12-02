import { ICreateNotificationUseCase } from "@application/interface/ICreateNotification.usecase";
import { NotificationAttrs, NotificationDoc } from "@/shared/types/interface";
import { INotificationRepository } from "@/domian/IRepository/INotification.repository";

export class CreateNotificationUseCase implements ICreateNotificationUseCase {
  constructor(private chatRepo: INotificationRepository) {}

  public async execute(
    notificationDto: NotificationAttrs
  ): Promise<NotificationDoc | null> {

    try {

      return await this.chatRepo.createNotification(notificationDto);

    } catch (error) {
        
      console.log(error, "createConversation");
      throw error;
    }
  }
}
