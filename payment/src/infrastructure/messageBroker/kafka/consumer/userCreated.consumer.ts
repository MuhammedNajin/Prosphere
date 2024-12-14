
import userRepository from '@infrastructure/repository/user.repository';
import { KafkaConsumer, Topics, UserCreatedEvent } from '@muhammednajinnprosphere/common'
import { Consumer, KafkaMessage } from 'kafkajs';

export class UserCreatedConsumer extends KafkaConsumer<UserCreatedEvent> {
    topic: Topics.userCreated = Topics.userCreated;

    constructor(consumer: Consumer) {
        super(consumer);
    }

    async onConsume(data: UserCreatedEvent['data'], msg: KafkaMessage): Promise<void> {
        console.log("heloo from consumer", data);
       try {
        const newUser = { 
            userId: data._id,
            username: data.username,
            email: data.email,
            phone: data.phone,
            jobRole: data.jobRole,
        }
          const user = userRepository.create(newUser);
          console.log("user created user", user);
       } catch (error) {
         console.log(error);
       }
       
    }
}