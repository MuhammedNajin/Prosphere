import React, { useState } from "react";
import JobUpdates from "./JobCard";
import TotalJobsApplied from "./TotalJobsApplied.tsx";
import JobsAppliedStatus from "./TotalJobsApplied.tsx";
import UpcomingInterviews from "./UpcomingInterviews.tsx";
import RecentApplicationsHistory from "./RecentApplicationsHistory.tsx";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart.tsx";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar.tsx";
import test from "node:test";
import YearPicker from "@/components/common/DatePicker/YearPicker.tsx";
import MonthYearPicker from "@/test.tsx";
import WeekPicker from "@/components/common/DatePicker/WeekPicker.tsx";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("week");
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const stats = [
    {
      count: 76,
      title: "New candidates to review",
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/18e839e282525adda515e2efa073d09607f4f5abea2a3f99a2834204105ec623?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732",
      bgColor: "bg-indigo-600 text-white",
    },
    {
      count: 3,
      title: "Schedule for today",
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/b9a465b44902e234c8e36e22b829c40b6512e1fdd7d225dd27bfb1727fa78c02?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732",
      bgColor: "bg-emerald-300 text-white",
    },
    {
      count: 24,
      title: "Messages received",
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/c5c3403c69c7945b73de5a8fabefbc27ef02fce2cbbf25baafbe44ce4ab71874?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732",
      bgColor: "bg-sky-400 text-white",
    },
  ];

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  };

  return (
    <main className="flex flex-col bg-white">
      <header className="flex flex-col pb-6">
        <div className="flex flex-1 flex-wrap gap-10 justify-between items-center p-8">
          <div className="flex flex-col self-stretch my-auto min-w-[240px]">
            <h1 className="text-2xl font-semibold leading-tight text-slate-800">
              Good morning, Maria
            </h1>
            <p className="mt-2 text-base font-medium leading-relaxed text-slate-500 ">
              Here is your job listings statistic report from July 19 - July 25.
            </p>
          </div>
          <div className="flex gap-7 justify-between items-center self-stretch px-4 py-3 my-auto text-base leading-relaxed bg-white border border-solid border-zinc-200 text-slate-800 w-[180px]">
            <span className="self-stretch my-auto">Jul 19 - Jul 25</span>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/bb4ef2bacf14cf777b13b4dc7d3471f64c3cfd92bb502e18601c475e521baa85?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732"
              className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
              alt=""
            />
          </div>
        </div>
      </header>
      <section className="flex flex-col  mx-auto">
        <div className="flex flex-wrap gap-6 items-start text-white ">
          {stats.map(({ count, title, iconSrc, bgColor }, index) => (
            <div
              className={`flex gap-3.5 items-center p-6 ${bgColor} min-w-[240px] max-md:px-5`}
            >
              <span className="self-stretch my-auto text-5xl font-semibold leading-none max-md:text-4xl">
                {count}
              </span>
              <p className="my-auto text-lg font-medium leading-7 w-[200px]">
                {title}
              </p>
              <img
                loading="lazy"
                src={iconSrc}
                className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
                alt=""
              />
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-wrap gap-6 items-start px-8 pb-8 max-md:px-5 ">
        <section className="flex overflow-hidden flex-col pb-6 bg-white border border-solid border-zinc-200 min-w-[240px] w-[728px] ">
          <div className="flex flex-col first-letter:justify-between  pt-6 w-full ">
            <div className="flex justify-between">
              <div className="flex flex-col self-stretch pl-3">
                <h2 className="text-xl font-semibold leading-tight text-slate-800">
                  Job statistics
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  Showing Jobstatistic Jul 19-25
                </p>
              </div>
              <div className="self-end">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList>
                    <TabsTrigger
                      value="week"
                      className={`px-4 py-2 rounded-t-md ${
                        activeTab === "week"
                          ? "bg-blue-500 text-white"
                          : "bg-white hover:bg-white"
                      }`}
                    >
                      Week
                    </TabsTrigger>
                    <TabsTrigger
                      value="month"
                      className={`px-4 py-2 rounded-t-md ${
                        activeTab === "month"
                          ? "bg-blue-500 text-white"
                          : "bg-white hover:bg-white"
                      }`}
                    >
                      Month
                    </TabsTrigger>
                    <TabsTrigger
                      value="year"
                      className={`px-4 py-2 rounded-t-md ${
                        activeTab === "year"
                          ? "bg-blue-500 text-white"
                          : "bg-white hover:bg-white"
                      }`}
                    >
                      Year
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="week" className="p-4">
                    <WeekPicker />
                  </TabsContent>
                  <TabsContent value="month" className="p-4">
                    <MonthYearPicker />
                  </TabsContent>
                  <TabsContent value="year" className="p-4">
                    <YearPicker />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            <nav className="flex flex-wrap gap-10 items-start pl-6 mt-4 max-w-full text-base font-semibold leading-relaxed bg-white shadow-sm text-slate-500 w-[727px] ">
              <a
                href="#overview"
                className="flex flex-col whitespace-nowrap text-slate-800 w-[74px]"
              >
                <span className="self-center">Overview</span>
                <div className="flex mt-2 w-full bg-indigo-600 rounded-none fill-indigo-600 min-h-[4px]" />
              </a>
              <a href="#jobs-view">Jobs View</a>
              <a href="#jobs-applied">Jobs Applied</a>

              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <defs>
                    <linearGradient
                      id="colorDesktop"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-desktop)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-desktop)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorMobile"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-mobile)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-mobile)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="desktop"
                    stroke="var(--color-desktop)"
                    fill="url(#colorDesktop)"
                  />
                  <Area
                    type="monotone"
                    dataKey="mobile"
                    stroke="var(--color-mobile)"
                    fill="url(#colorMobile)"
                  />
                </AreaChart>
              </ChartContainer>
            </nav>
          </div>
        </section>
        <JobUpdates />
      </section>
      <section className="flex flex-wrap gap-6 items-start px-8 pb-8 max-md:px-5 ">
        <TotalJobsApplied />
        <JobsAppliedStatus />
        <UpcomingInterviews />
      </section>
      <RecentApplicationsHistory />
    </main>
  );
};

export default Dashboard;
