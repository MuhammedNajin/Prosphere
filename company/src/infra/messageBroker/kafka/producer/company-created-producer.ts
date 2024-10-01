import { KafkaProducer, CompanyCreatedEvent, Topics } from '@muhammednajinnprosphere/common';


export class CompanyCreatedProducer extends KafkaProducer<CompanyCreatedEvent> {
   topic: Topics.companyCreated = Topics.companyCreated;
}