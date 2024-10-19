import { KafkaClient } from '@muhammednajinnprosphere/common';
import { CompanyCreatedConsumer, UserCreatedConsumer } from '@infra/messageBroker/kafka';

class MessageBrokerConnection {
  private static kafkaClient: KafkaClient = new KafkaClient();
  private constructor() {}

  public static async connect(dependencies: any): Promise<void> {
    await this.kafkaClient.connect('job-service', ['localhost:29092'], "job-service-group");
     const userCreateConsumer = await this.kafkaClient.getCosumer('user-created-group')
     const companyCreateConsumer = await this.kafkaClient.getCosumer('company-created-group')
     const  companyCreate = new CompanyCreatedConsumer(companyCreateConsumer!, dependencies)
     const  userCreate = new UserCreatedConsumer(userCreateConsumer!, dependencies)
    console.log(companyCreate,"listeennnnnnnnn", userCreate);
      companyCreate.listen()
      userCreate.listen()
  }

  public static get kafka(): KafkaClient {
    if (!this.kafkaClient) {
      throw new Error('Kafka client not initialized. Call connect() first.');
    }
    return this.kafkaClient;
  }


  public static async disconnect(): Promise<void> {
    try {
        if (this.kafkaClient) {
            await this.kafkaClient.disconnect();
            console.log('Kafka disconnected successfully');
        }
    } catch (error) {
        console.error('Error disconnecting from Kafka:', error);
        throw error;
    }
}
}

export  { MessageBrokerConnection };