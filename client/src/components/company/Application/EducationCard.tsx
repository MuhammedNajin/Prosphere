import { Calendar, GraduationCap, School } from 'lucide-react';
import { format } from 'date-fns';
import { Education } from '@/types/profile';

const EducationCard = ({ education }: { education: Education }) => {
  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-orange-600" />
            <h4 className="font-semibold text-lg text-slate-800">
              {education.degree}
            </h4>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <School className="h-4 w-4 text-slate-600" />
              <p className="text-slate-700">{education.school}</p>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-600" />
              <span className="text-slate-600 text-sm">
                {education.startDate && format(education.startDate, 'PPP')} - 
                {education.endDate ? format(education.endDate, 'PPP') : 'Present'}
              </span>
            </div>
          </div>
        </div>

        {education.grade && (
          <div className="bg-orange-50 px-3 py-1 rounded-full">
            <p className="text-orange-700 text-sm font-medium">
              {education.grade}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationCard;