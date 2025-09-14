import React, { useEffect, useState } from "react";
import { Search,  MoreHorizontal,  Inbox } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useQuery } from "react-query";
import { ApplicationApi } from "@/api/application.api";
import { useLocation, useNavigate, } from "react-router-dom";
import { CompanyApi } from "@/api";
import { Applicant, ViewType } from "@/types/application";
import { format } from "date-fns";
import { ItemsPerPageOption } from "@/types/job";
import Pagination from "../common/Pagination/Pagination";
import ApplicationSkeleton from "../Skeleton/CompanySideApplicationSkeleton";
import StatusFilter from "../common/JobApplicationFilter/ApplicationFilter";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import ApplicationCards from "./Application/ApplicationCardView";
import { useCurrentCompany } from "@/hooks/useSelectedCompany";


interface ApplicationResponse {
  applications: Applicant[];
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  total: number;
}

const EmptyState = ({ hasFilter }: { hasFilter: boolean }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 border rounded-lg bg-gray-50">
    <Inbox className="h-16 w-16 text-gray-400 mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      {hasFilter ? "No applications match your filters" : "No applications yet"}
    </h3>
    <p className="text-gray-500 text-center max-w-md">
      {hasFilter 
        ? "Try adjusting your filters or search terms to find what you're looking for"
        : "When candidates apply for your job postings, they will appear here"}
    </p>
  </div>
);

const Application: React.FC = () => {
  const [view, setView] = useState<ViewType>(ViewType.Table_View);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<ItemsPerPageOption>(10);
  const [currentPage, setCurrentPage] = useState(1);

  const company = useCurrentCompany();
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery<ApplicationResponse>(
    ["applications", company?.id, filter, itemsPerPage, currentPage, search],
    async () => {
      const response = await ApplicationApi.getAllApplication({
        companyId: company?.id!,
        filter,
        search,
        page: currentPage,
        pageSize: itemsPerPage,
      });
      return response;
    }
  );

  const hasApplication = (data?.applications ?? []).length > 0;
  const hasFilters = filter !== "" || search !== "";
  const { pathname } = useLocation();
  
  useEffect(() => {
    if (data?.applications) {
      const avatarUrls = data.applications.reduce<string[]>(
        (acc, applicant) => {
          if (applicant.applicantData.avatar) {
            acc.push(applicant.applicantData.avatar);
          }
          return acc;
        },
        []
      );

      async function getUrls(urls: string[]) {
        if (urls.length === 0) return;
        const data = await CompanyApi.getCompanyFilesBatch(urls);
        const urlMap = urls.reduce(
          (acc, url, index) => ({
            ...acc,
            [url]: data[index],
          }),
          {}
        );
        setUrls(urlMap);
      }

      getUrls(avatarUrls);
    }
  }, [data?.applications]);

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "interview":
        return "text-orange-800 border-orange-100";
      case "shortlisted":
        return "bg-purple-100 text-purple-800";
      case "declined":
        return "bg-red-100 text-red-800";
      case "hired":
        return "bg-green-100 text-green-800";
      case "interviewed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const onViewChange = (value: ViewType) => {
    setView(value);
  };

  const onViewApplication = (id: string) => {
    navigate(`/company/application/applicant/${id}/profile`, { state: { url: pathname }, replace: true});
  }

  if (isLoading) {
    return <ApplicationSkeleton />;
  }

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold">
              Total Applicants: {data?.total || 0}
            </h1>
            <div className="flex space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Applicants"
                  className="pl-10 pr-4 py-2.5 border rounded-md"
                  value={search}
                  onChange={handleSearch}
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={20}
                />
              </div>
              <StatusFilter
                onFilterChange={(value) => {
                  setFilter(value);
                  setCurrentPage(1);
                }}
              />
              <Tabs value={view} onValueChange={(value) => onViewChange(value as ViewType)}>
                <TabsList className="grid grid-cols-2 bg-white border">
                  <TabsTrigger
                    value={ViewType.Card_View}
                    className="data-[state=active]:bg-orange-700 data-[state=active]:text-white data-[state=active]:shadow-none px-4"
                  >
                    Pipeline View
                  </TabsTrigger>
                  <TabsTrigger
                    value={ViewType.Table_View}
                    className="data-[state=active]:bg-orange-700 data-[state=active]:text-white data-[state=active]:shadow-none px-4"
                  >
                    Table View
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {!hasApplication ? (
            <EmptyState hasFilter={hasFilters} />
          ) : (
            <>
              <div className="relative">
                {view === ViewType.Table_View ? (
                  <Table>
                    <TableHeader className="border">
                      <TableRow className="text-center">
                        <TableHead className="w-[300px]">
                          <div className="flex items-center space-x-2">
                            <Checkbox />
                            <span className="text-gray-500 font-medium">
                              Full Name
                            </span>
                          </div>
                        </TableHead>
                        <TableHead className="text-gray-500 font-medium">
                          Hiring Stage
                        </TableHead>
                        <TableHead className="text-gray-500 font-medium">
                          Applied Date
                        </TableHead>
                        <TableHead className="text-gray-500 font-medium">
                          Job Role
                        </TableHead>
                        <TableHead className="text-gray-500 font-medium text-center">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <div className="h-4" />
                    <TableBody className="border">
                      {data?.applications.map((applicant: Applicant, index) => (
                        <TableRow
                          key={applicant._id}
                          className={`border-0 ${
                            index % 2 ? "bg-gray-200" : "bg-white"
                          } hover:bg-gray-100`}
                        >
                          <TableCell>
                            <div className="flex items-center space-x-9">
                              <Checkbox />
                              <img
                                src={
                                  urls[applicant.applicantData.avatar] ??
                                  "/profileIcon.png"
                                }
                                alt={applicant.applicantData.username}
                                className="w-10 h-10 rounded-full"
                              />
                              <span>{applicant.applicantData.username}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-4 py-2 border-2 rounded-full text-sm ${getStageColor(
                                applicant.status
                              )}`}
                            >
                              {applicant.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {format(applicant.appliedAt, "PPP")}
                          </TableCell>
                          <TableCell>{applicant?.jobData?.jobTitle}</TableCell>
                          <TableCell className="flex justify-between">
                            <Button
                              onClick={() => onViewApplication(applicant?._id)}
                              variant="outline"
                              className="py-5 px-5 text-orange-700 font-semibold border-orange-700 border-2 bg-white hover:text-white hover:bg-orange-700"
                            >
                              See Application
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-5 h-5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <ApplicationCards
                    applications={data?.applications}
                    onViewApplication={onViewApplication}
                    urls={urls}
                  />
                )}
              </div>
              <Pagination
                hasNext={hasApplication}
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
                // total={data?.total}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Application;