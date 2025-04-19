import {
  KafkaConsumer,
  Topics,
  ProfileUpdateEvent,
} from "@muhammednajinnprosphere/common";
import { Consumer, KafkaMessage } from "kafkajs";
import { UserUpdateRepository } from "@/infra/repository/user/userUpdate.repository";
export class AvatarUpdateConsumer extends KafkaConsumer<ProfileUpdateEvent> {
  topic: Topics.profileUpdate = Topics.profileUpdate;

  constructor(consumer: Consumer) {
    super(consumer);
  }

  async onConsume(
    data: ProfileUpdateEvent["data"],
    msg: KafkaMessage
  ): Promise<void> {
    console.log("heloo from job service update avatar", msg, data);
    try {
      await UserUpdateRepository.updateUser(data.id, data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
