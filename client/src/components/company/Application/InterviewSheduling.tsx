import React from "react";
import {
  MoreHorizontal,
  Calendar,
  Pencil,
  Clock,
  Eye,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Popover } from "@/components/ui/popover-dialog";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import InterviewSchedulerModal from "./InterviewShedulingModal";

type InterviewType = "WRITTEN" | "TECHNICAL" | "FINAL";

interface Interview {
  id: string;
  candidate: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  type: InterviewType;
  testName: string;
  schedule: {
    startTime: string;
    endTime: string;
    date: string;
  };
  location: {
    room: string;
    building: string;
  };
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  feedbackSubmitted: boolean;
}

const InterviewList: React.FC = () => {
  const interviews: Interview[] = [
    {
      id: "1",
      candidate: {
        id: "c1",
        name: "Kathryn Murphy",
        avatarUrl: "/api/placeholder/32/32",
      },
      type: "WRITTEN",
      testName: "Written Test",
      schedule: {
        startTime: "10:00 AM",
        endTime: "11:30 AM",
        date: "Tomorrow - 10 July, 2021",
      },
      location: {
        room: "Silver Crysta Room",
        building: "Nomad",
      },
      status: "PENDING",
      feedbackSubmitted: false,
    },
    {
      id: "2",
      candidate: {
        id: "c2",
        name: "Jenny Wilson",
        avatarUrl: "/api/placeholder/32/32",
      },
      type: "TECHNICAL",
      testName: "Written Test 2",
      schedule: {
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        date: "11 July, 2021",
      },
      location: {
        room: "Silver Crysta Room",
        building: "Nomad",
      },
      status: "PENDING",
      feedbackSubmitted: false,
    },
    {
      id: "3",
      candidate: {
        id: "c3",
        name: "Thad Eddings",
        avatarUrl: "/api/placeholder/32/32",
      },
      type: "TECHNICAL",
      testName: "Skill Test",
      schedule: {
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        date: "12 July, 2021",
      },
      location: {
        room: "Silver Crysta Room",
        building: "Nomad",
      },
      status: "PENDING",
      feedbackSubmitted: false,
    },
    {
      id: "4",
      candidate: {
        id: "c4",
        name: "Thad Eddings",
        avatarUrl: "/api/placeholder/32/32",
      },
      type: "FINAL",
      testName: "Final Test",
      schedule: {
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        date: "13 July, 2021",
      },
      location: {
        room: "Silver Crysta Room",
        building: "Nomad",
      },
      status: "PENDING",
      feedbackSubmitted: false,
    },
  ];

  const handleReschedule = (id: string) => {
    console.log("Reschedule interview:", id);
  };

  const handleCancel = (id: string) => {
    console.log("Cancel interview:", id);
  };

  const handleViewDetails = (id: string) => {
    console.log("View details:", id);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Interview Schedule
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your upcoming interviews and feedback
            </p>
          </div>
          <InterviewSchedulerModal />
        </div>
        <Separator className="my-4" />
      </div>

      <div className="space-y-6">
        {interviews.map((interview, index) => {
          const showDate =
            index === 0 ||
            interviews[index - 1].schedule.date !== interview.schedule.date;

          return (
            <React.Fragment key={interview.id}>
              {showDate && (
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mt-6 first:mt-0">
                  <Calendar className="w-4 h-4" />
                  {interview.schedule.date}
                </div>
              )}

              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={interview.candidate.avatarUrl}
                          alt={interview.candidate.name}
                          className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {interview.candidate.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {interview.testName}
                        </p>
                      </div>
                    </div>

                    <div className=" flex flex-col  text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {interview.schedule.startTime} -{" "}
                          {interview.schedule.endTime}
                        </span>
                      </div>
                      <div className="text-gray-500">
                        {interview.location.room}, {interview.location.building}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 border p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                        <Pencil className="w-4 h-4" />
                        Add Feedback
                      </button>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-2">
                          <div className="space-y-1">
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-sm"
                              onClick={() => handleReschedule(interview.id)}
                            >
                              <Clock className="w-4 h-4 mr-2" />
                              Reschedule
                            </Button>
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-sm"
                              onClick={() => handleViewDetails(interview.id)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleCancel(interview.id)}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel Interview
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default InterviewList;
