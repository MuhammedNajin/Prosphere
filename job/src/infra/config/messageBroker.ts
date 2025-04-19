import { KafkaClient } from "@muhammednajinnprosphere/common";
import {
  CompanyCreatedConsumer,
  UserCreatedConsumer,
} from "@infra/messageBroker/kafka";
import { AvatarUpdateConsumer } from "../messageBroker/kafka/consumer/avatar-update.consumer";
import { CompanyUpdatedConsumer } from "../messageBroker/kafka/consumer/company-update.consumer";
import { SubscriptionConsumer } from "../messageBroker/kafka/consumer/subscription.consumer";

class MessageBrokerConnection {
  private static kafkaClient: KafkaClient = new KafkaClient();
  private constructor() {}

  public static async connect(dependencies: any): Promise<void> {
    const KAFKA_BROKER = process.env.MESSAGE_BROKERS || "localhost:29092";
    const KAFKA_GROUP = process.env.KAFKA_GROUP || "job-service-group";
    const KAFKA_CLIENT = process.env.USER_CLIENT_ID || "job-service";
    await this.kafkaClient.connect(
      KAFKA_CLIENT,
      [KAFKA_BROKER],
      KAFKA_GROUP
    );
    const userCreateConsumer = await this.kafkaClient.getCosumer(
      "user-created-group"
    );
    const companyCreateConsumer = await this.kafkaClient.getCosumer(
      "company-created-group"
    );
    const avatarUpdateConsumer = await this.kafkaClient.getCosumer(
      "avatar-update-group"
    );
    const companyUpdateConsumer = await this.kafkaClient.getCosumer(
      "company-update-group"
    )

    const subscriptionConsumer = await this.kafkaClient.getCosumer(
      "subscription-job-group"
    )

    const companyCreate = new CompanyCreatedConsumer(
      companyCreateConsumer!,
      dependencies
    );
    
    const userCreate = new UserCreatedConsumer(
      userCreateConsumer!,
      dependencies
    );

    const avatarUpdate = new AvatarUpdateConsumer(avatarUpdateConsumer!);
    const companyUpdate = new CompanyUpdatedConsumer(companyUpdateConsumer!);
    const subscription = new SubscriptionConsumer(subscriptionConsumer!)

    companyCreate.listen();
    userCreate.listen();
    avatarUpdate.listen();
    companyUpdate.listen();
    subscription.listen();
  }

  public static get kafka(): KafkaClient {
    if (!this.kafkaClient) {
      throw new Error("Kafka client not initialized. Call connect() first.");
    }
    return this.kafkaClient;
  }

  public static async disconnect(): Promise<void> {
    try {
      if (this.kafkaClient) {
        await this.kafkaClient.disconnect();
        console.log("Kafka disconnected successfully");
      }
    } catch (error) {
      console.error("Error disconnecting from Kafka:", error);
      throw error;
    }
  }
}

export { MessageBrokerConnection };
