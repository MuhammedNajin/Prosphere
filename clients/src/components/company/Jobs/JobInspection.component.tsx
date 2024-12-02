import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { CompanyApi } from "@/api";
import { Outlet, useNavigate, useOutlet, useParams } from "react-router-dom";
import NavigationLink from "../Application/NavigationLink";

const Jobinspect: React.FC = () => {

  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["applications"],
    queryFn: () => CompanyApi.getApplicationByJob(id as string),
  });

  useEffect(() => {
  
  }, [data]);

  

  return (
    <main className="flex flex-col items-center bg-white p-8">
      <header className="flex flex-wrap gap-10 justify-between items-center px-8 py-6 w-full bg-white max-md:px-5">
        <div className="flex gap-6 items-center self-stretch my-auto min-w-[240px] text-slate-800">
          <div className="flex flex-col self-stretch my-auto min-w-[240px]">
            <h1 className="text-2xl font-semibold leading-tight">
              Full Stack Developer
            </h1>
            <div className="flex gap-2 justify-center items-center mt-2 text-xl leading-relaxed">
              <span className="self-stretch my-auto">Full-Time</span>
              <span className="self-stretch my-auto text-slate-500">
                {4} / <span className="text-slate-500">{10} Hired</span>
              </span>
            </div>
          </div>
        </div>
        <button className="flex gap-2.5 justify-center items-center rounded-lg self-stretch px-4 py-2 my-auto text-base font-bold leading-relaxed text-center text-orange-700 border border-orange-700 border-solid">
          <span className="self-stretch my-auto">Back</span>
        </button>
      </header>

      <div className="flex w-full flex-wrap self-start gap-10 items-start text-base font-semibold leading-relaxed bg-white shadow-sm text-gray-500 border-=b">
      <nav>
          <ul className="flex space-x-6 items-start">
            <NavigationLink to="applicants">Applicants</NavigationLink>
            <NavigationLink to="job-details" state={{ isCompany: true }}>Job Details</NavigationLink>
            <NavigationLink to="analytics">Analytics</NavigationLink>
          </ul>
        </nav>  
      </div>

      <div className="w-full overflow-auto mt-4">
        <Outlet context={{ data: data }}/>
      </div>
    </main>
  );
}

export default Jobinspect;
