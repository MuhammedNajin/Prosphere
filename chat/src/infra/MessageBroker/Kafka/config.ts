import { KafkaClient } from '@muhammednajinnprosphere/common';
import { UserCreatedConsumer } from '@infra/MessageBroker/Kafka/consumer/userCreate.consumer';

class MessageBroker {
  private kafka: KafkaClient;

  constructor() {
    this.kafka = new KafkaClient();
  }

  async connect() {
   
    await this.kafka.connect('chat-service', ['localhost:29092'], 'chat-service-group');
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
