import { Search, Loader2, ClipboardList } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { useInfiniteQuery } from "react-query";
import { ApplicationApi } from "@/api/application.api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "../common/spinner/Loader";
import EmptyApplications from "./EmptyApplication";
import { UserApi } from "@/api/user.api";
import { getStageColor } from "@/lib/utilities/getApplicationStatusColor";
import { ApplicationStatus } from "@/types/application";
import { useCurrentUser } from "@/hooks/useSelectors";

const MyApplication = () => {
  const [filter, setFilter] = useState<ApplicationStatus | "All">('All');
  const [search, setSearch] = useState("");
  const [urls, setUrls] = useState<Record<string, string>>({});
  const user = useCurrentUser();
  type TabsCount = Record<string, number>;


  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["myApplications", filter, search],
    queryFn: ({ pageParam = 1 }) =>
      ApplicationApi.getMyApplicatons(filter, search, pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) return undefined;
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const applications = data?.pages.flatMap((page) => page?.applications ?? []) ?? [];
  const tabs = data?.pages[0]?.filtersCount as TabsCount;
  const total = data?.pages[0]?.total;

  const getUrls = useCallback(async (logoKeys: string[]) => {
    if (!logoKeys.length) return;
    
    const uniqueKeys = [...new Set(logoKeys.filter(Boolean))];
    
    try {
      const { data } = await UserApi.getFiles(uniqueKeys);
      const newUrls: Record<string, string> = {};
      
      data.forEach((url: string, index: number) => {
        if (uniqueKeys[index]) {
          newUrls[uniqueKeys[index]] = url;
        }
      });
      
      setUrls(prev => ({...prev, ...newUrls}));
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  }, []);



  useEffect(() => {
    if (!applications.length) return;
    console.log("data ", data);
    console.log("condition", total, applications, filter == 'All', applications.length === 0, filter === 'All' && applications.length == 0,  filter);
    
    
    const logoKeys = applications
      .map(el => el.companyId?.logo)
      .filter(logo => logo && !urls[logo]);
    
    if (logoKeys.length > 0) {
      getUrls(logoKeys);
    }
  }, [applications, getUrls]);

  if (total == 0) {
    return <EmptyApplications />;
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="container mx-auto px-4 py-8">
        <div className="w-full overflow-x-auto">
          <div className="flex min-w-max gap-4 border-b pb-2 mb-6 capitalize">
            {tabs && Object.entries(tabs)?.map(([key, value], index: number) => (
                <button
                key={index + Date.now()}
                onClick={() => setFilter(key as ApplicationStatus | "All")}
                className={`px-4 py-2 whitespace-nowrap capitalize ${
                  filter === key
                    ? "text-orange-600 font-semibold border-b-4 border-orange-600"
                    : "text-gray-500"
                }`}
              >
                {key}
                { 
                    value > 0 && (
                        <span className="text-gray-500">({ value })</span>
                    )
                }
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Applications History</h2>
          <div className="relative w-full sm:w-72">
            <Input
              type="text"
              placeholder="Search by company or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size={25} color="#6b7280" />
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-red-600">
              Error loading applications. Please try again later.
            </div>
          ) : applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="mb-6 p-4 bg-gray-50 rounded-full">
              <ClipboardList  className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Applications Found
            </h3>
          </div>
          ) :(
            <>
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-base">
                    <th className="p-4 font-medium">#</th>
                    <th className="p-4 font-medium">Company Name</th>
                    <th className="p-4 font-medium">Roles</th>
                    <th className="p-4 font-medium">Date Applied</th>
                    <th className="p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, index) => (
                    <tr
                      key={app.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50"
                      } capitalize text-base`}
                    >
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          {app?.companyId?.logo ? (
                            <img
                              src={urls[app.companyId.logo]}
                              alt={`${app?.companyId?.name} logo`}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="flex justify-center items-center w-10 h-10 rounded-full shadow-lg text-white  bg-orange-600">
                              <p>{app.companyId?.name[0]}</p>
                            </div>
                          )}
                          <span className="">{app?.companyId?.name}</span>
                        </div>
                      </td>
                      <td className="p-4">{app.jobId?.jobTitle}</td>
                      <td className="p-4">{format(app?.appliedAt, "PPP")}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full border font-medium ${getStageColor(app?.status)}`}
                        >
                          {app?.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {hasNextPage && (
                <div className="flex justify-center mt-6">
                  <Button
                    variant="outline"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="bg-white border border-orange-700 text-orange-700 hover:bg-orange-700 hover:text-white "
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading more...
                      </>
                    ) : (
                      "Load More.."
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default MyApplication;