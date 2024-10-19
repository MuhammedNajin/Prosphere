import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  LayoutList,
  ThumbsUp,
  X,
} from "lucide-react";
import React, { useState } from "react";

import SidebarNavigation from "./Sidebar";
import JobSearch from "./JobListingSearchBar";
import { Button } from "../ui/button";
import { TbLayoutListFilled } from "react-icons/tb";
import { FaRegComment } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import JobApplicationForm from "./JobApplicationForm";

const JobListing: React.FC = () => {
  const [modal, setModal] = useState(false);
  const jobs = [
    {
      title: "Social Media Assistant",
      company: "Nomad",
      location: "Paris, France",
      logo: "🏠",
      applyButton: "Apply",
      applyButtonColor: "bg-orange-500",
      tags: ["2 applied of 10 capacity"],
    },
    {
      title: "Brand Designer",
      company: "Dropbox",
      location: "San Francisco, USA",
      logo: "📦",
      applyButton: "Apply",
      applyButtonColor: "bg-black",
      tags: ["2 applied of 10 capacity"],
    },
    {
      title: "Interactive Developer",
      company: "Terraform",
      location: "Hamburg, Germany",
      logo: "🏗️",
      applyButton: "Apply",
      applyButtonColor: "bg-black",
      tags: ["8 applied of 12 capacity"],
    },
    {
      title: "Email Marketing",
      company: "Revolut",
      location: "Madrid, Spain",
      logo: "R",
      applyButton: "Apply",
      applyButtonColor: "bg-black",
      tags: ["0 applied of 10 capacity"],
    },
    {
      title: "Lead Engineer",
      company: "Canva",
      location: "Ankara, Turkey",
      logo: "C",
      applyButton: "Apply",
      applyButtonColor: "bg-orange-500",
      tags: ["5 applied of 10 capacity"],
    },
    {
      title: "Product Designer",
      company: "ClassPass",
      location: "Berlin, Germany",
      logo: "🔵",
      applyButton: "Apply",
      applyButtonColor: "bg-orange-500",
      tags: ["5 applied of 10 capacity"],
    },
    {
      title: "Customer Manager",
      company: "Pitch",
      location: "Berlin, Germany",
      logo: "⚫",
      applyButton: "Apply",
      applyButtonColor: "bg-orange-500",
      tags: ["5 applied of 10 capacity"],
    },
  ];

  return (
    <div>
      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="max-w-4xl  overflow-hidden flex flex-col shadow-none border">
          <DialogHeader>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <svg
                    className="w-6 h-6 text-green-600"
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
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    Social Media Assistant
                  </h2>
                  <p className="text-sm text-gray-500">
                    Nomad • Paris, France • Full-Time
                  </p>
                </div>
              </div>
            </div>
            <DialogDescription>
              <h3 className="text-lg font-semibold">Submit your application</h3>
              <p className="text-sm text-gray-500 mb-1">
                The following is required and will only be shared with Nomad
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto p-6 scrollbar-hide">
            <JobApplicationForm />
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex">
        <SidebarNavigation />
        <div className="flex flex-col flex-1">
          <JobSearch />
          {/* Left Sidebar */}
          <div className="flex border-t ">
            <div className="w-64 p-4 border-r pt-5">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger
                    className="font-semibold text-base text-orange-950 "
                    type="button"
                  >
                    Eployment Type
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Full-time (3)
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Part-Time (5)
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Remote (2)
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Internship (24)
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Contract (3)
                      </label>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="flex-1 p-4 pt-5 pr-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-clash font-bold">All Jobs</h2>
                <div className="flex items-center space-x-2">
                  <span>Sort by:</span>
                  <select className=" p-1 rounded">
                    <option>Most relevant</option>
                  </select>
                  <button className="p-1 border rounded">
                    <LayoutGrid size={20} />
                  </button>
                  <button className="p-1 border rounded">
                    <TbLayoutListFilled size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {jobs.map((job, index) => (
                  <div
                    key={index}
                    className="border p-8 rounded flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded text-2xl">
                        <img
                          src="/company.png"
                          alt=""
                          className="object-contain overflow-hidden"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-sm text-gray-600">
                          {job.company} • {job.location}
                        </p>
                        <div className="flex items-center gap-x-3 space-x-2">
                          <span className="bg-[#56CDAD1A]  text-[#56CDAD] text-xs px-3 py-3 rounded-full">
                            Full Time
                          </span>
                          <ThumbsUp />
                          <FaRegComment className="size-5" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-3">
                      <Button
                      onClick={(e) => setModal(!modal)}
                        className={`bg-orange-600 text-white px-16 py-2 rounded hover:bg-orange-800`}
                      >
                        Apply
                      </Button>
                      <Progress value={33} className="h-1" />
                      {job.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="text-sm text-gray-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                {/* {jobs.map((job, index) => (
                  <div
                    key={index}
                    className="border p-8 rounded flex items-center justify-between"
                  >
                    <div className="flex  space-x-4">
                      <div className="w-12 h-12 mt-3 flex items-center justify-center bg-gray-200 rounded-lg text-2xl">
                        <img
                          src="/company.png"
                          alt=""
                          className="object-contain overflow-hidden"
                        />
                      </div>
                      <div className="flex flex-col gap-y-1">
                        <h3 className="text-lg font-bold">{job.title}</h3>
                        <p className="text-sm text-[#7C8493]">
                          {job.company} • {job.location}
                        </p>
                        <div className="flex items-center gap-x-3 space-x-2 ">
                          <span className="bg-[#56CDAD1A]  text-[#56CDAD] text-xs px-3 py-3 rounded-full">
                            Full Time
                          </span>
                          <ThumbsUp />
                          <FaRegComment className="size-5" />
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                         <Button className="text-white px-4 py-2 rounded"/>
                         <Progress value={33}/>
                      </div>
                    </div>
                  </div>
                ))} */}
              </div>

              <div className="flex font-semibold justify-center items-center space-x-2 mt-4">
                <button className="p-2 border  rounded-full">
                  <ChevronLeft size={20} />
                </button>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-full">
                  1
                </button>
                <button className="px-4 py-2 border  rounded-full">2</button>
                <button className="px-4 py-2 border  rounded-full">3</button>
                <button className="px-4 py-2 border  rounded-full">4</button>
                <button className="px-4 py-2 border  rounded-full">5</button>
                <span>...</span>
                <button className="px-4 py-2 border  rounded-full">33</button>
                <button className="p-1 border  rounded-full">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListing;
