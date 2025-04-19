import Profile, { ProfileDoc } from "../database/shemas/profile.schema";
import { UserProfile } from "@domain/entities/profile";
import { IUserProfile } from "@domain/entities/interface";
import {
  BadRequestError,
  UserCreatedEvent,
} from "@muhammednajinnprosphere/common";
import { ArrayFields, Experience } from "./type";
import {
  isDuplicateEducation,
  isDuplicateExperience,
  isDuplicateSkill,
} from "./validation";

interface UploadProfilePhotoArgs {
  email: string;
  query: any;
}
export default {
  uploadFile: async ({ id, query }: UploadProfilePhotoArgs) => {
    let updates: unknown = { $set: query };
    const key = "resumeKey";
    console.log("quey", query[key]);

    if (query[key]) {
      updates = { $push: query[key] };
    }

    const profile = await Profile.findOneAndUpdate({ _id: id }, updates, {
      new: true,
    });

    return profile;
  },

  setResume: async (_id: string, key: string) => {
    await Profile.findOneAndUpdate(
      { _id },
      {
        $addToSet: { resumeKey: key },
      }
    );
  },

  deleteResume: async (key: string, _id: string) => {
    await Profile.updateOne(
      { _id },
      { $pull: { resumeKey: key } }
    );
  },

  aboutMe: async (description: string, email: string) => {
    const updates = { $set: { about: description } };
    const user = await Profile.findOneAndUpdate({ email }, updates, {
      new: true,
    });
    console.log(user);
    return user;
  },

  createProfile: async (user: UserCreatedEvent["data"]) => {
    return await Profile.build(user).save();
  },

  getProfile: async (_id: string) => {
    return await Profile.findOne({ _id });
  },

  search: async (search: string) => {
    console.log("search", search);
     return await Profile.find({ 
      username: { $regex: search, $options: 'i' }

     })
  },

  updateProfile: async (
    email: string,
    body: ArrayFields,
    option: { isArray?: boolean } = {}
  ) => {
    console.log("isArray", option);
    try {
      if (option?.isArray) {
        const existingProfile = await Profile.findOne({ email });

        if (!existingProfile) {
          throw new Error("Profile not found");
        }

        if (body["experience"]) {
          const newExperience = body["experience"];

          if (newExperience.startDate > new Date()) {
            throw new BadRequestError("Start date cannot be in the future");
          }

          if (
            !newExperience.currentlyWorking &&
            newExperience.endDate < newExperience.startDate
          ) {
            throw new BadRequestError("End date must be after start date");
          }

          if (
            isDuplicateExperience(existingProfile.experience, newExperience)
          ) {
            throw new BadRequestError(
              "This experience entry already exists or overlaps with an existing entry"
            );
          }
        } else if (body["education"]) {
          const newEducation = body["education"];

          if (newEducation.startDate > new Date()) {
            throw new BadRequestError("Start date cannot be in the future");
          }

          if (
            newEducation.currentlyStudying !== "Yes" &&
            newEducation.endDate < newEducation.startDate
          ) {
            throw new BadRequestError("End date must be after start date");
          }

          if (isDuplicateEducation(existingProfile.education, newEducation)) {
            throw new BadRequestError(
              "This education entry already exists or overlaps with an existing entry"
            );
          }
        } else if (body["skills"]) {
          const newSkill = body["skills"][0];

          const validProficiencies = [
            "Beginner",
            "Intermediate",
            "Advanced",
            "Expert",
          ];
          if (!validProficiencies.includes(newSkill.proficiency)) {
            throw new BadRequestError("Invalid proficiency level");
          }

          if (isDuplicateSkill(existingProfile.skills, newSkill)) {
            throw new BadRequestError(
              "This skill already exists in your profile"
            );
          }
        }

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
    } catch (error) {
      throw error;
    }
  },
};
