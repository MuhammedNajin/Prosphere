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
        { 'participants.2': { $exists: false } } 
      ]
    });
  }

  async createNewConversation(sender: string, receiver: string, _id: string) {
    return await Conversation.create({
      _id,
      participants: [sender, receiver],
      type: "direct",
      createdAt: new Date()
    });
  }

  async getConversation(userId: string) {
    try {
      const conversations = await Conversation.aggregate([

        {
          $match: {
            participants: new mongoose.Types.ObjectId(userId)
          }
        },
        
        {
          $lookup: {
            from: 'messages',
            let: { conversationId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$conversation', '$$conversationId'] },
                  deleted: false,
                  sender: { $ne: new mongoose.Types.ObjectId(userId) },
                  status: { $ne: 'read' },
                  'readBy.user': { 
                    $not: { $eq: new mongoose.Types.ObjectId(userId) }
                  }
                }
              }
            ],
            as: 'unreadMessages'
          }
        },
  
        {
          $lookup: {
            from: 'messages',
            localField: 'lastMessage',
            foreignField: '_id',
            as: 'lastMessageDetails'
          }
        },
  
        {
          $lookup: {
            from: 'users',
            let: { participantIds: '$participants' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $in: ['$_id', '$$participantIds'] },
                      { $ne: ['$_id', new mongoose.Types.ObjectId(userId)] }
                    ]
                  }
                }
              },
              {
                $project: {
                  _id: 1,
                  username: 1,
                  avatar: 1,
                }
              }
            ],
            as: 'otherParticipants'
          }
        },

        {
          $project: {
            id: "$_id",
            _id: 0,
            type: 1,
            unreadCount: { $size: '$unreadMessages' },
            lastMessage: { $arrayElemAt: ['$lastMessageDetails', 0] },
            participants: '$otherParticipants',
            createdAt: 1,
            updatedAt: 1
          }
        },
  
        {
          $sort: { 
            'lastMessage.createdAt': -1, 
            createdAt: -1 
          }
        }
      ]);
      console.log("conversation", conversations)
      return conversations;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
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

  async readMessage(conversationId: string, status: MessageDoc['status'], sender: string): Promise<void> {
       await Message.updateMany({ conversation: conversationId, sender }, {
         $set: { status }
      },
    )
  }


}

export default new ChatRepository();