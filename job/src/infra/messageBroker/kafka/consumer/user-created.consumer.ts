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
        console.log("heloo from consumer", data);
       try {
           console.log("userCreated event", data);
           const {
              userUseCases: { userCreationUseCase },
           } = this.dependencies;
            const dto = {
               _id: data.id,
               ...data
            }

            console.log("dto", dto);
           const profile = await userCreationUseCase.execute(dto)

           console.log("onMessage", profile);
       } catch (error) {
         console.log('error$$$$$((())))))', error);
       }
       
    }
}