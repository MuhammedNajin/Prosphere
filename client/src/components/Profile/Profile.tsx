import React, { useEffect, useState, useCallback } from "react";
import { FaPhone } from "react-icons/fa";
import { CiCalculator1, CiLocationOn } from "react-icons/ci";
import {
  Camera,
  CircleEllipsis,
  CircleUser,
  GraduationCap,
  Image,
  Info,
  Lightbulb,
  Pencil,
  PersonStanding,
  Plus,
  MapPin,
  Briefcase,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "react-query";
import { format } from "date-fns";
import { UserApi } from "@/api/user.api";
import { useCurrentUser } from "@/hooks/useSelectors";
import { ModalContent } from "@/types/profile";
import ProfileSkeleton from "../Skeleton/UserProfile.skeleton";
import About from "./About";
import PositionForm from "./PositionForm";
import EducationForm from "./EducationForm";
import SkillForm from "./SkillForm";
import AboutForm from "./AboutForm";
import ProfileImageForm from "./ProfileImageForm";
import ExperiencesSection from "./Experience";
import SkillsSection from "./Skills";
import EducationSection from "./Education";
import ProfileEditForm from "./ProfileEditForm";
import ContactInfoModalContent from "./ContactInfo";
import { CoverImageModal } from "./CoverImageForm";
import ResumeForm from "./ResumeFrom";
import ResumeSection from "./Resume";
import { IUser } from "@/types/user";
import { Button } from "@/components/ui/button";
import HeadlineForm from "./Headlineform";
import LocationForm from "./LocationForm";

const Profile: React.FC = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ModalContent | string>("");
  const [index, setIndex] = useState<number>(-1);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [coverImage, setCoverImage] = useState<string>("");

  const user = useCurrentUser();

  const { data, isLoading, error, refetch } = useQuery<IUser, Error>(
    ["profile", user?.id],
    () => UserApi.getProfile(),
    {
      enabled: !!user?.id,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );

  useEffect(() => {
    console.log("data from profile", data);
    const loadImages = async () => {
      if (!data) return;

      try {
        if (data.coverImageKey) {
          const coverUrl = await UserApi.getUploadedFile(data.coverImageKey);
          console.log("coverUrl", coverUrl);
          setCoverImage(coverUrl?.url ?? '');
        }
        if (data.profileImageKey) {
          const avatarUrl = await UserApi.getUploadedFile(data.profileImageKey);
          console.log("avatarUrl", avatarUrl);
          
          setAvatarUrl(avatarUrl.url ?? '');
        }
      } catch (error) {
        console.error("Failed to load images:", error);
      }
    };

    loadImages();
  }, [data]);

  const handleModalOpen = useCallback(
    (content: ModalContent, itemIndex: number = -1) => {
      setModalContent(content);
      setIndex(itemIndex);
      setShowModal(true);
    },
    []
  );

  const handleModalClose = useCallback(
    (shouldRefetch: boolean = false) => {
      setShowModal(false);
      setModalContent("");
      setIndex(-1);
      if (shouldRefetch) {
        refetch();
      }
    },
    [refetch]
  );

  const handleEditCoverImage = useCallback(() => {
    handleModalOpen(ModalContent.EditCoverImage);
  }, [handleModalOpen]);

  const displayName = user?.username || "User";

  const userInitials = user?.username?.[0]?.toUpperCase() || "U";

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load profile</p>
          <Button
            onClick={() => refetch()}
            className="bg-orange-600 text-white hover:bg-orange-700"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="basis-full rounded p-8 max-w-4xl mx-auto">
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {modalContent}
            </DialogTitle>
          </DialogHeader>

          {modalContent === ModalContent.AddPosition && (
            <PositionForm
              onClose={(shouldRefetch) => handleModalClose(shouldRefetch)}
            />
          )}
          {modalContent === ModalContent.EditPosition && (
            <PositionForm
              onClose={(shouldRefetch) => handleModalClose(shouldRefetch)}
              experience={data?.experience?.[index] || null}
            />
          )}
          {modalContent === ModalContent.AddEducation && (
            <EducationForm onClose={handleModalClose} />
          )}
          {modalContent === ModalContent.EditEducation && (
            <EducationForm
              onClose={handleModalClose}
              education={data?.education?.[index] || null}
            />
          )}
          {modalContent === ModalContent.AddSkill && (
            <SkillForm onClose={handleModalClose} skills={[]} />
          )}
          {modalContent === ModalContent.EditSkill && (
            <SkillForm onClose={handleModalClose} skills={data?.skills || []} />
          )}
          {modalContent === ModalContent.AddAbout && (
            <AboutForm onClose={handleModalClose} />
          )}
          {modalContent === ModalContent.EditAbout && (
            <AboutForm
              onClose={handleModalClose}
              description={data?.about || ""}
            />
          )}
          {modalContent === ModalContent.AddResume && (
            <ResumeForm onClose={handleModalClose} />
          )}
          {modalContent === ModalContent.AddProfileImage && (
            <ProfileImageForm
              onClose={handleModalClose}
              avatarKey={data?.profileImageKey}
              avatarUrl={avatarUrl}
            />
          )}
          {modalContent === ModalContent.EditProfileImage && (
            <ProfileImageForm
              onClose={handleModalClose}
              avatarKey={data?.profileImageKey}
              avatarUrl={avatarUrl}
            />
          )}
          {modalContent === ModalContent.EditProfile && (
            <ProfileEditForm setModal={handleModalClose} />
          )}
          {modalContent === ModalContent.ContactInfo && (
            <ContactInfoModalContent />
          )}
          {modalContent === ModalContent.EditCoverImage && (
            <CoverImageModal
              onClose={handleModalClose}
              currentImageUrl={coverImage}
              coverKey={data?.coverImageKey}
            />
          )}
          {modalContent === ModalContent.EditHeadline && (
            <HeadlineForm
              onClose={handleModalClose}
              currentHeadline={data?.headline || ""}
            />
          )}
          {modalContent === ModalContent.EditLocation && (
            <LocationForm
              onClose={handleModalClose}
              currentLocation={data?.location || {}}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="max-w-[50rem] mx-auto">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="relative h-56 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleEditCoverImage}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-200"
                    aria-label={
                      data?.coverImageKey
                        ? "Edit cover image"
                        : "Add cover image"
                    }
                  >
                    {data?.coverImageKey ? (
                      <Pencil className="w-4 h-4 text-white" />
                    ) : (
                      <Camera className="w-4 h-4 text-white" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {data?.coverImageKey
                      ? "Edit cover image"
                      : "Add cover image"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {data?.coverImageKey && coverImage ? (
              <img
                src={coverImage}
                className="w-full h-full object-cover"
                alt="Cover image"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600" />
            )}

            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative w-32 h-32 group">
                <div className="w-full h-full bg-gray-600 rounded-full border-4 border-white shadow-lg overflow-hidden">
                  {data?.profileImageKey && avatarUrl ? (
                    <img
                      src={avatarUrl}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      alt="Profile image"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-700">
                      <span className="text-3xl font-bold text-white">
                        {userInitials}
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/0 hover:bg-black/40 rounded-full transition-all duration-300 group-hover:bg-black/40" />
                <button
                  onClick={() =>
                    handleModalOpen(
                      data?.profileImageKey
                        ? ModalContent.EditProfileImage
                        : ModalContent.AddProfileImage
                    )
                  }
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-full"
                  aria-label={
                    data?.profileImageKey
                      ? "Edit profile image"
                      : "Add profile image"
                    }
                  >
                  <Pencil className="text-white" size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-20 pb-6 px-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {displayName}
                  </h1>
                  
                  <div className="mt-2 group">
                    {data?.headline ? (
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg text-gray-600 flex-1">
                          {data.headline}
                        </h2>
                        <button
                          onClick={() => handleModalOpen(ModalContent.EditHeadline)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-100 transition-all duration-200"
                          aria-label="Edit headline"
                        >
                          <Pencil className="w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleModalOpen(ModalContent.EditHeadline)}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mt-1"
                      >
                        <Briefcase className="w-4 h-4" />
                        <span className="text-sm">Add a professional headline</span>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4 text-sm text-gray-500">
                  <div className="group">
                    {data?.location?.placename ? (
                      <div className="flex items-center gap-2">
                        <CiLocationOn className="text-base flex-shrink-0" />
                        <span className="flex-1">{data.location.placename}</span>
                        <button
                          onClick={() => handleModalOpen(ModalContent.EditLocation)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-100 transition-all duration-200"
                          aria-label="Edit location"
                        >
                          <Pencil className="w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleModalOpen(ModalContent.EditLocation)}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>Add your location</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <CiCalculator1 className="text-base" />
                      <span>
                        Joined{" "}
                        {format(new Date(data?.createdAt || new Date()), "PPP")}
                      </span>
                    </div>
                    <button
                      onClick={() => handleModalOpen(ModalContent.ContactInfo)}
                      className="flex items-center gap-2 text-orange-600 hover:text-orange-700 hover:underline transition-colors"
                      aria-label="View contact information"
                    >
                      <FaPhone size={12} />
                      <span>Contact info</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Popover open={modal} onOpenChange={setModal}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <PopoverTrigger asChild>
                            <Button className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg">
                              <CircleEllipsis size={18} />
                              <span className="font-medium">Add Section</span>
                            </Button>
                          </PopoverTrigger>
                        </TooltipTrigger>
                        <TooltipContent className="bg-orange-600 text-white border-orange-500">
                          <p>Add profile section</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <PopoverContent className="w-64 p-0 shadow-lg border-gray-200">
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Add to your profile
                        </h3>
                        <div className="space-y-3">
                          {[
                            {
                              icon: Briefcase,
                              label: "Add headline",
                              action: ModalContent.EditHeadline,
                            },
                            {
                              icon: MapPin,
                              label: "Add location",
                              action: ModalContent.EditLocation,
                            },
                            {
                              icon: Info,
                              label: "Add about",
                              action: ModalContent.AddAbout,
                            },
                            {
                              icon: CircleUser,
                              label: "Add Avatar",
                              action: ModalContent.AddProfileImage,
                            },
                            {
                              icon: Image,
                              label: "Add Cover image",
                              action: ModalContent.EditCoverImage,
                            },
                            {
                              icon: Lightbulb,
                              label: "Add Skills",
                              action: ModalContent.AddSkill,
                            },
                            {
                              icon: PersonStanding,
                              label: "Add Position",
                              action: ModalContent.AddPosition,
                            },
                            {
                              icon: GraduationCap,
                              label: "Add Education",
                              action: ModalContent.AddEducation,
                            },
                          ].map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                handleModalOpen(item.action);
                                setModal(false);
                              }}
                              className="flex items-center gap-3 w-full p-2 text-left hover:bg-gray-100 rounded-lg transition-colors"
                              aria-label={item.label}
                            >
                              <item.icon className="w-5 h-5 text-gray-600" />
                              <span className="font-medium text-gray-700">
                                {item.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex-shrink-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() =>
                          handleModalOpen(ModalContent.EditProfile)
                        }
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Edit basic info"
                      >
                        <Pencil className="w-4 h-4 text-gray-600" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit basic info</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <div className="mt-2">
            {data?.about ? (
              <About
                setContent={setModalContent}
                description={data.about}
                setModal={setShowModal}
              />
            ) : (
              <div className="flex justify-between p-6 rounded-lg border bg-white hover:bg-gray-50 transition-colors items-center">
                <div>
                  <h1 className="text-lg font-bold text-gray-900">About me</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Describe about yourself
                  </p>
                </div>
                <button
                  className="p-2 rounded-full hover:bg-orange-100 text-orange-600 transition-colors"
                  onClick={() => handleModalOpen(ModalContent.AddAbout)}
                  aria-label="Add about section"
                >
                  <Plus size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="mt-2">
            {data?.experience && data.experience.length > 0 ? (
              <ExperiencesSection
                experiences={data.experience}
                onAddPosition={() => handleModalOpen(ModalContent.AddPosition)}
                onEditPosition={(index) =>
                  handleModalOpen(ModalContent.EditPosition, index)
                }
                initialDisplayCount={2}
              />
            ) : (
              <div className="flex justify-between p-6 rounded-lg border bg-white hover:bg-gray-50 transition-colors items-center">
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    Experience
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Provide details about your relevant work history
                  </p>
                </div>
                <button
                  className="p-2 rounded-full hover:bg-orange-100 text-orange-600 transition-colors"
                  onClick={() => handleModalOpen(ModalContent.AddPosition)}
                  aria-label="Add position"
                >
                  <Plus size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="mt-2">
            {data?.education && data.education.length > 0 ? (
              <EducationSection
                setContent={setModalContent}
                setIndex={setIndex}
                setModal={setShowModal}
                educations={data.education}
              />
            ) : (
              <div className="flex justify-between p-6 rounded-lg border bg-white hover:bg-gray-50 transition-colors items-center">
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Education</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    List your educational background and qualifications
                  </p>
                </div>
                <button
                  className="p-2 rounded-full hover:bg-orange-100 text-orange-600 transition-colors"
                  onClick={() => handleModalOpen(ModalContent.AddEducation)}
                  aria-label="Add education"
                >
                  <Plus size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="mt-2">
            {data?.skills && data.skills.length > 0 ? (
              <SkillsSection
                skills={data.skills}
                setContent={setModalContent}
                setModal={setShowModal}
              />
            ) : (
              <div className="flex justify-between p-6 rounded-lg border bg-white hover:bg-gray-50 transition-colors items-center">
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Skills</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    List your relevant professional skills and competencies
                  </p>
                </div>
                <button
                  className="p-2 rounded-full hover:bg-orange-100 text-orange-600 transition-colors"
                  onClick={() => handleModalOpen(ModalContent.AddSkill)}
                  aria-label="Add skills"
                >
                  <Plus size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="mt-2">
            <ResumeSection
              setContent={setModalContent}
              setModal={setShowModal}
              resumeKeys={data?.resumeKeys}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;