import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { CircleCheck, Settings2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getCompaniesThunk,
  setSelectedCompany,
} from "@/redux/reducers/companySlice";
import { useMutation } from "react-query";
import { CompanyApi } from "@/api";
import ErrorMessage from "../common/Message/ErrorMessage";
import { AxiosError } from "axios";

const Mycompany: React.FC = () => {
  const { user } = useSelector((state) => state.auth);
  const { state } = useLocation();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state.company);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCompaniesThunk(user._id));
    console.log("state", state);
    if (state == false) {
      toast({
        title: (
          <div className="flex items-center gap-2">
            <CircleCheck className="text-green-800" size={20} />
            <h1>Company Created Successufully</h1>
          </div>
        ),
      });
    }
  }, []);

  const tokenMutation = useMutation({
    mutationFn: CompanyApi.generateToken,
    onSuccess: (data, variables) => {
      const { id, el } = variables;
      console.log("data", data, variables);
      dispatch(setSelectedCompany(el));
      navigate(`/company/jobs/${id}`);
    },
    onError: (err: AxiosError, variables) => {
      console.log("error", err);
      if (err.status !== 403) {
        toast({
          variant: "destructive",
          duration: 3000,
          className: "bg-red-600 border-red-700 text-white",
          description: (
            <ErrorMessage message="Oops!, Something went wrong. Please try again." />
          ),
        });
      } else {
        const { id, el } = variables;
        console.log("data", variables);
        dispatch(setSelectedCompany(el));
        navigate(`/company/verification/${id}`);
      }
    },
  });

  return (
    <div className="p-6 h-full basis-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex w-full justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-orange-700">Your Companies</h1>
          <Button
            onClick={(e) => navigate("setup")}
            variant="default"
            className="bg-orange-700 hover:bg-blue-700 text-white"
          >
            <FaPlus className="w-5 h-5 mr-2" />
            Create a Company
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(companies) &&
            companies.map((el, index) => (
              <Card
                key={Date.now() + index}
                className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="relative h-32 w-full rounded-t-lg overflow-hidden bg-gray-200">
                  <img
                    src="/company.png"
                    alt={`${el.name} logo`}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-5 space-y-3">
                  <CardTitle className="text-xl font-semibold capitalize text-orange-700">
                    {el.name}
                  </CardTitle>
                  <CardDescription className=" text-base text-accent-purple font-medium">
                    <p className="text-sm ">
                      Industry: {el.industry || "N/A"}
                    </p>
                    <p className="text-sm ">
                      Employees: {el.employees || "Unknown"}
                    </p>
                    <p className="text-sm">
                      Founded: {el.foundedYear || "N/A"}
                    </p>
                  </CardDescription>
                </CardContent>
                <CardFooter className="px-5 pb-5 flex justify-end">
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      tokenMutation.mutate({ id: el._id, el });
                    }}
                    className="bg-orange-700 hover:bg-orange-900 text-white flex items-center"
                  >
                    <Settings2 size={20} className="mr-2" />
                    Manage
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Mycompany;
