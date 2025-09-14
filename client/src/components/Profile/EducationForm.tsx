import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import EnhancedCalendar from './Calender';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from 'react-query';
import { queryClient } from '@/main';
import { UserApi } from '@/api/user.api';
import ErrorMessage from '../common/Message/ErrorMessage';
import SuccessMessage from '../common/Message/SuccessMessage';
import LoaderSubmitButton from '../common/spinner/LoaderSubmitButton';
import { AxiosError, HttpStatusCode } from 'axios';
import { ApiErrorResponse } from '@/api';
import { IEducation } from '@/types/user';
import { z } from 'zod';
import { useCurrentUser } from '@/hooks/useSelectors';

// Define degree options
const DEGREE_OPTIONS = [
  { value: "highschool", label: "High School" },
  { value: "associate", label: "Associate's Degree" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "phd", label: "Ph.D." },
  { value: "doctorate", label: "Doctorate" },
  { value: "diploma", label: "Diploma" },
  { value: "certificate", label: "Certificate" },
  { value: "other", label: "Other" },
] as const;

// Enhanced validation schema
const educationFormSchema = z.object({
  school: z.string()
    .min(1, 'School name is required')
    .max(255, 'School name must be less than 255 characters')
    .trim(),
  degree: z.string()
    .min(1, 'Degree is required')
    .trim(),
  fieldOfStudy: z.string()
    .min(1, 'Field of study is required')
    .max(255, 'Field of study must be less than 255 characters')
    .trim(),
  startDate: z.date({ 
    required_error: 'Start date is required',
    invalid_type_error: 'Please select a valid start date'
  }),
  endDate: z.date()
    .optional()
    .nullable(),
  isCurrentStudent: z.boolean().default(false),
  gpa: z.string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 && num <= 10;
    }, 'GPA must be a number between 0 and 10'),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .trim()
    .optional(),
  activities: z.array(z.string().trim()).optional(),
  honors: z.array(z.string().trim()).optional(),
}).refine(
  (data) => {
    // If not current student and has end date, end date should be after start date
    if (!data.isCurrentStudent && data.endDate) {
      return data.endDate >= data.startDate;
    }
    return true;
  },
  { 
    message: 'End date must be after start date', 
    path: ['endDate'] 
  }
).refine(
  (data) => {
    // Start date shouldn't be in the future
    return data.startDate <= new Date();
  },
  {
    message: 'Start date cannot be in the future',
    path: ['startDate']
  }
);

type EducationFormValues = z.infer<typeof educationFormSchema>;

interface EducationFormProps {
  education?: IEducation | null;
  onClose: (shouldRefetch?: boolean) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ education, onClose }) => {
  const user = useCurrentUser();
  const { toast } = useToast();
  const isEditing = Boolean(education);

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      school: education?.school || '',
      degree: education?.degree || '',
      fieldOfStudy: education?.fieldOfStudy || '',
      startDate: education?.startDate ? new Date(education.startDate) : undefined,
      endDate: education?.endDate ? new Date(education.endDate) : null,
      isCurrentStudent: education?.isCurrentStudent || false,
      gpa: education?.gpa ? String(education.gpa) : '',
      description: education?.description || '',
      activities: education?.activities || [],
      honors: education?.honors || [],
    },
  });

  const { mutate: saveEducation, isLoading } = useMutation({
    mutationFn: async ({ data }: { data: { education: EducationFormValues }}) => {
      // Transform the form data to match API expectations
      const education = {
        ...data.education,
        gpa: data.education.gpa,
        // Ensure dates are properly formatted
        startDate: data.education.startDate,
        endDate: data.education.endDate ? data.education.endDate : null,
      };

      return UserApi.updateProfile({ 
        data: { education },  
        array: true 
      });
    },
    onSuccess: () => {
      toast({
        description: <SuccessMessage message={`Education ${isEditing ? 'updated' : 'added'} successfully`} />,
      });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      onClose(true);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('Education save error:', error);
      
      let errorMessage = `Failed to ${isEditing ? 'update' : 'add'} education`;
      
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
    },
  });

  const onSubmit = (data: EducationFormValues) => {
    if (!user?.id) {
      toast({
        description: <ErrorMessage message="User session expired. Please log in again" />,
        variant: 'destructive',
      });
      return;
    }

    
    saveEducation({ 
      data: { 
        education: { 
          ...data, 
        } 
      }, 
    });
  };

  const isCurrentStudent = form.watch('isCurrentStudent');

  const handleCancel = () => {
    if (form.formState.isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">School/Institution <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. University of California, Berkeley" 
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="degree"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Degree <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select degree type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DEGREE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="fieldOfStudy"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Field of Study <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Computer Science, Business Administration" 
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gpa"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">GPA (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    max="10" 
                    placeholder="e.g. 3.75" 
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                          'w-full pl-3 text-left font-normal justify-start',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick start date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <EnhancedCalendar
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    />
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
                  End Date {!isCurrentStudent && <span className="text-red-500">*</span>}
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        disabled={isCurrentStudent}
                        className={cn(
                          'w-full pl-3 text-left font-normal justify-start',
                          (!field.value || isCurrentStudent) && 'text-muted-foreground',
                          isCurrentStudent && 'cursor-not-allowed opacity-50'
                        )}
                      >
                        {field.value && !isCurrentStudent ? (
                          format(field.value, 'PPP')
                        ) : isCurrentStudent ? (
                          <span>Current student</span>
                        ) : (
                          <span>Pick end date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <EnhancedCalendar
                      selected={field.value ?? new Date()}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const startDate = form.getValues('startDate');
                        return date > new Date() || 
                               date < new Date('1900-01-01') || 
                               (startDate && date < startDate);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Current Student Checkbox */}
        <FormField
          control={form.control}
          name="isCurrentStudent"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3 rounded-md border p-4 bg-gray-50">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    if (checked) {
                      form.setValue('endDate', null);
                    }
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-medium cursor-pointer">
                  I am currently studying here
                </FormLabel>
                <p className="text-xs text-gray-600">
                  Check this if you are still enrolled at this institution
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
                  placeholder="Describe your studies, thesis, notable projects, etc."
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
            disabled={isLoading}
          >
            Cancel
          </Button>
          <LoaderSubmitButton 
            state={isLoading}
          >
            {isEditing ? 'Update Education' : 'Save Education'}
          </LoaderSubmitButton>
        </div>
      </form>
    </Form>
  );
};

export default EducationForm;