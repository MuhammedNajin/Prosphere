import { KafkaConsumer, Topics, UserCreatedEvent } from '@muhammednajinnprosphere/common'
import { Consumer, KafkaMessage } from 'kafkajs';

export class UserCreatedConsumer extends KafkaConsumer<UserCreatedEvent> {
    topic: Topics.userCreated = Topics.userCreated;
    dependencies: any;

    constructor(consumer: Consumer, dependecies: any) {
        super(consumer);
        this.dependencies = dependecies;
    }

    async onConsume(data: UserCreatedEvent['data'], msg: KafkaMessage): Promise<void> {
        console.log("heloo from consumer");
       try {
        const { 
            _id,
            email,
            jobRole,
            phone,
            username,
           } = data;
   
           const {
              useCases: { createProfileUseCase }
           } = this.dependencies;
          
           const profile = await createProfileUseCase(this.dependencies).execute({
             _id,
             email,
             jobRole,
             phone,
             username,
           })

           console.log("onMessage", profile);
       } catch (error) {
         console.log(error);
       }
       
    }
}