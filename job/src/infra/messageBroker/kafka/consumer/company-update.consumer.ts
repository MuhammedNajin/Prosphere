import { KafkaConsumer, Topics, CompanyUpdatedEvent } from '@muhammednajinnprosphere/common'
import { Consumer, KafkaMessage } from 'kafkajs';
import { CompanyRepository } from '@/infra/repository';
import { UpdateCompanyRepository } from '@/infra/repository/company/companyUpdate.repository';
export class CompanyUpdatedConsumer extends KafkaConsumer<CompanyUpdatedEvent> {
    topic: Topics.companyUpdated = Topics.companyUpdated;

    constructor(consumer: Consumer) {
        super(consumer);
    }

    async onConsume(data: CompanyUpdatedEvent['data'], msg: KafkaMessage): Promise<void> {
        console.log("heloo from company update", msg, data);
       try {
        const {
             id,
             logo
           } = data;     
         await  UpdateCompanyRepository.update(id, { logo });
       } catch (error) {
         console.log(error);
       }
       
    }
}