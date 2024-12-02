import { IUserRepository } from "@/domain/IRepository/IUserRepository";
import { IChatRepository } from "@/domain/IRepository/IChatRepository";
import Conversation from "../database/mongo/schema/conversation.schema";
import Message, {
  MessageAttrs,
  MessageDoc,
  MessageModel,
} from "../database/mongo/schema/message.schema";
import mongoose from "mongoose";

class ChatRepository implements IChatRepository {
  private Message = Message;
 
  async createMessage(
    messageDTO: MessageAttrs,
  ): Promise<MessageAttrs> {
    return await Message.build(messageDTO).save()
  }

  async getChat(conversationId: string): Promise<MessageAttrs[]>{
      return await Message.find({ conversation: conversationId })
  }

  async findConversation(sender: string, receiver: string) {
    return await Conversation.findOne({
      $and: [
        { participants: sender },
        { participants: receiver },
        { 'participants.2': { $exists: false } }  // Ensures exactly 2 participants
      ]
    });
  }

  async createNewConversation(sender: string, receiver: string) {
    return await Conversation.create({
      participants: [sender, receiver],
      type: "direct",
      createdAt: new Date()
    });
  }

  async getConversation(id: string) {
    return await Conversation.find({ participants: { $in: [id]}}).populate({
      path: 'participants lastMessage',
      match: { _id: { $ne: id } }
    })
  }

  async updateConversation(_id: string, mutation: object): Promise<void> {
     await Conversation.updateOne({_id}, {
       $set: { ...mutation }
     })
  }

  async changeMessageStatus(_id: string, status: MessageDoc['status']): Promise<MessageDoc | null> {
      return await Message.findByIdAndUpdate({ _id }, {
         $set: { status }
      },
      { new: true }
    )
  }
}

export default new ChatRepository();