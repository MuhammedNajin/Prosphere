import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { ApplicationApi } from '@/api/application.api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar } from 'lucide-react';
import { getStageColor } from '@/lib/utilities/getApplicationStatusColor';
import { Applicant } from '@/types/application';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};


const ApplicationCard = ({ application }: { application: Applicant}) => {
  const {
    jobData,
    status,
    appliedAt,
    applicantData
  } = application;

  return (
    <Card className="w-72 hover:shadow-md transition-shadow duration-200">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-3">
          <Badge variant="outline" className={getStageColor(status)}>
            {status}
          </Badge>
          <div className="flex items-center text-sm text-slate-500">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(appliedAt)}
          </div>
        </div>

        <h3 className="font-semibold text-slate-800 mb-2 truncate" title={jobData?.jobTitle}>
          {jobData?.jobTitle}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-slate-600">
            <User className="w-4 h-4 mr-1" />
            <span className="truncate" title={applicantData?.username}>
              {applicantData?.username}
            </span>
          </div>
          <span className="text-xs text-slate-500">
            {jobData?.employment}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const RecentApplicationsHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: applicationData } = useQuery({
    queryKey: ['application'],
    queryFn: () => ApplicationApi.getAllApplication({ 
      companyId: id as string,
      pageSize: 3,
      page: 1,
      filter: '',
      search: ''
    })
  });


  useEffect(() => {
    console.log(
      "all application", applicationData
    );
    
  }, [])
  const applications = applicationData?.applications || [];

  return (
    <section className="p-6 border rounded-lg mx-9">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Recent Applications
        </h2>
        <button 
          onClick={() => navigate(`/company/application/${id}`)}
          className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
        >
          View all
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {applications?.slice(0, 4).map((application: Applicant) => (
          <ApplicationCard 
            key={application?._id} 
            application={application}
          />
        ))}
      </div>
    </section>
  );
};

export default RecentApplicationsHistory;