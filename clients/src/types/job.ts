
export interface Job {
    jobTitle: string;
    employment: "Full-Time";
    jobDescription: string;
    jobLocation: string;
    minSalary: number;
    maxSalary: number;
    vacancies: number;
    experience: string;
    companyId: string;
    expiry: Date;
    responsibility: string[];
    skills: string[];
    qualifications: string[];
    status?: boolean;
    expired?: boolean;
}