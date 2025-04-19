import { IUserRepository } from "@/domain/IRepository/IUserRepository";
import { IChatRepository } from "@/domain/IRepository/IChatRepository";
import Conversation from "../database/mongo/schema/conversation.schema";
import Message, {
  MessageAttrs,
  MessageDoc,
  MessageModel,
} from "../database/mongo/schema/message.schema";
import mongoose from "mongoose";
import { MESSAGE_STATUS } from "@/shared/enums/messageEnums";
import { ROLE } from "@/shared/enums/roleEnums";

class ChatRepository implements IChatRepository {
  private Message = Message;
 
  async createMessage(
    messageDTO: MessageAttrs,
  ): Promise<MessageAttrs> {
    return (await Message.build(messageDTO).save()).populate('sender')
  }

  async getChat(conversationId: string, userId: string): Promise<MessageAttrs[]>{
    console.log("conversationId", conversationId)
      return await Message.find({ conversation: conversationId, deletedBy: {$nin: [userId]}  })
  }

  async findConversation(sender: string, receiver: string, context: ROLE, companyId: string, conversationId: string) {
    console.log("find Conversation from char repo", sender, receiver, context, companyId, conversationId);
      return await Conversation.findOne({
         _id: conversationId
      });
      
    // return await Conversation.findOne({
    //   $and: [
    //     { participants: sender },
    //     { participants: receiver },
    //     { context },
    //     { companyId },
    //     { 'participants.2': { $exists: false } } 
    //   ]
    // }).populate("companyId")
  }

  async createNewConversation(sender: string, receiver: string, _id: string, context: ROLE, companyId: string) {
    return (await Conversation.build({
      _id,
      participants: [sender, receiver],
      type: "direct",
      context, 
      companyId,
      createdAt: new Date()
    }).save()).populate('companyId')
  }

  async getConversation(queryParams: { userId?: string, companyId?: string, context: string }) {
    try {
      const baseAggregation = [];
       console.log("chat repo", queryParams);
       
      if (queryParams.context === ROLE.User) {
        baseAggregation.push({
          $match: {
            participants: new mongoose.Types.ObjectId(queryParams.userId),
          }
        });
      } else if (queryParams.context === ROLE.Company) {
        baseAggregation.push({
          $match: {
            companyId: new mongoose.Types.ObjectId(queryParams.companyId)
          }
        });
      } else {
        throw new Error('Either userId or companyId must be provided');
      }

      baseAggregation.push({
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'companyDetails' 
        }
      });

      baseAggregation.push({
        $addFields: {
          company: { $arrayElemAt: ['$companyDetails', 0] }
        }
      });

      if (queryParams.userId && queryParams.context === ROLE.User) {
        baseAggregation.push({
          $match: {
            $expr: {
              $ne: [
                '$company.owner',
                new mongoose.Types.ObjectId(queryParams.userId)
              ]
            }
          }
        });
      }

      baseAggregation.push({
        $lookup: {
          from: 'messages',
          let: { conversationId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$conversation', '$$conversationId'] },
                deleted: false,
                ...(queryParams.userId && {
                  sender: { $ne: new mongoose.Types.ObjectId(queryParams.userId) },
                  'readBy.user': { 
                    $not: { $eq: new mongoose.Types.ObjectId(queryParams.userId) }
                  }
                }),
                status: { $ne: 'read' }
              }
            }
          ],
          as: 'unreadMessages'
        }
      });

      baseAggregation.push({
        $lookup: {
          from: 'messages',
          localField: 'lastMessage',
          foreignField: '_id',
          as: 'lastMessageDetails'
        }
      });

      baseAggregation.push({
        $lookup: {
          from: 'users',
          let: { participantIds: '$participants' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$_id', '$$participantIds'] },
                    ...(queryParams.userId ? [
                      { $ne: ['$_id', new mongoose.Types.ObjectId(queryParams.userId)] }
                    ] : [])
                  ]
                }
              }
            },
            {
              $project: {
                _id: 1,
                username: 1,
                avatar: 1,
                role: 1,
                email: 1,
                status: 1,
                lastSeen: 1
              }
            }
          ],
          as: 'otherParticipants'
        }
      });

      baseAggregation.push({
        $project: {
          id: "$_id",
          _id: 0,
          type: 1,
          context: 1,
          company: {
            id: '$company._id',           
            name: '$company.name',
            logo: '$company.logo',
            owner: '$company.owner',
            status: '$company.status',
            contactEmail: '$company.contactEmail',
            website: '$company.website'
          },
          unreadCount: { $size: '$unreadMessages' },
          lastMessage: { $arrayElemAt: ['$lastMessageDetails', 0] },
          participants: '$otherParticipants',
          createdAt: 1,
          updatedAt: 1
        }
      });

      baseAggregation.push({
        $sort: { 
          'lastMessage.createdAt': -1, 
          createdAt: -1 
        }
      });

      const conversations = await Conversation.aggregate(baseAggregation);
      
      console.log("conversations", conversations);
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
    console.log("readMessage repo", conversationId, status);
    
       await Message.updateMany({ conversation: conversationId, sender }, {
         $set: { status }
      },
    )
  }

  async deliverAll(receiver: string) {
    try {
      console.log(" deliver message from repo", receiver);
      await Message.updateMany({ receiver, status: { $ne: MESSAGE_STATUS.READ } }, {
          $set: { status: MESSAGE_STATUS.DELIVERED }
      })
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async deleteForEveryOne(_id: string): Promise<void> {
     try {
         await Message.deleteOne({ _id })
     } catch (error) {
       throw error
     }
  }

  async delete(_id: string, userId: string): Promise<void> {
     try {
      console.log("delete from repo", _id, userId)
         await Message.updateOne({ _id }, {
            $addToSet: { deletedBy: userId }
         })
     } catch (error) {
       throw error
     }
  }


}

export default new ChatRepository();