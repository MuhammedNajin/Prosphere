import { KafkaClient } from '@muhammednajinnprosphere/common';
import { NotificationConsumer } from "./consumer/notification.consumer"

class MessageBroker {
  private kafka: KafkaClient;

  constructor() {
    this.kafka = new KafkaClient();
  }

  async connect() {
    
    const KAFKA_BROKER = process.env.MESSAGE_BROKERS || "localhost:29092";
    const KAFKA_GROUP = process.env.KAFKA_GROUP || "notification-service-group";
    const KAFKA_CLIENT = process.env.USER_CLIENT_ID || "notification-service";
    console.log("Connecting to message broker", KAFKA_BROKER, KAFKA_CLIENT, KAFKA_GROUP);
    
    await this.kafka.connect(
      KAFKA_CLIENT,
      [KAFKA_BROKER],
      KAFKA_GROUP
    );
    console.log("connected to kafka");
    
    this.setupConsumers();
  }

  private setupConsumers() {
    new NotificationConsumer(this.kafka.consumer).listen();
  }

  getKafkaClient() {
    return this.kafka;
  }
}

export const messageBroker = new MessageBroker();
