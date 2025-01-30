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
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { DialogFooter } from "@/components/ui/dialog";
import { UseMutationResult, useQuery } from "react-query";
import { CompanyApi } from "@/api/Company.api";
import { useParams } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";
import LoaderSubmitButton from "../common/spinner/LoaderSubmitButton";

import {Popover, PopoverContent, PopoverTrigger } from "../ui/popover-dialog";
import EnhancedCalendar from "../Profile/Calender";
import { CreateJobProps, UpdateJobProps } from "@/types/job";

interface CreateJobModalThreeProps {
  form: UseFormReturn<any>;
  mutation: UseMutationResult<AxiosResponse<any, any>, AxiosError<unknown, any>, UpdateJobProps | CreateJobProps, unknown>;
}

const CreateJobModalThree: React.FC<CreateJobModalThreeProps> = ({ form, mutation }) => {
  const { id } = useParams();
  const company = useQuery({
    queryKey: ['companyLocation'],
    queryFn: () => CompanyApi.getCompany(id as string)
  });

  const FormSection = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-white rounded-lg p-6 mb-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      {children}
    </div>
  );

    const handleCalendarClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };
  

  return (
    <div className="max-w-4xl mx-auto space-y-6 bg-gray-50 p-6 rounded-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Details</h2>
        <p className="text-gray-600">Please provide the specific requirements and details for this position.</p>
      </div>

      <FormSection>
        <FormField
          control={form.control}
          name="expiry"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex flex-col gap-y-1.5 sm:w-1/3">
                <FormLabel className="text-lg font-semibold text-gray-900">Expiry Date</FormLabel>
                <FormDescription className="text-sm text-gray-600">
                  The date when the job posting will close for applications.
                </FormDescription>
              </div>
              <div className="sm:w-2/3 relative">
                <FormControl>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {field.value ? (
                              format(parseISO(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="w-auto p-0" 
                        align="start"
                        onClick={handleCalendarClick}
                      >
                        <div onClick={handleCalendarClick}>
                          <EnhancedCalendar
                            selected={field.value ? parseISO(field.value) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(format(date, 'yyyy-MM-dd'));
                              }
                            }}
                            disabled={(date) => date < new Date()}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div> 
                </FormControl>
                <FormMessage className="text-xs mt-1.5" />
              </div>
            </FormItem>
          )}
        />
      </FormSection>

      <FormSection>
        <FormField
          control={form.control}
          name="vacancies"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex flex-col gap-y-1.5 sm:w-1/3">
                <FormLabel className="text-lg font-semibold text-gray-900">Vacancies</FormLabel>
                <FormDescription className="text-sm text-gray-600">
                  The number of open positions available for this job.
                </FormDescription>
              </div>
              <div className="sm:w-2/3">
                <FormControl>
                  <Input 
                    className="w-full sm:w-80 border-gray-300 focus:border-orange-500 focus:ring-orange-500/20" 
                    placeholder="Add Vacancies" 
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage className="text-xs mt-1.5" />
              </div>
            </FormItem>
          )}
        />
      </FormSection>

      <FormSection>
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex flex-col gap-y-1.5 sm:w-1/3">
                <FormLabel className="text-lg font-semibold text-gray-900">Experience</FormLabel>
                <FormDescription className="text-sm text-gray-600 max-w-[22rem]">
                  The minimum amount of relevant work experience required for
                  candidates to apply for this job.
                </FormDescription>
              </div>
              <div className="sm:w-2/3">
                <FormControl>
                  <Input 
                    type="number"
                    className="w-full sm:w-80 border-gray-300 focus:border-orange-500 focus:ring-orange-500/20" 
                    placeholder="Add Experience" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage className="text-xs mt-1.5" />
              </div>
            </FormItem>
          )}
        />
      </FormSection>

      <FormSection>
        <FormField
          control={form.control}
          name="jobLocation"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex flex-col gap-y-1.5 sm:w-1/3">
                <FormLabel className="text-lg font-semibold text-gray-900">Job Location</FormLabel>
                <FormDescription className="text-sm text-gray-600 max-w-[22rem]">
                  The primary location or work arrangement for this position.
                </FormDescription>
              </div>
              <div className="sm:w-2/3">
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full sm:w-[180px] border-gray-300 focus:ring-orange-500/20">
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="on-site">On-site</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-xs mt-1.5" />
              </div>
            </FormItem>
          )}
        />
      </FormSection>

      <FormSection>
        <FormField
          control={form.control}
          name="officeLocation"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex flex-col gap-y-1.5 sm:w-1/3">
                <FormLabel className="text-lg font-semibold text-gray-900">Office Location</FormLabel>
                <FormDescription className="text-sm text-gray-600 max-w-[22rem]">
                  Give your office location.
                </FormDescription>
              </div>
              <div className="sm:w-2/3">
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className="w-full sm:w-[180px] border-gray-300 focus:ring-orange-500/20">
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      {company.data && company.data?.location?.map((location: { placename: string }) => (
                        <SelectItem key={location.placename} value={location.placename}>
                          {location.placename}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-xs mt-1.5" />
              </div>
            </FormItem>
          )}
        />
      </FormSection>

      <DialogFooter className="pt-6 mt-8 border-t border-gray-200">
        <LoaderSubmitButton 
          state={mutation.isLoading}
         
        >
          Save Job
        </LoaderSubmitButton>
      </DialogFooter>
    </div>
  );
};

export default CreateJobModalThree;