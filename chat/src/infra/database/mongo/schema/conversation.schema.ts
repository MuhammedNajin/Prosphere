import mongoose, { Model, Document } from "mongoose";
export interface ConversationAttrs {
  type: "direct" | "group";
  participants: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
  context: string;
  admins?: mongoose.Types.ObjectId[];
}
export interface ConversationDoc extends Document {
  type: "direct" | "group";
  participants: mongoose.Types.ObjectId[];
  lastMessage: mongoose.Types.ObjectId | null;
  admins: mongoose.Types.ObjectId[];
  context: string;
  companyId: mongoose.Schema.Types.ObjectId;
  muted: Array<{
    user: mongoose.Types.ObjectId;
    mutedUntil: Date | null;
  }>;
  pinnedBy: mongoose.Types.ObjectId[];
}

export interface ConversationModel extends Model<ConversationDoc> {
  build(attrs: ConversationAttrs): ConversationDoc;
}

const ConversationSchema = new mongoose.Schema<
  ConversationDoc,
  ConversationModel
>(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      required: [true, "Conversation type is required"],
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    context: {
      type: String,
      enum: ["user", "company"],
      default: "user",
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null,
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    muted: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        mutedUntil: {
          type: Date,
          default: null,
        },
      },
    ],

    pinnedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
      virtuals: true,
    },
    toObject: { virtuals: true },
  }
);

ConversationSchema.statics.build = (attrs: ConversationAttrs) => {
  return new Conversation(attrs);
};

const Conversation = mongoose.model<ConversationDoc, ConversationModel>(
  "Conversation",
  ConversationSchema
);

export default Conversation;
