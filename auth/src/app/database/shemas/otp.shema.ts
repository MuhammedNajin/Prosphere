import mongoose, { Document, Model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator"; // For email uniqueness

interface otpAttrs {
  userId: string; // Reference to user document
  otp: string;
  expiresAt?: Date; // Expiration time for security
}

export interface OtpModel extends Model<OtpDoc> {
  build(attrs: otpAttrs): OtpDoc;
}

export interface OtpDoc extends Document {
  userId: string;
  otp: string;
  expiresAt?: Date;
}

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth", // Reference to the user model
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: Date.now() + 60 * 60 * 1000
    }
  },
  { timestamps: true }
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 10000 });

otpSchema.statics.build = async (attrs: otpAttrs) => {
  const newOtp = new Otp(attrs);
  console.log("new", newOtp);

  return newOtp;
};

const Otp = mongoose.model<OtpDoc, OtpModel>("Otp", otpSchema);
// Ensure unique OTPs

export default Otp;
