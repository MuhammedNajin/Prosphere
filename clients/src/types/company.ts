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