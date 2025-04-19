  import { KafkaClient } from '@muhammednajinnprosphere/common';
  import { UserCreatedConsumer } from '@infra/MessageBroker/Kafka/consumer/userCreate.consumer';
import { ChatNotificationProducer } from './producer/notification.producer';
import { CompanyCreatedConsumer } from './consumer/companyCreate.consumer';
import { AvatarUpdateConsumer} from './consumer/avatarUpdate.consumer'
  class MessageBroker {
    private kafka: KafkaClient;

    constructor() {
      this.kafka = new KafkaClient();
    }

    async connect() {
      const KAFKA_BROKER = process.env.MESSAGE_BROKERS || "localhost:29092";
      const KAFKA_GROUP = process.env.KAFKA_GROUP || "chat-service-group";
      const KAFKA_CLIENT = process.env.KAFKA_CLIENT_ID || "chat-service";
      await this.kafka.connect(KAFKA_CLIENT, [KAFKA_BROKER], KAFKA_GROUP);
      console.log("connected to kafka");
      
      this.setupConsumers();
    }

    private async setupConsumers() {
      new UserCreatedConsumer(this.kafka.consumer).listen();
      const companyCreateConsumer = await this.kafka.getCosumer('chat-company-created-group')
      const avatarUpdate = await this.kafka.getCosumer('chat-profile-update-group')
      new CompanyCreatedConsumer(companyCreateConsumer!).listen();
      new AvatarUpdateConsumer(avatarUpdate!).listen()
    }

    getKafkaClient() {
      return this.kafka;
    }

    getProducer() {
        return {
          chatNotificationProducer: new ChatNotificationProducer(this.kafka.producer)
        }
    }
  }

  export const messageBroker = new MessageBroker();
