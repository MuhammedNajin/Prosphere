import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  LayoutList,
  MapPin,
  Reply,
  Search,
  ThumbsUp,
  X,
} from "lucide-react";
import { BiSolidLike } from "react-icons/bi";
import { TbLayoutListFilled } from "react-icons/tb";
import { FaRegComment } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useInfiniteQuery, useMutation } from "react-query";
import { JobApi } from "@/api";
import { Job } from "@/types/job";
import { useNavigate } from "react-router-dom";
import { useGetUser } from "@/hooks/useGetUser";
import { queryClient } from "@/main";
import { Separator } from "../ui/separator";
import SalaryRangeSlider from "../common/RangeSlider";
import LocationSearch from "../common/LocationField/LocationField";

const JobListing = () => {
  const [comment, setComment] = useState(false);
  const [job, setJob] = useState<Job>();
  const [salaryRange, setSalaryRange] = useState([0, 200000]);
  const [experienceLevel, setExperienceLevel] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  const [filter, setFilters] = useState({
    jobLocation: [] as string[],
    employment: [] as string[],
    experience: 0,
    salary: { min: 0, max: 200000 },
  });

  const observer = useRef<IntersectionObserver>();
  const navigate = useNavigate();
  const user = useGetUser();

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery(
      ["jobs", filter, searchTerm],
      async ({ pageParam = 1 }) => {
        const response = await JobApi.getJobs({
          page: pageParam,
          filter,
          search: searchTerm,
          location,
        });
        return response;
      },
      {
        getNextPageParam: (lastPage, pages) => {
          return lastPage.hasMore ? pages.length + 1 : undefined;
        },
      }
    );

  const lastJobElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, fetchNextPage]
  );

  const likeMutation = useMutation({
    mutationFn: JobApi.likeJobs,
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  const handleLikes = (id: string, index: number) => {
    const data = {
      jobId: id,
      userId: user._id,
      index,
    };
    likeMutation.mutate({ data });
  };

  const handleFilterChange = (type: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const getExperienceLevelLabel = (value: number) => {
    if (value <= 2) return "Entry Level";
    if (value <= 5) return "Mid Level";
    if (value <= 8) return "Senior Level";
    return "Expert Level";
  };

  return (
    <div>
      <div className="flex">
        <div className="flex flex-col flex-1">
          <div className="max-w-7xl px-8 pt-6">
            <div className="p-6 pt-0">
              <div className="flex flex-1 gap-4">
                <div className="flex flex-1 gap-x-4 relative border rounded-lg pl-2">
                  <div className="flex flex-row items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    onChange={(e) => setSearchTerm(e.target.value)}
                    type="text"
                    placeholder="Job title or keyword"
                    className="w-full  pr-4 py-3  border-gray-200 focus:outline-none focus:border-transparent"
                  />
                </div>
                <Separator orientation="vertical" />
                <div className="flex flex-1 gap-x-4 relative border rounded-lg pl-2">
                  <div className="flex flex-row items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                 <LocationSearch onSelectLocation={(location) => {
                   console.log(location);
                   setLocation(location.place_name)
                   
                 }} />
                </div>
                <button className="px-8 py-3 bg-orange-700 text-white font-bold rounded hover:bg-orange-950 transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="flex border-t">
            <div className="w-64 p-4 border-r pt-5">
              <Accordion type="single" collapsible>
                <AccordionItem value="jobLocation">
                  <AccordionTrigger className="font-semibold text-base text-orange-950">
                    Job Location
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {["on-Site", "remote", "hybrid"].map((jobLocation) => (
                        <label key={jobLocation} className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            onChange={(e) => {
                              const newLocations = e.target.checked
                                ? [...filter.jobLocation, jobLocation]
                                : filter.jobLocation.filter(
                                    (loc) => loc !== jobLocation
                                  );
                              handleFilterChange("jobLocation", newLocations);
                            }}
                          />
                          {jobLocation}
                        </label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              {/* Existing Employment Type Filter */}
              <Accordion type="single" collapsible>
                <AccordionItem value="employment">
                  <AccordionTrigger className="font-semibold text-base text-orange-950">
                    Employment Type
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {["Full-time", "Part-Time", "Internship", "Contract"].map(
                        (type) => (
                          <label key={type} className="flex items-center">
                            <input
                              type="checkbox"
                              className="mr-2"
                              onChange={(e) => {
                                const newTypes = e.target.checked
                                  ? [...filter.employment, type]
                                  : filter.employment.filter(
                                      (t) => t !== type
                                    );
                                handleFilterChange("employment", newTypes);
                              }}
                            />
                            {type}
                          </label>
                        )
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Accordion type="single" collapsible>
                <AccordionItem value="employment">
                  <AccordionTrigger className="font-semibold text-base text-orange-950">
                    Experience Level
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mt-4">
                      <Slider
                        value={[experienceLevel]}
                        onValueChange={(value) => {
                          setExperienceLevel(value[0]);
                          handleFilterChange("experience", value[0]);
                        }}
                        max={15}
                        step={1}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm">
                        <span>{experienceLevel} years</span>
                        <span>{getExperienceLevelLabel(experienceLevel)}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
    
              <Accordion type="single" collapsible>
                <AccordionItem value="salary">
                  <AccordionTrigger className="font-semibold text-base text-orange-950">
                    Salary Range
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mt-4">
                      <SalaryRangeSlider
                        value={salaryRange}
                        onValueChange={(value) => {
                          setSalaryRange(value);
                          handleFilterChange("salary", {
                            min: value[0],
                            max: value[1],
                          });
                        }}
                        max={200000}
                        step={1000}
                        className="mb-2"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Job Listings */}
            <div className="flex-1 p-4 pt-5 pr-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-clash font-bold">All Jobs</h2>
                <div className="flex items-center space-x-2">
                  <span>Sort by:</span>
                  <select className="p-1 rounded">
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
                {data?.pages.map((page, pageIndex) =>
                  page.jobs.map((job, index) => {
                    const isLastElement =
                      pageIndex === data.pages.length - 1 &&
                      index === page.jobs.length - 1;

                    return (
                      <div
                        key={job._id}
                        ref={isLastElement ? lastJobElementRef : null}
                        className="border p-8 rounded-lg flex items-center justify-between bg-white hover:border-blue-950"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 flex items-center justify-center rounded">
                            <img
                              src="/company.png"
                              alt=""
                              className="object-contain overflow-hidden"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg hover:underline cursor-default">
                              {job.jobTitle}
                            </h3>
                            <p className="text-sm text-gray-600 capitalize">
                              {job.companyId?.name} • {job.officeLocation}
                            </p>
                            <div className="flex items-center gap-x-3 space-x-2">
                              <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm">
                                {job.employment}
                              </span>
                              <button
                                onClick={() => handleLikes(job._id, index)}
                                className="inline-flex items-center gap-x-2"
                              >
                                <span>{job.likes.length}</span>
                                {job.likes.includes(user._id) ? (
                                  <BiSolidLike
                                    size={18}
                                    className="text-blue-950"
                                  />
                                ) : (
                                  <ThumbsUp
                                    className="text-slate-400 hover:text-blue-600"
                                    size={18}
                                  />
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setComment(true);
                                  setJob(job);
                                }}
                                className="text-slate-400 hover:text-blue-600"
                              >
                                <FaRegComment size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-y-3">
                          <Button
                            onClick={() =>
                              navigate(`/job-description/${job._id}`)
                            }
                            className="bg-orange-700 text-white px-4 py-2 rounded hover:bg-orange-800"
                          >
                            View Details
                          </Button>
                          <div className="w-full">
                            <div className="text-sm text-gray-600 mb-1">
                              Experience: {job.experience} years
                            </div>
                            <Progress
                              value={(job.experience / 15) * 100}
                              className="h-1"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                {isFetchingNextPage && (
                  <div className="text-center bg-orange-600 py-4">Loading more jobs...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListing;
