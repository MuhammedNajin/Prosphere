import { Applicants, ApplicationStatus } from "./application";

export interface ApplicantProfileProps {
    applicant: {
      name: string;
      title: string;
      rating: number;
      avatar: string;
      appliedJobs: {
        title: string;
        company: string;
        type: string;
        appliedDate: string;
      }[];
      stage: {
        name: string;
        progress: number;
      };
      personalInfo: {
        fullName: string;
        dateOfBirth: string;
        age: number;
        gender: string;
        languages: string[];
        address: string;
      };
      professionalInfo: {
        aboutMe: string;
        currentJob: string;
        highestQualification: string;
        experienceYears: number;
        skillSet: string[];
      };
      contactInfo: {
        email: string;
        phone: string;
        instagram: string;
        twitter: string;
        website: string;
      };
    };
  }

  export interface Job {
    _id: string;
    jobTitle: string;
    employment: string;
    jobLocation: string;
    officeLocation: string;
    createdAt: string;
  }


  interface Applicant extends Applicants {
     resume: string;
     status: ApplicationStatus;
     updatedAt: string
  }
  
  export interface ApplicantProp {
      applicantId: {
        _id: string;
        username: string;
        jobRole: string;
        phone: string;
        email: string;
        avatar: string;
      }
      resume: string;
      status: ApplicationStatus;
      jobId: Job;
      applicant: Applicant
  }

  export interface MapboxResult {
    id: string;
    place_name: string;
    coordinates: [number, number];
}

export enum TeamRole {
  HR = "HR",
  Owner = "Owner",
  Employee = "Employee",
}

export enum CompanyStatus {
  Pending = "pending",
  Uploaded = "uploaded",
  Rejected = "rejected",
  Verified = "verified",
}

export enum Message {
  denied = "Access denied"
}

export enum GraphOptions {
   OVERVIEW = 'overview',
   JOBAPPLED = 'jobApplied',
   JOBSEEN = 'jobSeen'
}

export enum Time_Frame {
   YEAR = 'year',
   MONTH = 'month',
   WEEK = 'week',
}


export enum UsageStatsType {
  JOB_POSTS_Limit = 'jobPostLimit',
  VIDEO_CALLS_Limit = 'videoCallLimit',
  MESSAGES_Limit = 'messageLimit'
}

export type VerificationStatus = 'uploaded' | 'pending' | 'rejected';

export interface Company {
  name: string;
  website: string;
  industry: string;
  description: string;
  type: string;
  size: string;
  headquarters: ILocation;
  location: ILocationDetail[];
  techStack: string[];
  verified: boolean;
  reUploadDocLimit: number;
  status: VerificationStatus;
  foundedDate: string;
  owner: string[]
  team: ITeamMember[];
  statusHistory: IStatusHistory[];
  createdAt: Date;
  updatedAt: Date;
  companyVerificationDoc: IVerificationDoc;
  ownerVerificationDoc: IVerificationDoc;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  jobRole: string;
  avatar: string | null;
  about: string | null;
  coverImage: string | null;
  profilePhoto: string | null;
}


interface ILocation {
  placename: string;
  type: "Point";
  coordinates: number[];
}

interface ILocationDetail extends ILocation {
  placename: string;
  
}

interface ITeamMember {
  userId: string;

}

interface IStatusHistory {
  status: string;
  updatedAt: Date;

}

interface IVerificationDoc {
  documentType: string;
  documentUrl: string;
  uploadedAt: Date;
}

