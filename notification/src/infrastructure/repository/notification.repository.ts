import { INotificationRepository } from "@/domian/IRepository/INotification.repository";
import { NotificationAttrs, NotificationDoc } from "@/shared/types/interface";
import Notification from "../database/mongo/schema/notification.schema";
import { NotificationReadStatus } from "@/shared/types/enums";
import { NotificationType } from "@muhammednajinnprosphere/common";

class NotificationRepository implements INotificationRepository {

  async createNotification (notificationDTO: NotificationAttrs): Promise<NotificationDoc> {
    try {

      return await Notification.build(notificationDTO).save();
    } catch (error) {
      throw error
    }
  }

  async getNotification(userId: string, type: NotificationType | string ): Promise<NotificationDoc[] | null> {
       try {
        console.log("userid from repo", userId, type);

        let query: { recipient: string, type?: string } = { $or: [
          { recipient: userId },
          { recipient: "all" }
        ], type }
        
         if(type === 'all' || !type) {
           query = {$or: [
          { recipient: userId },
          { recipient: "all" }
        ] }
         }
         return await Notification.find(query).sort({createdAt: -1});
       } catch (error) {
          throw error
       }
   }
   async getNotificationCount(userId: string): Promise<number> {
    return await Notification.countDocuments({
      $or: [
        { recipient: userId },
        { recipient: "all" }
      ],
      status: NotificationReadStatus.UNREAD
    });
  }
  
   async readNotification(_id: string): Promise<void> {
      console.log("id from repo", _id);
      await Notification.updateOne({ _id }, { 
         $set: { status: NotificationReadStatus.READ }
      })
   }

  async deleteNotification(_id: string): Promise<void> {
     await Notification.deleteOne({ _id });
  }

 async deleteBulkNotification(ids: string[]): Promise<void> {
      try {
        await Notification.deleteMany({ _id: { $in: ids } });
      } catch (error) {
        throw error;
      }
  }

  async readNotifications(ids: string[]): Promise<void> {
     try {
        await Notification.updateMany({ _id: { $in: ids } }, {
           $set: { status: NotificationReadStatus.READ }
        })
     } catch (error) {
        throw error;
     }
  }
}


export default new NotificationRepository();