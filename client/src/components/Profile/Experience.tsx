import React, { useState } from 'react';
import { PlusIcon, PencilIcon, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { calculateDuration } from '@/lib/utilities/calculateDuration';
import { Experience } from '@/types/profile';

interface ExperiencesSectionProps {
    experiences?: Experience[];
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    setContent: React.Dispatch<React.SetStateAction<string>>;
    setIndex: React.Dispatch<React.SetStateAction<number>>;
}

const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({ 
    experiences = [], 
    setModal, 
    setContent, 
    setIndex 
}) => {
    const [showAll, setShowAll] = useState(false);
    const INITIAL_DISPLAY_COUNT = 1;
    
    const displayedExperiences = showAll 
        ? experiences 
        : experiences.slice(0, INITIAL_DISPLAY_COUNT);
    
    const remainingCount = experiences.length - INITIAL_DISPLAY_COUNT;

    const ExperienceCard = ({ exp, index }: { exp: Experience; index: number }) => (
        <div key={`${index}-${Date.now()}`} className="mb-6 last:mb-0">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex-shrink-0 bg-orange-50 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-orange-600" />
                </div>

                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold capitalize text-gray-800">
                                {exp.position}
                            </h3>
                            <p className="text-gray-600">
                                <span className="font-medium capitalize">{exp.companyName}</span>
                                <span className="mx-2">•</span>
                                <span>{exp.employmentType}</span>
                                <span className="mx-2">•</span>
                                <span>{calculateDuration(
                                    new Date(exp.startDate), 
                                    exp.currentlyWorking ? new Date() : new Date(exp.endDate ?? new Date().toISOString())
                                )}</span>
                            </p>
                            <p className="text-gray-500">
                                {exp.locationType}
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setContent('Edit Position');
                                setModal(true);
                                setIndex(index);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Edit position"
                        >
                            <PencilIcon className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>

                    <p className="mt-4 text-gray-700">
                        {exp.currentlyWorking 
                            ? `${format(new Date(exp.startDate), "PPP")} - Present`
                            : `${format(new Date(exp.startDate), "PPP")} - ${format(new Date(exp.endDate ?? new Date().toISOString()), "PPP")}`
                        }
                    </p>
                </div>
            </div>

            {index !== experiences.length - 1 && (
                <hr className="my-6 border-gray-200" />
            )}
        </div>
    );

    return (
        <div className="bg-white p-6 rounded border">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Experiences</h2>
                <button
                    onClick={() => {
                        setContent('Add Position');
                        setModal(true);
                    }}
                    className="p-2 bg-orange-50 rounded-md hover:bg-orange-100 transition-colors"
                    aria-label="Add new position"
                >
                    <PlusIcon className="w-5 h-5 text-orange-600" />
                </button>
            </div>

            {displayedExperiences.map((exp, index) => (
                <ExperienceCard key={index} exp={exp} index={index} />
            ))}

            {remainingCount > 0 && !showAll && (
                <button 
                    onClick={() => setShowAll(true)}
                    className="w-full text-center text-orange-600 mt-4 py-2 hover:bg-orange-50 rounded-md transition-colors"
                >
                    Show {remainingCount} more experience{remainingCount !== 1 ? 's' : ''}
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

export default ExperiencesSection;