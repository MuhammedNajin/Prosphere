import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UseFormReturn } from "react-hook-form";
import { DialogFooter } from "@/components/ui/dialog";

interface CreateJobModalThreeProps {
  form: UseFormReturn<any>;
}

const CreateJobModalThree: React.FC<CreateJobModalThreeProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="expiry"
        render={({ field }) => (
          <FormItem className="flex gap-x-10 items-center border-t border-b py-8">
            <div className="flex flex-col gap-y-2">
              <FormLabel className="font-medium text-md">Expiry Date</FormLabel>
              <FormDescription>
                The date when the job posting will close for applications.
              </FormDescription>
            </div>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date?.toISOString())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="vacancies"
        render={({ field }) => (
          <FormItem className="flex gap-x-10 items-center border-t border-b py-8">
            <div className="flex flex-col gap-y-2">
              <FormLabel className="font-medium text-md">Vacancies</FormLabel>
              <FormDescription>
                The number of open positions available for this job.
              </FormDescription>
            </div>
            <FormControl>
              <Input 
                className="w-80" 
                placeholder="Add Vacancies" 
                type="number"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="experience"
        render={({ field }) => (
          <FormItem className="flex gap-x-10 items-center border-t border-b py-8">
            <div className="flex flex-col gap-y-2">
              <FormLabel className="font-medium text-md">Experience</FormLabel>
              <FormDescription className="max-w-[22rem]">
                The minimum amount of relevant work experience required for
                candidates to apply for this job.
              </FormDescription>
            </div>
            <FormControl>
              <div className="flex justify-center items-center gap-x-2">
                <Input 
                  className="w-80" 
                  placeholder="Add Experience" 
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="jobLocation"
        render={({ field }) => (
          <FormItem className="flex gap-x-10 items-center border-t border-b py-8">
            <div className="flex flex-col gap-y-2">
              <FormLabel className="font-medium text-md">Job Location</FormLabel>
              <FormDescription className="max-w-[22rem]">
                The primary location or work arrangement for this position.
              </FormDescription>
            </div>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="on-site">On-site</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <DialogFooter>
        <Button type="submit">Submit Job Posting</Button>
      </DialogFooter>
    </>
  );
};

export default CreateJobModalThree;