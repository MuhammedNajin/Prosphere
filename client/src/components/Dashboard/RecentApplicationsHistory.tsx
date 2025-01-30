import React from 'react';
import { ArrowRight, Briefcase } from 'lucide-react';
import { useQuery } from 'react-query';
import { ApplicationApi } from '@/api/application.api';
import ApplicationItem from './ApplicationItem';
import { RecentApplicationData } from '@/types/application';

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-4 p-6 bg-slate-50 rounded-lg">
        <div className="w-16 h-16 bg-slate-200 rounded-lg"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-3 bg-slate-200 rounded w-1/3"></div>
        </div>
        <div className="w-24 h-8 bg-slate-200 rounded-full"></div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="p-4 bg-orange-50 rounded-full mb-4">
      <Briefcase className="w-8 h-8 text-orange-600" />
    </div>
    <h3 className="text-lg font-semibold text-slate-800 mb-2">
      No applications yet
    </h3>
    <p className="text-slate-500 mb-6 max-w-sm">
      Start your job search journey by applying to positions that match your skills and interests.
    </p>
    <a 
      href="/jobs"
      className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
    >
      Browse Open Positions
    </a>
  </div>
);

const RecentApplicationsHistory: React.FC = () => {
  const { data: applications, isLoading, isError } = useQuery({
    queryKey: ['recent-applications'],
    queryFn: () => ApplicationApi.getMyApplicatons("All", "", 1, 3),
    refetchOnWindowFocus: false,
  });

  const hasApplications = applications?.applications?.length > 0;

  return (
    <section className="flex flex-col px-8 pb-8 w-full leading-relaxed max-md:px-5">
      <div className="flex flex-col max-w-full w-[1104px] mx-auto">
        <div className="flex flex-col bg-white border border-solid border-zinc-200 rounded-lg shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Recent Applications History
            </h2>
            {hasApplications && (
              <span className="text-sm text-slate-500">
                Showing {applications?.applications?.length} recent applications
              </span>
            )}
          </div>
          
          <hr className="border-zinc-200" />
          
          <div className="p-6">
            {isLoading ? (
              <LoadingSkeleton />
            ) : isError ? (
              <div className="text-center py-8 text-red-600">
                Unable to load applications. Please try again later.
              </div>
            ) : !hasApplications ? (
              <EmptyState />
            ) : (
              <div className="space-y-4">
                {applications && applications.applications.map((application: RecentApplicationData, index: number) => (
                  <ApplicationItem key={application._id || index} application={application} />
                ))}
              </div>
            )}
          </div>

          {hasApplications && (
            <div className="flex justify-center py-4 border-t border-zinc-200">
              <a 
                href="/myapplication" 
                className="inline-flex items-center gap-2 px-4 py-2 text-orange-600 hover:text-orange-700 font-semibold transition-colors"
              >
                View all applications history
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RecentApplicationsHistory;