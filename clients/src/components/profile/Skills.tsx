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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Skills</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => {
                setContent('Add Skill')
                setModal(true)
              }}
           className="p-2 bg-blue-50 rounded-md">
            <PlusIcon className="w-5 h-5 text-blue-600" />
          </button>
          <button
          onClick={() => {
            setContent('Edit Skill')
            setModal(true)
          }}
           className="p-2 bg-gray-100 rounded-md">
            <PencilIcon className="w-5 h-5 text-gray-600" />
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
                  <Badge className="flex-shrink-0 px-1 py-1 flex items-center justify-center" />
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
