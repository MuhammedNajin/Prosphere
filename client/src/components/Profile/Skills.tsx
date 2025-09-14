import React from 'react';
import { Plus, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ISkill } from '@/types/user';
import { ModalContent } from '@/types/profile';

interface SkillsSectionProps {
  skills?: ISkill[];
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setContent: React.Dispatch<React.SetStateAction<ModalContent | string>>;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills = [], setContent, setModal }) => {
  return (
    <div className="bg-white p-6 rounded border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-clash text-gray-800">Skills</h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setContent(ModalContent.AddSkill);
              setModal(true);
            }}
            className="p-2 bg-orange-50 rounded-md hover:bg-orange-100 transition-colors"
            aria-label="Add new skill"
          >
            <Plus className="w-5 h-5 text-orange-600" />
          </button>
          {skills.length > 0 && (
            <button
              onClick={() => {
                setContent(ModalContent.EditSkill);
                setModal(true);
              }}
              className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              aria-label="Edit skills"
            >
              <Pencil className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <TooltipProvider key={Date.now() + index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="secondary"
                    className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm"
                  >
                    <span className="mr-2">{skill.name}</span>
                    <span className="h-5 w-5 rounded-full flex items-center justify-center bg-orange-200">
                      {skill.proficiency.charAt(0)}
                    </span>
                  </Badge>
                </TooltipTrigger>
                {/* <TooltipContent>
                  <p>{skill.proficiency}</p>
                  {skill.yearsOfExperience && (
                    <p>{skill.yearsOfExperience} years of experience</p>
                  )}
                  {skill.endorsements && <p>{skill.endorsements} endorsements</p>}
                </TooltipContent> */}
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-sm">No skills added yet.</p>
      )}
    </div>
  );
};

export default SkillsSection;