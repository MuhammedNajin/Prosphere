import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ProfileApi } from '@/api/Profile.api';
import { useSelector } from 'react-redux';

const formSchema = z.object({
  image: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Profile photo is required.")
    .transform((files) => files[0])
    .refine(
      (file) => file.size <= 5000000,
      "File size should be less than 5MB."
    )
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
      "Only .jpg, .png, and .gif formats are supported."
    ),
});

export function ProfileImageForm() {
  const { user } = useSelector((state) => state.auth)
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
    },
  });

  const handleSubmit = async (data) => {
    try {
      console.log("Submitted file:", data.image);
 
      const response = await ProfileApi.uploadProfilePhoto(data, "profileImageKey", user.email);
      console.log(response);
      
    } catch (error) {
      console.error("Error uploading profile photo:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onChange(e.target.files)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save changes</Button>
      </form>
    </Form>
  );
}