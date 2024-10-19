import React, { useState } from "react";
import SidebarNavigation from "../job/Sidebar";
import {
  Search,
  Filter,
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Application: React.FC = () => {
  const [view, setView] = useState<"pipeline" | "table">("table");

  interface Applicant {
    id: number;
    name: string;
    avatar: string;
    score: number;
    hiringStage: string;
    appliedDate: string;
    jobRole: string;
  }

  const applicants: Applicant[] = [
    {
      id: 1,
      name: "Jake Gyll",
      avatar: "/api/placeholder/30/30",
      score: 0,
      hiringStage: "Interview",
      appliedDate: "13 July, 2021",
      jobRole: "Designer",
    },
    {
      id: 2,
      name: "Guy Hawkins",
      avatar: "/api/placeholder/30/30",
      score: 0,
      hiringStage: "Interview",
      appliedDate: "13 July, 2021",
      jobRole: "JavaScript Dev",
    },
    {
      id: 3,
      name: "Cyndy Lillibridge",
      avatar: "/api/placeholder/30/30",
      score: 4.6,
      hiringStage: "Shortlisted",
      appliedDate: "12 July, 2021",
      jobRole: "Golang Dev",
    },
    {
      id: 4,
      name: "Rodolfo Goode",
      avatar: "/api/placeholder/30/30",
      score: 3.75,
      hiringStage: "Declined",
      appliedDate: "11 July, 2021",
      jobRole: ".NET Dev",
    },
    {
      id: 5,
      name: "Leif Floyd",
      avatar: "/api/placeholder/30/30",
      score: 4.8,
      hiringStage: "Hired",
      appliedDate: "11 July, 2021",
      jobRole: "Graphic Design",
    },
    {
      id: 6,
      name: "Jenny Wilson",
      avatar: "/api/placeholder/30/30",
      score: 4.6,
      hiringStage: "Hired",
      appliedDate: "9 July, 2021",
      jobRole: "Designer",
    },
    {
      id: 7,
      name: "Jerome Bell",
      avatar: "/api/placeholder/30/30",
      score: 4.0,
      hiringStage: "Interviewed",
      appliedDate: "5 July, 2021",
      jobRole: "Designer",
    },
    {
      id: 8,
      name: "Eleanor Pena",
      avatar: "/api/placeholder/30/30",
      score: 3.9,
      hiringStage: "Declined",
      appliedDate: "5 July, 2021",
      jobRole: "Designer",
    },
    {
      id: 9,
      name: "Darrell Steward",
      avatar: "/api/placeholder/30/30",
      score: 4.2,
      hiringStage: "Shortlisted",
      appliedDate: "3 July, 2021",
      jobRole: "Designer",
    },
    {
      id: 10,
      name: "Floyd Miles",
      avatar: "/api/placeholder/30/30",
      score: 4.1,
      hiringStage: "Interviewed",
      appliedDate: "1 July, 2021",
      jobRole: "Designer",
    },
  ];

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "interview":
        return "bg-orange-100 text-orange-800";
      case "shortlisted":
        return "bg-purple-100 text-purple-800";
      case "declined":
        return "bg-red-100 text-red-800";
      case "hired":
        return "bg-green-100 text-green-800";
      case "interviewed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div className="flex">
      <SidebarNavigation />
      <div className="flex-1">
        <div className="container mx-auto p-6 bg-white">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold">Total Applicants: 19</h1>
            <div className="flex space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Applicants"
                  className="pl-10 pr-4 py-2 border rounded-md"
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={20}
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border rounded-md">
                <Filter size={20} />
                <span>Filter</span>
              </button>
              <div className="flex border rounded-md">
                <button
                  className={`px-4 py-2 ${
                    view === "pipeline"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-white"
                  }`}
                  onClick={() => setView("pipeline")}
                >
                  Pipeline View
                </button>
                <button
                  className={`px-4 py-2 ${
                    view === "table"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-white"
                  }`}
                  onClick={() => setView("table")}
                >
                  Table View
                </button>
              </div>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-left font-medium text-gray-500">
                  <input type="checkbox" className="mr-2" />
                  Full Name
                </th>
                <th className="pb-2 text-left font-medium text-gray-500">
                  Score
                </th>
                <th className="pb-2 text-left font-medium text-gray-500">
                  Hiring Stage
                </th>
                <th className="pb-2 text-left font-medium text-gray-500">
                  Applied Date
                </th>
                <th className="pb-2 text-left font-medium text-gray-500">
                  Job Role
                </th>
                <th className="pb-2 text-left font-medium text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((applicant) => (
                <tr key={applicant.id} className="border-b last:border-b-0">
                  <td className="py-4 flex items-center space-x-2">
                    <input type="checkbox" />
                    <img
                      src={applicant.avatar}
                      alt={applicant.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{applicant.name}</span>
                  </td>
                  <td className="py-4">
                    {applicant.score > 0 ? (
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-yellow-300 mr-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                        <span>{applicant.score.toFixed(1)}</span>
                      </div>
                    ) : (
                      <span>{applicant.score.toFixed(1)}</span>
                    )}
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStageColor(
                        applicant.hiringStage
                      )}`}
                    >
                      {applicant.hiringStage}
                    </span>
                  </td>
                  <td className="py-4">{applicant.appliedDate}</td>
                  <td className="py-4">{applicant.jobRole}</td>
                  <td className="py-4">
                    <button className="px-4 py-2 bg-purple-100 text-purple-800 rounded-md">
                      See Application
                    </button>
                  </td>
                  <td className="py-4">
                    <button>
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center space-x-2">
              <span>View</span>
              <select className="border rounded-md px-2 py-1">
                <option>10</option>
              </select>
              <span>Applicants per page</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 border rounded-md">
                <ChevronLeft size={20} />
              </button>
              <button className="px-3 py-1 bg-purple-100 text-purple-800 rounded-md">
                1
              </button>
              <button className="px-3 py-1 border rounded-md">2</button>
              <button className="p-2 border rounded-md">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default Application;
