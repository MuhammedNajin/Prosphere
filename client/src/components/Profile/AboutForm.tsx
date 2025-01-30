import React from 'react'
import { ProfileApi } from "@/api/Profile.api";
import { useSelector } from "react-redux";
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from "@hookform/resolvers/zod";
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
import { RootState } from '@/redux/store';
import { profileAboutFormSchema } from '@/types/schema';
import { AboutFormData } from '@/types/formData';

interface AboutFormProps {
    about?: string
    onClose: React.Dispatch<React.SetStateAction<boolean>>
}



function AboutForm({ about, onClose } : AboutFormProps) {
    const { user } = useSelector((state: RootState) => state.auth);
   const { toast } = useToast()
   const client = useQueryClient();  
    const form = useForm({
        resolver: zodResolver(profileAboutFormSchema),
        defaultValues: {
          about: about || "",
        },
    });

    const aboutMutation = useMutation({
      mutationFn: ProfileApi.updateProfile,
      onSuccess: () => {
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
        if (!user?.email) return;
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