import React, { useState } from 'react';
import { UserApi } from "@/api/user.api";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import EnhancedCalendar from './Calender';
import { useMutation, useQueryClient } from 'react-query';
import { useToast } from '@/hooks/use-toast';
import SuccessMessage from '../common/Message/SuccessMessage';
import ErrorMessage from '../common/Message/ErrorMessage';
import LoaderSubmitButton from '../common/spinner/LoaderSubmitButton';
import { AxiosError, HttpStatusCode } from 'axios';
import { ApiErrorResponse } from '@/api';
import LocationSearch from '../common/LocationField/LocationField';
import { IExperience, ILocation } from '@/types/user';

interface PositionFormProps {
  experience?: IExperience | null;
  onClose: (isOpen: boolean) => void;
  mode?: 'create' | 'edit';
}

const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
] as const;


// Enhanced validation schema matching EducationForm patterns
const experienceFormSchema = z.object({
  title: z.string()
    .min(1, "Job title is required")
    .max(255, "Job title must be less than 255 characters")
    .trim(),
  company: z.string()
    .min(1, "Company name is required")
    .max(255, "Company name must be less than 255 characters")
    .trim(),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'freelance', 'internship'] as const, {
    required_error: "Employment type is required",
  }),
  startDate: z.date({
    required_error: "Start date is required",
    invalid_type_error: "Please select a valid start date"
  }),
  endDate: z.date()
    .optional()
    .nullable(),
  isCurrentRole: z.boolean().default(false),
  description: z.string()
    .max(1000, "Description must be less than 1000 characters")
    .trim()
    .optional(),
  location: z.string()
    .max(255, "Location must be less than 255 characters")
    .trim()
    .optional(),
}).refine(
  (data) => {
    // If not current role and has end date, end date should be after start date
    if (!data.isCurrentRole && data.endDate) {
      return data.endDate >= data.startDate;
    }
    return true;
  },
  { 
    message: "End date must be after start date", 
    path: ["endDate"] 
  }
).refine(
  (data) => {
    // Start date shouldn't be in the future
    return data.startDate <= new Date();
  },
  {
    message: "Start date cannot be in the future",
    path: ["startDate"]
  }
);

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

function PositionForm({ 
  experience = null, 
  onClose, 
  mode = experience ? 'edit' : 'create' 
}: PositionFormProps) {
  const { user } = useSelector((state: any) => state.auth);
  const { toast } = useToast();
  const queryClient = useQueryClient();


  // State for location handling
  const [selectedLocationData, setSelectedLocationData] = useState<any>(null);

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      title: experience?.title || "",
      company: experience?.company || "",
      employmentType: experience?.employmentType || 'full-time',
      startDate: experience?.startDate ? new Date(experience.startDate) : undefined,
      endDate: experience?.endDate ? new Date(experience.endDate) : null,
      isCurrentRole: experience?.isCurrentRole || false,
      description: experience?.description || "",
      location: experience?.location?.placename || experience?.location?.city || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ data }: { data: { experience: IExperience } }) => {
      return UserApi.updateProfile({ 
        data, 
        array: true 
      });
    },
    onSuccess: () => {
      const message = mode === 'create' 
        ? 'Experience added successfully' 
        : 'Experience updated successfully';
      
      toast({
        description: <SuccessMessage message={message} />,
      });
      
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      onClose(false);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('Experience update error:', error);
      
      let errorMessage = `Failed to ${mode === 'create' ? 'add' : 'update'} experience`;
      
      if (error.response?.status === HttpStatusCode.BadRequest) {
        errorMessage = error.response?.data?.errors?.[0]?.message || 'Invalid request data';
      } else if (error.response?.status === HttpStatusCode.Unauthorized) {
        errorMessage = 'You are not authorized to perform this action';
      } else if (error.response?.status === HttpStatusCode.InternalServerError) {
        errorMessage = 'Server error occurred. Please try again later';
      }
      
      toast({
        description: <ErrorMessage message={errorMessage} />,
        variant: 'destructive',
      });
    }
  });

  const handleLocationSelect = (locationData: any) => {
    setSelectedLocationData(locationData);
    
    // const location: ILocation = {
    //   placename: locationData.place_name,
    //   city: locationData.city,
    //   state: locationData.state,
    //   country: locationData.country,
    //   postalCode: locationData.pincode,
    //   coordinates: locationData.coordinates ? {
    //     lat: locationData.coordinates[1],
    //     lng: locationData.coordinates[0]
    //   } : undefined
    // };
    
    // Update form with the location name
    form.setValue('location', locationData.place_name || locationData.city || '');
  };

  const onSubmit = (data: ExperienceFormValues) => {
    if (!user?.email) {
      toast({
        description: <ErrorMessage message="User session expired. Please log in again" />,
        variant: 'destructive',
      });
      return;
    }

    // Create structured location object from selected data or form input
    let locationObj: ILocation | undefined;
    
    if (selectedLocationData) {
      locationObj = {
        placename: selectedLocationData.place_name,
        city: selectedLocationData.city,
        state: selectedLocationData.state,
        country: selectedLocationData.country,
        postalCode: selectedLocationData.pincode,
        coordinates: selectedLocationData.coordinates ? {
          lat: selectedLocationData.coordinates[1],
          lng: selectedLocationData.coordinates[0]
        } : undefined
      };
    } else if (data.location) {
      // Fallback for manual input
      locationObj = {
        placename: data.location,
        city: data.location, // Use as city if no structured data
      };
    }

    const experienceData: IExperience = {
      title: data.title,
      company: data.company,
      employmentType: data.employmentType as any,
      location: locationObj,
      startDate: data.startDate,
      endDate: data.isCurrentRole ? null : data.endDate,
      isCurrentRole: data.isCurrentRole,
      description: data.description,
    };

    mutation.mutate({ data: { experience: experienceData } });
  };

  const handleCalendarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCancel = () => {
    if (form.formState.isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        onClose(false);
      }
    } else {
      onClose(false);
    }
  };

  const isCurrentRole = form.watch("isCurrentRole");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {mode === 'create' ? 'Add Experience' : 'Edit Experience'}
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" onClick={handleCalendarClick}>
          {/* Job Title and Employment Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Job Title <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Software Engineer" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Employment Type <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EMPLOYMENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Company and Location Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Company <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Google" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="locationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Location Type <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select location type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LOCATION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>

          {/* Location Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Location (Optional)
            </label>
            <LocationSearch
              onSelectLocation={handleLocationSelect}
              placeholder="Search for city or location..."
              initialValue={form.getValues('location')}
              className="w-full"
            />
            {selectedLocationData && (
              <div className="text-xs text-gray-500 mt-1">
                Selected: {selectedLocationData.fullAddress || selectedLocationData.place_name}
              </div>
            )}
          </div>

          {/* Start Date and End Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-sm font-medium">Start Date <span className="text-red-500">*</span></FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal justify-start",
                            !field.value && "text-muted-foreground"
                          )}
                          onClick={handleCalendarClick}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick start date</span>
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
                          disabled={(date: Date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-sm font-medium">
                    End Date {!isCurrentRole && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          disabled={isCurrentRole}
                          className={cn(
                            "w-full pl-3 text-left font-normal justify-start",
                            (!field.value || isCurrentRole) && "text-muted-foreground",
                            isCurrentRole && "cursor-not-allowed opacity-50"
                          )}
                          onClick={handleCalendarClick}
                        >
                          {field.value && !isCurrentRole ? (
                            format(field.value, "PPP")
                          ) : isCurrentRole ? (
                            <span>Current role</span>
                          ) : (
                            <span>Pick end date</span>
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
                          selected={field.value ?? new Date()}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const startDate = form.getValues('startDate');
                            return date > new Date() || 
                                   date < new Date("1900-01-01") || 
                                   (startDate && date < startDate);
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Current Role Checkbox */}
          <FormField
            control={form.control}
            name="isCurrentRole"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-3 rounded-md border p-4 bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (checked) {
                        form.setValue("endDate", null);
                      }
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium cursor-pointer">
                    I am currently working in this role
                  </FormLabel>
                  <p className="text-xs text-gray-600">
                    Check this if you are still employed in this position
                  </p>
                </div>
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your role, responsibilities, and key achievements..."
                    className="min-h-[100px] resize-none"
                    {...field}
                  />
                </FormControl>
                <p className="text-xs text-gray-500 mt-1">
                  {field.value?.length || 0}/1000 characters
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={mutation.isLoading}
            >
              Cancel
            </Button>
            <LoaderSubmitButton state={mutation.isLoading}>
              {mode === 'create' ? 'Add Experience' : 'Save Changes'}
            </LoaderSubmitButton>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default PositionForm;