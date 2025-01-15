import React from "react";
import { ProfileApi } from "@/api/Profile.api";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover-dialog";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import EnhancedCalendar from "./Calender";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "react-query";
import { queryClient } from "@/main";
import ErrorMessage from "../common/Message/ErrorMessage";
import SuccessMessage from "../common/Message/SuccessMessage";
import LoaderSubmitButton from "../common/spinner/LoaderSubmitButton";
import { HttpStatusCode } from "axios";

interface EducationForm {
  education?: {
    school?: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: Date;
    endDate?: Date;
    currentlyStudying?: boolean;
    grade?: string;
  };
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

function EducationForm({
  education = {
    school: "",
    degree: "",
    fieldOfStudy: "",
    startDate: undefined,
    endDate: undefined,
    currentlyStudying: false,
    grade: "",
  },
  onClose,
}: EducationForm) {
  const { user } = useSelector((state: any) => state.auth);

  const formSchema = z
    .object({
      school: z.string().min(1, "School name is required"),
      degree: z.string().min(1, "Degree is required"),
      fieldOfStudy: z.string().min(1, "Field of study is required"),
      startDate: z.date({
        required_error: "Start date is required",
      }),
      endDate: z.date().optional(),
      currentlyStudying: z.boolean(),
      grade: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.currentlyStudying) return true;
        if (!data.endDate) return false;
        return data.startDate <= data.endDate;
      },
      {
        message: "End date must be after start date",
        path: ["endDate"],
      }
    );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      school: education?.school || "",
      degree: education?.degree || "",
      fieldOfStudy: education?.fieldOfStudy || "",
      startDate: education?.startDate || undefined,
      endDate: education?.endDate || undefined,
      currentlyStudying: education?.currentlyStudying || false,
      grade: education?.grade || "",
    },
  });

  const { toast } = useToast();
  const { mutate: updateEducation, isLoading } = useMutation({
    mutationFn: ProfileApi.updateProfile,
    onSuccess: () => {
      toast({
        title: (
          <SuccessMessage
            className=""
            message="Education details updated successfully"
          />
        ),
      });

      queryClient.invalidateQueries({ queryKey: ["profile"] });

      onClose(false);
    },

    onError: (error) => {
      console.error("Full error object:", error);
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);

      if (error.response?.status === HttpStatusCode.BadRequest) {
        const errorMessage =
          error.response.data?.errors?.[0]?.message || "Invalid request";
        console.log("Error message being used:", errorMessage);
        toast({
          title: <ErrorMessage message={errorMessage} />,
          className: "bg-red-500 text-white",
        });
        return;
      }

      toast({
        title: <ErrorMessage message="Failed to update education details" />,
      });
      console.error("Error updating education:", error);
    },
  });

  async function onSubmit(data: any) {
    const payloadData = {
      education: data,
    };

    updateEducation({ data: payloadData, email: user.email, array: true });
  }
  const currentlyStudying = form.watch("currentlyStudying");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex gap-x-6 ">
          <FormField
            control={form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School</FormLabel>
                <FormControl>
                  <Input
                    className="w-60"
                    placeholder="Enter school name"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="degree"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Degree</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-60">
                      <SelectValue placeholder="Select degree" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="bachelor">Bachelor's</SelectItem>
                    <SelectItem value="master">Master's</SelectItem>
                    <SelectItem value="phd">Ph.D.</SelectItem>
                    <SelectItem value="associate">Associate's</SelectItem>
                    <SelectItem value="diploma">Diploma</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-x-6">
          <FormField
            control={form.control}
            name="fieldOfStudy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field of Study</FormLabel>
                <FormControl>
                  <Input
                    className="w-60"
                    placeholder="Enter field of study"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade (Optional)</FormLabel>
                <FormControl>
                  <Input
                    className="w-60"
                    placeholder="Enter grade"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-x-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <EnhancedCalendar
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        disabled={currentlyStudying}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <EnhancedCalendar
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="currentlyStudying"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    if (checked) {
                      form.setValue("endDate", undefined);
                    }
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>I am currently studying here</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <LoaderSubmitButton state={isLoading}>Save</LoaderSubmitButton>
        </div>
      </form>
    </Form>
  );
}

export default EducationForm;
