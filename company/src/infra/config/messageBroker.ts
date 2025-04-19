import { KafkaClient } from '@muhammednajinnprosphere/common'
import { UserCreatedConsumer } from '../messageBroker/kafka';
import { UpdateTrailConsumer } from '../messageBroker/kafka/consumer/trail-update-consumer';
import { SubscriptionConsumer } from '../messageBroker/kafka/consumer/subscription-consumer';

const kafka = new KafkaClient();

const messageBrokerConnect = async (depedencies: any) => {
    const KAFKA_BROKER = process.env.MESSAGE_BROKERS || "localhost:29092";
    const KAFKA_GROUP = process.env.KAFKA_GROUP || "company-service-group";
    const KAFKA_CLIENT = process.env.USER_CLIENT_ID || 'company-service';
    console.log("Connecting to message broker", KAFKA_BROKER, KAFKA_CLIENT, KAFKA_GROUP);
    
    await kafka.connect(KAFKA_GROUP, [KAFKA_BROKER], KAFKA_CLIENT);  
    const updateTrailConsumer = await kafka.getCosumer('update-trail-group');
    const subscriptionConsumer = await kafka.getCosumer('subscription-group');
    new UpdateTrailConsumer(updateTrailConsumer!, depedencies).listen();
    new UserCreatedConsumer(kafka.consumer, depedencies).listen(); 
    new SubscriptionConsumer(subscriptionConsumer!).listen();
}

export { messageBrokerConnect, kafka }