
export enum UserRole {
  User = 'user',
  Admin = 'admin',
  None = 'none'
}
export interface IOtp {
  email: string;
  otp: string;
}

export interface googleSignUpFlow {
  phone: string;
  username: string;
  email: string;
}

export interface adminLogin {
  email: string;
  password: string;
}

export interface SignInResponse {
  userCredential: IUser;
  resumeKey: string[];
  avatar?: string;
}

// Response types for Google Auth
export interface GoogleAuthResponse {
  profile_complete: boolean;
  // If profile is complete
  id?: string;
  email?: string;
  username?: string;
  phone?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: {
    errorCode: string;
    message: string;
    details: Array<{
      message: string;
      field: string;
    }>;
  };
}


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
  FULL_TIME = "full-time",
  PART_TIME = "part-time", 
  CONTRACT = "contract",
  FREELANCE = "freelance",
  INTERNSHIP = "internship",
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
  name: string;
  proficiency: SkillProficiency;
 
}

/**
 * @interface IExperience
 * @description Represents a user's professional work experience.
 */
export interface IExperience {
  title: string;
  company: string;
  companyId?: string;
  location?: ILocation;
  employmentType?: EmploymentType;
  startDate: Date;
  endDate?: Date | null;
  isCurrentRole: boolean;
  description?: string;
  skills?: string[]; // Array of skill names used in this role
  achievements?: string[];
  createdAt?: Date;
}

/**
 * @interface IEducation
 * @description Represents a user's educational background.
 */
export interface IEducation {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date | null;
  isCurrentStudent: boolean;
  description?: string;
  gpa?: string;
  activities?: string[];
  honors?: string[];
  createdAt?: Date;
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
  isBlocked: boolean;
  
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
  createdAt: string;
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
  education?: IEducation;
  experience?: IExperience;
  headline?: string;
  about?: string;
  location?: ILocation;
  socialLinks?: ISocialLinks;
  preferences?: Partial<IPreferences>;

  // FIX: Make skills optional and allow partials
  skills?: Partial<ISkill>[];
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
  createdAt: string;
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