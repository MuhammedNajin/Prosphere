import React from 'react';

interface StageProgressProps {
  stage: {
    name: string;
    progress: number;
  };
}
{/* <FILE path="ApplicantProfile/StageProgress.tsx"> */}
const StageProgress: React.FC<StageProgressProps> = ({ stage }) => {
  const progressSteps = 4;
  const filledSteps = Math.round(stage.progress * progressSteps);

  return (
    <section className="flex flex-col p-4 mt-5 w-full bg-gray-100 rounded-lg">
      <div className="flex gap-10 justify-between items-start w-full text-sm leading-relaxed whitespace-nowrap">
        <h3 className="text-accent-purple">Stage</h3>
        <div className="flex gap-2 items-center text-right text-orange-700">
          <div className="flex shrink-0 self-stretch my-auto w-2.5 h-2.5 bg-orange-700 rounded-full fill-orange-700" />
          <span className="self-stretch my-auto">{stage.name}</span>
        </div>
      </div>
      <div className="flex gap-0.5 mt-2 w-full min-h-[11px]">
        {[...Array(progressSteps)].map((_, index) => (
          <div
            key={index}
            className={`flex flex-1 shrink basis-0 h-[11px] ${
              index < filledSteps ? 'bg-orange-700 ' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default StageProgress;