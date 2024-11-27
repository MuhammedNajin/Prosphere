import { CreateUserUseCase } from '@/application/usecase/userUsecase/createUser.usecase';
import userRepository from '@/infra/repository/user.repository';
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
          const user = new CreateUserUseCase(userRepository).execute(data);
          console.log("user created user");
       } catch (error) {
         console.log(error);
       }
       
    }
}