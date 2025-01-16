import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "react-query";
import { format, startOfMonth, endOfMonth } from "date-fns";
import {
  Search,
  BriefcaseIcon,
  PlusCircle,
  RefreshCw,
  Ellipsis,
  ChevronRight,
} from "lucide-react";
import { IoFilterOutline } from "react-icons/io5";

// UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/common/DatePicker/RangePicker";
import CreateJobModal from "../../job/CreateJobModal";
import { JobApi } from "@/api";
import Pagination from "@/components/common/Pagination/Pagination";
import { ItemsPerPageOption } from "@/types/job";

// Types
interface Job {
  _id: string;
  jobTitle: string;
  expiry: Date;
  createdAt: Date;
  employment: string;
  experience: number;
}

interface JobResponse {
  jobs: Job[];
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  total: number;
}

interface DateRange {
  from: Date;
  to: Date;
}

const CompanyManagement: React.FC = () => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [employmentFilter, setEmploymentFilter] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState<ItemsPerPageOption>(2);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, refetch } = useQuery<JobResponse>(
    ["company:jobs", dateRange, employmentFilter, itemsPerPage, currentPage],
    async () => {
      const response = await JobApi.getjobByCompany({
        to: dateRange.to,
        from: dateRange.from,
        filter: employmentFilter,
        page: currentPage,
        pageSize: itemsPerPage,
      });
      return response;
    }
  );

  const jobs = data?.jobs ?? [];
  const hasJobs = jobs.length > 0;

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await refetch();
  };

  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange);
  };

  const handleFilterChange = (value: string) => {
    setEmploymentFilter(value);
  };

  const handleClearFilters = () => {
    setEmploymentFilter("");
    setDateRange({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    });
  };

  const renderJobStatus = (expiryDate: Date) => {
    const isLive = new Date(expiryDate).getTime() > Date.now();
    return (
      <span
        className={`py-1 px-6 border-2 rounded-full ${
          isLive
            ? "border-green-700 text-green-700 bg-green-50"
            : "border-red-500 bg-red-50 text-red-600"
        }`}
      >
        {isLive ? "Live" : "Closed"}
      </span>
    );
  };

  // Empty state component
  const EmptyState = () => (
    <Card className="w-full my-8">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="rounded-full bg-gray-500 p-4 mb-4">
          <BriefcaseIcon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-orange-900 mb-2">
          No Jobs Posted Yet
        </h3>
        <p className="text-gray-600 text-center mb-6 max-w-sm">
          Get started by posting your first job opening. It only takes a few
          minutes to reach potential candidates.
        </p>
        <Button
          className="flex items-center gap-2 bg-orange-700 hover:bg-orange-900"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          Post Your First Job
        </Button>
      </CardContent>
    </Card>
  );

  const NoResults = () => (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <div className="mb-6 p-4 bg-gray-50 rounded-full">
        <Search className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No matching jobs found
      </h3>
      <p className="text-gray-600 mb-8 max-w-md">
        We couldn't find any jobs matching your current filters. Try adjusting
        your search criteria.
      </p>
      <div className="space-y-4 w-full max-w-md">
        <div className="flex items-start gap-3 text-left p-4 bg-white border border-gray-200 rounded-lg">
          <RefreshCw className="w-5 h-5 text-gray-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-gray-900">Broaden your search</h4>
            <p className="text-sm text-gray-600">
              Try using fewer filters or adjusting your search terms
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-8">
        <Button
          onClick={handleClearFilters}
          className="bg-orange-600 hover:bg-orange-700"
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );

  if (!hasJobs && !employmentFilter) {
    return <EmptyState />;
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={selectedJob}
      />

      <section className="flex flex-wrap gap-10 justify-between items-center">
        <header className="flex flex-col self-stretch my-auto min-w-[240px]">
          <h1 className="text-2xl font-semibold leading-tight text-slate-800">
            Job Listing
          </h1>
          {hasJobs && (
            <p className="mt-2 text-base font-medium leading-relaxed text-slate-500">
              Here is your listing status from {format(dateRange.from, "PPP")} -{" "}
              {format(dateRange.to, "PPP")}.
            </p>
          )}
        </header>
        {hasJobs && (
          <DatePickerWithRange
            onSelect={handleDateRangeChange}
            dateRange={dateRange}
          />
        )}
      </section>

      {hasJobs ? (
        <div className="w-full p-4 mt-2 border rounded">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg ml-4 font-semibold">Job List</h2>
            <Select value={employmentFilter} onValueChange={handleFilterChange}>
              <SelectTrigger
                icon={<IoFilterOutline className="size-5" />}
                className="w-28 bg-background gap-x-3 justify-center flex-row-reverse mr-3"
              >
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                {["Full-Time", "Part-Time", "Contract", "Internship"].map(
                  (type) => (
                    <SelectItem
                      key={type}
                      value={type.toLowerCase()}
                      className="hover:bg-orange-600 hover:text-white cursor-pointer"
                    >
                      {type}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {jobs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Posted Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Employment</TableHead>
                  <TableHead>Applicants</TableHead>
                  <TableHead className="text-right">Experience</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job, index) => (
                  <TableRow
                    key={job._id}
                    className={`border-b-0 font-clash rounded-lg text-sm font-medium capitalize
                      ${index % 2 ? "bg-background" : ""} hover:bg-gray-100`}
                  >
                    <TableCell className="font-medium">
                      {job.jobTitle}
                    </TableCell>
                    <TableCell>{renderJobStatus(job.expiry)}</TableCell>
                    <TableCell>{format(job.createdAt, "PPP")}</TableCell>
                    <TableCell>{format(job.expiry, "PPP")}</TableCell>
                    <TableCell>{job.employment}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell className="text-right">
                      {job.experience} year{job.experience !== 1 ? "s" : ""}
                    </TableCell>
                    <TableCell className="text-right">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost">
                            <Ellipsis />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="bg-gray-200 text-orange-950 flex flex-col items-center p-0 w-fit">
                          <button
                            onClick={() => {
                              setSelectedJob(job);
                              setIsModalOpen(true);
                            }}
                            className="px-2 font-semibold hover:bg-orange-700 hover:text-white w-full py-2"
                          >
                            Update
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/company/jobs/inspect/${job._id}`)
                            }
                            className="px-2 font-semibold w-full rounded hover:bg-orange-700 hover:text-white py-2"
                          >
                            Inspect
                          </button>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <NoResults />
          )}

          <Pagination
            hasJobs={hasJobs}
            currentPage={currentPage}
            totalPages={data?.totalPages || 1}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={(items) => {
              setItemsPerPage(items);
              setCurrentPage(1);
              refetch();
            }}
            hasNextPage={currentPage < (data?.totalPages || 1)}
            fetchNextPage={() => {}}
            total={data?.total}
          />
        </div>
      ) : (
        <NoResults />
      )}
    </div>
  );
};

export default CompanyManagement;
