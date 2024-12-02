import React from 'react';

interface ApplicationProps {
  logo: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  dateApplied: string;
  status: string;
  statusColor: string;
}

const Application: React.FC<ApplicationProps> = ({
  logo,
  title,
  company,
  location,
  jobType,
  dateApplied,
  status,
  statusColor
}) => (
  <div className={`flex flex-wrap gap-10 justify-between items-center p-6 w-full rounded-lg ${status === 'Declined' ? 'bg-slate-50' : 'bg-white'} max-md:px-5 `}>
    <div className="flex gap-4 items-center self-stretch my-auto min-w-[240px] w-[446px] ">
      <img loading="lazy" src={logo} className="object-contain shrink-0 self-stretch my-auto w-16 aspect-square" alt={`${company} logo`} />
      <div className="flex flex-col self-stretch my-auto min-w-[240px]">
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        <div className="flex gap-2 justify-center items-center text-base min-h-[27px] text-slate-500">
          <span className="self-stretch my-auto">{company}</span>
          <span className="self-stretch my-auto">{location}</span>
          <span className="self-stretch my-auto">{jobType}</span>
        </div>
      </div>
    </div>
    <div className="flex flex-col self-stretch my-auto text-base w-[171px]">
      <span className="font-medium text-slate-800">Date Applied</span>
      <span className="mt-1.5 text-slate-500">{dateApplied}</span>
    </div>
    <div className="flex flex-col justify-center items-start self-stretch my-auto text-sm font-semibold w-[117px]">
      <span className={`gap-2 self-stretch px-2.5 py-1.5 border border-solid rounded-[80px] text-${statusColor} border-${statusColor}`}>
        {status}
      </span>
    </div>
    <img loading="lazy" src={`http://b.io/ext_${status === 'Declined' ? '26' : status === 'Shortlisted' ? '24' : '22'}-`} className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square" alt="" />
  </div>
);

const RecentApplicationsHistory: React.FC = () => {
  const applications = [
    {
      logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/97955d263e832a59463b0434966f144336859bb3b81e2b268e351640fc104826?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732",
      title: "Social Media Assistant",
      company: "Nomad",
      location: "Paris, France",
      jobType: "Full-Time",
      dateApplied: "24 July 2021",
      status: "In Review",
      statusColor: "amber-400"
    },
    {
      logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/0e3de6a4e23120fee03372d479fb057887792852dee83a6fb56ca766f3990ba8?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732",
      title: "Social Media Assistant",
      company: "Udacity",
      location: "New York, USA",
      jobType: "Full-Time",
      dateApplied: "23 July 2021",
      status: "Shortlisted",
      statusColor: "indigo-600"
    },
    {
      logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/fa3ecb2dba1b3d8f68281501745134dd1237aa48fdb0d67f064e2976a77cbdec?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732",
      title: "Social Media Assistant",
      company: "Packer",
      location: "Madrid, Spain",
      jobType: "Full-Time",
      dateApplied: "22 July 2021",
      status: "Declined",
      statusColor: "red-400"
    }
  ];

  return (
    <section className="flex flex-col px-8 pb-8 w-full leading-relaxed max-md:px-5 ">
      <div className="flex flex-col max-w-full w-[1104px]">
        <div className="flex flex-col py-6 w-full bg-white border border-solid border-zinc-200 ">
          <h2 className="self-start ml-6 text-xl font-semibold leading-tight text-slate-800 max-md:ml-2.5">
            Recent Applications History
          </h2>
          <hr className="shrink-0 mt-8 h-px border border-solid bg-zinc-200 border-zinc-200 " />
          <div className="flex flex-col mx-6 mt-6 max-md:mr-2.5 ">
            {applications.map((app, index) => (
              <Application key={index} {...app} />
            ))}
          </div>
          <a href="#view-all-history" className="flex gap-4 items-center self-center mt-6 text-base font-semibold text-center text-indigo-600">
            <span className="self-stretch my-auto">View all applications history</span>
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/40c908fc8926880a8086e37d0e9caa8101d409f7915d42d67f6df508cddda2ab?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732" className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square" alt="" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default RecentApplicationsHistory;