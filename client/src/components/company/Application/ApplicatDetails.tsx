import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { UserApi } from "@/api/user.api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import EducationCard from "./EducationCard";
import ExperienceCard from "./ExperienceCard";
import { Education, Experience, Skill } from "@/types/profile";

const MAX_INITIAL_ITEMS = 3;

const ApplicantDetails = () => {
  const [showAllEducation, setShowAllEducation] = useState(false);
  const [showAllExperience, setShowAllExperience] = useState(false);
  const { applicantId } = useOutletContext<{ applicantId: string }>()
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profiledetails'],
    queryFn: () => {
      console.log("fetching profile for id:", applicantId);
      if(applicantId) {
        return UserApi.getUserById(applicantId)
      }
    },
    enabled: !!applicantId
  });

  useEffect(() => {
     console.log("id", applicantId);
     console.log("profileData", profileData);
  }, [profileData, applicantId]);


  const SkillBadge = ({ skill }: { skill: Skill }) => (
    <span className="px-3 py-1 bg-gray-100 text-orange-700 rounded-md text-sm">
      {skill?.name} ({ skill?.proficiency })
    </span>
  );

 

  const ShowMoreButton = ({ 
    showing, 
    totalItems, 
    onClick, 
    label 
  }: {
    showing: boolean;
    totalItems: number;
    onClick: () => void;
    label: string;
  }) => totalItems > MAX_INITIAL_ITEMS && (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 mt-2"
    >
      {showing ? (
        <>Show Less <ChevronUp size={16} /></>
      ) : (
        <>Show More ({totalItems - MAX_INITIAL_ITEMS} more) <ChevronDown size={16} /></>
      )}
      {label}
    </button>
  );

  const BasicInfo = () => (
    <div className="flex flex-col md:flex-row justify-between p-4 bg-slate-50 rounded-lg">
      <div className="space-y-2">
        <div>
          <h4 className="text-sm text-slate-500">Email</h4>
          <p className="font-medium text-slate-800">{profileData?.email || 'Not specified'}</p>
        </div>
        
        <div>
          <h4 className="text-sm text-slate-500">Job Role</h4>
          <p className="font-medium text-slate-800">{profileData?.jobRole || 'Not specified'}</p>
        </div>
      </div>
      <div className="space-y-2 mt-4 md:mt-0">
      <div>
          <h4 className="text-sm text-slate-500">Location</h4>
          <p className="font-medium text-slate-800">{profileData?.location?.placename || 'Not specified'}</p>
        </div>
        <div>
          <h4 className="text-sm text-slate-500">Phone</h4>
          <p className="font-medium text-slate-800">{profileData?.phone || 'Not specified'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <main className="flex flex-col items-center pb-6 bg-white  border-zinc-200    ">
      <Card className="w-full mt-6 p-6 border-0 shadow-none">
        <h2 className="text-lg font-semibold text-gray-600 mb-6">
          Profile Information
        </h2>
        
        <CardContent className="space-y-8 border-0">
        
          <section> 
            {isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <BasicInfo />
            )}
          </section>

          <section className="space-y-2">
            <h3 className="text-slate-500">About Me</h3>
            {isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <p className="font-medium text-slate-800 leading-7">
                {profileData?.about || "No description provided yet"}
              </p>
            )}
          </section>

          <section className="space-y-3">
            <h3 className="text-slate-500">Education</h3>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : profileData?.education?.length > 0 ? (
              <div className="space-y-2">
                {(showAllEducation 
                  ? profileData.education 
                  : profileData.education.slice(0, MAX_INITIAL_ITEMS)
                ).map((edu: Education, index: number) => (
                  <EducationCard key={index} education={edu} />
                ))}
                <ShowMoreButton
                  showing={showAllEducation}
                  totalItems={profileData.education.length}
                  onClick={() => setShowAllEducation(!showAllEducation)}
                  label="education entries"
                />
              </div>
            ) : (
              <p className="text-slate-600">No education details added</p>
            )}
          </section>

          <section className="space-y-3">
            <h3 className="text-slate-500">Experience</h3>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : profileData?.experience?.length > 0 ? (
              <div className="space-y-2">
                {(showAllExperience 
                  ? profileData.experience 
                  : profileData.experience.slice(0, MAX_INITIAL_ITEMS)
                ).map((exp: Experience, index: number) => (
                  <ExperienceCard key={index} experience={exp} />
                ))}
                <ShowMoreButton
                  showing={showAllExperience}
                  totalItems={profileData.experience.length}
                  onClick={() => setShowAllExperience(!showAllExperience)}
                  label="experience entries"
                />
              </div>
            ) : (
              <p className="text-slate-600">No experience details added</p>
            )}
          </section>

          <section className="space-y-2">
            <h3 className="text-slate-500">Skills</h3>
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <div className="flex flex-wrap gap-2">
                {profileData?.skills?.length > 0 ? (
                  profileData.skills.map((skill: Skill, index: number) => (
                    <SkillBadge key={index} skill={skill} />
                  ))
                ) : (
                  <span className="text-slate-600">No skills listed</span>
                )}
              </div>
            )}
          </section>

        </CardContent>
      </Card>
    </main>
  );
};

export default ApplicantDetails;