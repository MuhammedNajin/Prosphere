import { Experience } from '@/types/profile';
import { Building2, Calendar, MapPin } from 'lucide-react';

const ExperienceCard = ({ experience }: { experience: Experience }) => {

  const formatDate = (dateString: Date ) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getEmploymentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'full-time': 'bg-green-50 text-green-700',
      'part-time': 'bg-blue-50 text-blue-700',
      'contract': 'bg-purple-50 text-purple-700',
      'internship': 'bg-orange-50 text-orange-700'
    };
    return colors[type] || 'bg-gray-50 text-gray-700';
  };

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-lg text-slate-800">
                {experience.position}
              </h4>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEmploymentTypeColor(experience.employmentType)}`}>
                {experience.employmentType}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-600" />
              <p className="text-slate-700">{experience.companyName}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-600" />
              <span className="text-slate-600 text-sm">
                {formatDate(experience.startDate)} - {experience.currentlyWorking ? 'Present' : formatDate(experience.endDate || new Date())}
              </span>
            </div>
            
            {experience.locationType && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-600" />
                <span className="text-slate-600 text-sm capitalize">
                  {experience.locationType}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* {experience.description && (
          <p className="text-slate-600 text-sm leading-relaxed">
            {experience.description}
          </p>
        )} */}
      </div>
    </div>
  );
};

export default ExperienceCard;