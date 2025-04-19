import { KafkaProducer, Topics, NotificationEvent } from '@muhammednajinnprosphere/common';
import { MessageBrokerConnection } from '@infra/config/messageBroker'

export class NotificationProducer extends KafkaProducer<NotificationEvent> {
    topic: Topics.notificationEvent = Topics.notificationEvent;
}


