import React from "react";
import {
  Eye,
  Settings,
  Flame,
  Users,
  MapPin,
  Building2,
  ArrowRight,
  Edit,
  Plus,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  Instagram,
} from "lucide-react";

import SidebarNavigation from "../job/Sidebar";
import { FaRegComment } from "react-icons/fa";

const CompanyProfile: React.FC = () => {
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
    <div className="h-screen">
      <div className="flex">
        <SidebarNavigation />

        <div className="flex-1 max-w-4xl border-r">
          <div className=" py-6 px-8 bg-white border-b">
            <div className="flex flex-col md:flex-row items-start  justify-between mb-6">
              <div className="flex flex-1 gap-x-5 items-center mb-4 md:mb-0">
                <div className="relative w-32 h-32 mr-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg"></div>
                  <div className="absolute inset-1 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-emerald-500 font-bold text-3xl">
                      N
                    </span>
                  </div>
                  <button className="absolute -top-2 -left-2 bg-white rounded-full p-1 shadow-md">
                    <Edit size={12} className="text-gray-600" />
                  </button>
                </div>
                <div className="flex flex-1 gap-y-7">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">Nomad</h1>
                    <a
                      href="https://nomad.com"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      https://nomad.com
                    </a>
                  </div>
                  <div className="flex flex-1 space-x-2  self-start justify-end">
                    <button className="inline-flex items-center gap-x-2 px-8 py-2 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200">
                      <Eye size={16} />
                      Public View
                    </button>
                    <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                      <Settings size={16} className="mr-2" />
                      Profile Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex border-b py-3 px-8 gap-x-16 text-base font-bold ">
            <h1>Home</h1>
            <h1>About</h1>
            <h1>Jobs</h1>
            <h1>Posts</h1>
            <h1>Peoples</h1>
          </div>

          <div className=" p-6 bg-white rounded border-b">
            <div className="flex gap-8">
              <div className="">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">About</h2>
                  
                </div>
                <p className="text-gray-600 mb-6">
                  Nomad is a software platform for starting and running internet
                  businesses. Millions of businesses rely on Stripe's software
                  tools to accept payments, expand globally, and manage their
                  businesses online. Stripe has been at the forefront of
                  expanding internet commerce, powering new business models, and
                  supporting the latest platforms, from marketplaces to mobile
                  commerce sites. We believe that growing the GDP of the
                  internet is a problem rooted in code and design, not finance.
                  Stripe is built for developers, makers, and creators. We work
                  on solving the hard technical problems necessary to build
                  global economic infrastructure: from designing highly reliable
                  systems to developing advanced machine learning algorithms to
                  prevent fraud.
                </p>
              </div>
            </div>
          </div>

          <div className=" px-8 bg-white  rounded py-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Page posts</h2>
              <div className="flex space-x-2">
                <button className="p-1 rounded-full bg-gray-200 hover:bg-gray-300">
                  <ChevronLeft size={20} />
                </button>
                <button className="p-1 rounded-full bg-gray-200 hover:bg-gray-300">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {posts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <div>
                        <p className="font-semibold">{post.author}</p>
                        <p className="text-sm text-gray-500">
                          {post.followers}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{post.time}</span>
                      <button>
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                  </div>
                  <p className="mb-2">{post.content}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    {post.description}
                  </p>
                  <img
                    src={post.image}
                    alt="Post image"
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                  <div className="flex items-center justify-between text-gray-500 text-sm">
                    <div className="flex space-x-4">
                      <button className="flex items-center space-x-1">
                        <ThumbsUp size={16} />
                        <span>Like</span>
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1">
                        <MessageSquare size={16} />
                        <span>Comment</span>
                      </button>
                      <button className="flex items-center space-x-1">
                        <Repeat2 size={16} />
                        <span>Repost</span>
                      </button>
                      <button className="flex items-center space-x-1">
                        <Send size={16} />
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-4 space-x-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === 0 ? "bg-orange-600" : "bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>

            <button className="w-full mt-4 py-2 text-orange-600 font-semibold hover:bg-gray-100 rounded">
              Show all posts →
            </button>
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
      </div>
    </div>
  );
};

export default CompanyProfile;


