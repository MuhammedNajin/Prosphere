import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, Search } from 'lucide-react';

const EmptyApplications = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="mt-2 text-gray-600">Track and manage your job applications</p>
        </div>

        <Card className="bg-white">
          <CardContent className="flex flex-col items-center justify-center py-16">
  
            <div className="mb-6 p-4 bg-gray-50 rounded-full">
              <ClipboardList className="w-12 h-12 text-gray-200" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              No applications yet
            </h2>
            <p className="text-gray-600 text-center max-w-md mb-8">
              Start your job search journey by browsing open positions and submitting your first application.
            </p>
            <div className="flex gap-4">
              <Button
              onClick={() => {
                 window.location.href = '/jobs'
              }}
               className="flex items-center gap-2 bg-orange-700">
                <Search className="w-4 h-4" />
                Browse Jobs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmptyApplications;