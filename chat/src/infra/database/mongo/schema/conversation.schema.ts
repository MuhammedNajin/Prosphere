import mongoose, { Model, Document } from 'mongoose';

// Conversation Interfaces
export interface ConversationAttrs {
  type: 'direct' | 'group';
  participants: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
  name?: string;
  avatar?: string;
  admins?: mongoose.Types.ObjectId[];
}

export interface ConversationDoc extends Document {
  type: 'direct' | 'group';
  participants: mongoose.Types.ObjectId[];
  lastMessage: mongoose.Types.ObjectId | null;
  name: string | null;
  avatar: string | null;
  admins: mongoose.Types.ObjectId[];
  muted: Array<{
    user: mongoose.Types.ObjectId;
    mutedUntil: Date | null;
  }>;
  pinnedBy: mongoose.Types.ObjectId[];
}

export interface ConversationModel extends Model<ConversationDoc> {
  build(attrs: ConversationAttrs): ConversationDoc;
}

// Conversation Schema
const ConversationSchema = new mongoose.Schema<ConversationDoc, ConversationModel>({
  type: {
    type: String,
    enum: ['direct', 'group'],
    required: [true, 'Conversation type is required']
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  name: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: null
  },
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  muted: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    mutedUntil: {
      type: Date,
      default: null
    }
  }],
  pinnedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Static build method for Conversation
ConversationSchema.statics.build = (attrs: ConversationAttrs) => {
  return new Conversation(attrs);
};

// Create model
const Conversation = mongoose.model<ConversationDoc, ConversationModel>('Conversation', ConversationSchema);

export default Conversation;