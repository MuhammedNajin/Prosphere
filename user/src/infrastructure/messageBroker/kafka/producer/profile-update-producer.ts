import { KafkaProducer, Topics, profileUpdateEvent } from '@muhammednajinnprosphere/common';

export class UserUpdateProducer extends KafkaProducer<profileUpdateEvent> {
    topic: Topics.profileUpdate = Topics.profileUpdate;
}