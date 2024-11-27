import { IUserRepository } from "@/shared/interface/IUserRepository";
import { IChatRepository } from "@/shared/interface/IChatRepository";
import Conversation from "../database/mongo/schema/conversation.schema";
import Message, {
  MessageAttrs,
  MessageDoc,
  MessageModel,
} from "../database/mongo/schema/message.schema";

class ChatRepository implements IChatRepository {
  private Message = Message;
  constructor() {}

  async createMessage(
    messageDTO: MessageAttrs,
    receiverId: string
  ): Promise<MessageAttrs> {

    const conversation = await Conversation.findOne(
      {
        participants: {
          $all: [messageDTO.sender, receiverId],
        },
      },
      {
        $setOnInsert: {
          participants: [messageDTO.sender, receiverId],
          type: "direct",
          createdAt: new Date(),
        },
      },

      {
        upsert: true,
        new: true
      }
    );

    return await Message.create({
        
    })
  }
}

export default new ChatRepository();
