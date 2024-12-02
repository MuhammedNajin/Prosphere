import React, { useState } from "react";
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
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const HiringStage = () => {
  const { applicant } = useOutletContext();
  const [currentStatus, setCurrentStatus] = useState(applicant?.stage || 'interview');

  const notes = [
    {
      id: 1,
      author: "Maria Kelly",
      date: "10 July, 2021",
      time: "11:30 AM",
      content:
        "Please, do an interview stage immediately. The design division needs more new employee now",
      replies: 2,
    },
    {
      id: 2,
      author: "Maria Kelly",
      date: "10 July, 2021",
      time: "10:30 AM",
      content: "Please, do an interview stage immediately.",
      replies: 0,
    },
  ];

  const stages = [
    { id: 1, name: 'In-Review', status: 'completed' },
    { id: 2, name: 'Shortlisted', status: 'completed' },
    { id: 3, name: 'Interview', status: 'current' },
    { id: 4, name: 'Hired', status: 'upcoming' }
  ];

  return (
    <main className="flex flex-col items-center p-6 bg-white border border-solid border-zinc-200 max-w-[718px]">
      <div className="flex flex-col mt-6 max-w-full min-h-[782px] w-[672px]">
        <section className="flex flex-col w-full max-w-2xl max-md:max-w-full">
          <div className="flex flex-wrap gap-10 justify-between items-center leading-relaxed max-md:max-w-full">
            <h2 className="self-stretch my-auto text-lg font-semibold text-slate-800">
              Current Stage
            </h2>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Application Status</SelectLabel>
                  <div
                    className={`hover:bg-backgroundAccent cursor-pointer relative flex w-full  select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 `}
                  >
                    <StatusChangeDialog status="Inreview" />
                  </div>
                  <div
                    className={`hover:bg-backgroundAccent cursor-pointer relative flex w-full  select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 `}
                  >
                     <StatusChangeDialog status='Shortlisted' />
                  </div>
                  <div
                    className={`hover:bg-backgroundAccent cursor-pointer relative flex w-full  select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 `}
                  >
                   <StatusChangeDialog status='Rejected' />
                  </div>
                  <div
                    className={`hover:bg-backgroundAccent cursor-pointer relative flex w-full  select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 `}
                  >
                    <StatusChangeDialog status="Interview" />
                  </div>
                  <div
                    className={`hover:bg-backgroundAccent cursor-pointer relative flex w-full  select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 `}
                  >
                     <StatusChangeDialog status='Selected' />
                  </div>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Enhanced Progress Tracker */}
          <div className="w-full max-w-2xl mx-auto mt-8">
            <div className="relative w-full">
      
              <div className="absolute top-1/3 left-0 w-full mx-auto h-1 bg-gray-200 transform -translate-y-1/2">
                <div 
                  className="absolute top-0 left-0 h-full bg-orange-700 transition-all duration-500"
                  style={{ 
                    width: `${((stages.findIndex(s => s.status === 'current')) / (stages.length - 1)) * 100}%` 
                  }}
                />
              </div>

              {/* Stages */}
              <div className="relative z-10 flex justify-between ">
                {stages.map((stage, index) => (
                  <div key={stage.id} className={`flex flex-col `}>
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center 
                      ${stage.status === 'completed' ? 'bg-orange-700' : 
                        stage.status === 'current' ? 'bg-orange-700' : 'bg-gray-200'}
                        
                      transition-all duration-300
                    `}>
                      {stage.status === 'completed' && (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      )}
                      {stage.status === 'current' && (
                        <Circle className="w-6 h-6 text-white fill-orange-700" />
                      )}
                      {stage.status === 'upcoming' && (
                        <Clock className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="mt-2 text-sm font-medium text-center">
                      <span className={`
                        ${stage.status === 'completed' ? 'text-orange-700' : 
                          stage.status === 'current' ? 'text-orange-700' : 'text-gray-400'}
                      `}>
                        {stage.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stage Info Section */}
          <div className="flex flex-col mt-5 max-w-full w-[538px]">
            <h3 className="text-base font-semibold leading-relaxed text-slate-800">
              Stage Info
            </h3>
            <div className="flex flex-wrap gap-10 justify-between items-start mt-2 w-full">
              <div className="flex flex-col items-start text-base min-w-[240px] w-[267px]">
                <div className="flex flex-col leading-relaxed">
                  <span className="text-slate-500">Interview Date</span>
                  <span className="font-medium text-slate-800">
                    10 - 13 July 2021
                  </span>
                </div>
                <div className="flex flex-col self-stretch mt-6 w-full">
                  <span className="leading-relaxed text-slate-500">
                    Interview Location
                  </span>
                  <address className="font-medium leading-7 text-slate-800 not-italic">
                    Silver Crysta Room, Nomad Office
                    <br />
                    3517 W. Gray St. Utica, Pennsylvania 57867
                  </address>
                </div>
              </div>
              <div className="flex flex-col items-start leading-relaxed w-[218px]">
                <div className="flex flex-col">
                  <span className="text-base text-slate-500">
                    Interview Status
                  </span>
                  <span className="gap-2 self-start px-2.5 py-1.5 text-sm font-semibold text-amber-400 bg-orange-400 bg-opacity-10 rounded-[80px]">
                    On Progress
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notes Section */}
        <hr className="mt-4 w-full bg-zinc-200 min-h-[1px]" />
        <section className="flex overflow-hidden flex-col mt-4 w-full max-w-2xl leading-relaxed max-md:max-w-full">
          <div className="flex gap-10 justify-between items-center w-full text-base max-md:max-w-full">
            <h3 className="self-stretch my-auto font-semibold text-slate-800">
              Notes
            </h3>
            <button className="flex gap-2.5 justify-center items-center self-stretch py-3 pl-4 my-auto font-bold text-center text-indigo-600">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/eab9a436b204bad0bf4c273d8a0e800e60119e13bb399afa757f1095014a2917?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732"
                alt=""
                className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
              />
              <span className="self-stretch my-auto">Add Notes</span>
            </button>
          </div>

          {/* Notes List */}
          {notes.map((note) => (
            <article key={note.id} className="flex flex-wrap gap-4 items-start p-4 mt-4 bg-white border border-solid border-zinc-200">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/7848115779a2211fa8750ee584ca6769967553bc9f5571cad7eb5b7ecd9ced42?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732"
                alt={`${note.author}'s avatar`}
                className="object-contain shrink-0 w-10 aspect-square"
              />
              <div className="flex flex-col flex-1 shrink basis-0 min-w-[240px] max-md:max-w-full">
                <div className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
                  <h4 className="self-stretch my-auto text-base font-semibold text-slate-800">
                    {note.author}
                  </h4>
                  <time className="flex gap-2 justify-center items-center self-stretch my-auto text-sm text-slate-500">
                    <span className="self-stretch my-auto">{note.date}</span>
                    <span className="self-stretch my-auto">{note.time}</span>
                  </time>
                </div>
                <p className="mt-2 text-base leading-7 text-slate-600 max-md:max-w-full">
                  {note.content}
                </p>
                {note.replies > 0 && (
                  <span className="mt-2 text-base font-semibold text-indigo-600 max-md:max-w-full">
                    {note.replies} {note.replies === 1 ? "Reply" : "Replies"}
                  </span>
                )}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};

export default HiringStage;