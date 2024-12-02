import React, { useEffect, useState } from "react";
import SidebarNavigation from "../job/Sidebar";
import {
  Search,
  Filter,
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useQuery } from "react-query";
import { ApplicationApi } from "@/api/application.api";
import { useNavigate, useParams } from "react-router-dom";

const Application: React.FC = () => {
  const [view, setView] = useState<"pipeline" | "table">("table");
  const [ data, setData ] = useState([])
  const { id } = useParams()
 const applications = useQuery({ queryKey: ['applications'], queryFn: () => ApplicationApi.getAllApplication(id)});
 const navigate = useNavigate();
 useEffect(() => {
    console.log(applications.data, id)
    const apiData = applications.data?.data
    if(apiData) {
      setData(apiData.applications)
    }
 }, [applications])
  interface Applicant {
    id: number;
    name: string;
    avatar: string;
    score: number;
    hiringStage: string;
    appliedDate: string;
    jobRole: string;
  }


  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "interview":
        return "text-orange-800 border-orange-100";
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
      <div className="flex-1">
        <div className="container mx-auto p-6">
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

          <div className="relative">
      <Table>
        <TableHeader className="border">
          <TableRow className="text-center">
            <TableHead className="w-[300px]">
              <div className="flex items-center space-x-2">
                <Checkbox />
                <span className="text-gray-500 font-medium">Full Name</span>
              </div>
            </TableHead>
            <TableHead className="text-gray-500 font-medium">Hiring Stage</TableHead>
            <TableHead className="text-gray-500 font-medium">Applied Date</TableHead>
            <TableHead className="text-gray-500 font-medium">Job Role</TableHead>
            <TableHead className="text-gray-500 font-medium text-center">Action</TableHead>
           
          </TableRow>
        </TableHeader>
        {/* Add a spacer div for margin */}
        <div className="h-4" />
        <TableBody className="border">
          { data.length > 0 ? (
            data.map((applicant, index) => (
              <TableRow key={applicant._id} className={`border-0 ${index % 2 ? "bg-[#F8F8FD]" : "bg-white"} hover:bg-slate-100`}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Checkbox />
                    <img
                      src={applicant.avatar}
                      alt={applicant.applicantId.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{applicant.applicantId.username}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-4 py-2 border-2 rounded-full text-sm ${getStageColor(
                      applicant.status
                    )}`}
                  >
                    {applicant.status}
                  </span>
                </TableCell>
                <TableCell>{applicant.appliedAt}</TableCell>
                <TableCell>{applicant.jobId.jobTitle}</TableCell>
                <TableCell className="flex justify-between">
                  <Button 
                   onClick={() => {
                    navigate(`/company/application/applicant/${applicant._id}`);
                   }} 
                    variant="secondary" 
                    className="py-5 px-5 text-white border-2 bg-orange-500 hover:bg-white:border-2 hover:text-orange-500 hover:border-orange-500"
                  >
                    See Application
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : <></>
          }
        </TableBody>
      </Table>
    </div>

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
