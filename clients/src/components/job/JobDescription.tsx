import React from "react";
import SideBar from "./Sidebar";
import {
  Coffee,
  Bus,
  Heart,
  Stethoscope,
  Waves,
  Video,
  Tent,
  ArrowRight,
} from "lucide-react";

const JobDescription: React.FC = () => {
  const benefits = [
    {
      icon: <Stethoscope size={24} className="text-orange-600"/>,
      title: "Full Healthcare",
      description:
        "We believe in thriving communities and that starts with our team being happy and healthy.",
    },
    {
      icon: <Waves size={24} className="text-orange-600"/>,
      title: "Unlimited Vacation",
      description:
        "We believe you should have a flexible schedule that makes space for family, wellness, and fun.",
    },
    {
      icon: <Video size={24} className="text-orange-600"/>,
      title: "Skill Development",
      description:
        "We believe in always learning and leveling up our skills. Whether it's a conference or online course.",
    },
    {
      icon: <Tent size={24} className="text-orange-600"/>,
      title: "Team Summits",
      description:
        "Every 6 months we have a full team summit where we have fun, reflect, and plan for the upcoming quarter.",
    },
    {
      icon: <Coffee size={24} className="text-orange-600" />,
      title: "Remote Working",
      description:
        "You know how you perform your best. Work from home, coffee shop or anywhere when you feel like it.",
    },
    {
      icon: <Bus size={24} className="text-orange-600" />,
      title: "Commuter Benefits",
      description:
        "We're grateful for all the time and energy each team member puts into getting to work every day.",
    },
    {
      icon: <Heart size={24} className="text-orange-600" />,
      title: "We give back.",
      description:
        "We anonymously match any donation our employees make (up to $/€ 600) so they can support the organizations they care about most-times two.",
    },
  ];

  return (
    <div>
      <div className="flex">
        <SideBar />
        <div className="flex-1">
          <div className=" mx-auto  p-8">
            <div className="bg-white rounded  overflow-hidden">
              <div className="bg-[#FFF8F3] p-11 ">
                <div className="bg-white border p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-600 rounded  flex items-center justify-center text-white text-2xl font-bold">
                      S
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Social Media Assistant
                      </h2>
                      <p className="text-sm text-gray-600">
                        Stripe • Paris, France • Full-Time
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                    </button>
                    <button className="bg-orange-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=" p-8 bg-white  rounded border-t">
            <div className="flex flex-col md:flex-row gap-8 ">
              <div className="flex-grow md:w-2/3">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-600 mb-6">
                  Stripe is looking for Social Media Marketing expert to help
                  manage our online networks. You will be responsible for
                  monitoring our social media channels, creating content,
                  finding effective ways to engage the community and incentivize
                  others to engage on our channels.
                </p>

                <h3 className="text-xl font-semibold mb-3">Responsibilities</h3>
                <ul className="space-y-2 mb-6">
                  {[
                    "Community engagement to ensure that is supported and actively represented online",
                    "Focus on social media content development and publication",
                    "Marketing and strategy support",
                    "Stay on top of trends on social media platforms, and suggest content ideas to the team",
                    "Engage with online communities",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <h3 className="text-xl font-semibold mb-3">Who You Are</h3>
                <ul className="space-y-2 mb-6">
                  {[
                    "You get energy from people and building the ideal work environment",
                    "You have a sense for beautiful spaces and office experiences",
                    "You are a confident office manager, ready for added responsibilities",
                    "You are detail-oriented and creative",
                    "You are a growth marketer and know how to run campaigns",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <h3 className="text-xl font-semibold mb-3">Nice-To-Haves</h3>
                <ul className="space-y-2">
                  {[
                    "Fluent in English",
                    "Project management skills",
                    "Copy editing skills",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:w-1/3">
                <h3 className="text-xl font-semibold mb-4">About this role</h3>
                <div className="bg-[#FFF8F3] p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">5 applied</span>
                    <span className="text-sm text-gray-600">
                      of 10 capacity
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: "50%" }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    ["Apply Before", "July 31, 2021"],
                    ["Job Posted On", "July 1, 2021"],
                    ["Job Type", "Full-Time"],
                    ["Salary", "$75k-$85k USD"],
                  ].map(([label, value], index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Project Management",
                    "Copywriting",
                    "English",
                    "Social Media Marketing",
                    "Copy Editing",
                  ].map((skill, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto p-8 bg-white border-t ">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Perks & Benefits
            </h2>
            <p className="text-gray-600 mb-8">
              This job comes with several perks and benefits
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={Date.now() + index} className="flex flex-col items-start">
                  <div className="text-indigo-600 mb-2">{benefit.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-white border">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold mr-3">
                    S
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Stripe</h2>
                    <a
                      href="#"
                      className="text-indigo-600 flex items-center hover:underline"
                    >
                      Read more about Stripe
                      <ArrowRight size={16} className="ml-1" />
                    </a>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Stripe is a technology company that builds economic
                  infrastructure for the internet. Businesses of every size—from
                  new startups to public companies—use our software to accept
                  payments and manage their businesses online.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="grid grid-cols-2 gap-4">
                  <img
                    src="/api/placeholder/600/400"
                    alt="Office space"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="grid grid-rows-2 gap-4">
                    <img
                      src="/api/placeholder/300/200"
                      alt="Team meeting"
                      className="w-full h-[5.5rem] object-cover rounded-lg"
                    />
                    <img
                      src="/api/placeholder/300/200"
                      alt="Brainstorming session"
                      className="w-full h-[5.5rem] object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
