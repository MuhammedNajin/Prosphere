import React from 'react';
import { useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { ProfileApi } from "@/api/Profile.api";
import { queryClient } from '@/main';
import { RootState } from '@/redux/store';
  
 interface ProfileEditFormProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>
 }
function ProfileEditForm({ setModal }: ProfileEditFormProps) {
  const { user } = useSelector((state: RootState) => state.auth);

  const formSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
    jobRole: z.string().min(2, "Job role must be at least 2 characters"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username || "",
      phone: user?.phone || "",
      jobRole: user?.jobRole || "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    if (!user) {
      throw new Error('User not authenticated');
    }
    try {
      const response = await ProfileApi.updateProfile({ data, email: user.email, array: false });
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ['profile', user.email] });
      setModal(false)
      
    } catch (error) {
      console.error("Error updating profile:", error);
     
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <Input placeholder="Enter phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobRole"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Role</FormLabel>
              <FormControl>
                <Input placeholder="Enter job role" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">
            Save Profile
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default ProfileEditForm;