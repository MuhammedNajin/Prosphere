import React, { useEffect, useState } from "react";
import { Sidebar, SidebarItem, SidebarItemWrapper } from "../sidebar";
import { Home, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateJob from "../job/CreateJobModal";
import { FaPlus } from "react-icons/fa";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IoFilterOutline } from "react-icons/io5";
import { JobApi } from "@/api";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";

const CompanyManagemnet: React.FC = () => {
  const [isOpen, setOpen] = useState(false);
  const { id } = useParams();
  const { data } = useQuery(["fetchJobs", id], () => JobApi.getJobs(id!), {});

  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <div className="w-full mt-3 mx-auto px-5">
      <CreateJob isOpen={isOpen} onClose={setOpen} />
      <div className="flex">
        <Sidebar
          className="max-w-64 bg-white rounded flex flex-col p-2 items-center gap-y-4"
          Header={
            <div className="flex w-full items-center rounded-sm hover:bg-[#e1e2e3] hower:scale(-1) ">
              <img src="/Loginpage.image.png" className="w-14 h-14" alt="" />
              <h1 className="font-semibold text-ls p-2">Company Admin</h1>
            </div>
          }
        >
          <SidebarItemWrapper className="flex flex-col gap-y-5 w-64">
            <SidebarItem
              className="flex px-3 hover:text-black"
              icon={
                <Home
                  className="mr-2 text-zinc-500 hover:text-black"
                  size={20}
                />
              }
              label="Dashboard"
            />
            <SidebarItem
              className="flex px-3 "
              icon={<Home className="mr-2 text-zinc-500" size={20} />}
              label="Company Profile"
            />
            <SidebarItem
              className="flex px-3 "
              icon={<Home className="mr-2 text-zinc-500" size={20} />}
              label="All Application"
            />
            <SidebarItem
              className="flex px-3 "
              icon={<Users className="mr-2 text-zinc-500" size={20} />}
              label="Job Listing"
              badge={4}
            />
          </SidebarItemWrapper>
        </Sidebar>
        <div className="w-full p-2 mx-2">
          <div className="flex justify-between">
            <div className="flex">
              <div className="w-12">
                <img src="/Loginpage.image.png" alt="" />
              </div>
              <div className="ml-2">
                <h1 className="text-zinc-400 text-sm">Company</h1>
                <h1 className="font-bold text-ms">Brototype</h1>
              </div>
            </div>
            <div>
              <Button
                className="bg-orange-600 text-white border border-orange-500 hover:bg-orange-600 hover:text-white rounded-none inline-flex gap-x-2 shadow"
                onClick={(e) => setOpen(!isOpen)}
              >
                <FaPlus />
                Create job
              </Button>
            </div>
          </div>
          <div className="w-full p-2 mt-2 ">
            <div>
              <h1 className="font-bold text-2xl">Job Listing</h1>
            </div>
          </div>
          <div className="w-full p-2 mt-2">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold">Job List</h1>
              <Select>
                <SelectTrigger
                  icon={<IoFilterOutline className="size-5" />}
                  className="w-28 bg-[#f2f3f4] gap-x-3 items-center justify-center flex-row-reverse"
                >
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="">
                  <TableHead className="w-[100px]">Roles</TableHead>
                  <TableHead>Eployment</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Experience</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data &&
                  data.jobs.map((el) => (
                    <TableRow className="border-b-0">
                      <TableCell className="font-medium">{el.jobTitle}</TableCell>
                      <TableCell>{el.employment}</TableCell>
                      <TableCell>{el.jobLocation}</TableCell>
                      <TableCell className="text-right">{el.experience}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyManagemnet;
