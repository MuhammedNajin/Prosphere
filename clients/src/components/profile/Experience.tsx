import React from 'react';
import { PlusIcon, PencilIcon } from 'lucide-react';

interface Experience {
  id: number;
  role: string;
  company: string;
  type: string;
  duration: string;
  location: string;
  description: string;
  logo: string;
}

const experiences: Experience[] = [
  {
    id: 1,
    role: "Product Designer",
    company: "Twitter",
    type: "Full-Time",
    duration: "Jun 2019 - Present (1y 1m)",
    location: "Manchester, UK",
    description: "Created and executed social media plan for 10 brands utilizing multiple features and content types to increase brand outreach, engagement, and leads.",
    logo: "https://logo.clearbit.com/twitter.com",
  },
  {
    id: 2,
    role: "Growth Marketing Designer",
    company: "GoDaddy",
    type: "Full-Time",
    duration: "Jun 2011 - May 2019 (8y)",
    location: "Manchester, UK",
    description: "Developed digital marketing strategies, activation plans, proposals, contests and promotions for client initiatives",
    logo: "https://logo.clearbit.com/godaddy.com",
  },
];

interface ExperiencesSectionProps {
     experiences?: [{}];
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
         className="p-2 bg-blue-50 rounded-md">
          <PlusIcon className="w-5 h-5 text-blue-600" />
        </button>
      </div>
      
      {experiences.map((exp, index) => (
        <div key={Date.now()} className="mb-6 last:mb-0">
          <div className="flex items-start">
            <img src="https://logo.clearbit.com/godaddy.com" alt="Company Logo" className="w-12 h-12 rounded-full mr-4" />
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                  <p className="text-gray-600">
                    {exp.companyName} • {exp.employmentType} • {exp.duration}
                  </p>
                  <p className="text-gray-500">{exp.locationType}</p>
                </div>
                <button
                 onClick={() => {
                    setContent('Edit Position')
                    setModal(true)
                    setIndex(index)
                  }}
                 className="p-2">
                  <PencilIcon className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <p className="mt-2 text-gray-700">{exp.currentlyWorking ? exp.startDate: ""}</p>
            </div>
          </div>
          {exp.id !== experiences.length && <hr className="my-6 border-gray-200" />}
        </div>
      ))}
      
      <button className="w-full text-center text-blue-600 mt-4">
        Show 3 more experiences
      </button>
    </div>
  );
};

export default ExperiencesSection;