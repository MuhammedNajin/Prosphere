import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { CompanyApi } from "@/api";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import NavigationLink from "../Application/NavigationLink";
import { useSelectedCompany } from "@/hooks/useSelectedCompany";
import Pagination from "@/components/common/Pagination/Pagination";
import { ItemsPerPageOption } from "@/types/job";
import { Applicant } from "@/types/application";

interface ApplicationResponse {
  data: Applicant[];
  total: number;
  currentPage: number;
  totalPages: number;
}

const JobInspect: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<ItemsPerPageOption>(10);
  const navigate = useNavigate();
  const company = useSelectedCompany();
  const { id } = useParams();

  const { 
    data,
    refetch,
    isFetching
  } = useQuery<ApplicationResponse>({
    queryKey: ["applications", id!, currentPage, itemsPerPage],
    queryFn: async () => {
      // Add pagination parameters to the API call
      const response = await CompanyApi.getApplicationByJob(
        id as string,
        currentPage,
        itemsPerPage
      );
      return response;
    },
    keepPreviousData: true,
  });

  useEffect(() => {
     console.log("data", data, currentPage, totalPages)
  })

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await refetch();
  };

  const handleItemsPerPageChange = async (items: ItemsPerPageOption) => {
    setItemsPerPage(items);
    setCurrentPage(1);
    await refetch();
  };

  // Ensure we have the correct total pages calculation
  const totalPages = data?.total || 1;
  const hasMore = currentPage < totalPages;

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
        <button
          onClick={() => navigate(`/company/jobs/${company?._id}`)}
          className="flex gap-2.5 justify-center items-center rounded-lg self-stretch px-4 py-2 my-auto text-base font-bold leading-relaxed text-center text-orange-700 border border-orange-700 hover:bg-orange-700 hover:text-white border-solid"
        >
          <span className="self-stretch my-auto">Back</span>
        </button>
      </header>

      <div className="flex w-full flex-wrap self-start gap-10 items-start text-base font-semibold leading-relaxed bg-white shadow-sm text-gray-500 border-b">
        <nav>
          <ul className="flex space-x-6 items-start">
            <NavigationLink to="applicants">Applicants</NavigationLink>
            <NavigationLink to="job-details" state={{ isCompany: true }}>
              Job Details
            </NavigationLink>
          </ul>
        </nav>
      </div>

      <div className="w-full overflow-auto mt-4">
        <Outlet context={{ data: data?.data, isLoading: isFetching }} />
      </div>

      {data && data.total > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          hasNextPage={hasMore}
          fetchNextPage={refetch}
          hasNext={hasMore}
        />
      )}
    </main>
  );
};

export default JobInspect;