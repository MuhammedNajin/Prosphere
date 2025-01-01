import Profile from "../database/shemas/profile.schema";
import { UserProfile } from "@domain/entities/profile";
import { IUserProfile } from "@domain/entities/interface";
import { UserCreatedEvent } from "@muhammednajinnprosphere/common";

interface UploadProfilePhotoArgs {
   email: string,
   query: any,
}
export default {
  uploadFile: async ({ id , query}: UploadProfilePhotoArgs) => {
    let updates: unknown = { $set: query };
    const key = 'resumeKey'
    console.log("quey", query[key]);
    
    if(query[key]) {
      updates = { $push: query[key]}
    }
    
    const profile = await Profile.findOneAndUpdate({ _id: id }, updates, {
      new: true,
    });

    return profile; 
  },

  setResume: async (_id: string, key: string) => {
    await Profile.findOneAndUpdate({ _id }, {
      $addToSet: { resumeKey: key }
    })
  },

  aboutMe: async (description: string, email: string) => {
    const updates = { $set: { about: description } };
    const user = await Profile.findOneAndUpdate({ email }, updates, {
      new: true,
    });
    console.log(user);
    return user;
  },
   

  createProfile: async (user: UserCreatedEvent['data']) => {
    return await Profile.build(user).save();
  },

  getProfile: async (_id: string) => {
    return await Profile.findOne({ _id });
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
