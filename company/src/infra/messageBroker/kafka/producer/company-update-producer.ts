import { KafkaProducer, Topics, CompanyUpdatedEvent } from '@muhammednajinnprosphere/common';

export class CompanyUpdateProducer extends KafkaProducer<CompanyUpdatedEvent> {
   topic: Topics.companyUpdated = Topics.companyUpdated;
}