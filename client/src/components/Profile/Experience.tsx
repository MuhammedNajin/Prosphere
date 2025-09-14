import React, { useState, useMemo } from 'react';
import { PlusIcon, PencilIcon, Building2, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { calculateDuration } from '@/lib/utilities/calculateDuration';
import { IExperience } from '@/types/user';


interface ExperiencesSectionProps {
    experiences?: IExperience[];
    onAddPosition: () => void;
    onEditPosition: (index: number) => void;
    initialDisplayCount?: number;
}

const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({ 
    experiences = [], 
    onAddPosition,
    onEditPosition,
    initialDisplayCount = 1
}) => {
    const [showAll, setShowAll] = useState(false);
    
    const { displayedExperiences, remainingCount } = useMemo(() => {
        const displayed = showAll ? experiences : experiences.slice(0, initialDisplayCount);
        const remaining = Math.max(0, experiences.length - initialDisplayCount);
        return { displayedExperiences: displayed, remainingCount: remaining };
    }, [experiences, showAll, initialDisplayCount]);

    const formatDateRange = (startDate: Date, endDate?: Date | null, isCurrentRole?: boolean) => {
        const start = format(new Date(startDate), "MMM yyyy");
        
        if (isCurrentRole) {
            return `${start} - Present`;
        }
        
        if (endDate) {
            const end = format(new Date(endDate), "MMM yyyy");
            return `${start} - ${end}`;
        }
        
        return start;
    };

    const formatLocation = (location: any) => {
        if (typeof location === 'string') {
            return location;
        }
        
        if (location?.placename) {
            return location.placename;
        }
        
        return null;
    };

    const ExperienceCard = ({ experience, index }: { experience: IExperience; index: number }) => {
        const duration = useMemo(() => 
            calculateDuration(
                new Date(experience.startDate), 
                experience.isCurrentRole ? new Date() : new Date(experience.endDate || new Date())
            ), [experience.startDate, experience.endDate, experience.isCurrentRole]
        );

        const location = formatLocation(experience.location);

        return (
            <div className="group">
                <div className="flex items-start gap-4">
                    {/* Company Logo Placeholder */}
                    <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center border border-orange-200">
                        <Building2 className="w-6 h-6 text-orange-600" />
                    </div>

                    <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-grow min-w-0">
                                {/* Job Title */}
                                <h3 className="text-lg font-semibold text-gray-900 capitalize leading-tight">
                                    {experience.title}
                                </h3>
                                
                                {/* Company and Employment Type */}
                                <div className="flex items-center gap-2 mt-1 text-gray-600">
                                    <span className="font-medium capitalize truncate">
                                        {experience.company}
                                    </span>
                                    {experience.employmentType && (
                                        <>
                                            <span className="text-gray-400">•</span>
                                            <span className="capitalize whitespace-nowrap">
                                                {experience.employmentType.replace('_', ' ').toLowerCase()}
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* Date Range and Duration */}
                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                    <span>{formatDateRange(experience.startDate, experience.endDate, experience.isCurrentRole)}</span>
                                    <span className="text-gray-400">•</span>
                                    <span>{duration}</span>
                                </div>

                                {/* Location */}
                                {location && (
                                    <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                                        <MapPin className="w-3 h-3" />
                                        <span className="truncate">{location}</span>
                                    </div>
                                )}
                            </div>

                            {/* Edit Button */}
                            <button
                                onClick={() => onEditPosition(index)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                                aria-label={`Edit ${experience.title} position`}
                            >
                                <PencilIcon className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>

                        {/* Description */}
                        {experience.description && (
                            <p className="mt-3 text-gray-700 text-sm leading-relaxed">
                                {experience.description}
                            </p>
                        )}

                        {/* Skills */}
                        {experience.skills && experience.skills.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {experience.skills.map((skill, skillIndex) => (
                                        <span 
                                            key={skillIndex}
                                            className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Key Achievements */}
                        {experience.achievements && experience.achievements.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Key Achievements</h4>
                                <ul className="space-y-1">
                                    {experience.achievements.map((achievement, achIndex) => (
                                        <li key={achIndex} className="text-sm text-gray-600 flex items-start">
                                            <span className="inline-block w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                            <span className="leading-relaxed">{achievement}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const EmptyState = () => (
        <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No experience added yet</h3>
            <p className="text-gray-500 mb-4 max-w-sm mx-auto">
                Showcase your professional journey by adding your work experience
            </p>
            <button
                onClick={onAddPosition}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
                <PlusIcon className="w-4 h-4" />
                Add your first position
            </button>
        </div>
    );

    const ShowMoreButton = () => (
        <button 
            onClick={() => setShowAll(true)}
            className="w-full text-center text-orange-600 font-medium mt-6 py-3 hover:bg-orange-50 rounded-lg transition-colors border border-orange-200 hover:border-orange-300"
        >
            Show {remainingCount} more experience{remainingCount !== 1 ? 's' : ''}
        </button>
    );

    const ShowLessButton = () => (
        <button 
            onClick={() => setShowAll(false)}
            className="w-full text-center text-orange-600 font-medium mt-6 py-3 hover:bg-orange-50 rounded-lg transition-colors border border-orange-200 hover:border-orange-300"
        >
            Show less
        </button>
    );

    if (experiences.length === 0) {
        return (
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Experience</h2>
                        <button
                            onClick={onAddPosition}
                            className="p-2 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200"
                            aria-label="Add new position"
                        >
                            <PlusIcon className="w-5 h-5 text-orange-600" />
                        </button>
                    </div>
                    <EmptyState />
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Experience</h2>
                    <button
                        onClick={onAddPosition}
                        className="p-2 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200"
                        aria-label="Add new position"
                    >
                        <PlusIcon className="w-5 h-5 text-orange-600" />
                    </button>
                </div>

                {/* Experience List */}
                <div className="space-y-6">
                    {displayedExperiences.map((experience, index) => (
                        <React.Fragment key={Date.now() + index}>
                            <ExperienceCard experience={experience} index={index} />
                            {index < displayedExperiences.length - 1 && (
                                <hr className="border-gray-200" />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Show More/Less Controls */}
                {remainingCount > 0 && !showAll && <ShowMoreButton />}
                {showAll && remainingCount > 0 && <ShowLessButton />}
            </div>
        </section>
    );
};

export default ExperiencesSection;