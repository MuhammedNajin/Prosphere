import React, { useEffect, useState } from "react";
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
import { UseFormReturn } from "react-hook-form";
import { DialogFooter } from "@/components/ui/dialog";
import { UseMutationResult, useQuery } from "react-query";
import { CompanyApi } from "@/api/Company.api";
import { useParams } from "react-router-dom";
import { AxiosResponse } from "axios";
import LoaderSubmitButton from "../common/spinner/LoaderSubmitButton";

interface CreateJobModalThreeProps {
  form: UseFormReturn<any>;
  mutation: UseMutationResult<AxiosResponse<any, any>, unknown, {
    formData: any;
    id: any;
   }, unknown>
}

const CreateJobModalThree: React.FC<CreateJobModalThreeProps> = ({ form, mutation }) => {
  const [open, setOpen] = useState(false);
  const { id } = useParams()
  const company = useQuery({
    queryKey: ['companyLocation'],
    queryFn: () => CompanyApi.getCompany(id as string)
  })

  useEffect(() => {
     console.log(company.data)
  })

  return (
    <>
       <FormField
      control={form.control}
      name="expiry"
      render={({ field }) => (
        <FormItem className="flex flex-col sm:flex-row sm:items-center border-t border-b py-4 sm:py-8 space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex flex-col gap-y-1 sm:w-1/3">
            <FormLabel className="font-medium text-sm sm:text-md">Expiry Date</FormLabel>
            <FormDescription className="text-xs sm:text-sm">
              The date when the job posting will close for applications.
            </FormDescription>
          </div>
          <div className="sm:w-2/3 relative">
            <FormControl>
                 <div>
                 <Button
                    variant="outline"
                    className={cn(
                      "w-full sm:w-[280px] justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                  </Button>
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        field.onChange(date?.toISOString());
                        setTimeout(() => setOpen(false), 150);
                      }}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                 </div>   
            </FormControl>
            <FormMessage className="text-xs mt-1" />
          </div>
        </FormItem>
      )}
    />

      <FormField
        control={form.control}
        name="vacancies"
        render={({ field }) => (
          <FormItem className="flex flex-col sm:flex-row sm:items-center border-t border-b py-4 sm:py-8 space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col gap-y-1 sm:w-1/3">
              <FormLabel className="font-medium text-sm sm:text-md">Vacancies</FormLabel>
              <FormDescription className="text-xs sm:text-sm">
                The number of open positions available for this job.
              </FormDescription>
            </div>
            <div className="sm:w-2/3">
              <FormControl>
                <Input 
                  className="w-full sm:w-80" 
                  placeholder="Add Vacancies" 
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage className="text-xs mt-1" />
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="experience"
        render={({ field }) => (
          <FormItem className="flex flex-col sm:flex-row sm:items-center border-t border-b py-4 sm:py-8 space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col gap-y-1 sm:w-1/3">
              <FormLabel className="font-medium text-sm sm:text-md">Experience</FormLabel>
              <FormDescription className="text-xs sm:text-sm max-w-[22rem]">
                The minimum amount of relevant work experience required for
                candidates to apply for this job.
              </FormDescription>
            </div>
            <div className="sm:w-2/3">
              <FormControl>
                <Input 
                  type="number"
                  className="w-full sm:w-80" 
                  placeholder="Add Experience" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage className="text-xs mt-1" />
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="jobLocation"
        render={({ field }) => (
          <FormItem className="flex flex-col sm:flex-row sm:items-center border-t border-b py-4 sm:py-8 space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col gap-y-1 sm:w-1/3">
              <FormLabel className="font-medium text-sm sm:text-md">Job Location</FormLabel>
              <FormDescription className="text-xs sm:text-sm max-w-[22rem]">
                The primary location or work arrangement for this position.
              </FormDescription>
            </div>
            <div className="sm:w-2/3">
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="on-site">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-xs mt-1" />
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="officeLocation"
        render={({ field }) => (
          <FormItem className="flex flex-col sm:flex-row sm:items-center border-t border-b py-4 sm:py-8 space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col gap-y-1 sm:w-1/3">
              <FormLabel className="font-medium text-sm sm:text-md">Office Location</FormLabel>
              <FormDescription className="text-xs sm:text-sm max-w-[22rem]">
                Give your office location.
              </FormDescription>
            </div>
            <div className="sm:w-2/3">
              <FormControl>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                   {
                     company.data && company.data.location.map((location) => (
                      <SelectItem value={location.placename} >{location.placename}</SelectItem>
                     ))
                   }
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-xs mt-1" />
            </div>
          </FormItem>
        )}
      />

      <DialogFooter className="pt-4 sm:pt-6">
        <LoaderSubmitButton state={mutation.isLoading} >Save Job</LoaderSubmitButton>
      </DialogFooter>
    </>
  );
};

export default CreateJobModalThree;