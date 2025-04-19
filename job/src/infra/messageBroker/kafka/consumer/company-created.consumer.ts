import { KafkaConsumer, Topics, CompanyCreatedEvent } from '@muhammednajinnprosphere/common'
import { Consumer, KafkaMessage } from 'kafkajs';
import subscriptionRepository from '@infra/repository/subscription/subscription.repository'
export class CompanyCreatedConsumer extends KafkaConsumer<CompanyCreatedEvent> {
    topic: Topics.companyCreated = Topics.companyCreated;
    dependencies: any;

    constructor(consumer: Consumer, dependecies: any) {
        super(consumer);
        this.dependencies = dependecies;
     
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
   
           const {
            companyUseCases: { companyCreationUseCase }
           } = this.dependencies;
          
           const company = await companyCreationUseCase.execute({
            location,
            name,
            owner,
            _id,
           })

           await subscriptionRepository.createSubscription({ companyId: company._id });

           console.log("onMessage", company);
       } catch (error) {
         console.log(error);
       }
       
    }
}