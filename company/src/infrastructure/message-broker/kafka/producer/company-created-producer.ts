// company-created-producer.ts
import { injectable, inject } from "inversify";
import { Producer } from "kafkajs";
import { 
  KafkaClient, 
  KafkaProducer, 
  CompanyCreatedEvent, 
  Topics 
} from "@muhammednajinnprosphere/common";
import { Connections } from "@/di/symbols";


@injectable()
export class CompanyCreatedProducer extends KafkaProducer<CompanyCreatedEvent> {
  topic: Topics.companyCreated = Topics.companyCreated;

  constructor(
    @inject(Connections.KafkaConnection) kafkaConnection: KafkaClient
  ) {
    const producer: Producer = kafkaConnection.producer;
    super(producer);
  }
}
