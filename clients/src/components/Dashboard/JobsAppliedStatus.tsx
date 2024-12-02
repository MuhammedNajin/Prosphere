import React from 'react';

const JobsAppliedStatus: React.FC = () => {
  return (
    <section className="flex flex-col items-start px-6 py-7 bg-white border border-solid border-zinc-200 min-w-[240px] w-[352px] max-md:px-5">
      <h2 className="text-xl font-semibold leading-tight text-center text-slate-800">
        Jobs Applied Status
      </h2>
      <div className="flex gap-6 items-center self-stretch mt-11 max-md:mt-10">
        <div className="flex flex-col self-stretch my-auto w-[152px]">
          <div className="flex overflow-hidden relative flex-col justify-center p-1 rounded-full shadow-lg aspect-square w-[152px]">
            <img 
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/cd78ccd15d05761f6e81110eb87839700b8537fcb973da7fd62708443fbbcc63?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732" 
              alt="Jobs applied status chart" 
              className="object-cover absolute inset-0 size-full"
            />
            <div className="flex relative shrink-0 w-full h-36 border-violet-100 border-solid border-[14.306px] rounded-[143.059px]" />
          </div>
        </div>
        <div className="flex flex-col self-stretch my-auto leading-relaxed whitespace-nowrap">
          <div className="flex gap-4 items-center">
            <div className="flex shrink-0 self-stretch my-auto w-5 h-5 bg-indigo-600 rounded" />
            <div className="flex flex-col self-stretch my-auto">
              <p className="text-lg font-bold text-slate-800">60%</p>
              <p className="text-base text-slate-500">Unsuitable</p>
            </div>
          </div>
          <div className="flex gap-4 items-center mt-2">
            <div className="flex shrink-0 self-stretch my-auto w-5 h-5 bg-violet-100 rounded" />
            <div className="flex flex-col self-stretch my-auto">
              <p className="text-lg font-bold text-slate-800">40%</p>
              <p className="text-base text-slate-500">Interviewed</p>
            </div>
          </div>
        </div>
      </div>
      <a href="#" className="flex gap-2 items-center mt-11 text-base font-semibold leading-relaxed text-indigo-600 max-md:mt-10">
        <span className="self-stretch my-auto">View All Applications</span>
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/7d09976ba153d5f9151e87ea7b95f986fd2286bbc2ee738bca2f229d18eb4531?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732" 
          alt="Arrow right" 
          className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
        />
      </a>
    </section>
  );
};

export default JobsAppliedStatus;