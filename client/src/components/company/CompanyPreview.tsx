import React from "react";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Companydata } from "@/types/formData";

const CompanyPreview: React.FC<{ details: Companydata }> = ({ details }) => {
  return (
    <Card className="w-full max-w-sm mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <CardContent className="p-6">

        <div className="w-16 h-16 bg-gray-200 mb-4 rounded-full mx-auto"></div>

        <h2 className="text-2xl font-bold text-gray-900 mb-1 truncate">{details.name || 'Company Name'}</h2>

        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>{details.type || 'Organization Type'}</span>
          <span>{details.size || 'Organization Size'}</span>
        </div>

        <p className="text-sm text-gray-600 mb-2">
          {details.location?.[0]?.placename || 'Location not provided'}
        </p>

        {details.website && (
          <a href={details.website} className="text-blue-600 hover:underline text-sm mb-2 block">
            {details.website}
          </a>
        )}

        <Button className="w-full bg-orange-700 text-white mt-2">+ Follow</Button>
      </CardContent>
    </Card>
  );
};

export default CompanyPreview;
