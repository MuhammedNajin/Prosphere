import { JobApi } from '@/api';
import { Job } from '@/types/application';
import { ArrowRight, MapPin, Clock, Building2 } from 'lucide-react';
import { useQuery } from 'react-query';

interface Salary {
  min: number;
  max: number;
  currency: string;
}

interface JobsResponse {
  jobs: Job[];
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  total: number;
}

const CompanyLogo = ({ logo, companyName }: { logo: string | null; companyName: string }) => {
  if (logo) {
    return (
      <img
        src="/api/placeholder/48/48"
        alt={`${companyName} logo`}
        className="w-12 h-12 rounded-xl shadow-sm group-hover:shadow-md transition-shadow"
      />
    );
  }

  // Get first letter and create background color based on company name
  const firstLetter = companyName.charAt(0).toUpperCase();
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-teal-500'
  ];
  
  // Use company name length to determine color (creates consistent color for same company)
  const colorIndex = companyName.length % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div className={`w-12 h-12 rounded-xl shadow-sm group-hover:shadow-md transition-shadow flex items-center justify-center ${bgColor}`}>
      <span className="text-white text-xl font-bold">{firstLetter}</span>
    </div>
  );
};

const LatestJobs = () => {
  const { data: jobsData } = useQuery<JobsResponse>({
    queryKey: ["job-listing"],
    queryFn: () => JobApi.getJobs({
      page: 1,
      pageSize: 4,
    })
  });

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1d ago';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return `${Math.floor(diffInDays / 7)}w ago`;
  };

  const formatSalary = (salary: Salary) => {
    try {
      const currencyCode = salary.currency || 'USD';
      const formatNumber = (num: number) => 
        new Intl.NumberFormat('en-US', {
          style: 'decimal',
          maximumFractionDigits: 0,
        }).format(num);

      return `${currencyCode} ${formatNumber(salary.min)} - ${formatNumber(salary.max)}`;
    } catch (error) {
      return `${salary.min} - ${salary.max}`;
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Latest <span className="text-orange-500">Opportunities</span>
            </h2>
            <p className="mt-2 text-gray-600">Discover your next career move</p>
          </div>
          <button
           onClick={() => window.location.href = "/jobs"}
           className="flex items-center text-orange-600 hover:text-orange-700 font-medium">
            View all positions
            <ArrowRight className="ml-2" size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobsData?.jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <CompanyLogo 
                    logo={job.companyId.logo} 
                    companyName={job.companyId.name} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {job.jobTitle}
                      </h3>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                        {job.companyId && (
                          <div className="flex items-center gap-1">
                            <Building2 size={16} />
                            <span>{job.companyId.name}</span>
                          </div>
                        )}
                        {job.jobLocation && (
                          <div className="flex items-center gap-1">
                            <MapPin size={16} />
                            <span>{job.jobLocation}</span>
                          </div>
                        )}
                        {job.createdAt && (
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{formatTimeAgo(job.createdAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {job.employment}
                    </span>
                    {job.salary && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {formatSalary({ 
                          currency: 'INR',
                          max: job?.salary?.from,
                          min: job?.salary?.to,
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestJobs;