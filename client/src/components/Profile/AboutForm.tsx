import { UserApi } from "@/api/user.api";
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
import { profileAboutFormSchema } from '@/types/schema';
import { AboutFormData } from '@/types/formData';
import { useCurrentUser } from '@/hooks/useSelectors';

interface AboutFormProps {
    description?: string
    onClose: (shouldRefetch?: boolean) => void

}



function AboutForm({ description, onClose } : AboutFormProps) {
    const user = useCurrentUser()
   const { toast } = useToast()
   const client = useQueryClient();  
    const form = useForm({
        resolver: zodResolver(profileAboutFormSchema),
        defaultValues: {
          description: description || "",
        },
    });

    const aboutMutation = useMutation({
      mutationFn: UserApi.updateAbout,
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
    
    async function onSubmit(aboutFormData: AboutFormData) {
        console.log("clicke", aboutFormData, user)
        if (!user?.id) return;
        console.log("onsubmit from about", aboutFormData);
        aboutMutation.mutate(aboutFormData.description);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="description"
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