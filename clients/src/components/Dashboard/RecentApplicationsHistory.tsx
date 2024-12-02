import React from 'react';
import ApplicationItem from './ApplicationItem';
interface Application {
  company: string;
  logo: string;
  position: string;
  location: string;
  type: string;
  dateApplied: string;
  status: string;
  statusColor: string;
}

const applications: Application[] = [
  {
    company: "Nomad",
    logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/97955d263e832a59463b0434966f144336859bb3b81e2b268e351640fc104826?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732",
    position: "Social Media Assistant",
    location: "Paris, France",
    type: "Full-Time",
    dateApplied: "24 July 2021",
    status: "In Review",
    statusColor: "text-amber-400 border-amber-400"
  },
  {
    company: "Udacity",
    logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/0e3de6a4e23120fee03372d479fb057887792852dee83a6fb56ca766f3990ba8?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732",
    position: "Social Media Assistant",
    location: "New York, USA",
    type: "Full-Time",
    dateApplied: "23 July 2021",
    status: "Shortlisted",
    statusColor: "text-indigo-600 border-indigo-600"
  },
  {
    company: "Packer",
    logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/fa3ecb2dba1b3d8f68281501745134dd1237aa48fdb0d67f064e2976a77cbdec?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732",
    position: "Social Media Assistant",
    location: "Madrid, Spain",
    type: "Full-Time",
    dateApplied: "22 July 2021",
    status: "Declined",
    statusColor: "text-red-400 border-red-400"
  }
];



const RecentApplicationsHistory: React.FC = () => {
  return (
    <section className="flex flex-col px-8 pb-8 w-full leading-relaxed max-md:px-5 max-md:max-w-full">
      <div className="flex flex-col max-w-full w-[1104px]">
        Continuing from where we left off:

        <div className="flex flex-col py-6 w-full bg-white border border-solid border-zinc-200 max-md:max-w-full">
          <h2 className="self-start ml-6 text-xl font-semibold leading-tight text-slate-800 max-md:ml-2.5">
            Recent Applications History
          </h2>
          <hr className="shrink-0 mt-8 h-px border border-solid bg-zinc-200 border-zinc-200 max-md:max-w-full" />
          <div className="flex flex-col mx-6 mt-6 max-md:mr-2.5 max-md:max-w-full">
            {applications.map((application, index) => (
              <ApplicationItem key={index} application={application} />
            ))}
          </div>
          <a href="#" className="flex gap-4 items-center self-center mt-6 text-base font-semibold text-center text-indigo-600">
            <span className="self-stretch my-auto">
              View all applications history
            </span>
            <img 
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/40c908fc8926880a8086e37d0e9caa8101d409f7915d42d67f6df508cddda2ab?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732" 
              alt="Arrow right" 
              className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default RecentApplicationsHistory;