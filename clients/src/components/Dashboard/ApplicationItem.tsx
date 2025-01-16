

export interface Application {
    company: string;
    logo: string;
    position: string;
    location: string;
    type: string;
    dateApplied: string;
    status: string;
    statusColor: string;
  }



const ApplicationItem: React.FC<{ application: Application }> = ({ application }) => (
    <div className={`flex flex-wrap gap-10 justify-between items-center p-6 w-full rounded-lg ${application.company === "Udacity" ? "bg-white" : "bg-slate-50"} max-md:px-5 max-md:max-w-full`}>
      <div className="flex gap-4 items-center self-stretch my-auto min-w-[240px] w-[446px] max-md:max-w-full">
        <img 
          src={application.logo} 
          alt={`${application.company} logo`} 
          className="object-contain shrink-0 self-stretch my-auto w-16 aspect-square"
        />
        <div className="flex flex-col self-stretch my-auto min-w-[240px]">
          <h3 className="text-lg font-bold text-slate-800">{application.position}</h3>
          <div className="flex gap-2 justify-center items-center text-base min-h-[27px] text-slate-500">
            <span className="self-stretch my-auto">{application.company}</span>
            <span className="self-stretch my-auto">{application.location}</span>
            <span className="self-stretch my-auto">{application.type}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col self-stretch my-auto text-base w-[171px]">
        <p className="font-medium text-slate-800">Date Applied</p>
        <p className="mt-1.5 text-slate-500">{application.dateApplied}</p>
      </div>
      <div className="flex flex-col justify-center items-start self-stretch my-auto text-sm font-semibold whitespace-nowrap w-[117px]">
        <div className={`gap-2 self-stretch px-2.5 py-1.5 border border-solid rounded-[80px] ${application.statusColor}`}>
          {application.status}
        </div>
      </div>
    </div>
  );


  export default ApplicationItem