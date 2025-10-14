import { KafkaClient, KafkaConsumer, Topics, UserCreatedEvent } from '@muhammednajinnprosphere/common';
import { KafkaMessage, Consumer } from 'kafkajs';
import { inject, injectable } from 'inversify';
import { UseCases, Connections } from '@/di/symbols';
import { CreateUserUseCase } from '@/application/usecases/user/create-user.usecase';


@injectable()
export class UserCreatedConsumer extends KafkaConsumer<UserCreatedEvent> {
  topic: Topics.userCreated = Topics.userCreated;

  constructor(
    @inject(Connections.KafkaConnection) private kafkaClient: KafkaClient,
    @inject(UseCases.CreateUserUseCase) private createUserUseCase: CreateUserUseCase
  ) {
    
    const consumer = kafkaClient.createConsumer(
      process.env.KAFKA_GROUP || "company-service-group"
    );
    super(consumer);
  }

  async onConsume(data: UserCreatedEvent['data'], msg: KafkaMessage): Promise<void> {
    console.log("📩 [UserCreatedConsumer] Received message");

    try {
      const user = await this.createUserUseCase.execute(data);
      console.log("✅ [UserCreatedConsumer] User created:", user);
    } catch (error) {
      console.error("❌ [UserCreatedConsumer] Error processing message:", error);
    }
  }
}
