import React, { useState } from 'react';
import { ProfileApi } from "@/api/Profile.api";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover-dialog";
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import EnhancedCalendar from './Calender';
import { useMutation } from 'react-query';
import { useToast } from '@/hooks/use-toast';
import SuccessMessage from '../common/Message/SuccessMessage';
import ErrorMessage from '../common/Message/ErrorMessage';
import LoaderSubmitButton from '../common/spinner/LoaderSubmitButton';
import { queryClient } from '@/main';
import { AxiosError, HttpStatusCode } from 'axios';

interface PositionForm {
  position: {
    position?: string;
    employmentType?: string;
    companyName?: string;
    locationType?: string;
    startDate?: Date;
    endDate?: Date;
    currentlyWorking?: boolean;
  } | null;
  onClose: React.Dispatch<React.SetStateAction<boolean>>
}




function PositionForm({ position, onClose }: PositionForm = { position: null }) {
  const { user } = useSelector((state: any) => state.auth);
  const { toast } = useToast()


  const handleCalendarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const formSchema = z
    .object({
      position: z.string().min(1, "Title is required"),
      employmentType: z.string().min(1, "Employment type is required"),
      companyName: z.string().min(1, "Company name is required"),
      locationType: z.string().min(1, "Location type is required"),
      startDate: z.date({
        required_error: "Start date is required",
      }),
      endDate: z.date().optional(),
      currentlyWorking: z.boolean(),
    })
    .refine(
      (data) => {
        if (data.currentlyWorking) return true;
        if (!data.endDate) return false;
        return data.startDate <= data.endDate;
      },
      {
        message: "End date must be after start date",
        path: ["endDate"],
      }
    );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      position: position?.position || "",
      employmentType: position?.employmentType || "",
      companyName: position?.companyName || "",
      locationType: position?.locationType || "",
      startDate: position?.startDate || undefined,
      endDate: position?.endDate || undefined,
      currentlyWorking: position?.currentlyWorking || false,
    },
  });

  const mutation = useMutation({
    mutationFn: ProfileApi.updateProfile,
    onSuccess: () => {
      toast({
        title: <SuccessMessage message='Experience updated successfully'/>,
        
      });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      onClose(false)
    },
    onError: (error: AxiosError) => {
      console.error('Full error object:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
    
      if (error.response?.status === HttpStatusCode.BadRequest) {
        const errorMessage = error.response.data?.errors?.[0]?.message || 'Invalid request';
        console.log('Error message being used:', errorMessage);
        toast({
          title: <ErrorMessage  message={errorMessage} />,
          className: 'bg-red-500 text-white',
        });
        return;
      }
    
      toast({
        title: <ErrorMessage message='Failed to update position. Please try again.' />,
        className: 'bg-red-500 text-white',
      });
    }
  });

  const onSubmit = (data: FormData) => {
    const positionData = { experience: data };
    mutation.mutate({ data: positionData, email: user.email, array: true });
  };

  const currentlyWorking = form.watch("currentlyWorking");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" onClick={handleCalendarClick}>
        <div className="flex gap-x-6">
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input className="w-60" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="employmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-60">
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-x-6">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company name</FormLabel>
                <FormControl>
                  <Input className="w-60" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="locationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-60">
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="on-site">On-site</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-x-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
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
                          format(field.value, "PPP")
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
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        disabled={currentlyWorking}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
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
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="currentlyWorking"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    if (checked) {
                      form.setValue("endDate", undefined);
                    }
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>I am currently working in this role</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <div className="flex justify-end">
         <LoaderSubmitButton state={mutation.isLoading} >Save</LoaderSubmitButton>
        </div>
      </form>
    </Form>
  );
}

export default PositionForm;