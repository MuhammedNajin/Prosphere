import { Education, Experience, Skill } from "./type";

  
export  const datesOverlap = (
    start1: Date | string,
    end1: Date | string | null | undefined,
    start2: Date | string,
    end2: Date | string | null | undefined
  ): boolean => {
   
    const startDate1 = new Date(start1);
    const endDate1 = end1 ? new Date(end1) : new Date();
    const startDate2 = new Date(start2);
    const endDate2 = end2 ? new Date(end2) : new Date();
  
    return startDate1 <= endDate2 && endDate1 >= startDate2;
  };
  

 export  const isDuplicateExperience = (
    existingExperiences: Experience[],
    newExperience: Experience
  ): boolean => {
    return existingExperiences.some(exp => {

      const isSameCompany = exp.companyName.toLowerCase() === newExperience.companyName.toLowerCase();
      const isSamePosition = exp.position.toLowerCase() === newExperience.position.toLowerCase();
      
    
      const hasOverlappingDates = datesOverlap(
        exp.startDate,
        exp.currentlyWorking ? new Date() : exp.endDate,
        newExperience.startDate,
        newExperience.currentlyWorking ? new Date() : newExperience.endDate
      );
  
      return isSameCompany && isSamePosition && hasOverlappingDates;
    });
  };
  
 export  const isDuplicateEducation = (
    existingEducation: Education[],
    newEducation: Education
  ): boolean => {
    return existingEducation.some(edu => {
   
      const isSameSchool = edu.school.toLowerCase() === newEducation.school.toLowerCase();
      const isSameDegree = edu.degree.toLowerCase() === newEducation.degree.toLowerCase();
      const isSameField = edu.fieldOfStudy.toLowerCase() === newEducation.fieldOfStudy.toLowerCase();
 
      const hasOverlappingDates = datesOverlap(
        edu.startDate,
        edu.currentlyStudying ? new Date() : edu.endDate,
        newEducation.startDate,
        newEducation.currentlyStudying ? new Date() : newEducation.endDate
      );
  
      return isSameSchool && isSameDegree && isSameField && hasOverlappingDates;
    });
  };
  
export  const isDuplicateSkill = (
    existingSkills: Skill[],
    newSkill: Skill
  ): boolean => {
    return existingSkills.some(skill => 
      skill.name.toLowerCase() === newSkill.name.toLowerCase()
    );
  };