import { KafkaProducer, Topics, NotificationEvent } from '@muhammednajinnprosphere/common';


export class ChatNotificationProducer extends KafkaProducer<NotificationEvent> {
    topic: Topics.notificationEvent = Topics.notificationEvent;
}

