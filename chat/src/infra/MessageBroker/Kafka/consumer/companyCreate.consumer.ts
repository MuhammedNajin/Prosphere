import Company from "@/infra/database/mongo/schema/company.schema";
import companyRepository from "@/infra/repository/company.repository";
import { KafkaConsumer, Topics, CompanyCreatedEvent } from '@muhammednajinnprosphere/common'
import { Consumer, KafkaMessage } from 'kafkajs';

export class CompanyCreatedConsumer extends KafkaConsumer<CompanyCreatedEvent> {
    topic: Topics.companyCreated = Topics.companyCreated;
    dependencies: any;

    constructor(consumer: Consumer) {
        super(consumer);
    }

    async onConsume(data: CompanyCreatedEvent['data'], msg: KafkaMessage): Promise<void> {
        console.log("heloo from company created", data);
       try {
        const {
            _id, 
            location,
            name,
            owner
           } = data;

           const dto = {
             _id: data.id,
             ...data
           }
           
           await companyRepository.create(dto)                                            
           
       } catch (error) {
         console.log(error);
         
       }
       
    }
}