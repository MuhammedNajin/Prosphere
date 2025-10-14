import { UserRole } from "@muhammednajinnprosphere/common";

/**
 * Enum for skill proficiency levels.
 */
export enum SkillProficiency {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate", 
  ADVANCED = "Advanced",
  EXPERT = "Expert",
}

/**
 * Enum for employment types in experience.
 */
export enum EmploymentType {
  FULL_TIME = "Full-time",
  PART_TIME = "Part-time", 
  CONTRACT = "Contract",
  FREELANCE = "Freelance",
  INTERNSHIP = "Internship",
  VOLUNTEER = "Volunteer",
}

/**
 * @interface ILocation
 * @description Represents a geographical location.
 */
export interface ILocation {
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  placename?:string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * @interface ISkill
 * @description Represents a user's skill and their proficiency level.
 */
export interface ISkill {
  id: string;
  name: string;
  proficiency: SkillProficiency;
  yearsOfExperience?: number;
  endorsements?: number;
  createdAt: Date;
}

/**
 * @interface IExperience
 * @description Represents a user's professional work experience.
 */
export interface IExperience {
  id: string;
  title: string;
  company: string;
  companyId?: string; // Link to Company entity
  location?: ILocation;
  employmentType?: EmploymentType;
  startDate: Date;
  endDate?: Date | null;
  isCurrentRole: boolean;
  description?: string;
  skills?: string[]; // Array of skill names used in this role
  achievements?: string[];
  createdAt: Date;
}

/**
 * @interface IEducation
 * @description Represents a user's educational background.
 */
export interface IEducation {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date | null;
  isCurrentStudent: boolean;
  description?: string;
  gpa?: number;
  activities?: string[];
  honors?: string[];
  createdAt: Date;
}

/**
 * @interface ISocialLinks
 * @description Represents user's social media and professional links.
 */
export interface ISocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  portfolio?: string;
  website?: string;
  other?: { [platform: string]: string };
}

/**
 * @interface IPreferences
 * @description Represents user's preferences and settings.
 */
export interface IPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  profileVisibility: 'PUBLIC' | 'PRIVATE' | 'CONNECTIONS_ONLY';
  jobAlerts: boolean;
  language: string;
  timezone: string;
}

/**
 * @interface IUser
 * @description Defines the complete data structure for a user's profile.
 * This interface represents the state of a User, not its behavior (methods).
 */
export interface IUser {
  // Core Authentication Fields
  id: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  
  // Profile Fields
  firstName?: string;
  lastName?: string;
  headline?: string;
  about?: string;
  location?: ILocation;
  
  // Media Fields
  profileImageKey?: string;
  coverImageKey?: string;
  resumeKeys?: string[];
  
  // Professional Fields
  experience?: IExperience[];
  education?: IEducation[];
  skills?: ISkill[];
  
  // Social & Contact
  socialLinks?: ISocialLinks;
  
  // Business Fields
  managedCompanies?: string[];
  
  // User Preferences
  preferences?: IPreferences;
  
  // Status Fields
  isActive: boolean;
  lastLoginAt?: Date;
  emailVerifiedAt?: Date;
  phoneVerifiedAt?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface IUserCreateInput
 * @description Input interface for creating a new user.
 */
export interface IUserCreateInput {
  username: string;
  email: string;
  phone?: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
  headline?: string;
  about?: string;
  location?: ILocation;
  preferences?: Partial<IPreferences>;
}

/**
 * @interface IUserUpdateInput
 * @description Input interface for updating user information.
 */
export interface IUserUpdateInput {
  username?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  headline?: string;
  about?: string;
  location?: ILocation;
  socialLinks?: ISocialLinks;
  preferences?: Partial<IPreferences>;
}

/**
 * @interface IUserPublicProfile
 * @description Public view of user profile (for displaying to other users).
 */
export interface IUserPublicProfile {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  headline?: string;
  about?: string;
  location?: Omit<ILocation, 'coordinates'>; // Hide exact coordinates
  profileImageKey?: string;
  coverImageKey?: string;
  experience?: Omit<IExperience, 'id'>[];
  education?: Omit<IEducation, 'id'>[];
  skills?: Omit<ISkill, 'id'>[];
  socialLinks?: ISocialLinks;
  isVerified: boolean;
  createdAt: Date;
}

/**
 * @interface IUserSearchFilters
 * @description Interface for searching and filtering users.
 */
export interface IUserSearchFilters {
  role?: UserRole;
  location?: {
    city?: string;
    state?: string;
    country?: string;
    radius?: number; // in kilometers
  };
  skills?: string[];
  experience?: {
    minYears?: number;
    companies?: string[];
    titles?: string[];
  };
  education?: {
    schools?: string[];
    degrees?: string[];
  };
  isVerified?: boolean;
  isActive?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
}

/**
 * @interface IUserStats
 * @description User statistics and metrics.
 */
export interface IUserStats {
  userId: string;
  profileViews: number;
  connectionCount: number;
  endorsementCount: number;
  profileCompleteness: number;
  lastActivity: Date;
}