import { KafkaClient } from '@muhammednajinnprosphere/common';
import { UserCreatedConsumer } from '@/infrastructure/messageBroker/kafka/consumer/userCreated.consumer';
import { CompanyCreatedConsumer } from './consumer/companyCreated.consumer';
import { SubscriptionProducer } from './producer/subscription.producer';

class MessageBroker {
  private kafka: KafkaClient;

  constructor() {
    this.kafka = new KafkaClient();
 
  }

  async connect() {
    const KAFKA_BROKER = process.env.MESSAGE_BROKERS || "localhost:29092";
    const KAFKA_GROUP = process.env.KAFKA_GROUP || "payment-service-group";
    const KAFKA_CLIENT = process.env.USER_CLIENT_ID || "payment-service";
    await this.kafka.connect(KAFKA_CLIENT, [KAFKA_BROKER], KAFKA_GROUP);

    console.log("connected to kafka");
    
    this.setupConsumers();
  }

  private async setupConsumers() {
    const userCreateConsumer = await this.kafka.getCosumer('payment-user-created-group')
    const companyCreateConsumer = await this.kafka.getCosumer('payment-company-created-group')
    new UserCreatedConsumer(userCreateConsumer!).listen();
    new CompanyCreatedConsumer(companyCreateConsumer!).listen();
  }

  getKafkaClient() {
    return this.kafka;
  }

  getMessageProducers () {
     return {
      subscriptionProducer: new SubscriptionProducer(this.kafka.producer),
 }
  }
}

export const messageBroker = new MessageBroker();
