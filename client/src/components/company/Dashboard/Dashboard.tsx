import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import { startOfYear, endOfYear, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";

// Component imports
import JobUpdates from "./JobCard";
import RecentApplicationsHistory from "./RecentApplicationsHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import WeekPicker from "@/components/common/DatePicker/WeekPicker";
import MonthYearPicker from "@/components/common/DatePicker/MonthPicker";
import YearPicker from "@/components/common/DatePicker/YearPicker";

// API and type imports
import { CompanyApi } from "@/api";
import { Time_Frame, GraphOptions } from "@/types/company";
import { useCurrentUser } from "@/hooks/useSelectors";
import { useCurrentCompany } from "@/hooks/useSelectedCompany";
import { useQuery } from "react-query";

// Type definitions for our component's state and props
interface GraphData {
  date: string;
  jobApplied?: number;
  jobSeen?: number;
}

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface ChartConfigItem {
  label: string;
  color: string;
}

interface ChartConfig {
  [key: string]: ChartConfigItem;
  jobApplied: ChartConfigItem;
  jobSeen: ChartConfigItem;
}

const Dashboard: React.FC = () => {

  const { id } = useCurrentCompany()
  const user = useCurrentUser();

  const [activeTab, setActiveTab] = useState<Time_Frame>(Time_Frame.YEAR);
  const [graphOption, setGraphOption] = useState<GraphOptions>(GraphOptions.OVERVIEW);
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [greeting, setGreeting] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: startOfYear(new Date()),
    endDate: new Date(),
  });

  const chartConfig: ChartConfig = {
    jobApplied: {
      label: "Application",
      color: "#9E4A06",
    },
    jobSeen: {
      label: "View",
      color: "#F8AE56",
    },
  };

  const { data: jobStats } = useQuery({
    queryKey: ["jobStats", dateRange, activeTab],
    queryFn: () => CompanyApi.getCompanyJobStatistics(id!, dateRange, activeTab),
    enabled: !!id,
  });

  const { data: viewStats } = useQuery({
    queryKey: ["view", dateRange, activeTab],
    queryFn: () => CompanyApi.getCompanyJobViewStatistics(id!, dateRange, activeTab),
    enabled: !!id,
  });

  useEffect(() => {
    const hour = new Date().getHours();
    const newGreeting = hour >= 17 ? "Good evening" : 
                       hour >= 12 ? "Good afternoon" : 
                       "Good morning";
    setGreeting(newGreeting);
  }, []);

  useEffect(() => {
    console.log("application stats", jobStats);
    
    if (!jobStats && !viewStats) return;

    const processedData: GraphData[] = jobStats?.map((el: { date: string; count: number }, index: number) => ({
      date: el.date,
      jobApplied: el.count,
      jobSeen: viewStats?.[index]?.viewCount
    })) ?? [];

    setGraphData(processedData);
  }, [jobStats, viewStats]);

  const handleActiveTab = (value: string) => {
    const timeFrame = value as Time_Frame;  // Convert string to Time_Frame
    setActiveTab(timeFrame);
    
    const dateRanges: Record<Time_Frame, DateRange> = {
      [Time_Frame.MONTH]: {
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date()),
      },
      [Time_Frame.WEEK]: {
        startDate: startOfWeek(new Date()),
        endDate: endOfWeek(new Date()),
      },
      [Time_Frame.YEAR]: {
        startDate: startOfYear(new Date()),
        endDate: endOfYear(new Date()),
      },
    };
  
    setDateRange(dateRanges[timeFrame]);
  };

  // Tab configuration
  const tabs = [
    { id: GraphOptions.OVERVIEW, label: "Overview" },
    { id: GraphOptions.JOBSEEN, label: "Jobs View" },
    { id: GraphOptions.JOBAPPLED, label: "Jobs Applied" },
  ];

  return (
    <main className="flex flex-col bg-white">
      {/* Header Section */}
      <header className="flex flex-col pb-6">
        <div className="flex flex-1 flex-wrap gap-10 justify-between items-center p-8">
          <div className="flex flex-col self-stretch my-auto min-w-[240px]">
            <h1 className="text-2xl font-semibold leading-tight text-slate-800">
              {greeting}, {user?.username}
            </h1>
            <p className="mt-2 text-base font-medium leading-relaxed text-slate-500">
              Here is your job listings statistic report.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Section */}
      <section className="flex flex-wrap gap-6 items-start px-8 pb-8 mt-6">
        {/* Statistics Card */}
        <Card className="w-full max-w-[728px] bg-white border border-solid rounded-lg border-zinc-200">
          <CardHeader className="flex justify-between items-start p-6">
            <div className="flex flex-col">
              <CardTitle className="text-xl font-semibold leading-tight text-slate-800">
                Job Statistics
              </CardTitle>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                Showing Job Statistics {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
              </p>
            </div>

            {/* Time Period Selector */}
            <div className="flex-shrink-0">
              <Tabs
                value={activeTab}
                onValueChange={handleActiveTab}
                className="w-full"
              >
                <TabsList className="bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>

                <div className="mt-4">
                  <TabsContent value="week">
                    <WeekPicker onWeekChange={setDateRange} />
                  </TabsContent>
                  <TabsContent value="month">
                    <MonthYearPicker onMonthChange={setDateRange} />
                  </TabsContent>
                  <TabsContent value="year">
                    <YearPicker onYearChange={setDateRange} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </CardHeader>

          <div className="px-6 border-t border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`relative py-4 px-1 ${
                    graphOption === tab.id
                      ? "text-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setGraphOption(tab.id)}
                >
                  <span className="font-medium text-sm">{tab.label}</span>
                  {graphOption === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <CardContent className="p-6">
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <ResponsiveContainer>
                <AreaChart data={graphData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickMargin={11}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                    interval="preserveStartEnd"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  
                  <defs>
                    <linearGradient id="colorJobApplied" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartConfig?.jobApplied?.color} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={chartConfig?.jobApplied?.color} stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorJobSeen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartConfig?.jobSeen?.color} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={chartConfig?.jobSeen?.color} stopOpacity={0.1} />
                    </linearGradient>
                  </defs>

                  {(graphOption === GraphOptions.OVERVIEW || graphOption === GraphOptions.JOBAPPLED) && (
                    <Area
                      type="monotone"
                      dataKey="jobApplied"
                      stroke={chartConfig.jobApplied?.color}
                      fill="url(#colorJobApplied)"
                    />
                  )}
                  {(graphOption === GraphOptions.OVERVIEW || graphOption === GraphOptions.JOBSEEN) && (
                    <Area
                      type="monotone"
                      dataKey="jobSeen"
                      stroke={chartConfig.jobSeen?.color}
                      fill="url(#colorJobSeen)"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <JobUpdates />
      </section>

      <RecentApplicationsHistory />
    </main>
  );
};

export default Dashboard;