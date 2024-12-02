import React from 'react';
import Header from './Header';
import StatCard from './StatCard';
import JobsAppliedStatus from './JobsAppliedStatus';
import UpcomingInterviews from './UpcomingInterviews';
import RecentApplicationsHistory from './RecentApplicationsHistory';

const Dashboard: React.FC = () => {
  return (
    <main className="flex flex-col bg-white">
       <header className="flex flex-wrap gap-10 justify-between items-center p-8 w-full bg-white max-md:px-5 max-md:max-w-full">
      <div className="flex flex-col self-stretch my-auto min-w-[240px] max-md:max-w-full">
        <h1 className="text-2xl font-semibold leading-tight text-slate-800">
          Good morning, Jake
        </h1>
        <p className="mt-2 text-base font-medium leading-relaxed text-slate-500 max-md:max-w-full">
          Here is what's happening with your job search applications from July 19 - July 25.
        </p>
      </div>
      <div className="flex gap-7 justify-between items-center self-stretch px-4 py-3 my-auto text-base leading-relaxed bg-white border border-solid border-zinc-200 text-slate-800 w-[180px]">
        <span className="self-stretch my-auto">Jul 19 - Jul 25</span>
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/a95522fac02d0d3ad6f1f650d58abb7b1a510b0b6c76d6138cc14ac585edd4cb?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732" 
          alt="Calendar icon" 
          className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
        />
      </div>
    </header>
      <section className="flex flex-wrap gap-6 items-start px-8 pb-8 max-md:px-5 max-md:max-w-full">
        <StatCard title="Total Jobs Applied" value={45} imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/66fe26d2022414c202cde4d42b5435a53e61c7879d9cccd89e0aead6518d5b86?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732" />
        <StatCard title="Interviewed" value={18} imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/d57de74eb7faf71a3a7e62eb475ae6ce5ad62a6e77f76a97023864dfb01bde82?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732" />
        <JobsAppliedStatus />
        <UpcomingInterviews />
      </section>
      <RecentApplicationsHistory />
    </main>
  );
};

export default Dashboard;