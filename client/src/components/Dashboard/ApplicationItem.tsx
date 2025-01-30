import { RecentApplicationData } from '@/types/application';
import React from 'react';


const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'applied':
      return 'border-blue-500 text-blue-500 bg-blue-50';
    case 'rejected':
      return 'border-red-500 text-red-500 bg-red-50';
    case 'interview':
      return 'border-yellow-500 text-yellow-500 bg-yellow-50';
    case 'offered':
      return 'border-green-500 text-green-500 bg-green-50';
    default:
      return 'border-gray-500 text-gray-500 bg-gray-50';
  }
};

const ApplicationItem: React.FC<{ application: RecentApplicationData }> = ({ application }) => (
  <div className="flex flex-wrap gap-10 justify-between items-center p-6 w-full rounded-lg bg-slate-50 max-md:px-5 max-md:max-w-full">
    <div className="flex gap-4 items-center self-stretch my-auto min-w-[240px] w-[446px] max-md:max-w-full">
      {application?.companyId?.logo ? (
        <img 
          src={application.companyId.logo} 
          alt={`${application?.companyId?.name} logo`} 
          className="object-contain shrink-0 self-stretch my-auto w-16 aspect-square"
        />
      ) : (
        <div className="flex items-center justify-center shrink-0 self-stretch my-auto w-16 h-16 bg-gray-200 rounded-lg">
          <span className="text-xl font-bold text-gray-500">
            {application?.companyId?.name?.charAt(0)}
          </span>
        </div>
      )}
      <div className="flex flex-col self-stretch my-auto min-w-[240px]">
        <h3 className="text-lg font-bold text-slate-800">{application?.jobId?.jobTitle}</h3>
        <div className="flex gap-2 items-center text-base min-h-[27px] text-slate-500">
          <span className="self-stretch my-auto">{application?.companyId?.name}</span>
        </div>
      </div>
    </div>
    <div className="flex flex-col self-stretch my-auto text-base w-[171px]">
      <p className="font-medium text-slate-800">Date Applied</p>
      <p className="mt-1.5 text-slate-500">{formatDate(application?.appliedAt)}</p>
    </div>
    <div className="flex flex-col justify-center items-start self-stretch my-auto text-sm font-semibold whitespace-nowrap w-[117px]">
      <div className={`gap-2 self-stretch px-2.5 py-1.5 border border-solid rounded-[80px] ${getStatusColor(application?.status)}`}>
        {application?.status?.charAt(0)?.toUpperCase() + application?.status?.slice(1)}
      </div>
    </div>
  </div>
);

export default ApplicationItem;