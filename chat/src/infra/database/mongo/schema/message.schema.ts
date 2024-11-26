import mongoose, { Model, Document } from 'mongoose';

// Message Interfaces
export interface MessageAttrs {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: {
    type: 'text' | 'image' | 'file' | 'audio';
    text?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
  };
  replyTo?: mongoose.Types.ObjectId;
}

export interface MessageDoc extends Document {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: {
    type: 'text' | 'image' | 'file' | 'audio';
    text: string | null;
    fileUrl: string | null;
    fileName: string | null;
    fileSize: number | null;
    mimeType: string | null;
  };
  replyTo: mongoose.Types.ObjectId | null;
  readBy: Array<{
    user: mongoose.Types.ObjectId;
    readAt: Date;
  }>;
  deliveredTo: Array<{
    user: mongoose.Types.ObjectId;
    deliveredAt: Date;
  }>;
  deleted: boolean;
  deletedAt: Date | null;
}

export interface MessageModel extends Model<MessageDoc> {
  build(attrs: MessageAttrs): MessageDoc;
}

// Message Schema
const MessageSchema = new mongoose.Schema<MessageDoc, MessageModel>({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: [true, 'Conversation is required']
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required']
  },
  content: {
    type: {
      type: String,
      enum: ['text', 'image', 'file', 'audio'],
      required: [true, 'Content type is required']
    },
    text: {
      type: String,
      default: null
    },
    fileUrl: {
      type: String,
      default: null
    },
    fileName: {
      type: String,
      default: null
    },
    fileSize: {
      type: Number,
      default: null
    },
    mimeType: {
      type: String,
      default: null
    }
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  deliveredTo: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    deliveredAt: {
      type: Date,
      default: Date.now
    }
  }],
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Static build method for Message
MessageSchema.statics.build = (attrs: MessageAttrs) => {
  return new Message(attrs);
};

// Create model
const Message = mongoose.model<MessageDoc, MessageModel>('Message', MessageSchema);

export default Message;