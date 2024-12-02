import React, { useEffect, useState } from "react";
import { X, Paperclip, CircleCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Button } from "@/components/ui/button";
import { useGetUser } from "@/hooks/useGetUser";
import { ProfileApi } from "@/api/Profile.api";
import { ApplicationApi } from "@/api/application.api";
import ResumeFile from "./ResumeFile";
import { useProfile } from "@/hooks/useResume";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/reducers/authSlice";
import { useMutation } from "react-query";
import LoaderSubmitButton from "../common/spinner/LoaderSubmitButton";
import { useToast } from "@/hooks/use-toast";
import { JobApplicationFormProps } from "@/types/application";
import { Spinner } from "../common/spinner/Loader";
import { AxiosError, HttpStatusCode } from "axios";
import { queryClient } from "@/main";

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({
  companyId,
  jobId,
  onClose,
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [state, setState] = useState<boolean>(false);
  const user = useGetUser();
  const profile = useProfile();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const formSchema = z
    .object({
      fullName: z
        .string()
        .min(2, "Full name must be at least 2 characters")
        .transform((name) => (name == user.username ? undefined : name)),
      email: z
        .string()
        .email("Invalid email address")
        .transform((email) => (email === user.email ? undefined : email)),
      phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
        .transform((phone) => (phone === user.phone ? undefined : phone)),
      linkedinUrl: z
        .string()
        .url("Invalid LinkedIn URL")
        .optional()
        .or(z.literal("")),
      portfolioUrl: z
        .string()
        .url("Invalid Portfolio URL")
        .optional()
        .or(z.literal("")),
      coverLetter: z
        .string()
        .max(500, "Additional information must not exceed 500 characters")
        .optional()
        .or(z.literal("")),
      resume: z
        .string()
        .refine((resume) => resume.length > 0, "Upload your resume"),
    })
    .transform((data) => {
      return Object.fromEntries(
        Object.entries(data).filter(
          ([_, value]) => value !== undefined && value !== null && value !== ""
        )
      );
    });

  const resumeSchema = z.object({
    resume: z
      .instanceof(FileList)
      .refine((files) => files.length > 0, "Resume is required")
      .transform((files) => files[0])
      .refine((files) => files.size <= 5000000, "Resume must be less than 5MB")
      .refine(
        (files) =>
          [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ].includes(files.type),
        "Resume must be in PDF or Word format"
      ),
  });

  type FormValues = z.infer<typeof formSchema>;
  type ResumeValues = z.infer<typeof resumeSchema>;

  const resumeForm = useForm<ResumeValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      resume: undefined,
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      linkedinUrl: "",
      portfolioUrl: "",
      coverLetter: "",
      resume: "",
    },
  });

  const resumeMutation = useMutation({
    mutationFn: ProfileApi.uploadResume,
    onSuccess: (data, variables) => {
      const filename = resumeForm.getValues("resume");
      if (filename) {
        const resumeKey = `${user._id}${filename[0].name}`;
        form.setValue("resume", resumeKey);
        dispatch(setUser(resumeKey));
        queryClient.invalidateQueries({ queryKey: ['isApplied'] });
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CircleCheck className="text-green-800" size={20} />
              <h1>Resume uploaded Successfully</h1>
            </div>
          ),
        });
      }

    },
    onError: (error) => {
      toast({
        title: "Error uploading resume",
        variant: "destructive",
      });
    },
  });

  const applicationMutation = useMutation({
    mutationFn: ApplicationApi.jobApplication,
    onSuccess: () => {
      toast({
        title: (
          <div className="flex items-center gap-2">
            <CircleCheck className="text-green-800" size={20} />
            <h1>Application has been sent</h1>
          </div>
        ),
      });
      onClose(false);
    },

    onError: (error: AxiosError) => {

      if (error.status === HttpStatusCode.Conflict) {
        toast({
          title: "You have already submitted the application",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Error submitting application try again",
        variant: "destructive",
      });
    },
  });

  const onResumeSubmit = async (data) => {
    resumeMutation.mutate({ data });
  };

  const onSubmit = async (data: FormValues) => {
    const applicationData = {
      ...data,
      applicantId: user._id,
      jobId,
      companyId,
    };
    console.log("application", applicationData)
    applicationMutation.mutate({ data: applicationData });
  };

  return (
    <div className="bg-white md:p-6 rounded w-full md:mx-auto">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedinUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URL</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="LinkedIn URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="portfolioUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio URL</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="Portfolio URL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="coverLetter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Letter</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a cover letter or anything else you want to share"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="flex justify-end text-sm text-gray-500 mt-1">
                    <span>0 / 500</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              {profile &&
                profile?.resumeKey?.map((key, index) => (
                  <ResumeFile
                    key={index}
                    fileName={key}
                    onDownload={() => {}}
                    setResume={() => {
                      form.setValue("resume", key);
                      setState(!state);
                    }}
                    active={key === form.getValues("resume")}
                  />
                ))}
            </div>

            <FormField
              control={resumeForm.control}
              name="resume"
              render={({ field: { onChange, onBlur, name, ref } }) => (
                <FormItem>
                  <FormLabel>Attach your resume</FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-center justify-center w-full">
                      <label
                        htmlFor="resume"
                        className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Paperclip className="w-6 h-6 text-gray-400 mb-2" />
                          {fileName ? (
                            <p className="text-sm text-gray-500">{fileName}</p>
                          ) : (
                            <p className="text-sm text-gray-500">
                              Attach Resume/CV (PDF or MS Word)
                            </p>
                          )}
                        </div>
                        <input
                          id="resume"
                          type="file"
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              resumeForm.setValue("resume", e.target.files);
                              setFileName(file.name);
                            }
                          }}
                          onBlur={onBlur}
                          name={name}
                          ref={ref}
                        />
                      </label>
                      <FormMessage className="self-start mt-1" />
                      <div className="self-end mt-2">
                        <Button
                          type="button"
                          onClick={() =>
                            resumeForm.handleSubmit(onResumeSubmit)()
                          }
                          className="bg-gradient-to-b from-orange-500 to-orange-600 text-white focus:ring-2 focus:ring-orange-400 hover:shadow-xl transition duration-200"
                          variant="default"
                        >
                          {resumeMutation.isLoading ? (
                            <>
                              <Spinner color="#f9fafb" size={20} />
                              <span>saving</span>
                            </>
                          ) : (
                            "Upload resume"
                          )}
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <LoaderSubmitButton state={applicationMutation.isLoading}>
              Submit
            </LoaderSubmitButton>
          </form>
        </Form>

        <p className="text-xs text-gray-500 mt-4">
          By sending this, you confirm that you agree to our Terms of Service
          and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default JobApplicationForm;
