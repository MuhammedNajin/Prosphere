import React, { useEffect, useState } from "react";
import {
  Coffee,
  Bus,
  Heart,
  Stethoscope,
  Waves,
  Video,
  Tent,
  ArrowRight,
} from "lucide-react";
import { useQuery } from "react-query";
import { JobApi } from "@/api";
import { useLocation, useOutletContext, useParams } from "react-router-dom";
import { useGetUser } from "@/hooks/useGetUser";
import JobDescriptionSkeleton from "../Skeleton/JobDescription.skeleton";
import JobApplicationModal from "./JobApplicationModal";
import { ApplicationApi } from "@/api/application.api";
import { Button } from "../ui/button";
import CreateJobModal from "./CreateJobModal";

const JobDescription: React.FC = () => {
  const benefits = [
    {
      icon: <Stethoscope size={24} className="text-orange-600" />,
      title: "Full Healthcare",
      description:
        "We believe in thriving communities and that starts with our team being happy and healthy.",
    },
    {
      icon: <Waves size={24} className="text-orange-600" />,
      title: "Unlimited Vacation",
      description:
        "We believe you should have a flexible schedule that makes space for family, wellness, and fun.",
    },
    {
      icon: <Video size={24} className="text-orange-600" />,
      title: "Skill Development",
      description:
        "We believe in always learning and leveling up our skills. Whether it's a conference or online course.",
    },
    {
      icon: <Tent size={24} className="text-orange-600" />,
      title: "Team Summits",
      description:
        "Every 6 months we have a full team summit where we have fun, reflect, and plan for the upcoming quarter.",
    },
    {
      icon: <Coffee size={24} className="text-orange-600" />,
      title: "Remote Working",
      description:
        "You know how you perform your best. Work from home, coffee shop or anywhere when you feel like it.",
    },
    {
      icon: <Bus size={24} className="text-orange-600" />,
      title: "Commuter Benefits",
      description:
        "We're grateful for all the time and energy each team member puts into getting to work every day.",
    },
    {
      icon: <Heart size={24} className="text-orange-600" />,
      title: "We give back.",
      description:
        "We anonymously match any donation our employees make (up to $/€ 600) so they can support the organizations they care about most-times two.",
    },
  ];
  const [modal, setModal] = useState(false);
  const { id } = useParams();
  const user = useGetUser();
  const { state } = useLocation();
  const [isCompany, setIsCompany] = useState(false)
 
  useEffect(() => {
     console.log("state", state)
    if(state?.isCompany) {
      setIsCompany(true)
    }
  }, [state])

  useEffect(() => {
    if(!isCompany) {
      JobApi.jobSeen(id as string);
    }
  },[])

  const { data, isLoading } = useQuery({
    queryKey: ["job-description"],
    queryFn: () => JobApi.getJobDetails(id as string),
  });

  const isApplied = useQuery({
    queryKey: ["isApplied"],
    queryFn: () => {
      if (!isCompany) {
        return ApplicationApi.isApplied(id);
      }
    },
  });

  const job = data?.job;
  const companyId = job?.companyId;
  const jobProps = {
    company: companyId?.name,
    jobTitle: job?.jobTitle,
    officeLocation: job?.officeLocation,
  };

  useEffect(() => {
    console.log(data, isApplied.data);
  }, [data, isApplied.data]);

  if (isLoading) {
    return <JobDescriptionSkeleton />;
  }

  return (
    <div>
      {isCompany ? (
        <CreateJobModal isOpen={modal} onClose={setModal} job={job} />
      ) : (
        <JobApplicationModal
          applicationFormProps={{
            companyId: companyId?._id,
            jobId: id as string,
          }}
          job={jobProps}
          modal={modal}
          setModal={setModal}
        />
      )}

      <div className="flex">
        <div className="flex-1">
          <div className="mx-auto p-8">
            <div className="bg-white rounded overflow-hidden">
              <div className="bg-gray-100 p-11 rounded-lg">
                <div className="bg-white border p-6 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-700 rounded flex items-center justify-center text-white text-2xl font-bold">
                      {companyId?.name?.[0] || "C"}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {job?.jobTitle || "Job Title"}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {companyId?.name || "Company"} •{" "}
                        {job?.officeLocation || "Location"} • {job?.employment}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                    </button>
                    {isCompany ? (
                      <Button 
                      onClick={() => {
                         setModal(true)
                      }} 
                      className="bg-orange-700 hover:bg-orange-800 text-white font-bold py-2 px-4 rounded">Edit Job</Button>
                    ) : (
                      companyId?.owner !== user?._id && (
                        <button
                          disabled={isApplied?.data?.status ?? null}
                          onClick={() => {
                            setModal(true);
                          }}
                          className="bg-orange-700 hover:bg-orange-800 text-white font-bold py-2 px-4 rounded"
                        >
                          {isApplied?.data?.status ? "Applied" : "Apply"}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-white rounded border-t">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-grow md:w-2/3">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-600 mb-6">{job?.jobDescription}</p>

                <h3 className="text-xl font-semibold mb-3">Responsibilities</h3>
                <ul className="space-y-2 mb-6">
                  {job?.responsibility?.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <h3 className="text-xl font-semibold mb-3">Who You Are</h3>
                <ul className="space-y-2 mb-6">
                  {job?.qualifications?.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:w-1/3">
                <h3 className="text-xl font-semibold mb-4">About this role</h3>
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      {job?.likes?.length || 0} interested
                    </span>
                    <span className="text-sm text-gray-600">
                      of {job?.vacancies || 0} openings
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{
                        width: `${Math.min(
                          ((job?.likes?.length || 0) / (job?.vacancies || 1)) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Job Posted On</span>
                      <span className="text-gray-600">
                        {new Date(job?.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Job Type</span>
                      <span className="font-semibold">{job?.employment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Salary</span>
                      <span className="font-semibold">
                      ₹{job?.salary?.from?.toLocaleString()} -  ₹
                        {job?.salary?.to?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job?.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                    >
                      {skill.name} ({skill.proficiency})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto p-8 bg-white border-t">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Perks & Benefits
            </h2>
            <p className="text-gray-600 mb-8">
              This job comes with several perks and benefits
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex flex-col items-start">
                  <div className="text-indigo-600 mb-2">{benefit.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          {!isCompany && (
            <div className="p-8 bg-white border">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold mr-3">
                      {companyId?.name?.[0] || "C"}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {companyId?.name}
                      </h2>
                      <a
                        href={`/profile/${companyId.name}/${companyId._id}`}
                        className="text-indigo-600 flex items-center hover:underline"
                      >
                        Read more about {companyId?.name}
                        <ArrowRight size={16} className="ml-1" />
                      </a>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {companyId?.name} is located in{" "}
                    {companyId?.location?.[0]?.placename}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
