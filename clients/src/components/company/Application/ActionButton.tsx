import { Applicant } from '@/types/application';
import { MessageSquareText } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ActionButtonProps {
   applicant: Applicant
}
const ActionButtons: React.FC<ActionButtonProps> = ({ applicant }) => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-2 mt-5 w-full">
      <button className="flex-1 flex items-center justify-center px-4 py-2.5 text-base font-bold text-orange-700 border border-orange-700 rounded-md hover:bg-orange-700 hover:text-white hover:shadow-lg">
        Schedule Interview
      </button>
      <button
      onClick={(e) => {
         navigate('/company/message', { state: { applicant }})
      }} 
        className="flex items-center justify-center p-2.5 border text-orange-700  border-orange-700 rounded-md hover:bg-orange-700 hover:text-white hover:shadow-sm aspect-square"
        aria-label="Message"
      >
        <MessageSquareText className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ActionButtons;