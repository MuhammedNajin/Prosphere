import mongoose, { Model, Document } from "mongoose";

export interface profileAttrs {
  _id: string
  username: string;
  email: string;
  phone?: string;
  jobRole?: string;
}

export interface Experience {
  companyName: string;

  startDate: {
    startMonth: string;
    startYear: string;
  };

  endDate: {
    endMonth: string;
    endYear: string;
  };

  position: string;

  url: string;
}

export interface Education {
  school: string;
  startDate: {
    startMonth: string;
    startYear: string;
  };
  endDate: {
    endMonth: string;
    endYear: string;
  };
  degree: string;
  grade: string;
}

export interface ProfileDoc extends Document {
  username: string;
  email: string;
  phone: string;
  jobRole: string;
  profilePhoto: string;
  about: string;
  profileImageKey: string;
  experience: Experience;
  education: Education;
  skills: [string];
}

export interface ProfileModel extends Model<ProfileDoc> {
  build(attrs: profileAttrs): ProfileDoc;
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

  profileImageKey: {
    type: String,
  },

  experience: [
    {
      position: {
        type: String,
      },

      companyName: {
        type: String,
      },

      employmentType: {
        type: String,
      },

      locationType: {
        type: String,
        enum: ["on-site", "remote", "hybrid"],
      },

      startDate: {
        type: Date,
      },

      endDate: {
        type: Date,
      },

      currentlyWorking: {
        type: Boolean,
        default: true,
      },
    },
  ],

  education: [
    {
      school: {
        type: String,
      },

      degree: {
        type: String,
      },

      fieldOfStudy: {
        type: String,
      },

      startDate: {
        type: Date,
      },

      endDate: {
        type: Date,
      },

      currentlyStudying: {
        type: String,
      },

      grade: {
        type: String,
      },
    },
  ],

  skills: [
    {
      name: {
        type: String,
      },

      proficiency: {
        type: String,
      },
    },
  ],
});

profileSchema.statics.build = (attrs: profileAttrs) => {
  return new Profile(attrs);
};

const Profile = mongoose.model<ProfileDoc, ProfileModel>(
  "Profile",
  profileSchema
);

export default Profile;
