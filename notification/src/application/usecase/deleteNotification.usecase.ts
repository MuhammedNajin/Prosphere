import { IGetNotificationUseCase } from "@application/interface/IGetNotification.usecase";
import { NotificationDoc } from "@/shared/types/interface";
import { INotificationRepository } from "@/domian/IRepository/INotification.repository";
import { IReadNotificationUseCase } from "../interface/IReadNotification.usecase";
import { IDeleteNotificationUseCase } from "../interface/IDeleteNotification.usecase";

export class DeleteNotificationUseCase implements IDeleteNotificationUseCase {
  constructor(private chatRepo: INotificationRepository) {}

  public async execute(id: string): Promise<void> {
    try {

      await this.chatRepo.deleteNotification(id);

    } catch (error) {
      console.log(error, "delete notification");
      throw error;
    }
  }
}
