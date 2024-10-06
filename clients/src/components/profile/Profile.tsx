import React, { useEffect, useRef, useState } from "react";
import { FaEdit, FaPhone } from "react-icons/fa";
import About from "./About";
import { ProfileApi } from "@/api/Profile.api";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
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
  CircleUser,
  GraduationCap,
  Image,
  Info,
  Lightbulb,
  Pencil,
  PersonStanding,
} from "lucide-react";
import PositionForm from "./PositionForm";
import EducationForm from "./EducationForm";
import SkillForm from "./SkitllsForm";
import AboutForm from "./AboutForm";
import { CiCalculator1, CiLocationOn } from "react-icons/ci";
import { ProfileImageForm } from './ProfileImageForm'
import ExperiencesSection from "./Experience";
import SkillsSection from "./Skills";
import EducationSection from "./Education";
import ProfileEditForm from "./ProfileEditForm";
import ContactInfoModalContent from "./ContactInfo";
import { CoverImageModal } from "./CoverImageForm";
import { useQuery } from "react-query";

const Profile: React.FC = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [ index, setIndex ] = useState(-1);
  const { user } = useSelector((state) => state.auth);
  
  const { data } = useQuery(
    ["fetchProfile", user.email],
    () => ProfileApi.getProfile(user.email), 
    {}
  );

  console.log("data", data)
  useEffect(() => {
    console.log("uerdata", data)
  },[]);

  return (
    <main className="basis-full rounded">
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{modalContent}</DialogTitle>
          </DialogHeader>
           {
              (modalContent == 'Add Position' || modalContent == 'Edit Position') && (
                <PositionForm position={data && modalContent == 'Edit Position' ? data.experience[index] : null}/>
              )

           }

        {
              
              ( modalContent == 'Add Education' || modalContent == 'Edit Education') && (
                 <EducationForm education={data && modalContent == 'Edit Education' ? data.education[index] : null} />
              )
        }

        {
           ( modalContent == 'Add Skill' ||  modalContent == 'Edit Skill') && (
               <SkillForm skills={data && modalContent == 'Edit Skill' ? data.skills : []}/>
            )
        }

        {
          (modalContent == 'Add About' || modalContent == 'Edit About') && (
            <AboutForm about={data && modalContent == 'Edit About' ? data.about : ""}/>
          )
        }

        {
           ( modalContent == 'Add Cover Image' || modalContent == 'Edit Cover Image') && (
             <h1></h1>
           )
        }

        {
            ( modalContent == 'Add Profile Image' || modalContent == 'Edit Profile Image') && (
              <ProfileImageForm />
            )
        }

        { 
          modalContent == 'Edit Profile' && (
            <ProfileEditForm setModal={setShowModal} />
          )
        }
        { 
          modalContent == 'Contact Info' && (
            <ContactInfoModalContent/>
          )
        }

        {
          modalContent == 'Edit Cover Image' && (
            <CoverImageModal />
          )
        }

        </DialogContent>
      </Dialog>

      {/* <header>
        <nav className="bg-slate-400 h-24"></nav>
      </header> */}

      <div className=" max-w-5xl">
        <div className="">
       
          <div className="flex flex-col justify-center  md:basis-2/3 basis-full">
            <div className="w-full  bg-white border rounded ">
              <div className="w-full relative h-56 flex justify-center items-center ">
                <img
                  src={data && data.coverImageKey ? data.coverImageKey : ''}
                  style={{ width: "100%", height: "100%" }}
                  className="overflow-hidden rounded"
                  alt=""
                />
                <div className="w-40 h-40 flex justify-center items-center top-36 bg-slate-600 object-cover rounded-full absolute left-1/2 -translate-x-1/2 border-4 border-white">
                  { data && data.profileImageKey ? (
                    <img
                    onClick={(e) => setModal(!modal)}
                    src={data && data.profileImageKey ? data.profileImageKey : ''}
                    className="rounded-full"
                    style={{ width: "100%", height: "100%" }}
                    alt=""
                  />
                
                  ) : (
                    <h1 className="text-6xl font-semibold text-white">{user.username[0]}</h1>
                  )
                }
                </div>
              </div>
              <div className="flex w-full mt-14 sm:mt-0 px-4 py-2 ">
                <div className="mt-2 p-2">
                  <div>
                    <h1 className="text-2xl font-semibold  ">
                      {user.username}
                    </h1>
                    <h2 className="text-lg font-medium text-zinc-500">
                     { user.jobRole}
                    </h2>
                    <h1 className="text-md font-medium text-zinc-500">
                      12 connections
                    </h1>
                  </div>
                  <div className="mt-2 text-zinc-400 tracking-wider">
                   <div className="flex gap-x-2 items-center">
                   <CiLocationOn />
                   <h3>Kozhikode, kerala, india</h3>
                   </div>
                    
                    <div className="flex">
                     <div className="flex gap-x-1 items-center">
                     <CiCalculator1 />
                     <p className="mr-3">Joined october 2023</p>
                     </div>
                     <div className="flex gap-1 items-center">
                     <FaPhone />
                     <p
                     onClick={() => {
                      setModalContent('Contact Info');
                      setShowModal(!showModal)
                     }} 
                     className="text-blue-400 cursor-pointer">contact info</p>
                     </div>
                    </div>
                  </div>
                  <div className="flex mt-3 gap-x-3">
                    <Button variant="outline" className="inline-flex rounded-full bg-[#f2f3f4] text-md font-bold animate-shimmer items-center justify-center    px-6 py-[6px] text-black transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                      Connect
                    </Button>
                    <Button variant="outline" className="inline-flex rounded-full text-md font-bold animate-shimmer items-center justify-center  border border-slate-800 bg-white  px-6 py-[6px] text-black transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                      Follow
                    </Button>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">Add Profile section</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-60">
                        <div className="flex flex-col gap-y-[1.5rem]">
                          <div className="flex gap-x-3 items-center">
                            <Info className="size-5" />
                            <h4
                             onClick={() => {
                              setModalContent('Add About');
                              setShowModal(!showModal)
                            }}
                             className="font-medium leading-none cursor-pointer">
                              Add about
                            </h4>
                          </div>
                          <div className="flex gap-x-3 items-center">
                            <CircleUser className="size-5" />
                            <h4 
                             onClick={() => {
                              setModalContent('Add Profile Image');
                              setShowModal(!showModal)
                            }}
                            className="font-medium leading-none cursor-pointer">
                              Add Avatar
                            </h4>
                          </div>
                          <div className="flex gap-x-3 items-center">
                            <Image className="size-5" />
                            <h4 
                              onClick={() => {
                                setModalContent('Edit Cover Image');
                                setShowModal(!showModal)
                              }}
                              className="font-medium leading-none cursor-pointer">
                              Add Cover image
                            </h4>
                          </div>
                          <div className="flex gap-x-3 items-center">
                            <Lightbulb className="size-5" />
                            <h4
                            onClick={() => {
                              setModalContent('Add Skill');
                              setShowModal(!showModal)
                            }} 
                            className="font-medium leading-none cursor-pointer">
                              Add Skills
                            </h4>
                          </div>
                          <div className="flex gap-x-3 items-center">
                            <PersonStanding className="size-5" />
                            <h4
                              onClick={() => {
                                setModalContent('Add Position');
                                setShowModal(!showModal)
                              }}
                              className="font-medium leading-none cursor-pointer"
                            >
                              Add Position
                            </h4>
                          </div>
                          <div className="flex gap-x-3 items-center">
                            <GraduationCap className="size-5" />
                            <h4 
                             onClick={(e) => {
                                setModalContent('Add Education');
                                setShowModal(!showModal)
                             }}
                            className="font-medium leading-none cursor-pointer">
                              Add Education
                            </h4>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex gap-y-10 flex-col p-2 w-full">
                  <div >
                    <div className="flex justify-end pr-14">
                      <Pencil
                      className="size-4"
                       onClick={() => {
                          setModalContent('Edit Profile');
                          setShowModal(!showModal)
                       }}
                      />
                    </div>
                    
                  </div>
                  {/* <div className="flex gap-x-3 items-center justify-center">
                      <div className="h-14 w-14">
                        <img
                          src="data:image/png;base64,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"
                          alt=""
                        />
                      </div>
                      <div>
                        <h1 className="font-semibold text-md">Broto</h1>
                      </div> 
                    </div>*/}
                </div>
              </div>
            </div>

            {/* <div className="w-full mt-3 bg-white p-5">
              <ul className="flex justify-around">
                {["Post", "Followers", "Following"].map((el) => {
                  return (
                    <li className="cursor-pointer">
                      <span className="mr-2 cursor-pointer">0</span>
                      {el}
                    </li>
                  );
                })}
              </ul>
            </div> */}

          </div>
          <div className="mt-2">
           {
             ( data && data.about ) && (
                <About setContent={setModalContent} about={data.about} setModal={setShowModal}/>
             )
           }
          </div>
          <div className="mt-2">
          {
             ( data && data.experience.length > 0 ) && (
              <ExperiencesSection 
              setContent={setModalContent} 
              setModal={setShowModal} 
              experiences={data.experience}
              setIndex={setIndex}
              />
             )
           }
          
          </div>
          <div className="mt-2">
          {
             ( data && data.education.length > 0 ) && (
              <EducationSection setContent={setModalContent} setIndex={setIndex} setModal={setShowModal} educations={data.education} />
             )
           }
         
          </div>
          <div className="mt-2">
          {
             ( data && data.skills.length > 0 ) && (
              <SkillsSection skills={data.skills} setContent={setModalContent} setModal={setShowModal} />
             )
           }
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
