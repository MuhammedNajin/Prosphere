import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from 'react-query';
import { ProfileApi } from '@/api/Profile.api';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResumeFormProps {
  onClose: (show: boolean) => void;
}

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
      'Only PDF and Word documents are accepted'
    ),
});

const ResumeForm: React.FC<ResumeFormProps> = ({ onClose }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
  });

  const mutation = useMutation({
    mutationFn: ProfileApi.uploadResume,
    onSuccess: () => {
      toast({
        description: (
          <div className="flex items-center gap-2">
            <CircleCheck className="text-green-800" size={20} />
            <h1>Resume uploaded successfully</h1>
          </div>
        ),
      });
      onClose(false);
    },
    onError: () => {
      const errorMessage = 'Error uploading resume, try again';
      toast({
        description: (
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-800" size={20} />
            <h1>{errorMessage}</h1>
          </div>
        ),
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append('resume', data.resume);
    formData.append('userId', user?._id!);
    mutation.mutate({ data: formData });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Controller
          name="resume"
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => field.onChange(e.target.files?.[0] || null)}
              className="w-full p-2 border rounded"
            />
          )}
        />
        {errors.resume && (
          <p className="text-red-500 text-sm mt-1">{errors.resume?.message?.toString() || 'Invalid resume file' }</p>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => onClose(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? 'Uploading...' : 'Upload Resume'}
        </Button>
      </div>
    </form>
  );
};

export default ResumeForm;
