import mongoose, { Model, Document } from "mongoose";
import { NotificationAttrs, NotificationDoc } from "@/shared/types/interface";

export interface NotificationModel extends Model<NotificationDoc> {
  build(attrs: NotificationAttrs): NotificationDoc;
}

const NotificationSchema = new mongoose.Schema<NotificationDoc, NotificationModel>(
  {
    recipient: {
      type: String,
      ref: "User",
      required: [true, "Recipient is required"],
      index: true
    },

    type: {
      type: String,
      enum: ["application", "job", "interview_invite", "profile_view", "message", "reminder"],
      required: [true, "Notification type is required"],
      index: true
    },

    context: {
       type: String,
       enum: ["user", "company"],
       default: 'user'
    },

    companyId: {
       type: mongoose.Schema.Types.ObjectId,
       default: null
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot be longer than 100 characters"]
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [500, "Message cannot be longer than 500 characters"]
    },

    data: {
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
      },
      applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
      },
      messageId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
      },
      employerId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
      },
      conversationId: {
        type: String,
        default: null
      }
    },

    status: {
      type: String,
      enum: ["unread", "read", "archived"],
      default: "unread",
      index: true
    },

    actionUrl: {
      type: String,
      default: null
    },

    readAt: {
      type: Date,
      default: null
    },

    archivedAt: {
      type: Date,
      default: null
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },

    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

NotificationSchema.index({ recipient: 1, status: 1, createdAt: -1 });
NotificationSchema.index({ recipient: 1, isDeleted: 1 });

NotificationSchema.statics.build = (attrs: NotificationAttrs) => {
  return new Notification(attrs);
};

const Notification = mongoose.model<NotificationDoc, NotificationModel>(
  "Notification",
  NotificationSchema
);

export default Notification;