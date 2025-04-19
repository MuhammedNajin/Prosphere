import { KafkaConsumer, Topics, SubscriptionEvent } from '@muhammednajinnprosphere/common'
import { Consumer, KafkaMessage } from 'kafkajs';
import { subscriptionRepository } from '@/infra/repository';

export class SubscriptionConsumer extends KafkaConsumer<SubscriptionEvent> {
    topic: Topics.subscriptionEvent = Topics.subscriptionEvent;
    

    constructor(consumer: Consumer) {
        super(consumer);
    }

    async onConsume(data: SubscriptionEvent['data'], msg: KafkaMessage): Promise<void> {
        console.log("heloo from consumer");
       try {
        const {
           duration,
           endDate,
           isSubscriped,
           startDate
           } = data;
        
         await  subscriptionRepository.updateSubscription(data)
       } catch (error) {
         console.log(error);
       }
       
    }
}