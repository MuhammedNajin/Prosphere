import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from 'react-query';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/main';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import ErrorMessage from '../common/Message/ErrorMessage';
import SuccessMessage from '../common/Message/SuccessMessage';
import LoaderSubmitButton from '../common/spinner/LoaderSubmitButton';
import { AxiosError, HttpStatusCode } from 'axios';
import { ApiErrorResponse } from '@/api';
import { useCurrentUser } from '@/hooks/useSelectors';
import { UserApi } from '@/api/user.api';
import { Input } from '../ui/input';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const resumeSchema = z.object({
  resume: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, 'File size must be less than 5MB')
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      'Only PDF and Word documents are allowed'
    ),
});

type ResumeFormValues = z.infer<typeof resumeSchema>;

interface ResumeFormProps {
  onClose: () => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ onClose }) => {
  const user = useCurrentUser()
  const { toast } = useToast();

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      resume: undefined,
    },
  });

  const { mutate: uploadResume, isLoading } = useMutation({
    mutationFn: (formData: FormData) => UserApi.uploadResume({ data: formData }),
    onSuccess: () => {
      toast({
        description: <SuccessMessage message="Resume uploaded successfully" />,
      });
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      onClose();
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage =
        error.response?.status === HttpStatusCode.BadRequest
          ? error.response?.data?.errors?.[0]?.message || 'Invalid resume file'
          : 'Error uploading resume, please try again';
      toast({
        description: <ErrorMessage message={errorMessage} />,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ResumeFormValues) => {
    if (!user?.id) {
      toast({
        description: <ErrorMessage message="User ID is missing" />,
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('resume', data.resume);
    formData.append('userId', user.id);
    uploadResume(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="resume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Resume</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e: any) => field.onChange(e.target.files?.[0] || undefined)}
                  className="w-full p-2 border rounded"
                />
              </FormControl>
              <p className="text-sm text-gray-600 mt-1">
                Accepted formats: PDF, Word (.doc, .docx). Max size: 5MB
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <LoaderSubmitButton state={isLoading}>Upload Resume</LoaderSubmitButton>
        </div>
      </form>
    </Form>
  );
};

export default ResumeForm;