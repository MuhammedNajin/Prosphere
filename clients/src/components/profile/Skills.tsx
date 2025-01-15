import React from "react";
import { PlusIcon, PencilIcon } from "lucide-react";
import { Badge } from "../ui/badge";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SkillsSectionProps {
  skills: string[];
  setModal:React.Dispatch<React.SetStateAction<boolean>>
    setContent:React.Dispatch<React.SetStateAction<string>>
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, setContent, setModal }) => {
  console.log("skills", skills);
  return (
    <div className="bg-white p-6 rounded border">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800">Skills</h2>
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => {
                setContent('Add Skill')
                setModal(true)
              }}
           className="p-2 bg-orange-50 rounded-md">
            <PlusIcon className="w-5 h-5 text-orange-600" />
          </button>
          <button
          onClick={() => {
            setContent('Edit Skill')
            setModal(true)
          }}
           className="p-2 bg-gray-100 rounded-md">
            <PencilIcon size={16} className=" text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm"
          >
            <span className="mr-1">{skill?.name}</span>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                <span className="inline-flex items-center justify-center px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">  
                  <Badge variant="secondary" className="h-5 w-5 rounded-full flex items-center justify-center">
                    {skill.proficiency.charAt(0)}
                  </Badge>
                </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{skill.proficiency}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
