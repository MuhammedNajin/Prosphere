import { ProficiencyLevel } from "./formData";

export enum ModalContent {
  AddPosition = "Add Position",
  EditPosition = "Edit Position",
  AddEducation = "Add Education",
  EditEducation = "Edit Education",
  AddSkill = "Add Skill",
  EditSkill = "Edit Skill",
  AddAbout = "Add About",
  EditAbout = "Edit About",
  AddCoverImage = "Add Cover Image",
  EditCoverImage = "Edit Cover Image",
  AddProfileImage = "Add Profile Image",
  EditProfileImage = "Edit Profile Image",
  EditProfile = "Edit Profile",
  ContactInfo = "Contact Info",
  AddResume = "Add Resume",
  EditResume = "Edit Resume",
  EditHeadline = 'Edit Headline',
  EditLocation = 'Edit Location'
}

export enum IMAGEKEY {
  AVATAR = "profileImageKey",
  COVER = "coverImageKey",
}

export interface Experience {
  position: string;
  companyName: string;
  employmentType: string;
  locationType: "on-site" | "remote" | "hybrid";
  startDate: Date;
  endDate?: Date;
  currentlyWorking?: boolean;
}

export interface Education {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  description?: string;
  currentlyStudying: boolean;
  grade: string;
  _id?: string;
}

export interface Skill {
  name: string;
  proficiency: ProficiencyLevel;
}

export interface ProfileData {
  _id: string;
  about?: string;
  coverImageKey?: string;
  profileImageKey?: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
}

export interface UpdateProfileData {
  username: string;
  phone: string;
  logo: string;
  jobRole: string;
  about?: string;
  coverImageKey?: string;
  profileImageKey?: string;
  experience?: Experience;
  education?: Education;
  skills?: Skill[];
}
