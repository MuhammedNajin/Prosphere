import { KafkaClient } from '@muhammednajinnprosphere/common';
import { CompanyCreatedConsumer } from '@infra/messageBroker/kafka';

class MessageBrokerConnection {
  private static kafkaClient: KafkaClient;

  private constructor() {}

  public static async connect(dependencies: any): Promise<void> {
    if (!this.kafkaClient) {
      this.kafkaClient = new KafkaClient();
    }

    await this.kafkaClient.connect('job-service', ['localhost:29092'], "job-service-group");
    new CompanyCreatedConsumer(this.kafkaClient.consumer, dependencies).listen();
  }

  public static get kafka(): KafkaClient {
    if (!this.kafkaClient) {
      throw new Error('Kafka client not initialized. Call connect() first.');
    }
    return this.kafkaClient;
  }
}

export  { MessageBrokerConnection };