import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDispatch } from "react-redux";
import {
  CircleCheck,
  Settings2,
  Users,
  Calendar,
  Briefcase,
  Plus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getCompaniesThunk,
  setCurrentCompany,
  setCompanySubscription,
} from "@/redux/reducers/companySlice";
import { useMutation } from "react-query";
import { CompanyApi } from "@/api";
import ErrorMessage from "../common/Message/ErrorMessage";
import { AxiosError } from "axios";
import EmptyCompanyState from "./EmptyCompanyState";
import { AppDispatch } from "@/redux/store";
import { useCompanies, useCurrentUser } from "@/hooks/useSelectors";
import { CompanyStatus, ICompany } from "@/types/company";

const MyCompany: React.FC = () => {
  const user = useCurrentUser();
  const { state } = useLocation();
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const companies = useCompanies();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCompaniesThunk());
    if (state === false) {
      toast({
        description: (
          <div className="flex items-center gap-2">
            <CircleCheck className="text-green-800" size={20} />
            <h1>Company Created Successfully</h1>
          </div>
        ),
      });
    }
  }, [dispatch, state, toast, user?.id]);

  const tokenMutation = useMutation({
    mutationFn: CompanyApi.generateAccessToken,
    onSuccess: (data, variables) => {
      console.log("dataaaaaaa", data);
      const { id } = variables;
      // dispatch(setSelectedCompany(el));
      dispatch(setCompanySubscription(data.data?.data));
      navigate(`/company/${id}`);
    },
    onError: (err: AxiosError, variables) => {
      if ((err as any).status !== 403) {
        toast({
          variant: "destructive",
          duration: 3000,
          className: "bg-red-600 border-red-700 text-white",
          description: (
            <ErrorMessage message="Oops! Something went wrong. Please try again." />
          ),
        });
      } else {
        const { id } = variables;
        // dispatch(setSelectedCompany(el));
        navigate(`/company/verification/${id}`);
      }
    },
  });

  const handleTokenGeneration = (el: ICompany) => {
    dispatch(setCurrentCompany(el));
    tokenMutation.mutate({ id: el.id });
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getRandomColor = (str: string): string => {
    const colors = [
      "bg-blue-600",
      "bg-green-600",
      "bg-purple-600",
      "bg-pink-600",
      "bg-indigo-600",
    ];
    const index = str
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  return (
    <div className="p-6 h-full basis-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex w-full justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-orange-700">Your Companies</h1>
          <Button
            onClick={() => navigate("setup")}
            variant="default"
            className="bg-orange-700 hover:bg-orange-800 text-white transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create a Company
          </Button>
        </div>

        {!Array.isArray(companies) || companies.length === 0 ? (
          <EmptyCompanyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((el: ICompany, index: number) => (
              <Card
                key={Date.now() + index}
                className="group relative rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <CardHeader className="p-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`flex items-center justify-center w-16 h-16 rounded-full ${getRandomColor(
                        el.name
                      )} text-white text-xl font-bold transition-transform duration-300 group-hover:scale-110`}
                    >
                      {getInitials(el.name)}
                    </div>
                    <CardTitle className="text-xl font-semibold capitalize text-orange-700">
                      {el.name}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Briefcase className="w-5 h-5" />
                      <span className="text-sm">
                        Industry: {el.industry || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-gray-600">
                      <Users className="w-5 h-5" />
                      <span className="text-sm">
                        Employees: {el.size || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <span className="text-sm">
                        Status: {el.status ?? CompanyStatus.PENDING}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="px-6 pb-6 flex justify-end">
                  <Button
                    variant="secondary"
                    onClick={() => handleTokenGeneration(el)}
                    className="bg-orange-700 hover:bg-orange-800 text-white flex items-center transition-all duration-300 transform hover:scale-105"
                  >
                    <Settings2 size={20} className="mr-2" />
                    Manage
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCompany;
