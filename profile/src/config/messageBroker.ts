
import { KafkaClient } from '@muhammednajinnprosphere/common'
import { UserCreatedConsumer } from '../events/consumer/user-created-listener';

const kafka = new KafkaClient();

const messageBrokerConnect = async (depedencies: any) => {
    await kafka.connect('Profile-service', ['localhost:29092'], "Profile-service-group");  
    new UserCreatedConsumer(kafka.consumer, depedencies).listen(); 
}

export { messageBrokerConnect, kafka }