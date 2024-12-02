import { INotificationRepository } from "@/domian/IRepository/INotification.repository";
import { NotificationAttrs, NotificationDoc } from "@/shared/types/interface";
import Notification from "../database/mongo/schema/notification.schema";

class NotificationRepository implements INotificationRepository {

 
  async createNotification (

    notificationDTO: NotificationAttrs,

  ): Promise<NotificationDoc> {

    return await Notification.build(notificationDTO).save();

  }

  
}

export default new NotificationRepository();