import mongoose, { Model, Document } from "mongoose";

export interface UserAttrs {
  username: string;
  email: string;
  phone?: string;
  jobRole?: string;
}

export interface UserDoc extends Document {
  _id: string
  username: string;
  email: string;
  phone: string;
  jobRole: string;
  profilePhoto: string
  about: string
}


export interface UserModel extends Model<UserDoc> {
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
    unique: [true, "phone should be unique"],
  },

  password: {
    type: String,
  },

  jobRole: {
    type: String,
  },

  avatar: {
    type: String,
  },

  about: {
    type: String,
  },

  coverImage: {
    type: String,
  },

  profilePhoto: {
    type: String,
  }

});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>(
  "User",
  userSchema
);

export default User;
