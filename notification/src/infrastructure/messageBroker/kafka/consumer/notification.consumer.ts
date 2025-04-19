import { KafkaConsumer, Topics, NotificationEvent } from '@muhammednajinnprosphere/common'
import { Consumer, KafkaMessage } from 'kafkajs';
import { CreateNotificationUseCase } from '@/application/usecase/createNotification.usecase';
import notificationRepository from '@infrastructure/repository/notification.repository'
import { NotificationSocketManager } from '@/infrastructure/socket';
export class NotificationConsumer extends KafkaConsumer<NotificationEvent> {
    topic: Topics.notificationEvent = Topics.notificationEvent;

    constructor(consumer: Consumer) {
        super(consumer);
    }

    async onConsume(data: NotificationEvent['data'], msg: KafkaMessage): Promise<void> {
        console.log("heloo from consumer", data);
       try {
          const notificationSockect = NotificationSocketManager.getSocket();


          notificationSockect?.to(data.recipient).emit("notification:sent", data);
          const notification =  await new CreateNotificationUseCase(notificationRepository).execute(data)
          console.log("notification event", notification);
       } catch (error) {
         console.log(error);
       }
       
    }
}