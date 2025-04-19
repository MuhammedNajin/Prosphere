import { KafkaProducer, NotificationEvent } from "@muhammednajinnprosphere/common";


export interface Producers {
    chatNotificationProducer: KafkaProducer<NotificationEvent>
}