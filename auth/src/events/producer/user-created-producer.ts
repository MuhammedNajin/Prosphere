import { KafkaProducer, Topics, UserCreatedEvent } from '@muhammednajinnprosphere/common';


export class UserCreatedProducer extends KafkaProducer<UserCreatedEvent> {
    topic: Topics = Topics.userCreated;
}