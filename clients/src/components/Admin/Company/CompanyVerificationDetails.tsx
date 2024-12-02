import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  FileText,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  MapPin,
  Globe,
  UsersRound,
  Wrench,
  ShieldAlert,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { useMutation, useQuery } from "react-query";
import { AdminApi } from "@/api";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import DocumentReviewModal from "./DocumentModal";
import { CompanyStatus } from "@/types/company";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VerificationStatusConfirmation } from "./VerificationStatusConfirmation";
import { useToast } from "@/hooks/use-toast";
import SuccessMessage from '@/components/common/Message/SuccessMessage'
const CompanyVerificationDetails = () => {
  const [progress] = useState(65);
  const { id } = useParams();
  const { toast } = useToast()
  const { data } = useQuery({
    queryKey: ["company details"],
    queryFn: () => AdminApi.getCompany(id as string),
  });

  useEffect(() => {
    console.log("admin company details", data);
  }, [data]);
  

  function handleStatusChange() {}

  const getStatusColor = (status) => {
    const statusColors = {
      uploaded: "bg-yellow-100 text-yellow-800",
      verified: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      pending: "bg-blue-100 text-blue-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const CompanyVerificationStatusMutation = useMutation({
    mutationFn: AdminApi.changeCompanyVerificationStatus,
    onSuccess: (data, variables) => {
        const { status } = variables
      console.log("success", data, variables);
      const message = status === CompanyStatus.Verified ? "Company documents verified Successfully"
      : "Company documents rejected successfully"
       toast({
         title: <SuccessMessage message={message}  className=""/>
       })
    },
    onError: (err) => {
      console.log("error", err);
    },
  });

  const onSubmit = (id: string, status) => {
    CompanyVerificationStatusMutation.mutate({ status, id });
  };
  return (
    <div>
      {data ? (
        <div className="w-full max-w-7xl mx-auto p-6 space-y-6 bg-gray-50">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-semibold text-gray-900 capitalize">
                    {data.name}
                  </h1>
                  <Badge className={`${getStatusColor(data.status)} text-sm`}>
                    {data.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Submitted:{" "}
                    {format(data?.ownerVerificationDoc?.uploadedAt, "PPP")}
                  </span>
                  <span className="mx-2">•</span>
                  <span>ID: VR-2024-001</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Select
                  onValueChange={handleStatusChange}
                  disabled={data.status === CompanyStatus.Verified}
                >
                  <SelectTrigger className="w-[200px] bg-white border-gray-200 hover:bg-gray-50 transition-colors">
                    <SelectValue
                      placeholder={
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="h-4 w-4 text-gray-500" />
                          <span>Select Status</span>
                        </div>
                      }
                    >
                      {data.status == CompanyStatus.Verified && (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span className={getStatusColor(data.status)}>
                            {CompanyStatus.Verified}
                          </span>
                        </div>
                      )}

                      {data.status == CompanyStatus.Rejected && (
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className={getStatusColor(data.status)}>
                            {CompanyStatus.Rejected}
                          </span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <div className="flex flex-col ">
                      <div className="flex items-center gap-2 hover:bg-slate-100 p-3">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <VerificationStatusConfirmation
                         isLoading={CompanyVerificationStatusMutation.isLoading}
                          onSubmit={onSubmit}
                          status={CompanyStatus.Verified}
                        />
                      </div>

                      {
                        data.status !== CompanyStatus.Rejected && (
                            <div className="flex items-center gap-2 hover:bg-slate-100 p-3">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <VerificationStatusConfirmation
                        isLoading={CompanyVerificationStatusMutation.isLoading }
                          onSubmit={onSubmit}
                          status={CompanyStatus.Rejected}
                        />
                      </div>
                        )
                      }
                    </div>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between mb-2 text-sm text-gray-600">
                <span>Verification Progress</span>
                <span className="font-medium text-gray-900">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 rounded-lg" />
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="company" className="w-full">
            <TabsList className="w-full justify-start mb-6 bg-white p-1 rounded-lg">
              <TabsTrigger
                value="company"
                className="flex items-center gap-2 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 hover:bg-gray-100"
              >
                <Building2 className="w-4 h-4" />
                Company Details
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="flex items-center gap-2 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 hover:bg-gray-100"
              >
                <FileText className="w-4 h-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger
                value="owner"
                className="flex items-center gap-2 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 hover:bg-gray-100"
              >
                <User className="w-4 h-4" />
                Owner Details
              </TabsTrigger>
            </TabsList>

            {/* Company Details Tab */}
            <TabsContent value="company">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info Card */}
                <Card className="lg:col-span-2 bg-white shadow-lg rounded-lg overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      Company Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                    <div className="space-y-6">
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-gray-400 mt-1" />
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Company Name
                          </label>
                          <p className="text-lg font-medium">{data.name}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Building2 className="w-5 h-5 text-gray-400 mt-1" />
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Industry
                          </label>
                          <p className="text-lg">Information Technology</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <UsersRound className="w-5 h-5 text-gray-400 mt-1" />
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Size
                          </label>
                          <p className="text-lg">{data.size}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-start gap-3">
                        <Wrench className="w-5 h-5 text-gray-400 mt-1" />
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Org type
                          </label>
                          <p className="text-lg">{data.type}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Location
                          </label>
                          {data.location.map((el) => (
                            <p className="text-lg">{el.placename}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                      Verification Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span>Business License</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Verified
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <span>Tax Documents</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Pending
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="mt-4">
              <div className="flex-1 space-y-4">
                {data?.companyVerificationDoc ? (
                  <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center sm:items-start gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg transition-colors group-hover:bg-blue-100">
                          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
                            {data?.companyVerificationDoc?.documentType}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 mb-3">
                            PDF • 2.4 MB
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <DocumentReviewModal document={data?.companyVerificationDoc} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-gray-50">
                    <CardContent className="p-6 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12 text-gray-400" />
                        <h3 className="font-medium text-gray-600">
                          No Document Uploaded
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="owner">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Owner Info Card */}
                <Card className="lg:col-span-2 bg-white shadow-lg rounded-lg overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <User className="w-5 h-5 text-blue-600" />
                      Owner Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                    <div className="space-y-6">
                      <div>
                        <div className="w-20 h-20 bg-gray-100 rounded-full mb-4 flex items-center justify-center">
                          <User className="w-10 h-10 text-gray-400" />
                        </div>
                        <label className="text-sm font-medium text-gray-500">
                          Full Name
                        </label>
                        <p className="text-lg font-medium">
                          {data.owner.username}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Position
                        </label>
                        <p className="text-lg">Chief Executive Officer</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Email
                        </label>
                        <p className="text-lg">{data.owner.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Phone
                        </label>
                        <p className="text-lg">{data.owner.phone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Identity Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {data.ownerVerificationDoc ? (
                      <div className="p-4 flex flex-col gap-y-16 border rounded-lg hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-50 rounded-md">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {data?.ownerVerificationDoc?.documentType}
                            </h3>
                            <p className="text-sm text-gray-500">
                              PDF • 1.2 MB
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <DocumentReviewModal
                            document={data?.ownerVerificationDoc}
                          />
                        </div>
                      </div>
                    ) : (
                      <Card className="bg-gray-50">
                        <CardContent className="p-6 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="w-12 h-12 text-gray-400" />
                            <h3 className="font-medium text-gray-600">
                              No Document Uploaded
                            </h3>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CompanyVerificationDetails;
