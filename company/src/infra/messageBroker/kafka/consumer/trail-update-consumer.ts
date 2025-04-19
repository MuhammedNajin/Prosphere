import { KafkaConsumer, Topics, TrailUpdateEvent } from '@muhammednajinnprosphere/common'
import { Consumer, KafkaMessage } from 'kafkajs';
import { updateTrailUseCase } from '@/application/useCases/company/updateTrail.usecase';

export class UpdateTrailConsumer extends KafkaConsumer<TrailUpdateEvent> {
    topic: Topics.trailUpdate = Topics.trailUpdate;
    dependencies: any
    constructor(consumer: Consumer, dependencies: any) {
        super(consumer);
        this.dependencies = dependencies
    }

    async onConsume(data: TrailUpdateEvent['data'], msg: KafkaMessage): Promise<void> {
        console.log("heloo from consumer");
       try {
        const {
            companyId,
            key
           } = data;
   
          await updateTrailUseCase(this.dependencies).execute(companyId, key);

       } catch (error) {
         console.log(error);
       }
       
    }
}