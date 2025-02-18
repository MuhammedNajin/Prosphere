import React, { useEffect, useState } from "react";
import { FaPhone } from "react-icons/fa";
import About from "./About";
import { ProfileApi } from "@/api/Profile.api";
import { useSelector } from "react-redux";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PositionForm from "./PositionForm";
import EducationForm from "./EducationForm";
import SkillForm from "./SkitllsForm";
import AboutForm from "./AboutForm";
import { CiCalculator1, CiLocationOn } from "react-icons/ci";
import ProfileImageForm from "./ProfileImageForm";
import ExperiencesSection from "./Experience";
import SkillsSection from "./Skills";
import EducationSection from "./Education";
import ProfileEditForm from "./ProfileEditForm";
import ContactInfoModalContent from "./ContactInfo";
import { CoverImageModal } from "./CoverImageForm";
import { useQuery } from "react-query";
import { ModalContent } from "@/types/profile";
import ProfileSkeleton from "../Skeleton/UserProfile.skeleton";
import { format } from "date-fns";
import { RootState } from "@/redux/store";
import ResumeForm from "./ResumeFrom";
import ResumeSection from "./Resume";

const Profile: React.FC = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [index, setIndex] = useState(-1);
  const { user } = useSelector((state: RootState) => state.auth);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const { data, isLoading } = useQuery(
    ["profile"],
    () => ProfileApi.getProfile(user?._id!),
    {}
  );

  useEffect(() => {
    if (data && data.coverImageKey) {
      ProfileApi.getUploadedFile(data.coverImageKey).then((url) => {
        console.log("url", url);
        setCoverImage(url);
      });
    }

    if (data && data.profileImageKey) {
      ProfileApi.getUploadedFile(data.profileImageKey).then((url) => {
        console.log("url", url);
        setAvatarUrl(url);
      });
    }
  }, [data]);

  const handleEditCoverImage = () => {
    setModalContent(ModalContent.EditCoverImage);
    setShowModal(true);
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <main className="basis-full rounded p-8">
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-xl shadow-none">
          <DialogHeader>
            <DialogTitle>{modalContent}</DialogTitle>
          </DialogHeader>
          {(modalContent === ModalContent.AddPosition ||
            modalContent === ModalContent.EditPosition) && (
            <PositionForm
              onClose={setShowModal}
              position={
                data && modalContent === ModalContent.EditPosition
                  ? data.experience[index]
                  : null
              }
            />
          )}

          {(modalContent === ModalContent.AddEducation ||
            modalContent === ModalContent.EditEducation) && (
            <EducationForm
              education={
                data && modalContent === ModalContent.EditEducation
                  ? data.education[index]
                  : null
              }
              onClose={setShowModal}
            />
          )}

          {(modalContent === ModalContent.AddSkill ||
            modalContent === ModalContent.EditSkill) && (
            <SkillForm
              skills={
                data && modalContent === ModalContent.EditSkill
                  ? data.skills
                  : []
              }
              onClose={setShowModal}
            />
          )}

          {(modalContent === ModalContent.AddAbout ||
            modalContent === ModalContent.EditAbout) && (
            <AboutForm
              onClose={setShowModal}
              about={
                data && modalContent === ModalContent.EditAbout
                  ? data.about
                  : ""
              }
            />
          )}

          {(modalContent === ModalContent.AddResume ||
            modalContent === ModalContent.EditResume) && (
            <ResumeForm
              onClose={setShowModal}
            />
          )}

          {(modalContent === ModalContent.AddProfileImage ||
            modalContent === ModalContent.EditProfileImage) && (
            <ProfileImageForm
              avatarKey={data.profileImageKey}
              avatarUrl={avatarUrl}
              onClose={setShowModal}
            />
          )}

          {modalContent === ModalContent.EditProfile && (
            <ProfileEditForm setModal={setShowModal} />
          )}

          {modalContent === ModalContent.ContactInfo && (
            <ContactInfoModalContent />
          )}

          {modalContent === ModalContent.EditCoverImage && (
            <CoverImageModal
              currentImageUrl={coverImage}
              onClose={setShowModal}
              coverKey={data.coverImageKey}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className=" max-w-[50rem]">
        <div className="">
          <div className="flex flex-1 flex-col justify-center border rounded">
            <div className="w-full rounded ">
              <div className="w-full relative h-56 flex justify-center items-center bg-gradient-to-t from-orange-100 to-transparent">
                <div className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 flex items-center justify-center hover:bg-orange-200 hover:text-white">
                  {data && data.coverImageKey ? (
                    <button className="p-1 rounded-full hover:bg-gray-200 ">
                      <Pencil
                        onClick={() => {
                          handleEditCoverImage();
                        }}
                        className="w-4 h-4 text-orange-700 hover:text-white"
                      />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleEditCoverImage();
                      }}
                      className="p-1 rounded-full"
                    >
                      <Camera className="w-4 h-4 text-orange-700 hover:text-white" />
                    </button>
                  )}
                </div>
                <img
                  src={
                    data && data.coverImageKey
                      ? `${coverImage}`
                      : "/coverImage.png"
                  }
                  style={{ width: "100%", height: "100%" }}
                  className="overflow-hidden rounded"
                  alt=""
                />
                <div
                  className="w-40 h-40 flex justify-center items-center top-36 bg-slate-600 object-cover rounded-full absolute left-1/2 -translate-x-1/2 border-4 border-white group overflow-hidden transition-all duration-300 ease-in-out
                      hover:border-orange-500 hover:shadow-lg hover:shadow-orange-200/5"
                >
                  <div className="relative w-full h-full">
                    {data && data.profileImageKey ? (
                      <img
                        onClick={() => setModal(!modal)}
                        src={data.profileImageKey ? `${avatarUrl}` : ""}
                        className="rounded-full w-full h-full object-cover 
                         transition-transform duration-300 group-hover:scale-105"
                        alt="Profile"
                      />
                    ) : (
                      <h1 className="text-6xl font-semibold text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        {user?.username[0] || "U"}
                      </h1>
                    )}

                    <div
                      className="absolute inset-0 bg-gray-600 opacity-0 group-hover:opacity-70 
                         transition-all duration-300 rounded-full "
                    />

                    <button
                      onClick={() => {
                        let args = data?.profileImageKey
                          ? ModalContent.EditProfileImage
                          : ModalContent.AddProfileImage;

                        setModalContent(args);
                        setShowModal(!showModal);
                      }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                           rounded-full p-3 opacity-0 scale-50
                           group-hover:opacity-100 group-hover:scale-100
                           transition-all duration-300 ease-out
                           hover:shadow-lg hover:scale-110
                           flex items-center justify-center"
                    >
                      <Pencil
                        className="text-white transition-colors duration-300"
                        size={26}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-y-1 w-full mt-14 sm:mt-0 px-4 py-2 border">
                <div className="mt-2 p-2 flex-1">
                  <div>
                    <h1 className="text-2xl font-semibold">{data?.username}</h1>
                    <h2 className="text-lg font-medium text-zinc-500">
                      {data?.jobRole}
                    </h2>
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
                      <div className="flex gap-1 items-center">
                        <FaPhone size={12} className="text-xs" />
                        <p
                          onClick={() => {
                            setModalContent("Contact Info");
                            setShowModal(!showModal);
                          }}
                          className="text-blue-400 text-xs cursor-pointer hover:underline"
                        >
                          contact info
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex mt-3 gap-x-3">
                    <Popover>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <PopoverTrigger asChild>
                              <button className="inline-flex gap-x-1 items-center text-base justify-center px-4 py-[4px] rounded-full bg-gradient-to-b from-orange-500 to-orange-600 text-white focus:ring-2 focus:ring-orange-400 hover:shadow-xl transition duration-200">
                                <CircleEllipsis size={20} className="" />
                                More
                              </button>
                            </PopoverTrigger>
                          </TooltipTrigger>
                          <TooltipContent className="border-1 bg-orange-600 text-white shadow-xl">
                            <p>Add profile section</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <PopoverContent className="w-60 shadow-none">
                        <div className="flex flex-col gap-y-[1.5rem]">
                          <div className="flex gap-x-3 items-center">
                            <Info className="size-5" />
                            <h4
                              onClick={() => {
                                setModalContent("Add About");
                                setShowModal(!showModal);
                              }}
                              className="font-medium leading-none cursor-pointer"
                            >
                              Add about
                            </h4>
                          </div>
                          <div className="flex gap-x-3 items-center">
                            <CircleUser className="size-5" />
                            <h4
                              onClick={() => {
                                setModalContent("Add Profile Image");
                                setShowModal(!showModal);
                              }}
                              className="font-medium leading-none cursor-pointer"
                            >
                              Add Avatar
                            </h4>
                          </div>
                          <div className="flex gap-x-3 items-center">
                            <Image className="size-5" />
                            <h4
                              onClick={() => {
                                setModalContent("Edit Cover Image");
                                setShowModal(!showModal);
                              }}
                              className="font-medium leading-none cursor-pointer"
                            >
                              Add Cover image
                            </h4>
                          </div>
                          <div className="flex gap-x-3 items-center">
                            <Lightbulb className="size-5" />
                            <h4
                              onClick={() => {
                                setModalContent("Add Skill");
                                setShowModal(!showModal);
                              }}
                              className="font-medium leading-none cursor-pointer"
                            >
                              Add Skills
                            </h4>
                          </div>
                          <div className="flex gap-x-3 items-center">
                            <PersonStanding className="size-5" />
                            <h4
                              onClick={() => {
                                setModalContent("Add Position");
                                setShowModal(!showModal);
                              }}
                              className="font-medium leading-none cursor-pointer"
                            >
                              Add Position
                            </h4>
                          </div>
                          <div className="flex gap-x-3 items-center">
                            <GraduationCap className="size-5" />
                            <h4
                              onClick={() => {
                                setModalContent("Add Education");
                                setShowModal(!showModal);
                              }}
                              className="font-medium leading-none cursor-pointer"
                            >
                              Add Education
                            </h4>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex flex-1 gap-y-10 flex-col p-2 ">
                  <div>
                    <div className="flex justify-end pr-1">
                      <button className="p-2 hover:bg-gray-200 rounded-full">
                        <Pencil
                          className="size-4"
                          onClick={() => {
                            setModalContent("Edit Profile");
                            setShowModal(!showModal);
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2">
            {data?.about ? (
              <About
                setContent={setModalContent}
                about={data.about}
                setModal={setShowModal}
              />
            ) : (
              <div className="flex justify-between p-4 px-8 rounded mt-4 border items-center">
                <div>
                  <h1 className="text-lg font-bold font-clash">About me</h1>
                  <p className="text-xs text-gray-600">
                    Describe about yourself
                  </p>
                </div>
                <div>
                  <button
                    className="p-1 rounded-full hover:bg-gray-200"
                    onClick={() => {
                      setModalContent(ModalContent.AddAbout);
                      setShowModal(true);
                    }}
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-2">
            {data?.experience?.length > 0 ? (
              <ExperiencesSection
                setContent={setModalContent}
                setModal={setShowModal}
                experiences={data.experience}
                setIndex={setIndex}
              />
            ) : (
              <div className="flex justify-between p-4 px-8 rounded mt-4 border items-center">
                <div>
                  <h1 className="text-lg font-bold font-clash">Experience</h1>
                  <p className="text-xs text-gray-600">
                    Provide details about your relevant work history
                  </p>
                </div>
                <div>
                  <button
                    className="p-1 rounded-full hover:bg-gray-200"
                    onClick={() => {
                      setModalContent(ModalContent.AddPosition);
                      setShowModal(true);
                    }}
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-2">
            {data?.education?.length > 0 ? (
              <EducationSection
                setContent={setModalContent}
                setIndex={setIndex}
                setModal={setShowModal}
                educations={data.education}
              />
            ) : (
              <div className="flex justify-between p-4 px-8 rounded mt-4 border items-center">
                <div>
                  <h1 className="text-lg font-bold font-clash">Education</h1>
                  <p className="text-xs text-gray-600">
                    List your educational background and qualifications
                  </p>
                </div>
                <div>
                  <button
                    className="p-1 rounded-full hover:bg-gray-200"
                    onClick={() => {
                      setModalContent(ModalContent.AddEducation);
                      setShowModal(true);
                    }}
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-2">
            {data?.skills?.length > 0 ? (
              <SkillsSection
                skills={data.skills}
                setContent={setModalContent}
                setModal={setShowModal}
              />
            ) : (
              <div className="flex justify-between p-4 px-8 rounded mt-4 border items-center">
                <div>
                  <h1 className="text-lg font-bold font-clash">Skills</h1>
                  <p className="text-xs text-gray-600">
                    List your relevant professional skills and competencies
                  </p>
                </div>
                <div>
                  <button
                    className="p-1 rounded-full hover:bg-gray-200"
                    onClick={() => {
                      setModalContent(ModalContent.AddSkill);
                      setShowModal(true);
                    }}
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-2">
            <ResumeSection
              setContent={setModalContent}
              setModal={setShowModal}
              resumeKeys={data?.resumeKey}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
