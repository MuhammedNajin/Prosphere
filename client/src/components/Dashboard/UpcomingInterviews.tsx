import React from 'react';

const UpcomingInterviews: React.FC = () => {
  return (
    <section className="flex overflow-hidden flex-col pb-6 bg-white border border-solid border-zinc-200 min-w-[240px] w-[446px] max-md:max-w-full">
      <header className="flex z-10 flex-col pt-7 pb-4 w-full text-xl font-semibold leading-tight text-gray-800 bg-white border border-solid shadow-2xl border-zinc-200 max-md:max-w-full">
        <h2 className="self-start ml-6 text-center max-md:ml-2.5">
          Upcoming Interviews
        </h2>
        <hr className="shrink-0 mt-5 h-px border border-solid bg-zinc-200 border-zinc-200 max-md:max-w-full" />
        <div className="flex gap-10 justify-between items-center mx-6 mt-4 max-md:mx-2.5">
          <p className="self-stretch my-auto">
            <span className="text-gray-800">Today, </span>
            <span className="leading-8 text-gray-800">26 November</span>
          </p>
          <img 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/0bc93cdc8984d42fda30292a3f5905803df08c309ac9fc5fad864f30fd9716db?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732" 
            alt="Calendar icon" 
            className="object-contain shrink-0 self-stretch my-auto w-16 aspect-[2.67]"
          />
        </div>
      </header>
      <div className="flex flex-col px-6 pb-11 mt-0 w-full text-base leading-relaxed max-md:pl-5 max-md:max-w-full">
        <div className="flex flex-col w-full font-medium text-slate-500">
          <div className="flex flex-col items-start max-w-full text-gray-800 rounded-none w-[406px] max-md:pr-5">
            <p className="opacity-50">9:30 AM</p>
          </div>
          <div className="flex gap-4 mt-11 max-w-full rounded-none w-[406px] max-md:mt-10">
            <p>10:00 AM</p>
            <hr className="shrink-0 my-auto max-w-full h-0.5 border-2 border-solid bg-zinc-200 border-zinc-200 w-[315px]" />
          </div>
          <p className="mt-11 max-w-full rounded-none w-[408px] max-md:pr-5 max-md:mt-10">
            10:30 AM
          </p>
          <div className="flex gap-4 mt-11 max-w-full rounded-none w-[406px] max-md:mt-10">
            <p>11:00 AM</p>
            <hr className="shrink-0 my-auto max-w-full h-0.5 border-2 border-solid bg-zinc-200 border-zinc-200 w-[315px]" />
          </div>
        </div>
        <div className="flex z-10 gap-4 self-end py-4 pr-11 pl-4 mt-0 bg-violet-100 rounded-lg max-md:pr-5">
          <img 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d01bd5d49e78d9455183687658be3629fdd5a65b77cff2906c3544cfa3770314?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732" 
            alt="Joe Bartmann profile picture" 
            className="object-contain shrink-0 w-12 aspect-square"
          />
          <div className="flex flex-col self-start">
            <p className="self-start font-semibold text-slate-800">
              Joe Bartmann
            </p>
            <p className="mt-1.5 font-medium text-slate-500">
              HR Manager at Divvy
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingInterviews;