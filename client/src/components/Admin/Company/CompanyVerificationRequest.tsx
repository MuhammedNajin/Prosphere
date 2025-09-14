import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { AdminApi } from "@/api";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, Shield } from "lucide-react";
import { CompanyStatus } from "@/types/company";

interface CompanyVerification {
  id: string;
  name: string;
  website: string;
  type: string;
  createdAt: string;
}

const CompanyVerificationRequest: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>(CompanyStatus.UNDER_REVIEW);
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["adminCompanyVerification", status, page],
    queryFn: () => AdminApi.verificationRequest(status, page),
    keepPreviousData: true,
  });

  useEffect(() => {
    console.log(">>>>>>>>>>>", data?.companies || 'No Data');
  }, [data])

  const companies: CompanyVerification[] = data?.companies || [];
  const pagination = data?.pagination;
  const filters = data?.filters;

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
          <p className="text-lg font-semibold text-gray-700">
            Failed to load verification requests
          </p>
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

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1); // reset to first page when status changes
              refetch();
            }}
            className="rounded-md border px-3 py-2 text-sm"
          >
            {filters?.availableStatuses?.map((s: string) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </CardHeader>

        <CardContent>
          <div className="relative overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 font-semibold text-gray-600">
                    Company Name
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-600">
                    Website
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-600">
                    Ownership Type
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-600">
                    Request Date
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {companies.length > 0 ? (
                  companies.map((company: CompanyVerification) => (
                    <tr
                      key={company.id}
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
                        {company.createdAt
                          ? format(new Date(company.createdAt), "PPP")
                          : "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            navigate(
                              `/admin/company/verification/details/${company.id}`
                            )
                          }
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

          {/* Pagination */}
          {pagination && (
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="outline"
                disabled={!pagination.hasPreviousPage}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              <p className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages ?? 1}
              </p>
              <Button
                variant="outline"
                disabled={!pagination.hasNextPage}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyVerificationRequest;
