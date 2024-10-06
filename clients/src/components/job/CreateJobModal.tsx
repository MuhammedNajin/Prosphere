import React, { useState } from "react";
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
import { FaGift } from "react-icons/fa6";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SecondModal from "./CreateJobModalTwo";
import CreateJobModalThree from "./CreateJobModalThree";
import { JobApi } from '../../api'
import { useParams } from "react-router-dom";

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateJobModal: React.FC<CreateJobModalProps> = ({ isOpen, onClose }) => {
  const [completion, setCompletion] = useState<1 | 2 | 3>(1);

  const [formStep] = useState([
    [
      "Job information",
      <PiShoppingBagLight key="job-info" className="size-6 text-white p-0" />,
    ],
    [
      "Job description",
      <HiOutlineClipboardDocumentList key="job-desc" className="size-6 text-white p-0" />,
    ],
    ["Perks & benefits", <FaGift key="perks" className="size-6 text-white p-0" />],
  ]);
  const [employmentTypes] = useState([
    "Full-Time",
    "Part-Time",
    "Remote",
    "Internship",
    "Contract",
  ]);

  const formSchema = z.object({
    jobTitle: z.string().min(4, {
      message: "Job Title must be at least 4 characters",
    }),
    employment: z.enum(
      ["Full-Time", "Part-Time", "Remote", "Internship", "Contract"],
      {
        required_error: "Please select an employment type",
      }
    ),
    minSalary: z.number().min(1000, {
      message: "Minimum salary must be at least 1000",
    }),
    maxSalary: z.number().min(1000, {
      message: "Maximum salary must be at least 1000",
    }),
    skills: z.string(),
    jobDescription: z.string(),
    qualifications: z.array(z.string()),
    niceToHave: z.array(z.string()),
    responsibility: z.array(z.string()),
    experience: z.string(),
    vacancies: z.number(),
    expiry: z.string(),
    jobLocation: z.string(),
  });

  const [minSalary, setMinSalary] = React.useState([5000]);
  const [maxSalary, setMaxSalary] = useState([50000]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      employment: "Full-Time",
      minSalary: 5000,
      maxSalary: 50000,
      skills: "",
      jobDescription: "",
      qualifications: [],
      niceToHave: [],
      responsibility: [],
      experience: '',
      vacancies: 0,
      expiry: '',
      jobLocation: '',
    },
    mode: "onChange",
  });

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const step = parseInt(e.currentTarget.value);
    switch (step) {
      case 1:
        const isValid = await form.trigger([
          "jobTitle",
          "employment",
          "maxSalary",
          "minSalary",
        ]);
        if (isValid) setCompletion(2);
        break;
      case 2: 
        setCompletion(3);
        break;  
    }
  };

  const { id } = useParams()

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    console.log(formData);
    const response = await JobApi.postJob(formData, id);
    
  };

  
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal>
      <DialogContent className="w-3/4 max-w-4xl top-[50%] border shadow-none rounded-sm max-h-[80vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Post a Job
          </DialogTitle>
          <DialogDescription>
            <div className="flex p-3 gap-x-36 rounded-sm mt-2 mb-2 border">
              {formStep.map((el, index) => (
                <div key={index} className="flex gap-4 justify-center items-center">
                  <div className="rounded-full size-14 bg-orange-500 flex justify-center items-center">
                    {el[1]}
                  </div>
                  <div>
                    <h1>Step {`${index + 1}/3`}</h1>
                    <h2>{el[0]}</h2>
                  </div>
                </div>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {completion === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem className="flex gap-x-10 items-center border-t border-b py-8">
                        <div className="flex flex-col gap-y-2">
                          <FormLabel className="font-medium text-md">
                            Job Title
                          </FormLabel>
                          <FormDescription>
                            Job titles must describe one position
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Input
                            className="w-80"
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
                      <FormItem className="flex gap-x-10 items-center border-t border-b py-6">
                        <div className="flex flex-col gap-y-2">
                          <FormLabel className="font-medium text-md">
                            Type of Employment
                          </FormLabel>
                          <FormDescription>
                            You can select multiple types of employment
                          </FormDescription>
                        </div>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            {employmentTypes.map((el) => (
                              <div
                                key={el}
                                className="flex items-center space-x-4"
                              >
                                <RadioGroupItem value={el} id={el} />
                                <Label htmlFor={el}>{el}</Label>
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
                      <FormItem className="flex gap-x-10 items-center border-t border-b py-6">
                        <div className="flex flex-col gap-y-2">
                          <FormLabel className="font-medium text-md">
                            Minimum Salary
                          </FormLabel>
                          <FormDescription>
                            Specify the minimum salary for the role
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Input
                          className="w-80"
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
                      <FormItem className="flex gap-x-10 items-center border-t border-b py-6">
                        <div className="flex flex-col gap-y-2">
                          <FormLabel className="font-medium text-md">
                            Maximum Salary
                          </FormLabel>
                          <FormDescription>
                            Specify the maximum salary for the role
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Input
                          className="w-80"
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
                    render={({ field }) => (
                      <FormItem className="flex gap-x-14 items-center border-t border-b py-6">
                        <div className="flex flex-col gap-y-2">
                          <FormLabel className="font-medium text-md">
                            Required Skills
                          </FormLabel>
                          <FormDescription>
                            Add required skills for the job
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Input
                            className="w-80"
                            placeholder="e.g: JavaScript, React, Node.js"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button value="1" onClick={handleNext} type="button">
                      Next
                    </Button>
                  </DialogFooter>
                </>
              )}
              {completion === 2 && (
                <SecondModal handleNext={handleNext} form={form} />
              )}
              {completion === 3 && (
                <CreateJobModalThree form={form} />
              )}
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobModal;