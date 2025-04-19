import { INotificationRepository } from "@/domian/IRepository/INotification.repository"
import { IDeleteBulkNotificationUseCase } from "../interface/IDeleteBulkNotification.usecase";

export class DeleteBulkNotificationUseCase implements IDeleteBulkNotificationUseCase {
  constructor(private chatRepo: INotificationRepository) {}

  public async execute(ids: string[]): Promise<void> {
    try {

      await this.chatRepo.deleteBulkNotification(ids);

    } catch (error) {
      console.log(error, "delete notification");
      throw error;
    }
  }
}
