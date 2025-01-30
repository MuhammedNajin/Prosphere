import React, { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { LoaderSubmitButton } from '@/components/ui/loader-submit-button';
import { ApplicationStatus, STATUS_CONFIG } from "@/types/application";
import { useMutation } from "react-query";
import { ApplicationApi } from "@/api/application.api";
import { zodResolver } from "@hookform/resolvers/zod";
import LoaderSubmitButton from "@/components/common/spinner/LoaderSubmitButton";
import { CircleCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StatusFormData } from "@/types/formData";
import { statusFormSchema } from "@/types/schema";
import { useSelectedCompany } from "@/hooks/useSelectedCompany";

interface StatusChangeModalProps {
  status: ApplicationStatus;
  loading?: boolean;
  triggerClassName?: string;
  index: number,
  currentStatus: ApplicationStatus,
  setCurrentStatus: React.Dispatch<React.SetStateAction<ApplicationStatus>>
}

export const StatusChangeDialog: React.FC<StatusChangeModalProps> = ({
  status,
  triggerClassName = "",
  currentStatus,
  index,
  setCurrentStatus
}) => {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
  const company = useSelectedCompany()
  const { toast } = useToast();

     
   const statuses = useMemo(() => [
      "inreview",
      "shortlisted",
      "interview",
      "selected",
      "rejected",
    ], []);

    const statusIndex = useMemo(() => 
      statuses.indexOf(currentStatus), 
      [currentStatus, statuses]
    );

   const isDisable = (index: number) => {
      if(currentStatus === ApplicationStatus.Applied) return false;
  
       return index <= statusIndex && currentStatus != ApplicationStatus.Rejected
    }
  
  const form = useForm<StatusFormData>({
    resolver: zodResolver(statusFormSchema),
    defaultValues: {
      status: status.toLowerCase() as StatusFormData['status'],
      title: "",
      description: "",
    },
  });

  useEffect(() => {
     console.log("stage", status, isDisable(index), currentStatus, statusIndex);
     
  }, [])

  const applicationMutation = useMutation({
    mutationFn: ApplicationApi.changeApplicationStatus,
    onSuccess: () => {
      form.reset();
      setCurrentStatus(status);
      closeRef.current?.click();
      toast({
        description: (
          <div className="flex items-center gap-x-2">
            <CircleCheck className="w-10 h-10 text-green-600"/>
            <h1>Application Status changed successfully</h1>
          </div>
        )
      });
    },
    onError: (error: unknown) => {
      console.error('Status change failed:', error);
    },
  });

  const handleSubmition = useCallback(async (data: StatusFormData) => {
    try {
      applicationMutation.mutate({ data, id: company?._id });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }, [applicationMutation, company?._id]);

 return (
  <AlertDialog>
  <AlertDialogTrigger  asChild>
    <button
      disabled={isDisable(index)}
      className={`h-full w-full flex justify-start items-center ${triggerClassName}`}
    >
      {config?.buttonText}
    </button>
  </AlertDialogTrigger>

  <AlertDialogContent>
    <AlertDialogHeader>
      <h2 className="text-lg font-semibold">{config.title}</h2>
      <div className="w-full">
        <Form {...form}>
          <form
            className="w-full flex flex-col gap-5"
            onSubmit={form.handleSubmit(handleSubmition)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold capitalize">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={config.titlePlaceholder}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a clear and concise title
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={config.descriptionPlaceholder}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide detailed information about this status change
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <AlertDialogCancel
                ref={closeRef}
                className="bg-secondary hover:bg-secondary/80"
              >
                Cancel
              </AlertDialogCancel>
              <LoaderSubmitButton state={applicationMutation.isLoading}>
                Save
              </LoaderSubmitButton>
             
            </div>
          </form>
        </Form>
        
      </div>
    </AlertDialogHeader>
    <AlertDialogFooter></AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
 )
}