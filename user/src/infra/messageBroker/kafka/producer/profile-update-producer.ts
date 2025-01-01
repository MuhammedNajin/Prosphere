import { KafkaProducer, Topics, profileUpdateEvent } from '@muhammednajinnprosphere/common';


export class ProfileUpdateProducer extends KafkaProducer<profileUpdateEvent> {
    topic: Topics.profileUpdate = Topics.profileUpdate;
}