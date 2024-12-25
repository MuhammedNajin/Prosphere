import React from "react";
import { Button } from "@/components/ui/button";
import { Building2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const EmptyCompanyState = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 h-full basis-full">
      <div className=" mx-auto">
        

        <Card className="mt-8 py-16">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="bg-orange-100 p-4 rounded-full mb-6">
              <Building2 className="w-12 h-12 text-orange-700" />
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              No Companies Yet
            </h2>
            
            <p className="text-gray-600 mb-8 max-w-md">
              Get started by creating your first company. You'll be able to manage 
              your business details, employees, and more all in one place.
            </p>
            
            <Button
              onClick={() => navigate("setup")}
              variant="default"
              className="bg-orange-700 hover:bg-orange-800 text-white px-6 py-3 h-auto text-lg transition-all duration-300 transform hover:scale-105"
            >
              <Plus className=" mr-2" />
              Create Your First Company
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmptyCompanyState;