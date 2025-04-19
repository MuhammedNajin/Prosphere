export class JobEntity {
    _id?: string
    jobTitle: string;
    employment: string;
    description: string;
    jobLocation: string;
    salaryRange: { status: boolean; from: number; to: number };
    vacancies: { status: boolean; available: number; filled: number };
    experience: number;
    companyId: string;
    expiry: Date;
    responsibilities: string;
    completedJobAdd: "first" | "second";
    skills: string[];
    qualification: string[];
    status: boolean;
    expired: boolean;
   
  
    constructor({
      jobTitle,
      employment,
      description,
      jobLocation,
      salaryRange,
      vacancies,
      experience,
      companyId,
      expiry,
      responsibilities,
      completedJobAdd,
      skills,
      qualification,
      status = true,
      expired = false,
    }: {
      jobTitle: string;
      employment: string;
      description: string;
      jobLocation: string;
      salaryRange: { status: boolean; from: number; to: number };
      vacancies: { status: boolean; available: number; filled: number };
      experience: number;
      companyId: string;
      expiry: Date;
      responsibilities: string;
      completedJobAdd: "first" | "second";
      skills: string[];
      qualification: string[];
      status?: boolean;
      expired?: boolean;
     
    }) {
      this.jobTitle = jobTitle;
      this.employment = employment;
      this.description = description;
      this.jobLocation = jobLocation;
      this.salaryRange = salaryRange;
      this.vacancies = vacancies;
      this.experience = experience;
      this.companyId = companyId;
      this.expiry = expiry;
      this.responsibilities = responsibilities;
      this.completedJobAdd = completedJobAdd;
      this.skills = skills;
      this.qualification = qualification;
      this.status = status;
      this.expired = expired;
    }
  }
  