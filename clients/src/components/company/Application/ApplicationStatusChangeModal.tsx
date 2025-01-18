import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { STATUS_CONFIG } from "@/types/application";
import { useMutation } from "react-query";
import { ApplicationApi } from "@/api/application.api";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import LoaderSubmitButton from "@/components/common/spinner/LoaderSubmitButton";
import { title } from "process";
import { CircleCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define the status type
export type ApplicationStatus =
   "All"
  | "Applied"
  | "Inreview"
  | "Shortlisted"
  | "Interview"
  | "Rejected"
  | "Selected";

interface StatusChangeModalProps {
  status: ApplicationStatus;
  loading?: boolean;
  triggerClassName?: string;
}

// Form schema and types
const statusFormSchema = z.object({
  status: z.enum([
    "Applied",
    "Inreview",
    "Shortlisted",
    "Interview",
    "Rejected",
    "Selected",
  ]),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export type StatusFormData = z.infer<typeof statusFormSchema>;

export const StatusChangeDialog: React.FC<StatusChangeModalProps> = ({
  status,
  loading = false,
  triggerClassName = "",
}) => {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const config = STATUS_CONFIG[status];
  const { id } = useParams();
  const { toast } = useToast()
  const form = useForm<StatusFormData>({
    resolver: zodResolver(statusFormSchema),
    defaultValues: {
      status,
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    console.log("mounted");
    return () => {
      console.log(status);
    };
  }, []);

  const applicationMutation = useMutation({
    mutationFn: ApplicationApi.changeApplicationStatus,
    onSuccess: () => {
      console.log("sucesss");
      form.reset();
      closeRef.current?.click();
      toast({
        title: (
          <>
        <div className="flex items-center gap-x-2">
        <CircleCheck className="w-10 h-10 text-green-600"/>
        <h1>Application Status changed successfully</h1>
        </div>
          </>
        )
      });
    },
    onError: (error: unknown) => {
      console.log(error);
    },
  });

  const handleSubmition = async (data: StatusFormData) => {
    try {
      applicationMutation.mutate({ data, id });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className={`h-full w-full flex justify-start items-center ${triggerClassName}`}
        >
          {config.buttonText}
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
  );
};
