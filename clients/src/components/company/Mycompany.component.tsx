import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { CompanyApi } from "@/api/Company.api";

const Mycompany: React.FC = () => {
  const { user } = useSelector((state) => state.auth);

 const { data } = useQuery([
   'mycompany', user._id
 ],
 () => CompanyApi.getCompany(user._id),
 {}
)

useEffect(() => {
   console.log(user, data)
}, [data]);

  const navigate = useNavigate();
  return (
    <div className="p-6 bg-gray-100 min-h-screen basis-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex w-full justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your company</h1>
          <Button
            onClick={(e) => navigate("setup")}
            variant="ghost"
            className="text-white hover:text-orange-500 hover:bg-white border bg-orange-500"
          >
            <FaPlus className="w-5 h-5 mr-2" />
            Create a Company page
          </Button>
        </div>
        <div className="flex w-full">
          {
             data && data.map((el) => (
              <Card className="max-w-sm rounded">
            <CardHeader className="space-y-1 p-0">
            
              <div className="p-0 w-64">
                <div className="h-32 w-full bg-gray-200 rounded-t-lg">
                  <img
                    src="/company.png"
                    alt={`${name} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="pt-4">
                <h3 className="text-xl font-semibold">{el.name}</h3>
                <p className="text-sm text-gray-600">0 followers</p>
              </div>
            </CardContent>
            <CardFooter>
              <Link to={`management/${el._id}`}>Manage</Link>
            </CardFooter>
          </Card>
             ))
          }
        </div>
      </div>
    </div>
  );
};

export default Mycompany;
