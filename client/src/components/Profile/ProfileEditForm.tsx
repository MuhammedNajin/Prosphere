import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from 'react-query';
import { queryClient } from '@/main';
import { UserApi } from '@/api/user.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import ErrorMessage from '../common/Message/ErrorMessage';
import SuccessMessage from '../common/Message/SuccessMessage';
import LoaderSubmitButton from '../common/spinner/LoaderSubmitButton';
import { AxiosError, HttpStatusCode } from 'axios';
import { ApiErrorResponse } from '@/api';
import { IUserUpdateInput } from '@/types/user';
import { useCurrentUser } from '@/hooks/useSelectors';

const profileEditFormSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional(),
  firstName: z.string().max(50, 'First name must be at most 50 characters').optional(),
  lastName: z.string().max(50, 'Last name must be at most 50 characters').optional(),
  headline: z.string().max(120, 'Headline must be at most 120 characters').optional(),
});

type ProfileEditFormValues = z.infer<typeof profileEditFormSchema>;

interface ProfileEditFormProps {
  setModal: (shouldRefetch?: boolean) => void
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ setModal }) => {
  const user = useCurrentUser();
  const { toast } = useToast();

  const form = useForm<ProfileEditFormValues>({
    resolver: zodResolver(profileEditFormSchema),
    defaultValues: {
      username: user?.username || '',
      phone: user?.phone || '',
      headline: '',
    },
  });

  const { mutate: updateProfile, isLoading } = useMutation({
    mutationFn: ({ data }: { data: Partial<IUserUpdateInput>; id: string }) =>
      UserApi.updateProfile({ data, array: false }),
    onSuccess: () => {
      toast({
        description: <SuccessMessage message="Profile updated successfully" />,
      });
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      setModal(false);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage =
        error.response?.status === HttpStatusCode.BadRequest
          ? error.response?.data?.errors?.[0]?.message || 'Invalid request'
          : 'Failed to update profile';
      toast({
        description: <ErrorMessage message={errorMessage} />,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ProfileEditFormValues) => {
    if (!user?.id) {
      toast({
        description: <ErrorMessage message="User ID is missing" />,
        variant: 'destructive',
      });
      return;
    }
    updateProfile({ data, id: user.id });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number (e.g., +1234567890)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="headline"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Headline</FormLabel>
                <FormControl>
                  <Input placeholder="Enter professional headline" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setModal(false)}>
            Cancel
          </Button>
          <LoaderSubmitButton state={isLoading}>Save Profile</LoaderSubmitButton>
        </div>
      </form>
    </Form>
  );
};

export default ProfileEditForm;