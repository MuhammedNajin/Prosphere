import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  imageSrc: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, imageSrc }) => {
  return (
    <div className="flex flex-col font-semibold min-w-[240px] text-slate-800 w-[258px]">
      <div className="flex overflow-hidden items-start px-6 pt-7 max-w-full bg-white border border-solid border-zinc-200 w-[258px] max-md:px-5">
        <div className="flex z-10 flex-col self-start mr-0">
          <h2 className="text-xl leading-tight">{title}</h2>
          <p className="self-start mt-7 text-7xl leading-none text-center max-md:text-4xl">
            {value}
          </p>
        </div>
        <img 
          src={imageSrc} 
          alt={`${title} illustration`} 
          className="object-contain shrink-0 self-end mt-16 aspect-[1.29] w-[88px] max-md:mt-10"
        />
      </div>
    </div>
  );
};

export default StatCard;