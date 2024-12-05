import { KafkaClient } from '@muhammednajinnprosphere/common';
import { UserCreatedConsumer } from '@infrastructure/messageBroker/consumer/userCreated.consumer';

class MessageBroker {
  private kafka: KafkaClient;

  constructor() {
    this.kafka = new KafkaClient();
  }

  async connect() {
   
    await this.kafka.connect('payment-service', ['localhost:29092'], 'payment-service-group');
    console.log("connected to kafka");
    
    this.setupConsumers();
  }

  private setupConsumers() {
    new UserCreatedConsumer(this.kafka.consumer).listen();
  }

  getKafkaClient() {
    return this.kafka;
  }
}

export const messageBroker = new MessageBroker();
