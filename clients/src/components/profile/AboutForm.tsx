import React from 'react'
import { ProfileApi } from "@/api/Profile.api";
import { useSelector } from "react-redux";
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import LoaderSubmitButton from '../common/spinner/LoaderSubmitButton';
import { useMutation, useQueryClient } from 'react-query';
import { useToast } from '@/hooks/use-toast';

interface AboutFormProps {
    about?: string
    onClose: React.Dispatch<React.SetStateAction<boolean>>
}

const formSchema = z.object({
    about: z.string().min(10, "About Me should be at least 10 characters long"),
  });

  type AboutFormData = z.infer<typeof formSchema>;

function AboutForm({ about, onClose } : AboutFormProps) {
    const { user } = useSelector((state) => state.auth);
   const { toast } = useToast()
   const client = useQueryClient();  
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          about: about || "",
        },
    });

    const aboutMutation = useMutation({
      mutationFn: ProfileApi.updateProfile,
      onSuccess: (data, ) => {
            client.invalidateQueries('profile')
            onClose(false)
            toast({
                title: "About Me updated successfully",
                duration: 5000,
                className: "bg-green-500 text-white",
            })
      }, 
      onError: (err) => {
         console.log("err", err);
      }
    })
    
    async function onSubmit(data: AboutFormData) {
        console.log("data", data);
        aboutMutation.mutate({ data, email: user.email });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="about"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                About me
                            </FormLabel>
                            <FormControl>
                                <Textarea 
                                    placeholder="Write a brief description about yourself" 
                                    className="resize-none" 
                                    rows={6}
                                    {...field} 
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <LoaderSubmitButton state={aboutMutation.isLoading}>
                        Save
                    </LoaderSubmitButton>
                </div>
            </form>
        </Form>
    )
}

export default AboutForm