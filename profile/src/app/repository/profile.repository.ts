import Profile from "../database/shemas/profile.schema";
import { UserProfile } from "../../entities/profile";
import { IUserProfile } from "../../entities/interface";

export default {
  uploadProfilePhoto: async ({ url, email, key }) => {
    const updates = { $set: { profilePhoto: url, profileImageKey: key } };
    const profile = await Profile.findOneAndUpdate({ email }, updates, {
      new: true,
    });

    return profile;
  },

  aboutMe: async (description: string, email: string) => {
    const updates = { $set: { about: description } };
    const user = await Profile.findOneAndUpdate({ email }, updates, {
      new: true,
    });
    console.log(user);
    return user;
  },

  createProfile: async (user: IUserProfile) => {
    const profile = new UserProfile(user);
    console.log("profile", profile);
    return await Profile.build(profile).save();
  },

  getProfile: async (email: string) => {
    return await Profile.findOne({ email });
  },

  updateProfile: async (
    email: string,
    body: Object,
    option: { isArray?: boolean } = {}
  ) => {
    console.log("isArray", option)
    if (option?.isArray) {
      return await Profile.findOneAndUpdate(
        { email },
        {
          $addToSet: { ...body },
        },
        {
          new: true,
        }
      );
    }
    return await Profile.findOneAndUpdate(
      { email },
      {
        $set: { ...body },
      },
      {
        new: true,
      }
    );
  },
};
