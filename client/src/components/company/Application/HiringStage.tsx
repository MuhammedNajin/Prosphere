import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusChangeDialog } from "./ApplicationStatusChangeModal";
import { useOutletContext } from "react-router-dom";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import {  ApplicationStatus } from "@/types/application";
import { ApplicantProp } from "@/types/company";

const HiringStage = () => {
  const { applicant } = useOutletContext<ApplicantProp>();
  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>(applicant?.status as ApplicationStatus);
  const [isAnimating, setIsAnimating] = useState(false);

  const statusToStage = useMemo(() => ({
    inreview: 1,
    shortlisted: 2,
    interview: 3,
    selected: 4,
    rejected: -1,
    applied: 0,
    All: 0
  }), []);

  const stages = useMemo(() => {
    const currentStage = statusToStage[currentStatus];
    
    return [
      { 
        id: 1, 
        name: "In-Review", 
        status: currentStage > 1 ? "completed" : currentStage === 1 ? "current" : "upcoming"
      },
      { 
        id: 2, 
        name: "Shortlisted", 
        status: currentStage > 2 ? "completed" : currentStage === 2 ? "current" : "upcoming"
      },
      { 
        id: 3, 
        name: "Interview", 
        status: currentStage > 3 ? "completed" : currentStage === 3 ? "current" : "upcoming"
      },
      { 
        id: 4, 
        name: "Hired", 
        status: currentStage === 4 ? "current" : "upcoming"
      },
    ];
  }, [currentStatus, statusToStage]);

  const statuses = useMemo(
    () => ["inreview", "shortlisted", "interview", "selected", "rejected"],
    []
  );

  useEffect(() => {
    setCurrentStatus(applicant?.status as ApplicationStatus);
  }, [applicant]);

  const getHoverColor = useCallback((status: ApplicationStatus) => {
    const colors: Record<ApplicationStatus, string> = {
      inreview: "hover:bg-blue-100",
      shortlisted: "hover:bg-green-100",
      rejected: "hover:bg-red-100",
      interview: "hover:bg-purple-100",
      selected: "hover:bg-emerald-100",
      All: "hover:bg-gray-100",
      applied: "hover:bg-yellow-100",
    };
    return colors[status];
  }, []);

  const progressWidth = useMemo(() => {
    if (currentStatus === "rejected") return "0%";
    const currentStage = statusToStage[currentStatus];
    const totalStages = Object.keys(statusToStage).length - 1;
    const progress = ((currentStage - 1) / (totalStages - 1)) * 100;
    return `${Math.max(0, Math.min(100, progress))}%`;
  }, [currentStatus, statusToStage]);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1500); // Increased animation duration
    return () => clearTimeout(timer);
  }, [currentStatus]);

  const renderStageIcon = useCallback((status: string) => {
    switch (status) {
      case "completed":
        return (
          <CheckCircle2 
            className={`w-6 h-6 text-white transition-all duration-500 ${
              isAnimating ? 'animate-bounce-gentle' : ''
            }`}
          />
        );
      case "current":
        return (
          <Circle 
            className={`w-6 h-6 text-white fill-orange-700 transition-all duration-500 ${
              isAnimating ? 'animate-pulse-scale' : ''
            }`} 
          />
        );
      case "upcoming":
        return <Clock className="w-6 h-6 text-gray-400" />;
      default:
        return null;
    }
  }, [isAnimating]);

  return (
    <main className="flex flex-col items-center p-4 bg-white border-solid border-zinc-200">
      <div className="flex flex-col mt-6 min-w-full min-h-[782px]">
        <section className="flex flex-col w-full max-w-2xl max-md:max-w-full">
          <div className="flex flex-wrap gap-10 justify-between items-center leading-relaxed max-md:max-w-full">
            <h2 className="self-stretch my-auto text-lg font-semibold text-slate-800">
              Current Stage
            </h2>
            <Select>
              <SelectTrigger className="w-[120px] border-orange-700 bg-white text-orange-600">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Application Status</SelectLabel>
                  {statuses.map((status, index: number) => (
                    <div
                      key={status}
                      className={`cursor-pointer relative flex w-full select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${getHoverColor(
                        status as ApplicationStatus
                      )}`}
                    >
                      <StatusChangeDialog
                        status={status as ApplicationStatus}
                        currentStatus={currentStatus}
                        index={index}
                        key={index + Date.now()}
                        setCurrentStatus={setCurrentStatus}
                      />
                    </div>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full mx-auto mt-8">
            <div className="relative w-full">
              <div className="absolute top-1/3 left-0 w-full mx-auto h-1 bg-gray-200 transform -translate-y-1/2">
                <div
                  className={`absolute top-0 left-0 h-full bg-orange-700 transition-all duration-1000 ease-in-out ${
                    isAnimating ? 'progress-animate' : ''
                  }`}
                  style={{ 
                    width: progressWidth,
                    boxShadow: isAnimating ? '0 0 15px rgba(234, 88, 12, 0.6)' : 'none'
                  }}
                />
              </div>

              <div className="relative z-10 flex justify-between">
                {stages.map((stage) => (
                  <div 
                    key={stage.id} 
                    className={`flex flex-col transform transition-all duration-500 ${
                      stage.status === "current" && isAnimating ? 'scale-110' : 'scale-100'
                    }`}
                  >
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center 
                        transition-all duration-500 ease-in-out
                        ${
                          stage.status === "completed" ||
                          stage.status === "current"
                            ? "bg-orange-700"
                            : "bg-gray-200"
                        }
                        ${stage.status === "current" && isAnimating ? 'ring-4 ring-orange-200 animate-ping-gentle' : ''}
                      `}
                    >
                      {renderStageIcon(stage.status)}
                    </div>
                    <div className="mt-2 text-sm font-medium text-center">
                      <span
                        className={`
                          transition-colors duration-500
                          ${
                            stage.status === "completed" ||
                            stage.status === "current"
                              ? "text-orange-700"
                              : "text-gray-400"
                          }
                        `}
                      >
                        {stage.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes progressAnimate {
          0% {
            transform: scaleY(1);
            opacity: 0.7;
          }
          50% {
            transform: scaleY(1.5);
            opacity: 1;
          }
          100% {
            transform: scaleY(1);
            opacity: 0.7;
          }
        }

        .progress-animate {
          animation: progressAnimate 1.1s ease-in-out;
        }

        @keyframes pingGentle {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-ping-gentle {
          animation: pingGentle 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes bounceGentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }

        .animate-bounce-gentle {
          animation: bounceGentle 1s ease-in-out infinite;
        }

        @keyframes pulseScale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .animate-pulse-scale {
          animation: pulseScale 1s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
};

export default React.memo(HiringStage);