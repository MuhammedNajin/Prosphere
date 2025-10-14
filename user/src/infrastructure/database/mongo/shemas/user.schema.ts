import {
  IEducation,
  IExperience,
  ILocation,
  ISkill,
  IUser,
  ISocialLinks,
  IPreferences,
  EmploymentType,
  SkillProficiency,
} from '@/domain/interface/IUser';
import { Schema, model, Document, Model } from 'mongoose';
import { UserRole } from '@muhammednajinnprosphere/common';

export interface IUserDocument extends IUser, Document {
  id: string;
}

interface IUserModel extends Model<IUserDocument> {
  build(attrs: Partial<IUser>): IUserDocument;
}


const LocationSchema = new Schema<ILocation>(
  {
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    placename: { type: String, trim: true },
    coordinates: {
      lat: { type: Number, min: -90, max: 90 },
      lng: { type: Number, min: -180, max: 180 },
    },
  },
  { _id: false }
);

const ExperienceSchema = new Schema<IExperience>(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    companyId: { type: String, trim: true, ref: 'Company' },

    location: LocationSchema,
    
    employmentType: {
      type: String,
      enum: Object.values(EmploymentType),
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value: Date) => value <= new Date(),
        message: 'Start date cannot be in the future',
      },
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (this: IExperience, value: Date) {
          if (!this.isCurrentRole && value) {
            return value >= this.startDate;
          }
          return true;
        },
        message: 'End date must be after start date',
      },
    },
    isCurrentRole: { type: Boolean, default: false },
    description: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    achievements: [{ type: String, trim: true }],
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);


const EducationSchema = new Schema<IEducation>(
  {
    school: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    fieldOfStudy: { type: String, required: true, trim: true },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value: Date) => value <= new Date(),
        message: 'Start date cannot be in the future',
      },
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (this: IEducation, value: Date) {
          if (!this.isCurrentStudent && value) {
            return value >= this.startDate;
          }
          return true;
        },
        message: 'End date must be after start date',
      },
    },
    isCurrentStudent: { type: Boolean, default: false },
    description: { type: String, trim: true },
    gpa: { type: Number, min: 0, max: 10 },
    activities: [{ type: String, trim: true }],
    honors: [{ type: String, trim: true }],
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, trim: true, lowercase: true },
    proficiency: {
      type: String,
      enum: Object.values(SkillProficiency),
      default: SkillProficiency.INTERMEDIATE,
    },
    yearsOfExperience: { type: Number, min: 0 },
    endorsements: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const SocialLinksSchema = new Schema<ISocialLinks>(
  {
    linkedin: String,
    twitter: String,
    github: String,
    portfolio: String,
    website: String,
    other: { type: Map, of: String },
  },
  { _id: false }
);

const PreferencesSchema = new Schema<IPreferences>(
  {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    profileVisibility: {
      type: String,
      enum: ['PUBLIC', 'PRIVATE', 'CONNECTIONS_ONLY'],
      default: 'PUBLIC',
    },
    jobAlerts: { type: Boolean, default: true },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'UTC' },
  },
  { _id: false }
);

// --- MAIN USER SCHEMA ---
const UserSchema = new Schema<IUserDocument>(
  {
    // Core Auth Fields
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-zA-Z0-9_-]+$/,
    },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    isVerified: { type: Boolean, default: false },

    // Profile
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    headline: { type: String, trim: true, maxlength: 120 },
    about: { type: String, trim: true, maxlength: 2000 },
    location: LocationSchema,

    // Media
    profileImageKey: { type: String, trim: true },
    coverImageKey: { type: String, trim: true },
    resumeKeys: [{ type: String, trim: true }],

    // Professional
    experience: [ExperienceSchema],
    education: [EducationSchema],
    skills: [SkillSchema],

    // Social
    socialLinks: SocialLinksSchema,

    // Business
    managedCompanies: [{ type: String, trim: true, ref: 'Company' }],

    // Preferences
    preferences: PreferencesSchema,

    // Status
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
    emailVerifiedAt: Date,
    phoneVerifiedAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Static build method
UserSchema.statics.build = function (attrs: Partial<IUser>): IUserDocument {
  return new this(attrs);
};

// Indexes
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ 'location.city': 1 });
UserSchema.index({ 'location.country': 1 });
UserSchema.index({ 'skills.name': 1 });
UserSchema.index({ createdAt: -1 });

export const UserModel = model<IUserDocument, IUserModel>('User', UserSchema);
