import { SubscriptionAttrs, SubscriptionDoc } from "@/shared/types/subscription";
import mongoose, { Model, Document } from "mongoose";

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