import { useQuery } from 'react-query';
import { useOutletContext } from 'react-router-dom';
import { CompanyApi } from '@/api/Company.api';
import { Loader2, FileWarning, Download, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ApplicantProp } from '@/types/company';

const ApplicantResume = () => {
  const { applicant } = useOutletContext<ApplicantProp>();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['resume'],
    queryFn: () => CompanyApi.getUploadedFIle(applicant.resume),
    enabled: !!applicant.resume,
  });

  if (!applicant.resume) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <Alert className="max-w-md">
          <FileWarning className="h-5 w-5" />
          <AlertTitle>No Resume Found</AlertTitle>
          <AlertDescription>
            The applicant hasn't uploaded a resume yet.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <FileWarning className="h-5 w-5" />
          <AlertTitle>Error Loading Resume</AlertTitle>
          <AlertDescription>
            There was a problem loading the resume. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const pdfUrl = data?.data?.url;
  
  const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-6 py-4 border-b bg-white">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {applicant.username}'s Resume
          </h2>
          <p className="text-sm text-gray-500">
            Last updated: {new Date(applicant.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <ExternalLink className="h-4 w-4" />
            Open
          </a>
          <a
            href={pdfUrl}
            download
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <Download className="h-4 w-4" />
            Download
          </a>
        </div>
      </div>

      <div className="flex-1 bg-gray-100 p-6">
        <div className="h-full bg-white rounded-lg shadow-sm overflow-hidden">
          <iframe
            src={googleDocsUrl}
            className="w-full h-full border-0"
            frameBorder="0"
            allowFullScreen
            loading="lazy"
            title={`${applicant.username}'s Resume`}
            onError={(e) => {
              (e.target as HTMLIFrameElement).src = pdfUrl;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicantResume;