import React from 'react';
import { PlusIcon, PencilIcon } from 'lucide-react';
import { format } from 'date-fns';
import { calculateDuration } from '@/lib/utilities/calculateDuration';
import { Experience } from '@/types/profile';


interface ExperiencesSectionProps {
    experiences?: Experience[];
    setModal: React.Dispatch<React.SetStateAction<boolean>>
    setContent: React.Dispatch<React.SetStateAction<string>>
    setIndex: React.Dispatch<React.SetStateAction<number>>
}

const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({ experiences, setModal, setContent, setIndex}) => {
    console.log("experience", experiences);
    
  return (
    <div className="bg-white p-6 rounded border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Experiences</h2>
        <button
         onClick={() => {
            setContent('Add Position')
            setModal(true)
          }}
         className="p-2 bg-orange-50 rounded-md">
          <PlusIcon className="w-5 h-5 text-orange-600" />
        </button>
      </div>
      
      {experiences && experiences.map((exp: Experience, index: number) => (
       <div 
       key={`${index}-${Date.now()}`} 
       className="mb-6 last:mb-0"
     >
       <div className="flex items-start gap-4">
         <img 
           src="https://logo.clearbit.com/godaddy.com" 
           alt={`${exp.companyName} logo`}
           className="w-12 h-12 rounded-full flex-shrink-0"
         />
 
         <div className="flex-grow">

           <div className="flex justify-between items-start">
             <div className="space-y-1">
               <h3 className="text-lg font-semibold capitalize text-gray-800">
                 {exp.position}
               </h3>
               <p className="text-gray-600">
                 <span className="font-medium capitalize">{exp.companyName}</span>
                 <span className="mx-2">•</span>
                 <span>{exp.employmentType}</span>
                 <span className="mx-2">•</span>
                 <span>{calculateDuration(new Date(exp.startDate), exp.currentlyWorking ? new Date() : new Date(exp.endDate ?? new Date().toISOString()))}</span>
               </p>
               <p className="text-gray-500">
                 {exp.locationType}
               </p>
             </div>

             <button
               onClick={() => {
                 setContent('Edit Position');
                 setModal(true);
                 setIndex(index);
               }}
               className="p-2 hover:bg-gray-100 rounded-full transition-colors"
               aria-label="Edit position"
             >
               <PencilIcon className="w-4 h-4 text-gray-400" />
             </button>
           </div>
 
           <p className="mt-4 text-gray-700">
             {exp.currentlyWorking 
               ? `${format(new Date(exp.startDate), "PPP")} - Present`
               : `${format(new Date(exp.startDate), "PPP")} - ${format(new Date(exp.endDate ?? new Date().toISOString()), "PPP")}`
             }
           </p>
         </div>
       </div>
 
       {index !== experiences.length - 1 && (
         <hr className="my-6 border-gray-200" />
       )}
     </div>
      ))}
      
      <button className="w-full text-center text-orange-600 mt-4">
        Show 3 more experiences
      </button>
    </div>
  );
};

export default ExperiencesSection;