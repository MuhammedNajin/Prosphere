import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Coffee,
  Bus,
  Heart,
  Stethoscope,
  Waves,
  Video,
  Tent,
  ArrowRight,
  MapPin,
  Users,
  Globe,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "react-query";
import { JobApi } from "@/api";
import JobDescriptionSkeleton from "../Skeleton/JobDescription.skeleton";
import JobApplicationModal from "./JobApplicationModal";
import { ApplicationApi } from "@/api/application.api";
import CreateJobModal from "./CreateJobModal";
import { Skill } from "@/types/profile";
import { useCurrentUser } from "@/hooks/useSelectors";


const JobDescription: React.FC = () => {
  const navigate = useNavigate();
  const { id: paramId } = useParams(); // Get ID from URL params

  const user = useCurrentUser();
  const { state } = useLocation();
  const [isCompany, setIsCompany] = useState(false);
  const [modal, setModal] = useState(false);

  // Use paramId if available, otherwise use companyId
  const jobId = paramId

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

  useEffect(() => {
    if (state?.isCompany) {
      setIsCompany(true);
    }
  }, [state]);

  useEffect(() => {
    // Only call jobSeen if we have a valid jobId and user is not a company
    if (!isCompany && jobId) {
      JobApi.jobSeen(jobId)
        .then(() => {
          console.log('Job seen API called successfully');
        })
        .catch((error) => {
          console.error('Error calling jobSeen API:', error);
        });
    }
  }, [isCompany, jobId]);

  // Fixed: Add proper error handling and enabled condition
  const { data, isLoading, error } = useQuery({
    queryKey: ["job-description", jobId],
    queryFn: () => {
      if (!jobId) {
        throw new Error('Job ID is required');
      }
      return JobApi.getJobDetails(jobId);
    },
    enabled: !!jobId, // Only run query if jobId exists
    retry: 3,
    onError: (error) => {
      console.error('Error fetching job details:', error);
    }
  });

  // Fixed: Add proper error handling and conditional execution
  const isApplied = useQuery({
    queryKey: ["isApplied", jobId],
    queryFn: () => {
      if (!jobId) {
        throw new Error('Job ID is required for checking application status');
      }
      return ApplicationApi.isApplied(jobId);
    },
    enabled: !isCompany && !!jobId, // Only run if not company and jobId exists
    retry: 3,
    onError: (error) => {
      console.error('Error checking application status:', error);
    }
  });

  useEffect(() => {
    console.log("isApplied data:", isApplied.data, user?.id);
    console.log("job*********", data?.job);
  })

  const job = data?.job;
  const company = job?.companyId;
  const jobProps = {
    company: company?.name,
    jobTitle: job?.jobTitle,
    officeLocation: job?.officeLocation,
  };

  const handleCompanyProfile = () => {
    if (company?._id && company?.name) {
      navigate(`/profile/${company.name}/${company._id}/home`, {
        state: { fromJob: true }
      });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // You might want to show a toast notification here
      console.log('Link copied to clipboard');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  // Show error state
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Job</h2>
            <p className="text-gray-600 mb-4">
              {error instanceof Error ? error.message : 'Failed to load job details'}
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <JobDescriptionSkeleton />;
  }

  // Show not found state
  if (!job && !isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-4">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/jobs')}>
              Browse Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {isCompany ? (
        <CreateJobModal isOpen={modal} onClose={() => setModal(false)} job={job} />
      ) : (
        <JobApplicationModal
          applicationFormProps={{
            companyId: company?._id,
            jobId: jobId as string,
          }}
          job={jobProps}
          modal={modal}
          setModal={setModal}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                  {company?.name?.[0] || "C"}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {job?.jobTitle || "Job Title"}
                  </h1>
                  <p className="text-gray-600">
                    {company?.name || "Company"} • {job?.officeLocation || "Location"} • {job?.employment}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                {isCompany ? (
                  <Button 
                    onClick={() => setModal(true)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Edit Job
                  </Button>
                ) : (
                  company?.owner !== user?.id && (
                    <Button
                      disabled={isApplied?.data?.status ?? false}
                      onClick={() => setModal(true)}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      {isApplied?.data?.status ? "Applied" : "Apply Now"}
                    </Button>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600 whitespace-pre-wrap mb-6">{job?.jobDescription}</p>

                <h3 className="text-lg font-semibold mb-3">Responsibilities</h3>
                <ul className="space-y-2 mb-6">
                  {job?.responsibility?.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 mr-2 text-orange-600 mt-1 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-lg font-semibold mb-3">Qualifications</h3>
                <ul className="space-y-2">
                  {job?.qualifications?.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 mr-2 text-orange-600 mt-1 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Perks & Benefits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="mb-2">{benefit.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Job Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posted On</span>
                    <span className="font-medium">
                      {job?.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employment Type</span>
                    <span className="font-medium">{job?.employment || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salary Range</span>
                    <span className="font-medium">
                      {job?.salary?.from && job?.salary?.to 
                        ? `₹${job.salary.from.toLocaleString()} - ₹${job.salary.to.toLocaleString()}`
                        : 'Not specified'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vacancies</span>
                    <span className="font-medium">{job?.vacancies || 'N/A'}</span>
                  </div>
                </div>

                {job?.skills && job.skills.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill: Skill, index: number) => (
                        <span
                          key={index}
                          className="bg-orange-50 text-orange-700 text-xs font-medium px-2.5 py-1 rounded"
                        >
                          {skill?.name} {skill?.proficiency && `(${skill.proficiency})`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {!isCompany && company && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                      {company.name?.[0] || "C"}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{company.name}</h2>
                      <p className="text-sm text-gray-600">{company.industry}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {company.location?.[0]?.placename && (
                      <div className="flex items-center text-gray-600">
                        <MapPin size={16} className="mr-2" />
                        <span>{company.location[0].placename}</span>
                      </div>
                    )}
                    {company.size && (
                      <div className="flex items-center text-gray-600">
                        <Users size={16} className="mr-2" />
                        <span>{company.size} employees</span>
                      </div>
                    )}
                    {company.website && (
                      <div className="flex items-center">
                        <Globe size={16} className="mr-2" />
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-600 hover:text-orange-700"
                        >
                          Company Website
                        </a>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleCompanyProfile}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={!company._id || !company.name}
                  >
                    <span>View Company Profile</span>
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;