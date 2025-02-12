import React, { useEffect } from "react";
import { JobApi } from "@/api";
import { useQuery } from "react-query";
import { useLocation, useParams } from "react-router-dom";
import { Briefcase, Clock, MapPin, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skill } from "@/types/profile";
import { startOfYear } from 'date-fns'
const formatSalary = (amount: number) => {
  if (amount >= 10000000) return `${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
  return `${(amount / 1000).toFixed(0)}K`;
};

const JobPosts: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const fromJob = location.state?.fromJob || false;

  useEffect(() => {
     console.log("fromjob job ", fromJob);
     
  },)

  const { data: response = { jobs: [] } } = useQuery(
    ["jobs", id],
    () => {
      return JobApi.getjobByCompanyFromPublic({
          filter: "",
          from: startOfYear(new Date()),
          to: new Date(),
          page: 1,
          pageSize: 10,
          companyId: id,
        })
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 2,
    }
  );

  const displayJobs = React.useMemo(() => {
    return response.jobs.slice(0, 3).map((job: any) => ({
      ...job,
      formattedSalary: {
        from: formatSalary(job?.salary?.from),
        to: formatSalary(job?.salary?.to),
      },
    }));
  }, [response.jobs]);

  return (
    <Card className="w-full max-w-[1106px] bg-gradient-to-br from-white to-zinc-50/50">
      <CardHeader className="pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Job Posts
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {displayJobs.map((job: any, index: number) => (
            <div
              key={index + new Date().getTime()}
              className="group relative bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-zinc-100 hover:border-orange-100 hover:scale-[1.02]"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                  <MapPin className="w-3 h-3 mr-1" />
                  {job.jobLocation}
                </span>
                <span className="inline-flex items-center text-xs font-medium text-slate-600">
                  <Clock className="w-3 h-3 mr-1" />
                  {job.employment}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-slate-800 mb-4 line-clamp-2 group-hover:text-orange-600 transition-colors">
                {job?.jobTitle}
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-700">
                    ₹{job?.formattedSalary?.from} - {job?.formattedSalary?.to}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                  <span>{job?.experience} years experience</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {job.skills.slice(0, 3).map((skill: Skill, idx: number) => (
                  <span
                    key={`${job?.id}-${idx}`}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors"
                  >
                    {skill?.name}
                  </span>
                ))}
              </div>

              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-50 to-transparent rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobPosts;
