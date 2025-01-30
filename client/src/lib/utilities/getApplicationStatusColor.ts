import { ApplicationStatus } from "@/types/application";

export const getStageColor = (stage: ApplicationStatus) => {
    const colors: Record<Lowercase<ApplicationStatus>, string> = {
      'applied': 'bg-blue-100 text-blue-800 border-blue-800',
      'inreview': 'bg-yellow-100 text-yellow-800 border-yellow-800',
      'shortlisted': 'bg-purple-100 text-purple-800 border-purple-800',
      'interview': 'bg-orange-100 text-orange-800 border-orange-800',
      'rejected': 'bg-red-100 text-red-800 border-red-800',
      'selected': 'bg-green-100 text-green-800 border-green-800',
      'all': 'bg-gray-100 text-gray-800 border-gray-800',
    };

    const stageKey = stage.toLowerCase() as Lowercase<ApplicationStatus>;
    return colors[stageKey] || 'bg-gray-100 text-gray-800 border-gray-800';
};