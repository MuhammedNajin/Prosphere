import React, { useState } from 'react';
import { Plus, Pencil, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';
import { IEducation } from '@/types/user';
import { ModalContent } from '@/types/profile';

interface EducationSectionProps {
  educations?: IEducation[];
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setContent: React.Dispatch<React.SetStateAction<ModalContent | string>>;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}

const EducationSection: React.FC<EducationSectionProps> = ({
  educations = [],
  setModal,
  setContent,
  setIndex,
}) => {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_DISPLAY_COUNT = 1;

  const displayedEducations = showAll
    ? educations
    : educations.slice(0, INITIAL_DISPLAY_COUNT);

  const remainingCount = educations.length - INITIAL_DISPLAY_COUNT;

  const handleEditEducation = (index: number) => {
    setContent(ModalContent.EditEducation);
    setModal(true);
    setIndex(index);
  };

  const handleAddEducation = () => {
    setContent(ModalContent.AddEducation);
    setModal(true);
  };

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const formatDateRange = (startDate: Date | string, endDate?: Date | null | undefined , isCurrentStudent?: boolean): string => {
    const start = formatDate(startDate);
    
    if (isCurrentStudent) {
      return `${start} - Present`;
    }
    
    const end = formatDate(endDate ?? new Date);
    return `${start} - ${end}`;
  };

  const EducationCard: React.FC<{ education: IEducation; index: number }> = ({ education, index }) => (
    <div key={Date.now() + index} className="mb-6 last:mb-0">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full flex-shrink-0 bg-orange-50 flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-orange-600" />
        </div>

        {/* Content */}
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1 min-w-0 flex-grow">
              {/* School Name */}
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {education.school}
              </h3>
              
              {/* Degree and Field of Study */}
              <div className="text-gray-600">
                <span className="font-medium">{education.degree}</span>
                {education.fieldOfStudy && (
                  <>
                    <span className="mx-2 text-gray-400">•</span>
                    <span>{education.fieldOfStudy}</span>
                  </>
                )}
              </div>
              
              {/* Date Range */}
              <p className="text-gray-700 text-sm">
                {formatDateRange(education.startDate, education.endDate, education.isCurrentStudent)}
              </p>
              
              {/* GPA */}
              {education.gpa && (
                <p className="text-gray-600 text-sm">
                  GPA: {typeof education.gpa === 'string' ? education.gpa : education.gpa}
                </p>
              )}
            </div>
            
            {/* Edit Button */}
            <button
              onClick={() => handleEditEducation(index)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              aria-label={`Edit education at ${education.school}`}
            >
              <Pencil className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          {/* Description */}
          {education.description && (
            <div className="mt-3">
              <p className="text-gray-700 text-sm leading-relaxed">
                {education.description}
              </p>
            </div>
          )}
          
          {/* Activities */}
          {education.activities && education.activities.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-semibold text-gray-800 mb-1">Activities:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-0.5">
                {education.activities.map((activity, idx) => (
                  <li key={`activity-${idx}`} className="leading-relaxed">
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Honors */}
          {education.honors && education.honors.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-semibold text-gray-800 mb-1">Honors & Awards:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-0.5">
                {education.honors.map((honor, idx) => (
                  <li key={`honor-${idx}`} className="leading-relaxed">
                    {honor}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Separator - only show if not the last item in the displayed list */}
      {index < displayedEducations.length - 1 && (
        <hr className="my-6 border-gray-200" />
      )}
    </div>
  );

  const EmptyState: React.FC = () => (
    <div className="text-center py-8">
      <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500 mb-4">No education details added yet</p>
      <button
        onClick={handleAddEducation}
        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Education
      </button>
    </div>
  );

  if (educations.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Education</h2>
          <button
            onClick={handleAddEducation}
            className="p-2 bg-orange-50 rounded-md hover:bg-orange-100 transition-colors"
            aria-label="Add new education"
          >
            <Plus className="w-5 h-5 text-orange-600" />
          </button>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Education</h2>
        <button
          onClick={handleAddEducation}
          className="p-2 bg-orange-50 rounded-md hover:bg-orange-100 transition-colors"
          aria-label="Add new education"
        >
          <Plus className="w-5 h-5 text-orange-600" />
        </button>
      </div>

      {/* Education List */}
      <div className="space-y-0">
        {displayedEducations.map((education, index) => (
          <EducationCard  education={education} index={index} />
        ))}
      </div>

      {/* Show More/Less Buttons */}
      {educations.length > INITIAL_DISPLAY_COUNT && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          {!showAll ? (
            <button
              onClick={() => setShowAll(true)}
              className="w-full text-center text-orange-600 py-3 hover:bg-orange-50 rounded-md transition-colors font-medium"
            >
              Show {remainingCount} more education{remainingCount !== 1 ? 's' : ''}
            </button>
          ) : (
            <button
              onClick={() => setShowAll(false)}
              className="w-full text-center text-orange-600 py-3 hover:bg-orange-50 rounded-md transition-colors font-medium"
            >
              Show less
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EducationSection;