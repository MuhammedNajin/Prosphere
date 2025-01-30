import { Job } from '@/types/company';
import React from 'react';

interface AppliedJobsProps {
  job: Job;
}

const AppliedJobs: React.FC<AppliedJobsProps> = ({ job }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  return (
    <section className="flex flex-col p-4 mt-5 w-full leading-relaxed bg-gray-100 rounded-lg">
      <div className="flex gap-10 justify-between items-start w-full text-sm">
        <h3 className="text-purple-600">Applied Jobs</h3>
        <span className="text-right text-slate-500">
          {formatDate(job?.createdAt)}
        </span>
      </div>
      <hr className="mt-2 w-full bg-zinc-200 min-h-[1px]" />
      <div className="flex flex-col self-start mt-2">
        <h4 className="text-base font-semibold text-gray-800 capitalize ">
          {job?.jobTitle}
        </h4>
        <div className="flex gap-2 justify-center items-center self-start text-sm whitespace-nowrap text-slate-600">
          <span className="self-stretch my-auto">{job?.officeLocation}</span>
           •
          <span className="self-stretch my-auto">{job?.employment}</span>
        </div>
      </div>
    </section>
  );
};

export default AppliedJobs;