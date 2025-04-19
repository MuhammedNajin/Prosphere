import Company from "@/infra/database/mongo/schema/company.schema";
import userRepository from "@/infra/repository/user.repository";
import { KafkaConsumer, Topics, ProfileUpdateEvent } from '@muhammednajinnprosphere/common'
import { Consumer, KafkaMessage } from 'kafkajs';

export class AvatarUpdateConsumer extends KafkaConsumer<ProfileUpdateEvent> {
    topic: Topics.profileUpdate =  Topics.profileUpdate;

    constructor(consumer: Consumer) {
        super(consumer);
    }

    async onConsume(data: ProfileUpdateEvent['data'], msg: KafkaMessage): Promise<void> {
        console.log("heloo from company created", msg, data);
       try {
        
           await userRepository.updateUser(data.id, data)
           
       } catch (error) {
         console.log(error);
         throw error
       }
       
    }
}