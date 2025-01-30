import { format } from "date-fns";
import { Calendar, Briefcase, User } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Applicant } from "@/types/application";

interface ApplicationCardsProps {
  applications: Applicant[] | undefined;
  onViewApplication: (id: string) => void;
  urls: Record<string, string>;
}

const ApplicationCards = ({ applications, onViewApplication, urls }: ApplicationCardsProps) => {
  const getStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      'applied': 'bg-blue-100 text-blue-800 border-blue-800',
      'inreview': 'bg-yellow-100 text-yellow-800 border-yellow-800',
      'shortlisted': 'bg-purple-100 text-purple-800 border-purple-800',
      'interview': 'bg-orange-100 text-orange-800 border-orange-800',
      'rejected': 'bg-red-100 text-red-800 border-red-800',
      'selected': 'bg-green-100 text-green-800 border-green-800'
    };
    return colors[stage.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-800';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {applications && applications.map((applicant) => (
        <Card key={applicant._id} className="flex flex-col hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={urls[applicant.applicantData.avatar] ?? "/profileIcon.png"}
                    alt={applicant.applicantData.username}
                    className="w-12 h-12 rounded-full border-2 border-orange-200 object-cover"
                  />
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-lg leading-tight">
                      {applicant.applicantData.username}
                    </h3>
                    <button
                   
              onClick={() => onViewApplication(applicant._id)}
              className=" text-orange-800 text-sm text-start hover:text-orange-600"
            >
              View Profile
            </button>
                  </div>
                </div>
              </div>
              <Badge 
              variant="outline" 
              className={`px-4 py-1.5 ${getStageColor(applicant.status)}`}
            >
              {applicant.status}
            </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-6">
            

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-5">
                  <Briefcase className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium">{applicant?.jobData?.jobTitle}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-5">
                  <Calendar className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm">Applied on {format(applicant.appliedAt, "PPP")}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-5">
                  <User className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm">Experience: {applicant?.jobData?.experience} years</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ApplicationCards;