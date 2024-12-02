import React from 'react';

interface JobStatCardProps {
  title: string;
  count: number;
  imageSrc: string;
}

const JobStatCard: React.FC<JobStatCardProps> = ({ title, count, imageSrc }) => (
  <div className="flex overflow-hidden items-start px-6 pt-7 max-w-full bg-white border border-solid border-zinc-200 w-[258px] max-md:px-5">
    <div className="flex z-10 flex-col self-start mr-0">
      <h3 className="text-xl leading-tight text-slate-800">{title}</h3>
      <span className="self-start mt-7 text-7xl leading-none text-center max-md:text-4xl">{count}</span>
    </div>
    <img loading="lazy" src={imageSrc} className="object-contain shrink-0 self-end mt-16 aspect-[1.29] w-[88px] max-md:mt-10" alt="" />
  </div>
);

const TotalJobsApplied: React.FC = () => {
  return (
    <section className="flex flex-col font-semibold min-w-[240px] text-slate-800 w-[258px]">
      <JobStatCard title="Total Jobs Applied" count={45} imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/66fe26d2022414c202cde4d42b5435a53e61c7879d9cccd89e0aead6518d5b86?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732" />
      <JobStatCard title="Interviewed" count={18} imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/d57de74eb7faf71a3a7e62eb475ae6ce5ad62a6e77f76a97023864dfb01bde82?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732" />
    </section>
  );
};

export default TotalJobsApplied;