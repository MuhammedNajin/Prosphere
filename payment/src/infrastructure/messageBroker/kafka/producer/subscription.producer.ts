import { KafkaProducer, Topics, SubscriptionEvent } from '@muhammednajinnprosphere/common';

export class SubscriptionProducer extends KafkaProducer<SubscriptionEvent> {
   topic: Topics.subscriptionEvent = Topics.subscriptionEvent;
}