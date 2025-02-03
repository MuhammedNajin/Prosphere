import React, { useState } from 'react';
import { PlusIcon, PencilIcon, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';
import { Education } from '@/types/profile';

interface EducationSectionProps {
    educations?: Education[];
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    setContent: React.Dispatch<React.SetStateAction<string>>;
    setIndex: React.Dispatch<React.SetStateAction<number>>;
}

const EducationSection: React.FC<EducationSectionProps> = ({
    educations = [],
    setModal,
    setContent,
    setIndex
}) => {
    const [showAll, setShowAll] = useState(false);
    const INITIAL_DISPLAY_COUNT = 1;
    
    const displayedEducations = showAll 
        ? educations 
        : educations.slice(0, INITIAL_DISPLAY_COUNT);
    
    const remainingCount = educations.length - INITIAL_DISPLAY_COUNT;

    const EducationCard = ({ edu, index }: { edu: Education; index: number }) => (
        <div key={`${index}-${Date.now()}`} className="mb-6 last:mb-0">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex-shrink-0 bg-orange-50 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-orange-600" />
                </div>

                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {edu.school}
                            </h3>
                            <p className="text-gray-600">
                                {edu.degree}
                                {edu.fieldOfStudy && (
                                    <>
                                        <span className="mx-2">•</span>
                                        {edu.fieldOfStudy}
                                    </>
                                )}
                            </p>
                            <p className="text-gray-700">
                                {edu.currentlyStudying
                                    ? `${format(new Date(edu.startDate), "PPP")} - Present`
                                    : `${format(new Date(edu.startDate), "PPP")} - ${format(new Date(edu.endDate ?? Date.now()), "PPP")}`
                                }
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setContent('Edit Education');
                                setModal(true);
                                setIndex(index);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Edit education"
                        >
                            <PencilIcon className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>

                    {edu.description && (
                        <p className="mt-4 text-gray-700">
                            {edu.description}
                        </p>
                    )}
                </div>
            </div>

            {index !== educations.length - 1 && (
                <hr className="my-6 border-gray-200" />
            )}
        </div>
    );

    return (
        <div className="bg-white p-6 rounded border">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Education</h2>
                <button
                    onClick={() => {
                        setContent('Add Education');
                        setModal(true);
                    }}
                    className="p-2 bg-orange-50 rounded-md hover:bg-orange-100 transition-colors"
                    aria-label="Add new education"
                >
                    <PlusIcon className="w-5 h-5 text-orange-600" />
                </button>
            </div>

            {displayedEducations.map((edu, index) => (
                <EducationCard key={index} edu={edu} index={index} />
            ))}

            {remainingCount > 0 && !showAll && (
                <button 
                    onClick={() => setShowAll(true)}
                    className="w-full text-center text-orange-600 mt-4 py-2 hover:bg-orange-50 rounded-md transition-colors"
                >
                    Show {remainingCount} more education{remainingCount !== 1 ? 's' : ''}
                </button>
            )}

            {showAll && remainingCount > 0 && (
                <button 
                    onClick={() => setShowAll(false)}
                    className="w-full text-center text-orange-600 mt-4 py-2 hover:bg-orange-50 rounded-md transition-colors"
                >
                    Show less
                </button>
            )}
        </div>
    );
};

export default EducationSection;