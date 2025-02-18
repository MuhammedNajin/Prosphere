import React, { useState } from "react";
import { Paperclip, CircleCheck, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGetUser } from "@/hooks/useGetUser";
import { ProfileApi } from "@/api/Profile.api";
import { ApplicationApi } from "@/api/application.api";
import ResumeFile from "./ResumeFile";
import { useResume } from "@/hooks/useResume";
import { useDispatch } from "react-redux";
import { setResume } from "@/redux/reducers/authSlice";
import { useMutation, useQueryClient } from "react-query";
import LoaderSubmitButton from "../common/spinner/LoaderSubmitButton";
import { useToast } from "@/hooks/use-toast";
import { JobApplicationFormProps } from "@/types/application";
import { Spinner } from "../common/spinner/Loader";
import { AxiosError, HttpStatusCode } from "axios";
import { ApplicationFormData, ResumeValues } from "@/types/formData";
import { jobApplicationFormSchema, resumeSchema } from "@/types/schema";

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({
  companyId,
  jobId,
  onClose,
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [state, setState] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<any | null>(null);
  const [charCount, setCharCount] = useState<number>(0);
  const user = useGetUser();
  const profile = useResume();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const resumeForm = useForm<ResumeValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      resume: undefined,
    },
  });

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(jobApplicationFormSchema),
    defaultValues: {
      fullName: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      linkedinUrl: "",
      portfolioUrl: "",
      coverLetter: "",
      resume: "",
    },
  });

  const resumeMutation = useMutation({
    mutationFn: ProfileApi.uploadResume,
    onSuccess: () => {
      setUploadError(null);
      const filename = resumeForm.getValues("resume");
      if (filename && filename instanceof FileList && filename.length > 0) {
        const resumeKey = `${user?._id}${filename[0].name}`;
        form.setValue("resume", resumeKey);
        dispatch(setResume(resumeKey));

        toast({
          description: (
            <div className="flex items-center gap-2">
              <CircleCheck className="text-green-800" size={20} />
              <h1>Resume uploaded Successfully</h1>
            </div>
          ),
        });
      }
    },
    onError: (error: any) => {
      let errorMessage = "Error uploading resume";

      // Handle specific validation errors from the schema
      if (error.message) {
        if (error.message.includes("5MB")) {
          errorMessage = "Resume file size must be less than 5MB";
        } else if (error.message.includes("PDF or Word")) {
          errorMessage = "Resume must be in PDF or Word format";
        }
      }

      setUploadError(errorMessage);
      toast({
        description: (
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-800" size={20} />
            <h1>{errorMessage}</h1>
          </div>
        ),
        variant: "destructive",
      });
    },
  });

  const applicationMutation = useMutation({
    mutationFn: ApplicationApi.jobApplication,
    onSuccess: () => {
      queryClient.invalidateQueries("isApplied");
      toast({
        description: (
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
          description: "You have already submitted the application",
          variant: "destructive",
        });
        return;
      }

      toast({
        description: "Error submitting application try again",
        variant: "destructive",
      });
    },
  });

  const onResumeSubmit = async (data: ResumeValues) => {
    resumeMutation.mutate({ data });
  };

  const onSubmit = async (data: ApplicationFormData) => {
    if (!user?._id) return;

    const applicationData = {
      ...data,
      applicantId: user._id,
      jobId,
      companyId,
    };
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
                      maxLength={500}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setCharCount(e.target.value.length);
                      }}
                    />
                  </FormControl>
                  <FormDescription className="flex justify-end text-sm text-gray-500 mt-1">
                    <span>{charCount} / 500</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              {profile &&
                profile?.map((key: string, index: number) => (
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
              render={({ field: { onBlur, name, ref } }) => (
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
                            const files = e.target.files;
                            const file = files?.[0];
                            if (file) {
                              resumeForm.setValue("resume", files);
                              setFileName(file.name);
                              setUploadError(null); // Clear any previous errors
                            }
                          }}
                          onBlur={onBlur}
                          name={name}
                          ref={ref}
                        />
                      </label>
                      {uploadError && (
                        <Alert variant="destructive" className="mt-2 w-full">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{uploadError}</AlertDescription>
                        </Alert>
                      )}
                      <FormMessage className="self-start mt-1" />
                      <div className="self-end mt-2">
                        <Button
                          type="button"
                          onClick={() => {
                            resumeForm.handleSubmit(
                              (data) => {
                                onResumeSubmit(data);
                              },
                              (errors) => {
                                if (errors.resume) {
                                  setUploadError(errors.resume.message);
                                }
                              }
                            )();
                          }}
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
  