import { KafkaConsumer, Topics, UserCreatedEvent } from '@muhammednajinnprosphere/common'
import { Consumer, KafkaMessage } from 'kafkajs';

export class UserCreatedConsumer extends KafkaConsumer<UserCreatedEvent> {
    topic: Topics.userCreated = Topics.userCreated;
    dependencies: any;

    constructor(consumer: Consumer, dependecies: any) {
        super(consumer);
        console.log("consuer", dependecies)
        this.dependencies = dependecies;
    }

    async onConsume(data: UserCreatedEvent['data'], msg: KafkaMessage): Promise<void> {
        console.log("heloo from consumer");
       try {
        const { 
            email,
            jobRole,
            phone,
            username,
           } = data;
   
           const {
              useCases: { createUserUseCase }
           } = this.dependencies;
          
           const profile = await createUserUseCase(this.dependencies).execute({
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