import React from 'react';

interface JobCardProps {
  logo: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  tags: string[];
  applicants: number;
  capacity: number;
}

const JobCard: React.FC<JobCardProps> = ({ logo, title, company, location, jobType, tags, applicants, capacity }) => (
  <div className="flex flex-col flex-1 shrink py-6 pr-5 pl-6 bg-white border border-solid basis-0 border-zinc-200 min-w-[240px] max-md:pl-5">
    <div className="flex flex-col w-full max-w-[205px]">
      <div className="flex gap-10 justify-between items-start w-full text-sm font-semibold text-emerald-300 whitespace-nowrap">
        <img loading="lazy" src={logo} className="object-contain shrink-0 w-12 aspect-square" alt={`${company} logo`} />
        <span className="gap-2 self-stretch px-2.5 py-1.5 bg-emerald-300 bg-opacity-10 rounded-[80px]">{jobType}</span>
      </div>
      <div className="flex flex-col mt-4">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <div className="flex gap-2 justify-center items-center self-start text-base text-slate-500">
          <span className="self-stretch my-auto">{company}</span>
          <span className="self-stretch my-auto">{location}</span>
        </div>
      </div>
    </div>
    <div className="flex gap-2 items-start self-start mt-6 text-sm font-semibold whitespace-nowrap">
      {tags.map((tag, index) => (
        <span key={index} className={`gap-2 self-stretch px-2.5 py-1.5 text-${tag.toLowerCase()} border border-${tag.toLowerCase()} border-solid rounded-[80px]`}>
          {tag}
        </span>
      ))}
    </div>
    <div className="flex flex-col mt-6 w-full text-sm text-center text-slate-500">
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/c93041f14af7fc08ccdf57b13f7671b35a8d18fc2b5cabb850d2ca7e2953fe71?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732" className="object-contain w-full aspect-[33.33]" alt="Application progress bar" />
      <p className="self-start mt-2">
        <span className="font-semibold text-slate-800">{applicants} applied </span>
        <span className="text-slate-500">of {capacity} capacity</span>
      </p>
    </div>
  </div>
);

const JobUpdates: React.FC = () => {
  const jobs = [
    {
      logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/b1f0ef93df9440e774b9c43001ef6c0cebf747419e4b37568ce0a82e4f38a5e0?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732",
      title: "Social Media Assistant",
      company: "Nomad",
      location: "Paris, France",
      jobType: "Full-Time",
      tags: ["Marketing", "Design"],
      applicants: 5,
      capacity: 10
    },
    {
      logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/3b7426b22e86307adec7f009a144499267f3db213954b50a07d37756229fe084?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732",
      title: "Brand Designer",
      company: "Nomad",
      location: "Paris, France",
      jobType: "Full-Time",
      tags: ["Business", "Design"],
      applicants: 5,
      capacity: 10
    },
    {
      logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/c24a6dd137c84ccca6588a70a32d66960c38f4700d0d55d2205f87bc66fff494?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732",
      title: "Interactive Developer",
      company: "Terraform",
      location: "Berlin, Germany",
      jobType: "Full-Time",
      tags: ["Marketing", "Design"],
      applicants: 5,
      capacity: 10
    },
    {
      logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/921d4cd4372f852a87b427ae3618136a959c572be42566d14c2e41204ed3e545?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732",
      title: "Product Designer",
      company: "ClassPass",
      location: "Berlin, Germany",
      jobType: "Full-Time",
      tags: ["Business", "Design"],
      applicants: 5,
      capacity: 10
    }
  ];

  return (
    <section className="flex flex-col mt-6 w-full border border-solid border-zinc-200 max-w-[1106px] max-md:max-w-full">
      <div className="flex flex-wrap gap-10 justify-between items-start p-6 w-full font-semibold bg-white shadow-sm max-md:px-5 max-md:max-w-full">
        <h2 className="text-xl leading-tight text-slate-800">Job Updates</h2>
        <a href="#view-all" className="flex gap-2 items-center text-base leading-relaxed text-indigo-600">
          <span className="self-stretch my-auto">View All</span>
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/7d09976ba153d5f9151e87ea7b95f986fd2286bbc2ee738bca2f229d18eb4531?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732" className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square" alt="" />
        </a>
      </div>
      <div className="flex flex-wrap gap-6 items-start p-6 w-full leading-relaxed max-md:px-5 max-md:max-w-full">
        {jobs.map((job, index) => (
          <JobCard key={index} {...job} />
        ))}
      </div>
    </section>
  );
};

export default JobUpdates;