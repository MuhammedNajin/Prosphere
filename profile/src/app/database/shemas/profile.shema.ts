import mongoose, { Model } from "mongoose";

interface profileAttrs {
  username: string;
  email: string;
  phone?: string;
  jobRole?: string;
}

export interface ProfileModel extends Model<ProfileDoc> {}

export interface ProfileDoc extends Document {
  username: string;
  email: string;
  phone: string;
  jobRole: string;
}

const profileSchema = new mongoose.Schema({
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

  profileImage: {
    type: String,
  }
  
});

profileSchema.statics.build = (attrs: profileAttrs) => {
  return new Profile(attrs);
};

const Profile = mongoose.model<ProfileDoc, ProfileModel>(
  "Profile",
  profileSchema
);

export default Profile;
