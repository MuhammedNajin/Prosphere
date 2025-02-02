import React from 'react';
import { useQuery } from 'react-query';
import { AdminApi } from '@/api';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, ExternalLink, Shield } from 'lucide-react';

interface CompanyVerification {
  _id: string;
  name: string;
  website: string;
  type: string;
  createdAt: string;
}

const CompanyVerificationRequest: React.FC = () => {
  const navigate = useNavigate();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminCompanyVerification'],
    queryFn: () => AdminApi.verificationRequest()
  });

  if (isLoading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Failed to load verification requests</p>
          <p className="text-sm text-gray-500">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 p-8">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Company Verification Requests
            </CardTitle>
            <p className="text-sm text-gray-500">
              Review and verify company registration requests
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 font-semibold text-gray-600">Company Name</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Website</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Ownership Type</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Request Date</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data?.data && data.data.length > 0 ? (
                  data.data.map((company: CompanyVerification) => (
                    <tr 
                      key={company._id} 
                      className="bg-white hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">{company.name}</td>
                      <td className="px-6 py-4">
                        <a 
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          {company.website}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                          {company.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {format(new Date(company.createdAt), 'PPP')}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/admin/company/verification/details/${company._id}`)}
                          className="inline-flex items-center gap-2 rounded-md border-2 border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 transition-all hover:bg-blue-50 hover:shadow-[2px_2px_0px_0px_rgba(37,99,235,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                        >
                          <Shield className="h-4 w-4" />
                          Verify
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td 
                      colSpan={5} 
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No verification requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyVerificationRequest;