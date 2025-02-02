import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart as BarChartIcon,
  Activity,
  Users,
  Briefcase,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
} from "recharts";
import { NumberTicker } from "@/components/ui/number-ticker";
import { useQuery } from "react-query";
import { AdminApi } from "@/api";
import { useMemo } from "react";
import { Job } from "@/types/job";
import { format } from "date-fns";

interface JobStats 
   {
    totalJob: number;
    totalActiveJob: number;
    totalUser: number;
    totalApplication: number;
    trends: Array<{
      month: string;
      jobs: number;
      applications: number;
    }>;
    employmentTypeCounts: Array<{
      count: number;
      type: string;
    }>;
    recentJobs: Job[]
  };


const EMPLOYMENT_TYPES = [
  "Full-Time",
  "Part-Time",
  "Remote",
  "Internship",
  "Contract",
] as const;

const AdminDashboard = () => {
  const recentJobs = [
    {
      id: 1,
      title: "Senior React Developer",
      company: "Tech Corp",
      applications: 23,
    },
    {
      id: 2,
      title: "Product Manager",
      company: "Innovation Inc",
      applications: 45,
    },
    { id: 3, title: "UX Designer", company: "Design Studio", applications: 18 },
  ];

  const { data: jobStats } = useQuery<JobStats>({
    queryKey: "jobStats",
    queryFn: () => AdminApi.getJobStats(),
  });

  const completeEmploymentCounts = useMemo(() => {
    const existingCounts = new Map(
      jobStats?.employmentTypeCounts.map(({ type, count }) => [type, count])
    );

    return EMPLOYMENT_TYPES.map(type => ({
      type,
      count: existingCounts.get(type) || 0
    }));
  }, [jobStats?.employmentTypeCounts]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-blue-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <NumberTicker
                value={jobStats?.totalJob || 0}
                className="text-2xl font-bold"
              />
              <p className="text-xs text-gray-500">Posted jobs</p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Activity className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <NumberTicker
                value={jobStats?.totalActiveJob || 0}
                className="text-2xl font-bold"
              />
              <p className="text-xs text-gray-500">Currently active </p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-purple-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Candidates
              </CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <NumberTicker
                value={jobStats?.totalUser || 0}
                className="text-2xl font-bold"
              />
              <p className="text-xs text-gray-500">Registered users</p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-yellow-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Applications
              </CardTitle>
              <BarChartIcon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <NumberTicker
                value={jobStats?.totalApplication || 0}
                className="text-2xl font-bold"
              />
              <p className="text-xs text-gray-500">Job Applications</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Job Postings & Applications Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={jobStats?.trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="bump"
                      dataKey="jobs"
                      stroke="#8884d8"
                      name="Jobs Posted"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="applications"
                      stroke="#82ca9d"
                      name="Applications"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Jobs by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={completeEmploymentCounts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 capitalize">
          <CardHeader>
            <CardTitle>Recent Job Postings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="px-6 py-3">Job Title</th>
                    <th className="px-6 py-3">Company</th>
                    <th className="px-6 py-3">Applications</th>
                    <th className="px-6 py-3">Location</th>
                    <th className="px-6 py-3">Validity</th>
                  </tr>
                </thead>
                <tbody>
                  {jobStats?.recentJobs?.map((job) => (
                    <tr key={job._id} className="border-b bg-white">
                      <td className="px-6 py-4">{job.jobTitle}</td>
                      <td className="px-6 py-4">{job.companyId.name}</td>
                      <td className="px-6 py-4">-</td>
                      <td className="px-6 py-4">{job.jobLocation}</td>
                      <td className="px-6 py-4">
                         { format(job.expiry ?? new Date, 'PPP')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;