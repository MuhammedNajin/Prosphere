import mongoose, { Model, Document } from "mongoose";

interface LimitConfig {
  jobPostLimit: number;
  videoCallLimit: number;
  messageLimit: number;
}

export interface SubscriptionAttrs {
  companyId: mongoose.Types.ObjectId;
  trialLimit?: LimitConfig;
  usageLimit: LimitConfig;
  isSubscribed?: boolean;
  duration?: number;
  startDate?: Date;
  endDate?: Date;
  status?: 'active' | 'expired' | 'cancelled';
}

export interface SubscriptionDoc extends Document {
  companyId: mongoose.Types.ObjectId;
  trialLimit: LimitConfig;
  usageLimit: LimitConfig;
  isSubscribed: boolean;
  duration: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'cancelled';
  currentUsage: {
    jobPosts: number;
    videoCalls: number;
    messages: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PopulatedSubscriptionDoc
  extends Omit<SubscriptionDoc, "companyId"> {
  companyId: {
    _id: mongoose.Types.ObjectId;
    name: string;
  };
}

export interface SubscriptionModel extends Model<SubscriptionDoc> {
  build(attrs: SubscriptionAttrs): SubscriptionDoc;
}

const subscriptionSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company ID is required"],
    },

    trailLimit: {
      jobPostLimit: {
        type: Number,
        default: 1,
      },

      videoCallLimit: {
        type: Number,
        default: 1,
      },

      messageLimit: {
        type: Number,
        default: 10,
      },
    },

    usageLimit: {
      jobPostLimit: {
        type: Number,
        default: 0
      },

      videoCallLimit: {
        type: Number,
        default: 0
      },

      messageLimit: {
        type: Number,
        default: 0,
      },
    },

    isSubscribed: {
      type: Boolean,
      default: false,
    },

    duration: {
      type: Number,
      default: 0,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active',
    },
    
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

subscriptionSchema.statics.build = (attrs: SubscriptionAttrs) => {
  return new Subscription(attrs);
};

const Subscription = mongoose.model<SubscriptionDoc, SubscriptionModel>(
  "Subscription",
  subscriptionSchema
);

export default Subscription;