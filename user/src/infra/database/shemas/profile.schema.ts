import mongoose, { Model, Document } from "mongoose";

export interface Location {
  placename?: string;
  type: "Point";
  coordinates: number[];
}

export interface profileAttrs {
  username: string;
  email: string;
  phone?: string;
  jobRole?: string;
  about?: string;
  coverImageKey?: string;
  profileImageKey?: string;
  resumeKey?: string[];
  gender?: string;
  location?: Location;
  experience?: Experience[];
  education?: Education[];
  skills?: Skill[];
}

export interface Experience {
  position?: string;
  companyName?: string;
  employmentType?: string;
  locationType?: "on-site" | "remote" | "hybrid";
  startDate?: Date;
  endDate?: Date;
  currentlyWorking?: boolean;
}

export interface Education {
  school?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: Date;
  endDate?: Date;
  currentlyStudying?: string;
  grade?: string;
}

export interface Skill {
  name?: string;
  proficiency?: string;
}

export interface ProfileDoc extends Document {
  username: string;
  email: string;
  phone?: string;
  jobRole?: string;
  about?: string;
  coverImageKey?: string;
  profileImageKey?: string;
  resumeKey: string[];
  gender?: string;
  location?: Location;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
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
    unique: [true, "email should be unique"],
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

  resumeKey: {
    type: [String],
    default: [],
  },

  gender: {
    type: String,
  },

  location: {
    placename: {
      type: String,
    },

    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
    },
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

const Profile = mongoose.model<ProfileDoc, ProfileModel>("Profile", profileSchema);

export default Profile;