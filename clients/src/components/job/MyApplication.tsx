import { useMyApplications } from '@/hooks/useMyApplication';
import { Search, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useGetUser } from '@/hooks/useGetUser';
import { useInfiniteQuery } from 'react-query';
import { ApplicationApi } from '@/api/application.api';
import { ApplicationStatus } from '../company/Application/ApplicationStatusChangeModal';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from '../common/spinner/Loader';

const MyApplication = () => {
    const [filter, setFilter] = useState<ApplicationStatus>('All');
    const [search, setSearch] = useState('');
    const user = useGetUser();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError
    } = useInfiniteQuery({
        queryKey: ['myApplications', filter, search],
        queryFn: ({ pageParam = 1 }) => 
            ApplicationApi.getMyApplicatons(filter, search, pageParam),
        getNextPageParam: (lastPage, pages) => {
            return lastPage.hasMore ? pages.length + 1 : undefined;
        },  
        enabled: !!user?._id,
        staleTime: 5 * 60 * 1000,
        cacheTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const applications = data?.pages.flatMap(page => page.applications) ?? [];

    const tabs = [
        { name: 'All', count: 45 },
        { name: 'Applied', count: 34 },
        { name: 'Inreview', count: 18 },
        { name: 'Shortlisted', count: 5 },
        { name: 'Interview', count: 2 },
        { name: 'Rejected', count: 1 },
        { name: 'Selected', count: 1 },
    ];

    useEffect(() => {
       console.log("applications", applications);
       
    }, [applications])

    return (
        <main className="min-h-screen bg-white">
            <section className="container mx-auto px-4 py-8">
                <div className="w-full overflow-x-auto">
                    <nav className="flex min-w-max gap-4 border-b pb-2 mb-6">
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                onClick={() => setFilter(tab.name)}
                                className={`px-4 py-2 whitespace-nowrap ${
                                    filter === tab.name ? 'text-orange-600 font-semibold border-b-4 border-orange-600' : 'text-gray-500'
                                }`}
                            >
                                {tab.name} <span className="text-gray-500">({tab.count})</span>
                            </button>
                        ))}
                    </nav>
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
                            <Spinner size={25} color='#6b7280'/>
                        </div>
                    ) : isError ? (
                        <div className="text-center py-8 text-red-600">
                            Error loading applications. Please try again later.
                        </div>
                    ) : (
                        <>
                            <table className="min-w-full">
                                <thead>
                                    <tr className="text-left text-gray-500 text-lg">
                                        <th className="p-4 font-medium">#</th>
                                        <th className="p-4 font-medium">Company Name</th>
                                        <th className="p-4 font-medium">Roles</th>
                                        <th className="p-4 font-medium">Date Applied</th>
                                        <th className="p-4 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {applications.map((app, index) => (
                                        <tr 
                                            key={app._id}
                                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} capitalize text-base`}
                                        >
                                            <td className="p-4">{index + 1}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={app?.company || "/company.png"}
                                                        alt={`${app.companyId?.name} logo`}
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                    <span className="">{app.companyId?.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">{app.jobId?.jobTitle}</td>
                                            <td className="p-4">{format(app.appliedAt, 'PPP')}</td>
                                            <td className="p-4">
                                                <span 
                                                    className={`px-3 py-1 rounded-full font-medium bg-${app.status.color}/10 text-${app.status  .color}`}
                                                >
                                                    {app.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))} */}
                                </tbody>
                            </table>
                            
                            {hasNextPage && (
                                <div className="flex justify-center mt-6">
                                    <Button
                                        onClick={() => fetchNextPage()}
                                        disabled={isFetchingNextPage}
                                        className="bg-orange-600 text-white hover:bg-orange-700"
                                    >
                                        {isFetchingNextPage ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Loading more...
                                            </>
                                        ) : (
                                            'Load More Applications'
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