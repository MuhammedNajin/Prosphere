import React, { useEffect, useState } from "react";
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
  const { id } = useParams();
  const { data, isError } = useQuery(
    ["fetchJobs", id],
    () => JobApi.getJobs(id!),
    {}
  );

  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between">
      </div>
      <div className="w-full p-2 mt-2 ">
      </div>
      <div className="w-full p-4 mt-2 border">
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
  );
};

export default CompanyManagemnet;
