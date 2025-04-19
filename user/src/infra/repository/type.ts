export interface Experience {
    position: string;
    companyName: string;
    employmentType: string;
    locationType: 'on-site' | 'remote' | 'hybrid';
    startDate: Date;
    endDate?: Date;
    currentlyWorking: boolean;
  }
  
  export  interface Education {
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date;
    endDate?: Date;
    currentlyStudying: 'Yes' | 'No';
    grade?: string;
  }
  
  export interface Skill {
    name: string;
    proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  }

  export interface ArrayFields{
    experience : Experience,
    education: Education,
    skills: Skill
  }