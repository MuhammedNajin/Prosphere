// user-created-producer.ts
import { injectable, inject } from "inversify";
import { Producer } from "kafkajs";
import { KafkaClient, KafkaProducer, Topics, UserCreatedEvent } from "@muhammednajinnprosphere/common";
import { Connections } from "@/di/symbols";
import { KafkaConnection } from "@/config/kafka-connection";


@injectable()
export class UserCreatedProducer extends KafkaProducer<UserCreatedEvent> {
  topic: Topics.userCreated = Topics.userCreated;

  constructor(
    @inject(Connections.KafkaConnection) kafkaConnection: KafkaClient
  ) {
    const producer: Producer = kafkaConnection.producer;
    super(producer);
  }
}
