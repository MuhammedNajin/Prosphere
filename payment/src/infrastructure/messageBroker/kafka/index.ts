import { messageBroker } from "./connection";
import { SubscriptionProducer } from "./producer/subscription.producer";

export interface MessageBrokerProducers {
    subscriptionProducer: SubscriptionProducer
}
