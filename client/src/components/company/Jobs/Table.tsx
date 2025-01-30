import { Ellipsis } from 'lucide-react';
import React from 'react';

interface Applicant {
  id: string;
  name: string;
  avatar: string;
  score: number;
  stage: string;
  appliedDate: string;
}

interface ApplicantTableRowProps {
  applicant: Applicant;
  isEven: boolean;
}

const ApplicantTableRow: React.FC<ApplicantTableRowProps> = ({ applicant, isEven }) => {
  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'In Review':
        return 'text-amber-400 border-amber-400';
      case 'Shortlisted':
        return 'text-indigo-600 border-indigo-600';
      case 'Declined':
        return 'text-red-400 border-red-400';
      case 'Hired':
        return 'text-emerald-300 border-emerald-300';
      case 'Interview':
        return 'text-sky-400 border-sky-400';
      default:
        return 'text-slate-500 border-slate-500';
    }
  };

  return (
    <div className={`flex flex-wrap items-center p-4  ${isEven ? 'bg-slate-50' : 'bg-white'}`}>
      <div className="flex gap-6 items-center  my-auto min-w-[240px] w-[240px]">
        <div className="flex gap-4 items-center  my-auto">
          <div className="flex self-stretch py-2.5 my-auto w-6 h-6 rounded border-2 border-solid border-zinc-200 min-h-[24px]" />
        </div>
        <div className="flex gap-4 items-center self-stretch my-auto text-base font-medium leading-relaxed text-slate-800">
          <img loading="lazy" src={applicant.avatar} alt={`${applicant.name}'s avatar`} className="object-contain shrink-0  my-auto w-10 aspect-square" />
          <div className=" my-auto">{applicant.name}</div>
        </div>
      </div>
      
      <div className="flex flex-col items-start  my-auto text-sm font-semibold leading-relaxed w-[183px]">
        <div className={`gap-2  px-2.5 py-1.5 border border-solid rounded-full ${getStageColor(applicant.stage)}`}>
          {applicant.stage}
        </div>
      </div>
      <div className=" text-base font-medium leading-7 text-slate-800 w-[205px]">
        {applicant.appliedDate}
      </div>
      <div className="flex gap-4 justify-center items-center  my-auto text-sm font-bold leading-relaxed text-center text-indigo-600">
        <button className="gap-2.5  px-5 py-3 my-auto bg-violet-100 border border-indigo-600 border-solid max-md:px-5">
          See Application
        </button>
        <Ellipsis />
      </div>
    </div>
  );
};

export default ApplicantTableRow;