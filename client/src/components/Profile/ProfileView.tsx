import { useEffect, useState } from "react";
import { ProfileApi } from "@/api/Profile.api";
import { CiCalculator1, CiLocationOn } from "react-icons/ci";
import { useQuery } from "react-query";
import ProfileSkeleton from "../Skeleton/UserProfile.skeleton";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Send, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Education, Experience, Skill } from "@/types/profile";

const PublicProfile = () => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [showAllExperience, setShowAllExperience] = useState(false);
  const [showAllEducation, setShowAllEducation] = useState(false);
  const navigate = useNavigate()
  const { id } = useParams();

  const { data, isLoading } = useQuery(
    ["public-profile", id],
    () => ProfileApi.getProfile(id!),
    {}
  );

  useEffect(() => {
    if (data && data.coverImageKey) {
      ProfileApi.getUploadedFile(data.coverImageKey).then((url) => {
        setCoverImage(url);
      });
    }

    if (data && data.profileImageKey) {
      ProfileApi.getUploadedFile(data.profileImageKey).then((url) => {
        setAvatarUrl(url);
      });
    }
  }, [data]);

  const handleSendMessage = () => {
    console.log("Send message to:", data);
    const user = {
       _id: data._id,
       username: data.username,
       email: data.email,
       phone: data.phone,
       avatar: data.avatar,
    }
     navigate('/chat', { state: { applicant: user }})
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  const renderExperienceSection = () => {
    if (!data?.experience?.length) {
      return (
        <div className="p-4 px-8 rounded mt-4 border items-center">
          <h1 className="text-lg font-bold font-clash">Experience</h1>
          <p className="text-sm text-gray-500 italic">No experience listed</p>
        </div>
      );
    }

    const displayedExperience = showAllExperience
      ? data.experience
      : data.experience.slice(0, 1);

    return (
      <div className="p-4 px-8 rounded mt-4 border">
        <h1 className="text-lg font-bold font-clash">Experience</h1>
        {displayedExperience.map((exp: Experience, index: number) => (
          <div key={index + Date.now()} className="mt-4 border-b pb-4 last:border-b-0 last:pb-0">
            <h2 className="text-base font-medium">{exp.position}</h2>
            <p className="text-sm text-gray-600">{exp.companyName}</p>
            <p className="text-xs text-gray-500">
              {format(exp.startDate, 'PPP')} - {exp.endDate ? format(exp.endDate, "PPP") : 'Present'}
            </p>
            <p className="text-sm mt-2">{exp.employmentType}</p>
          </div>
        ))}
        {data.experience.length > 1 && (
          <Button
            variant="ghost"
            onClick={() => setShowAllExperience(!showAllExperience)}
            className="w-full mt-4 flex items-center justify-center gap-2"
          >
            {showAllExperience ? (
              <>Show Less <ChevronUp size={16} /></>
            ) : (
              <>See More ({data.experience.length - 1} more) <ChevronDown size={16} /></>
            )}
          </Button>
        )}
      </div>
    );
  };

  const renderEducationSection = () => {
    if (!data?.education?.length) {
      return (
        <div className="p-4 px-8 rounded mt-4 border items-center">
          <h1 className="text-lg font-bold font-clash">Education</h1>
          <p className="text-sm text-gray-500 italic">No education listed</p>
        </div>
      );
    }

    const displayedEducation = showAllEducation
      ? data.education
      : data.education.slice(0, 1);

    return (
      <div className="p-4 px-8 rounded mt-4 border">
        <h1 className="text-lg font-bold font-clash">Education</h1>
        {displayedEducation.map((edu: Education, index: number) => (
          <div key={index} className="mt-4 border-b pb-4 last:border-b-0 last:pb-0">
            <h2 className="text-base font-medium">{edu.school}</h2>
            <p className="text-sm text-gray-600">{edu.degree}</p>
            <p className="text-xs text-gray-500">
              {edu.startDate} - {edu.endDate || 'Present'}
            </p>
            <p className="text-sm mt-2">{edu.description}</p>
          </div>
        ))}
        {data.education.length > 1 && (
          <Button
            variant="ghost"
            onClick={() => setShowAllEducation(!showAllEducation)}
            className="w-full mt-4 flex items-center justify-center gap-2"
          >
            {showAllEducation ? (
              <>Show Less <ChevronUp size={16} /></>
            ) : (
              <>See More ({data.education.length - 1} more) <ChevronDown size={16} /></>
            )}
          </Button>
        )}
      </div>
    );
  };

  return (
    <main className="basis-full rounded p-8">
      <div className="max-w-[50rem]">
        <div className="">
          <div className="flex flex-1 flex-col justify-center border rounded">
            <div className="w-full rounded">
              <div className="w-full relative h-56 flex justify-center items-center bg-gradient-to-t from-orange-100 to-transparent">
                <img
                  src={data && data.coverImageKey ? `${coverImage}` : "/coverImage.png"}
                  style={{ width: "100%", height: "100%" }}
                  className="overflow-hidden rounded"
                  alt="Cover"
                />
                <div className="w-40 h-40 flex justify-center items-center top-36 bg-slate-600 object-cover rounded-full absolute left-1/2 -translate-x-1/2 border-4 border-white overflow-hidden">
                  <div className="relative w-full h-full">
                    {data && data.profileImageKey ? (
                      <img
                        src={data.profileImageKey ? `${avatarUrl}` : ""}
                        className="rounded-full w-full h-full object-cover"
                        alt="Profile"
                      />
                    ) : (
                      <h1 className="text-6xl font-semibold text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        {data?.username ? data.username[0] : "U"}
                      </h1>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-y-1 w-full mt-14 sm:mt-0 px-4 py-2 border">
                <div className="mt-2 p-2 flex-1">
                  <div>
                    <h1 className="text-2xl font-semibold">{data?.username}</h1>
                    <h2 className="text-lg font-medium text-zinc-500">{data?.jobRole}</h2>
                  </div>
                  <div className="flex flex-col mt-1 justify-start gap-y-1 text-zinc-400 tracking-wider">
                    <div className="flex gap-x-2 items-center">
                      <CiLocationOn />
                      <h3 className="text-xs">{data?.location?.placename}</h3>
                    </div>
                    <div className="flex justify-start gap-y-1">
                      <div className="flex gap-x-1 items-center">
                        <CiCalculator1 className="text-xs" />
                        <p className="mr-3 text-xs">
                          {format(data?.createdAt ?? new Date(), "PPP")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex mt-3 gap-x-3">
                    <Button
                      onClick={handleSendMessage}
                      className="inline-flex gap-x-1 items-center text-base justify-center px-4 py-[4px] rounded-full bg-gradient-to-b from-orange-500 to-orange-600 text-white focus:ring-2 focus:ring-orange-400 hover:shadow-xl transition duration-200"
                    >
                      <Send size={16} />
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-2">
            {data?.about ? (
              <div className="p-4 px-8 rounded mt-4 border">
                <h1 className="text-lg font-bold font-clash">About</h1>
                <p className="mt-2 text-sm text-gray-700">{data.about}</p>
              </div>
            ) : (
              <div className="p-4 px-8 rounded mt-4 border items-center">
                <h1 className="text-lg font-bold font-clash">About</h1>
                <p className="text-sm text-gray-500 italic">No information provided</p>
              </div>
            )}
          </div>

          <div className="mt-2">
            {renderExperienceSection()}
          </div>

          <div className="mt-2">
            {renderEducationSection()}
          </div>

          <div className="mt-2">
            {data?.skills?.length > 0 ? (
              <div className="p-4 px-8 rounded mt-4 border">
                <h1 className="text-lg font-bold font-clash">Skills</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.skills.map((skill: Skill, index: number) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 px-8 rounded mt-4 border items-center">
                <h1 className="text-lg font-bold font-clash">Skills</h1>
                <p className="text-sm text-gray-500 italic">No skills listed</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PublicProfile;