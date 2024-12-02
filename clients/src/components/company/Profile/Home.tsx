import {
  ChevronLeft,
  ChevronRight,
  Instagram,
  Linkedin,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Repeat2,
  Send,
  ThumbsUp,
} from "lucide-react";
import React from "react";
import { FaRegComment } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";

const Home: React.FC = () => {
  const posts = [
    {
      id: 1,
      author: "Brotype",
      followers: "40,371 followers",
      time: "3d",
      content: "Meet Devika Nakulan!",
      description: "With a BCA degree and expertise in the ...",
      image: "/api/placeholder/400/320",
      likes: 92,
    },
    {
      id: 2,
      author: "Brotype",
      followers: "40,371 followers",
      time: "1w",
      content: "Brocamp Alumni Connect",
      description: "Offline interactive session with Mr. Gladson ...",
      image: "/api/placeholder/400/320",
      likes: 70,
    },
  ];

  const teamMembers = [
    {
      name: "Célestin Gardinier",
      role: "CEO & Co-Founder",
      imageUrl: "/api/placeholder/100/100",
      instagramUrl: "#",
      linkedinUrl: "#",
    },
    {
      name: "Reynaud Colbert",
      role: "Co-Founder",
      imageUrl: "/api/placeholder/100/100",
      instagramUrl: "#",
      linkedinUrl: "#",
    },
    {
      name: "Arienne Lyon",
      role: "Managing Director",
      imageUrl: "/api/placeholder/100/100",
      instagramUrl: "#",
      linkedinUrl: "#",
    },
  ];
  const { companyProfile } = useOutletContext()
  const jobs = [
    {
      title: "Social Media Assistant",
      company: "Nomad",
      location: "Paris, France",
      logo: "N",
      logoColor: "bg-emerald-500",
    },
    {
      title: "Brand Designer",
      company: "Dropbox",
      location: "San Fransisco, USA",
      logo: "D",
      logoColor: "bg-blue-500",
    },
    {
      title: "Interactive Developer",
      company: "Terraform",
      location: "Hamburg, Germany",
      logo: "T",
      logoColor: "bg-cyan-500",
    },
  ];

  return (
    <div>
      <div className=" p-6 bg-white rounded border-b">
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">About</h2>
            </div>
           { companyProfile?.description ? (
              <p className="text-gray-600 mb-6">
              { companyProfile?.description }
             </p>
           ): (
            <div className="p-5 flex basis-full justify-between bg-[#f8f9fa] border my-4 rounded-lg items-center">
                <div>
                  <h1 className="text-lg font-clash font-bold">Description</h1>
                  <p className="text-sm">
                    Add a description about your company
                  </p>
                </div>
              </div>
           )
           }
          </div>
        </div>
      </div>

      <div className=" px-8 bg-white  rounded py-4">
       
      </div>


      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold ">Team</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {teamMembers.map((member, index) => (
            <div className="bg-white p-4 rounded border  flex flex-col items-center">
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-24 h-24 rounded-full mb-4 object-cover"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {member.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{member.role}</p>
              <div className="flex space-x-2">
                {member.instagramUrl && (
                  <a
                    href={member.instagramUrl}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Instagram size={20} />
                  </a>
                )}
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Linkedin size={20} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 py-2 text-orange-600 font-semibold hover:bg-gray-100 rounded">
          View all members →
        </button>
      </div>

      <div className="px-8 py-4 ">
        <div className="text-2xl font-bold mb-4">
          <h1>Job openings</h1>
        </div>
        <div className="flex gap-x-4">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="border p-8 rounded flex items-center justify-between"
            >
              <div className="flex  space-x-4">
                <div className="w-12 h-12 mt-3 flex items-center justify-center bg-gray-200 rounded-lg text-2xl">
                  <img
                    src="/company.png"
                    alt=""
                    className="object-contain overflow-hidden"
                  />
                </div>
                <div className="flex flex-col gap-y-1">
                  <h3 className="text-lg font-bold">{job.title}</h3>
                  <p className="text-sm text-[#7C8493]">
                    {job.company} • {job.location}
                  </p>
                  <div className="flex items-center gap-x-3 space-x-2 ">
                    <span className="bg-[#56CDAD1A]  text-[#56CDAD] text-xs px-3 py-3 rounded-full">
                      Full Time
                    </span>
                    <ThumbsUp />
                    <FaRegComment className="size-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
