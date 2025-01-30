import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PiShoppingBagLight } from "react-icons/pi";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldErrors, FieldPath, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SecondModal from "./CreateJobModalTwo";
import CreateJobModalThree from "./CreateJobModalThree";
import { JobApi } from "../../api";
import { popularSkills } from "@/constants/popularSkill";
import { CircleCheck, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "react-query";
import { useToast } from "@/hooks/use-toast";
import { CreateJobProps, Job, UpdateJobProps } from "@/types/job";
import SuccessMessage from "../common/Message/SuccessMessage";
import { queryClient } from "@/main";
import ErrorMessage from "../common/Message/ErrorMessage";
import { setTrailLimit } from '@/redux/reducers/companySlice'
import { UsageStatsType } from "@/types/company";
import { useDispatch } from "react-redux";
import { JobFormData } from "@/types/formData";
import { jobFormSchema } from "@/types/schema";
import { AxiosError } from "axios";
import { useSelectedCompany } from "@/hooks/useSelectedCompany";
interface CreateJobModalProps {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  job: Job | null;
}

const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  job = null,
}) => {
  const [completion, setCompletion] = useState<1 | 2 | 3>(1);
  const [inputSkill, setInputSkill] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const [formStep] = useState([
    "Job information",
    "Job description",
    "Perks & benefits",
  ]);

  const [employmentTypes] = useState([
    "Full-Time",
    "Part-Time",
    "Remote",
    "Internship",
    "Contract",
  ]);

  const [minSalary, setMinSalary] = React.useState([5000]);
  const [maxSalary, setMaxSalary] = useState([50000]);

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      jobTitle: "",
      employment: "Full-Time",
      minSalary: 5000,
      maxSalary: 50000,
      skills: [],
      jobDescription: "",
      qualifications: [],
      niceToHave: [],
      responsibility: [],
      experience: 1,
      vacancies: 0,
      expiry: "",
      jobLocation: "",
      officeLocation: "",
    },
    mode: "onChange",
  });

  const getFirstErrorField = (errors: Object): FieldPath<JobFormData> | null  => {
    if (!errors) return null;
    return Object.keys(errors)[0] as FieldPath<JobFormData>;
  };

  useEffect(() => {
    if (job) {
      form.reset({
        jobTitle: job.jobTitle,
        employment: job.employment,
        minSalary: job.minSalary,
        maxSalary: job.maxSalary,
        skills: job.skills,
        jobDescription: job.jobDescription,
        qualifications: job.qualifications,
        niceToHave: job.niceToHave,
        responsibility: job.responsibility,
        experience: job.experience,
        vacancies: job.vacancies,
        expiry: job.expiry,
        jobLocation: job.jobLocation,
        officeLocation: job.officeLocation,
      });
    }
  }, [job])

  useEffect(() => {
    console.log("job", job);
    

    const errors: FieldErrors<JobFormData> = form.formState.errors;
    if (!errors) return;

    const firstErrorField = getFirstErrorField(errors)
    console.log("firstErrorField gettting error here", firstErrorField);
    
    if (firstErrorField) {
      form.setFocus(firstErrorField as keyof JobFormData);
   
      const element = document.getElementsByName(firstErrorField)[0];
      console.log("hi element", element);
      
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [form.formState.errors, form.setFocus]);

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const step = parseInt(e.currentTarget.value);
    switch (step) {
      case 1:
        const fieldsToValidate = [
          "jobTitle",
          "employment",
          "maxSalary",
          "minSalary",
          "skills",
        ] as const satisfies readonly (keyof JobFormData)[];

        const isValid = await form.trigger(fieldsToValidate);

        if (isValid) {
          setCompletion(2);
        } else {
          const errors = form.formState.errors;
          const firstErrorField = getFirstErrorField(errors);
          if (firstErrorField) {
            form.setFocus(firstErrorField);
          }
        }
        break;
      case 2:
        const step2Fields = [
          "jobDescription",
          "qualifications",
          "responsibility",
          "niceToHave",
        ] as const satisfies readonly (keyof JobFormData)[]; 
        const isStep2Valid = await form.trigger(step2Fields);

        if (isStep2Valid) {
          setCompletion(3);
        } else {
          const errors = form.formState.errors;
          const firstErrorField = getFirstErrorField(errors);
          if (firstErrorField) {
            form.setFocus(firstErrorField);
          }
        }
        break;
    }
  };

  const company = useSelectedCompany();
  const dispatch = useDispatch()



  const jobCreationMutation = useMutation({
    mutationFn: async (params: CreateJobProps | UpdateJobProps) => {
      if ('id' in params) {
        return JobApi.updateJob(params);
      }
      return JobApi.postJob(params);
    },
    onSuccess: () => {
      if(!job) {
         dispatch(setTrailLimit(UsageStatsType.JOB_POSTS_Limit));
      }
     toast({
       description: <SuccessMessage  message='Job posted successfully...'/>,
       
     });
     queryClient.invalidateQueries({ queryKey: ['jobs'] });
      
    onClose(false)
   },
   onError: (error: AxiosError) => {
     toast({
       description: <ErrorMessage message='Failed to post job. try again' />,
       className:"bg-red-500 text-white"
     });
     console.error("Error updating education:", error);
   },

  });
  
  const onSubmit = async (formData: JobFormData) => {
    if (!company?._id) {
      toast({
        description: <ErrorMessage message="Company information is missing" />,
        variant: "destructive"
      });
      return;
    }
  
    if (job) {
      if (!job._id) {
        toast({
          description: <ErrorMessage message="Job ID is missing" />,
          variant: "destructive"
        });
        return;
      }
      
      jobCreationMutation.mutate({
        formData,
        companyId: company._id,
        id: job._id as string
      });
    } else {
      jobCreationMutation.mutate({
        formData,
        companyId: company._id
      });
    }
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
      if (fields) {
        console.log("hola", fields);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      if (jobCreationMutation.isSuccess) {
        toast({
          description: (
            <div className="flex items-center gap-2">
              <CircleCheck className="text-green-800" size={20} />
              <h1>Company Created Successufully</h1>
            </div>
          ),
        });
      }
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("value", value);

    setInputSkill(value);
    if (value.length > 0) {
      const filtered = popularSkills.filter((skill) =>
        skill.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    console.log("kerii", inputSkill);
  };

  const handleSuggestionClick = (skill: string) => {
    console.log(skill, "skills");
    setInputSkill(skill);
    console.log("handle suggestions", inputSkill);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleAddSkill = () => {
    if (
      inputSkill.trim() &&
      !fields.some(
        (field) => field.name.toLowerCase() === inputSkill.trim().toLowerCase()
      )
    ) {
      append({ name: inputSkill.trim(), proficiency: "Beginner" });
      setInputSkill("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal>
      <DialogContent className="w-[90%] h-[90hv] md:max-w-4xl bg-white top-[50%] border shadow-none rounded-sm md:max-h-[90vh] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Post a Job
          </DialogTitle>
          <DialogDescription>
            <div className="flex flex-col  sm:flex-row p-3 gap-4 sm:gap-x-8 rounded-sm mt-2 mb-2 border">
              {formStep.map((el, index) => (
                <div
                  key={index}
                  className="flex flex-1 gap-4 justify-start items-center"
                >
                  <div
                    className={`rounded-full size-12 sm:size-14 ${
                      completion === index + 1
                        ? "bg-orange-500"
                        : "bg-[#FFF8F3]"
                    }  flex justify-center items-center`}
                  >
                    {index === 0 && (
                      <PiShoppingBagLight
                        key="job-info"
                        className={`size-6 ${
                          index + 1 === completion
                            ? "text-white"
                            : "text-gray-600"
                        } p-0`}
                      />
                    )}
                    {index === 1 && (
                      <HiOutlineClipboardDocumentList
                        key="job-desc"
                        className={`size-6 ${
                          index + 1 === completion
                            ? "text-white"
                            : "text-gray-600"
                        } p-0`}
                      />
                    )}
                    {index === 2 && (
                      <PiShoppingBagLight
                        key="job-info"
                        className={`size-6 ${
                          index + 1 === completion
                            ? "text-white"
                            : "text-gray-600"
                        } p-0`}
                      />
                    )}
                  </div>
                  <div>
                    <h1 className="text-sm sm:text-base">
                      Step {`${index + 1}/3`}
                    </h1>
                    <h2 className="text-sm sm:text-base">{el}</h2>
                  </div>
                </div>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto scrollbar-hide max-h-[calc(90vh-200px)] px-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {completion === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem className="flex flex-col sm:flex-row sm:gap-x-10 items-start sm:items-center border-t border-b py-4 sm:py-8">
                        <div className="flex flex-col gap-y-2 mb-2 sm:mb-0">
                          <FormLabel className="font-medium text-md">
                            Job Title
                          </FormLabel>
                          <FormDescription className="text-sm">
                            Job titles must describe one position
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Input
                            className="w-full sm:w-80"
                            placeholder="e.g: Software Engineer"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employment"
                    render={({ field }) => (
                      <FormItem className="flex flex-col sm:flex-row sm:gap-x-10 items-start sm:items-center border-t border-b py-4 sm:py-6">
                        <div className="flex flex-col gap-y-2 mb-2 sm:mb-0">
                          <FormLabel className="font-medium text-md">
                            Type of Employment
                          </FormLabel>
                          <FormDescription className="text-sm">
                            You can select multiple types of employment
                          </FormDescription>
                        </div>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                          >
                            {employmentTypes.map((el) => (
                              <div
                                key={el}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem value={el} id={el} />
                                <Label htmlFor={el} className="text-sm">
                                  {el}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minSalary"
                    render={({ field }) => (
                      <FormItem className="flex flex-col sm:flex-row sm:gap-x-10 items-start sm:items-center border-t border-b py-4 sm:py-6">
                        <div className="flex flex-col gap-y-2 mb-2 sm:mb-0">
                          <FormLabel className="font-medium text-md">
                            Minimum Salary
                          </FormLabel>
                          <FormDescription className="text-sm">
                            Specify the minimum salary for the role
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Input
                            className="w-full sm:w-80"
                            type="number"
                            {...field}
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                              setMinSalary([Number(e.target.value)]);
                            }}
                            value={minSalary[0]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxSalary"
                    render={({ field }) => (
                      <FormItem className="flex flex-col sm:flex-row sm:gap-x-10 items-start sm:items-center border-t border-b py-4 sm:py-6">
                        <div className="flex flex-col gap-y-2 mb-2 sm:mb-0">
                          <FormLabel className="font-medium text-md">
                            Maximum Salary
                          </FormLabel>
                          <FormDescription className="text-sm">
                            Specify the maximum salary for the role
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Input
                            className="w-full sm:w-80"
                            type="number"
                            {...field}
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                              setMaxSalary([Number(e.target.value)]);
                            }}
                            value={maxSalary[0]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="skills"
                    render={() => (
                      <FormItem className="flex flex-col sm:flex-row sm:gap-x-10 border-t border-b py-4 sm:py-6">
                        <div className="flex flex-col gap-y-2 mb-2 sm:mb-0">
                          <FormLabel className="font-medium text-md">
                            Skills
                          </FormLabel>
                          <FormDescription className="text-sm">
                            Add required skills for the job
                          </FormDescription>
                        </div>

                        <div className="flex flex-col w-full sm:w-auto">
                          <FormControl>
                            <div className="flex gap-2 mb-2 relative">
                              <Input
                                value={inputSkill}
                                onChange={handleInputChange}
                                onFocus={() => setShowSuggestions(true)}
                                placeholder="Enter a skill"
                                className="flex-grow"
                              />
                              <Button
                                className="bg-white text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white"
                                type="button"
                                onClick={handleAddSkill}
                              >
                                Add
                              </Button>
                              {showSuggestions && suggestions.length > 0 && (
                                <div
                                  ref={suggestionsRef}
                                  className="absolute z-10 w-full bg-white border border-gray-300 mt-12 rounded-md shadow-lg"
                                >
                                  {suggestions.map((skill, index) => (
                                    <div
                                      key={index}
                                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                      onClick={() =>
                                        handleSuggestionClick(skill)
                                      }
                                    >
                                      {skill}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {fields.map((field, index) => (
                              <Badge
                                key={field.id}
                                variant="secondary"
                                className="text-xs sm:text-sm text-orange-500 border border-orange-500 py-[5px]"
                              >
                                {field.name}
                                <select
                                  value={field.proficiency}
                                  onChange={(e) =>
                                    form.setValue(
                                      `skills.${index}.proficiency`,
                                      e.target.value as "Beginner" | "Intermediate" | "Advanced" | "Expert"
                                    )
                                  }
                                  className="ml-2 bg-transparent border-none text-xs sm:text-sm"
                                >
                                  <option value="Beginner">Beginner</option>
                                  <option value="Intermediate">
                                    Intermediate
                                  </option>
                                  <option value="Advanced">Advanced</option>
                                  <option value="Expert">Expert</option>
                                </select>
                                <X
                                  className="ml-2 h-3 w-3 sm:h-4 sm:w-4 cursor-pointer"
                                  onClick={() => remove(index)}
                                />
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="pt-4 pr-2">
                    <Button
                      value="1"
                      onClick={handleNext}
                      type="button"
                      className="w-full sm:w-auto px-8"
                    >
                      Next
                    </Button>
                  </DialogFooter>
                </>
              )}
              {completion === 2 && (
                <SecondModal handleNext={handleNext} form={form} />
              )}
              {completion === 3 && (
                <CreateJobModalThree
                  form={form}
                  mutation={jobCreationMutation}
                />
              )}
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobModal;
