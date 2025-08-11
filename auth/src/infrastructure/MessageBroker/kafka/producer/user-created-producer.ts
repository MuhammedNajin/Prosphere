import { injectable } from 'inversify';
import { KafkaProducer, Topics, UserCreatedEvent } from '@muhammednajinnprosphere/common';

@injectable()
export class UserCreatedProducer extends KafkaProducer<UserCreatedEvent>  {
  topic: Topics.userCreated = Topics.userCreated;
}
