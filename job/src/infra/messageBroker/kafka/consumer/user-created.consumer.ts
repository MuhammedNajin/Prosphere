import { KafkaConsumer, Topics, UserCreatedEvent } from '@muhammednajinnprosphere/common'
import { Consumer, KafkaMessage } from 'kafkajs';

export class UserCreatedConsumer extends KafkaConsumer<UserCreatedEvent> {
    topic: Topics.userCreated = Topics.userCreated;
    dependencies: any;

    constructor(consumer: Consumer, dependecies: any) {
        super(consumer);
        console.log("consuer", dependecies.userUseCase)
        this.dependencies = dependecies;
    }

    async onConsume(data: UserCreatedEvent['data'], msg: KafkaMessage): Promise<void> {
        console.log("heloo from consumer", data);
       try {
        const {
            _id,
            email,
            jobRole,
            phone,
            username,
           } = data;
           console.log("userCreated event", data);
           const {
              userUseCases: { userCreationUseCase },
           } = this.dependencies;
          
           const profile = await userCreationUseCase.execute({
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