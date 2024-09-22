import mongoose, { Document, Model } from "mongoose";
import Password from "../../../libs/utils/password";

interface authAttrs {
  username: string;
  email: string;
  phone?: string;
  password?: string;
  jobRole?: string;
  location?: null;
  authType?: string
}

export interface AuthModel extends Model<AuthDoc> {
  build(attrs: authAttrs): AuthDoc;
}

export interface AuthDoc extends Document {
  username: string;
  email: string;
  phone: string;
  password: string;
  jobRole: string;
  location?: null;
  companyName?: string;
  forgetPasswordToken: string;
  forgetPasswordTokenExpireAt: number;
  authType: "default" | "linkedIn" | "google";
  verified?: boolean;
  isBlocked: boolean;
  isAdmin: boolean;
}

const authSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is required"],
  },

  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, " email should be uniqe"],
  },

  phone: {
    type: String,
    unique: [true, "phone should be unique"],
  },

  password: {
    type: String,
  },

  jobRole: {
    type: String,
  },

  authType: {
    type: String,
    enum: ["default", "linkedIn", "google"],
    default: "default",
  },

  location: {
    type: String,
  },

  companyName: {
    type: String,
  },
  forgetPasswordToken: {
    type: String,
  },

  forgetPasswordTokenExpireAt: {
    type: Date,
    default: Date.now(),
  },
  
  verified: {
    type: Boolean,
    default: false,
  },

  isBlocked: {
    type: Boolean,
    default: false,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },
},
{ timestamps: true }
);

authSchema.pre("save", async function (next) {
  console.log(this.get("password"), this.isModified("password"));
  if (this.isModified("password")) {
    const hashedPassword = (await Password.toHash(
      this.get("password") as string
    )) as string;
    this.set("password", hashedPassword);
  }

  next();
});

authSchema.statics.build = (attrs: authAttrs) => {
  return new Auth(attrs);
};

const Auth = mongoose.model<AuthDoc, AuthModel>("Auth", authSchema);

export default Auth;
