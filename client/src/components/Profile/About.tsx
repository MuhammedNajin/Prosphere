import React from 'react';
import { Pencil } from 'lucide-react';
import { ModalContent } from '@/types/profile';

interface AboutMeProps {
   description?: string
   setModal:React.Dispatch<React.SetStateAction<boolean>>
   setContent:React.Dispatch<React.SetStateAction<string>>
}

const AboutMe: React.FC<AboutMeProps> = ({ description, setContent, setModal }) => {
  return (
    <div className="w-full p-6 bg-white rounded border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">About Me</h2>
        <button
         onClick={() => {
           setContent(ModalContent.EditAbout)
           setModal(true)
         }}
         className="text-zinc-500 hover:text-zinc-200">
          <Pencil size={20} />
        </button>
      </div>
      <div className="space-y-4 text-gray-600">
        <p>
          { description }
        </p>
      </div>
    </div>
  );
};

export default AboutMe;