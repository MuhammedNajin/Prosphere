import { KafkaConsumer, Topics, CompanyCreatedEvent } from '@muhammednajinnprosphere/common'
import { Consumer, KafkaMessage } from 'kafkajs';

export class CompanyCreatedConsumer extends KafkaConsumer<CompanyCreatedEvent> {
    topic: Topics.companyCreated = Topics.companyCreated;
    dependencies: any;

    constructor(consumer: Consumer, dependecies: any) {
        super(consumer);
        console.log("consuer", dependecies)
        this.dependencies = dependecies;
    }

    async onConsume(data: CompanyCreatedEvent['data'], msg: KafkaMessage): Promise<void> {
        console.log("heloo from consumer");
       try {
        const {
            _id, 
            location,
            name,
            owner
           } = data;
   
           const {
              useCases: { companyCreationUseCase }
           } = this.dependencies;
          
           const company = await companyCreationUseCase.execute({
            location,
            name,
            owner,
            _id,
           })

           console.log("onMessage", company);
       } catch (error) {
         console.log(error);
       }
       
    }
}