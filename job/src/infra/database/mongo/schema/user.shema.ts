import mongoose, { Model, Document } from "mongoose";

export interface UserAttrs {
  _id: string,  
  username: string;
  email: string;
  phone?: string;
  jobRole?: string;
}



export interface UserDoc extends Document {
  _id: string,
  username: string;
  email: string;
  phone: string;
  jobRole: string;
  profilePhoto: string;
  about: string;
  profileImageKey: string;
}

export interface ProfileModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema({
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
  },

  jobRole: {
    type: String,
  },

  about: {
    type: String,
  },

  coverImageKey: {
    type: String,
  },

  coverImageUrl: {
    type: String,
  },

  profilePhoto: {
    type: String,
  },

  profileImageKey: {
    type: String,
  },
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, ProfileModel>(
  "User",
  userSchema
);

export default User;
