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
    ContactInfo = "Contact Info"
  }
  

 export enum IMAGEKEY {
   AVATAR = "profileImageKey",
   COVER = "coverImageKey"
 }

 export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
  _id?: string;
}

export interface Education {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  description?: string;
  _id?: string;
}

export interface Skill {
  name: string;
  level: number;
  _id?: string;
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
