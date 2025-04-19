import { KafkaProducer, Topics, TrailUpdateEvent } from '@muhammednajinnprosphere/common';

export class UpdateTrailProducer extends KafkaProducer<TrailUpdateEvent> {
    topic: Topics.trailUpdate = Topics.trailUpdate;
}


