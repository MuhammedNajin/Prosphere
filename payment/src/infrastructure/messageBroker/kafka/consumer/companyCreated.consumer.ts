import { KafkaConsumer, Topics, CompanyCreatedEvent } from '@muhammednajinnprosphere/common'
import { Consumer, KafkaMessage } from 'kafkajs';
import companyRepository from '@/infrastructure/repository/company.repository';
import userRepository from '@/infrastructure/repository/user.repository';
import { User } from '@/infrastructure/database/sql/entities/user.entity';
import { Company } from '@/infrastructure/database/sql/entities/company.entitiy';

export class CompanyCreatedConsumer extends KafkaConsumer<CompanyCreatedEvent> {
    topic: Topics.companyCreated = Topics.companyCreated;

    constructor(consumer: Consumer) {
        super(consumer);
    }

    async onConsume(data: CompanyCreatedEvent['data'], msg: KafkaMessage): Promise<void> {
        console.log("heloo from company created", msg, data);
       try {
        const {
            _id, 
            location,
            name,
            owner
           } = data;
           const user = await userRepository.find(owner);

           const companyDto = new Company()
             
          companyDto.companyId = _id
          companyDto.name = name;
          companyDto.owner = user as User;
        
          const company = await companyRepository.create(companyDto)
        
          console.log("onMessage", company);
       } catch (error) {
         console.log(error);
       }
       
    }
}