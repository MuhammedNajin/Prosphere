import React from 'react'
import { ProfileApi } from "@/api/Profile.api";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
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

interface AboutFormProps {
    about?: string
}

function AboutForm({ about } : AboutFormProps) {
    const { user } = useSelector((state) => state.auth);
    const formSchema = z.object({
      about: z.string().min(10, "About Me should be at least 10 characters long"),
    });
        
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          about: about || "",
        },
    });
    
    async function onSubmit(data) {
        console.log("data", data);
        const response = await ProfileApi.updateProfile(data, user.email);
        console.log(response);
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
                    <Button type="submit">
                        Save About Me
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default AboutForm