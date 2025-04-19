import { IGetNotificationUseCase } from "@application/interface/IGetNotification.usecase";
import { NotificationDoc } from "@/shared/types/interface";
import { INotificationRepository } from "@/domian/IRepository/INotification.repository";
import { IReadNotificationUseCase } from "../interface/IReadNotification.usecase";

export class ReadNotificationUseCase implements IReadNotificationUseCase {
  constructor(private chatRepo: INotificationRepository) {}

  public async execute(id: string): Promise<void> {
    try {

      await this.chatRepo.readNotification(id);

    } catch (error) {
      console.log(error, "createConversation");
      throw error;
    }
  }
}
