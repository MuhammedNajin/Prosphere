import React, { useEffect } from 'react';
import { PlusIcon, PencilIcon } from 'lucide-react';
import { format } from 'date-fns';

interface Education {
  id: number;
  school: string;
  degree: string;
  field: string;
  years: string;
  description?: string;
  logo: string;
}

interface ExperiencesSectionProps {
    educations?: [{}];
    setModal: React.Dispatch<React.SetStateAction<boolean>>
   setContent: React.Dispatch<React.SetStateAction<string>>
   setIndex: React.Dispatch<React.SetStateAction<number>>
}

const EducationSection: React.FC<ExperiencesSectionProps> = ({setContent, setIndex, educations, setModal }) => {

  useEffect(() => {
     console.log("educations", educations);
  }, [educations])
  return (
    <div className="bg-white p-6 rounded border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Educations</h2>
        <button
         onClick={() => {
            setContent('Add Education')
            setModal(true)
          }}
         className="p-2 bg-orange-50 rounded-md">
          <PlusIcon className="w-5 h-5 text-orange-600" />
        </button>
      </div>
      
      {educations.map((edu, index) => (
        <div key={Date.now() + index} className="mb-6 last:mb-0">
          <div className="flex items-start">
            <img src="https://logo.clearbit.com/twitter.com" alt={edu.school} className="w-12 h-12 mr-4" />
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{edu.school}</h3>
                  <p className="text-gray-600">
                    {edu.degree}, {edu.fieldOfStudy}
                  </p>
                  <p className="mt-2 text-gray-700">
                              {edu.currentlyStudying
                                ? `${format(edu?.startDate || Date.now(), "PPP")} - Present`
                                : `${format(edu.startDate || Date.now(), "PPP")} - ${format(edu.endDate || Date.now(), "PPP")}`
                              }
                            </p>
                </div>
                <button
                 onClick={() => {
                    setContent('Edit Education')
                    setModal(true)
                    setIndex(index)
                  }}
                 className="p-2">
                  <PencilIcon className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              {edu.description && (
                <p className="mt-2 text-gray-700">{edu.description}</p>
              )}
            </div>
          </div>
          {index < educations.length - 1 && <hr className="my-6 border-gray-200" />}
        </div>
      ))}
      
      <button className="w-full text-center text-orange-600 mt-4">
        Show 2 more educations
      </button>
    </div>
  );
};

export default EducationSection;