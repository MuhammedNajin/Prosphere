
import { KafkaClient } from '@muhammednajinnprosphere/common'
import { UserCreatedConsumer } from '../messageBroker/kafka';

const kafka = new KafkaClient();

const messageBrokerConnect = async (depedencies: any) => {
    await kafka.connect('company-service', ['localhost:29092'], "company-service-group");  
    new UserCreatedConsumer(kafka.consumer, depedencies).listen(); 
}

export { messageBrokerConnect, kafka }