import React from "react";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CompanyDetails } from './CompanyForm'


const CompanyPreview: React.FC<{ details: CompanyDetails }> = ({ details }) => (
    <Card className="w-full max-w-sm mx-auto">
      <CardContent className="p-4">
        <div className="w-16 h-16 bg-gray-200 mb-4"></div>
        <h2 className="text-xl font-bold mb-1">{details.name || 'Company name'}</h2>
        <p className="text-sm text-gray-600 mb-2">Tagline</p>
        <p className="text-sm text-gray-600 mb-4">{details.industry || 'Information Technology'}</p>
        <Button className="w-full">+ Follow</Button>
      </CardContent>
    </Card>
  );

  export default CompanyPreview;