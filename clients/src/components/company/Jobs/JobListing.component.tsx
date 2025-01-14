import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IoFilterOutline } from "react-icons/io5";
import { JobApi } from "@/api";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import {
  BriefcaseIcon,
  Calendar,
  ChevronRight,
  Ellipsis,
  PlusCircle,
} from "lucide-react";
import { addDays, endOfMonth, format, startOfMonth } from "date-fns";
import CreateJobModal from "../../job/CreateJobModal";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { DatePickerWithRange } from "@/components/common/DatePicker/RangePicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

const CompanyManagemnet: React.FC = () => {
  const [job, setJob] = useState(null);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  })
  const [filter, setFilter] = useState('');
  const { id } = useParams();
  const { data, isError } = useQuery(
    ["jobs"],
    () => JobApi.getjobByCompany(date?.to, date?.from),
    {}
  );
  const [isOpen, setClose] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    console.log(data);
  }, [data]);

  function handleFilterByDate(dateRange) { 
     console.log("dateRange", dateRange);
  }

  return (
    <div className="flex-1 p-4  md:p-8">
      <CreateJobModal isOpen={isOpen} onClose={setClose} job={job} />
      <section className="flex flex-wrap gap-10 justify-between items-center">
        <header className="flex flex-col self-stretch my-auto min-w-[240px]">
          <h1 className="text-2xl font-semibold leading-tight text-slate-800">
            Job Listing
          </h1>
          {data && data?.length > 0 ? (
            <p className="mt-2 text-base font-medium leading-relaxed text-slate-500">
              Here is your listing status from July 19 - July 25.
            </p>
          ) : (
            <></>
          )}
        </header>
        {data && data?.length > 0 && (
          <DatePickerWithRange onSelect={handleFilterByDate} />
        )}
      </section>
      <div className="w-full  p-2 mt-2 "></div>
      {data && data?.length > 0 ? (
        <div className="w-full p-4 mt-2 border rounded">
          <div className="flex items-center justify-between">
            <h1 className="text-lg ml-4 font-semibold">Job List</h1>
            <Select
            onValueChange={(value) => {
               setFilter(value)
            }}
            >

              <SelectTrigger
                icon={<IoFilterOutline className="size-5" />}
                className="w-28 bg-background gap-x-3 justify-center flex-row-reverse mr-3"
              >
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="full-time"
                  className="hover:bg-orange-600 hover:text-white cursor-pointer"
                >
                  Full Time
                </SelectItem>
                <SelectItem
                  
                  value="part-time"
                  className="hover:bg-orange-600 hover:text-white cursor-pointer"
                >
                  Part Time
                </SelectItem>
                <SelectItem
                  value="contract"
                  className="hover:bg-orange-600 hover:text-white cursor-pointer"
                >
                  Contract
                </SelectItem>
                <SelectItem
                  value="internship"
                  className="hover:bg-orange-600 hover:text-white cursor-pointer"
                >
                  Internship
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="">
                <TableHead className="text-start">Roles</TableHead>
                <TableHead className="">Status</TableHead>
                <TableHead className="">Posted Date</TableHead>
                <TableHead className="">Due Date</TableHead>
                <TableHead>Eployment</TableHead>
                <TableHead>Applicants</TableHead>
                <TableHead className="text-right">Needs</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((el, index) => (
                <TableRow
                  className={`border-b-0 font-clash rounded-lg text-start text-sm font-medium capitalize ${
                    index % 2 ? "bg-background " : ""
                  } hover:bg-gray-100`}
                >
                  <TableCell className="font-medium">{el.jobTitle}</TableCell>
                  <TableCell>
                    <span
                      className={`${
                        new Date(el.expiry).getTime() > Date.now()
                          ? "border-green-700 text-green-700 bg-green-50"
                          : "border-red-500 bg-red-50 text-red-600"
                      } py-1 px-6 border-2 rounded-full `}
                    >
                      {new Date(el.expiry).getTime() > Date.now()
                        ? "Live"
                        : "Closed"}
                    </span>
                  </TableCell>
                  <TableCell>{format(el.createdAt, "PPP")}</TableCell>
                  <TableCell>{format(el.expiry, "PPP")}</TableCell>
                  <TableCell>{el.employment}</TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right">
                    {el.experience} year
                  </TableCell>
                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost">
                          <Ellipsis />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="bg-gray-200 text-orange-950 flex flex-col items-center p-0 w-fit">
                        <div>
                          <button
                            onClick={() => {
                              setJob(el);
                              setClose(true);
                            }}
                            className="px-2 font-semibold  hover:bg-orange-700 hover:text-white w-full py-2"
                          >
                            Update
                          </button>
                        </div>
                        <div>
                          <button
                            onClick={() => {
                              navigate(`/company/jobs/inspect/${el._id}`);
                            }}
                            className="px-2 font-semibold w-full rounded hover:bg-orange-700 hover:text-white py-2"
                          >
                            Inspect
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <nav
            className="flex flex-wrap gap-10 justify-between items-center px-4 text-base leading-relaxed bg-white border-t pt-2"
            aria-label="Pagination"
          >
            <div className="flex gap-4 items-center self-stretch my-auto font-medium min-w-[240px] text-slate-500">
              <span className="self-stretch my-auto">View</span>
              <Select
              // value={applicantsPerPage?.toString()}
              // onValueChange={(value) => onApplicantsPerPageChange(Number(value))}
              >
                <SelectTrigger className="flex gap-2 justify-center items-center  py-2 bg-white border-zinc-200 min-w-[100px] w-8">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
              <span className="self-stretch my-auto">Applicants per page</span>
            </div>
            <div className="flex gap-2 justify-center items-center self-stretch my-auto font-semibold text-center whitespace-nowrap">
              <button
                // onClick={() => onPageChange(currentPage - 1)}
                disabled={1 === 1}
                className="p-2"
                aria-label="Previous page"
              >
                <ChevronRight className="rotate-180" />
              </button>
              <div className="flex items-start self-stretch my-auto">
                {[...Array(3)].map((_, index) => (
                  <button
                    key={index}
                    // onClick={() => onPageChange(index + 1)}
                    className={`gap-2 self-stretch px-3 py-2.5 rounded-lg ${
                      1 === index + 1
                        ? "text-white bg-orange-700"
                        : "text-slate-600"
                    } w-[46px] h-[46px]`}
                    aria-label={`Page ${index + 1}`}
                    aria-current={1 === index + 1 ? "page" : undefined}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                // onClick={() => onPageChange(currentPage + 1)}
                // disabled={currentPage === totalPages}
                className="p-2"
                aria-label="Next page"
              >
                <ChevronRight />
              </button>
            </div>
          </nav>
        </div>
      ) : (
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
              onClick={() => setClose(true)}
            >
              <PlusCircle className="h-4 w-4" />
              Post Your First Job
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompanyManagemnet;
