import React, { useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CiCircleCheck } from "react-icons/ci";
import { UseFormReturn } from "react-hook-form";
import { DialogFooter } from "@/components/ui/dialog";

interface CreateJobModalTwoProps {
  form: UseFormReturn<any>;
  handleNext: React.MouseEventHandler<HTMLButtonElement>;
}

const CreateJobModalTwo: React.FC<CreateJobModalTwoProps> = ({
  form,
  handleNext,
}) => {
  const [responsibility, setResponsibility] = useState("");
  const [qualification, setQualification] = useState("");
  const [niceToHave, setNiceToHave] = useState("");

  const handleAdd = (fieldName: string, value: string, setValue: React.Dispatch<React.SetStateAction<string>>) => {
    const currentValues = form.getValues(fieldName) || [];
    form.setValue(fieldName, [...currentValues, value]);
    setValue("");
  };

  return (
    <div>
      <FormField
        control={form.control}
        name="jobDescription"
        render={({ field }) => (
          <FormItem className="flex gap-x-10 items-center border-t border-b py-8">
            <div className="flex flex-col gap-y-2">
              <FormLabel className="font-medium text-md">
                Job Description
              </FormLabel>
              <FormDescription>
                Describe the job role in detail
              </FormDescription>
            </div>
            <FormControl>
              <Textarea {...field} placeholder="Enter your job description" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="responsibility"
        render={({ field }) => (
          <FormItem className="flex gap-x-10 border-t border-b py-8">
            <div className="flex flex-col gap-y-2">
              <FormLabel className="font-medium text-md">
                Responsibilities
              </FormLabel>
              <FormDescription>
                Outline the core responsibilities of the position
              </FormDescription>
            </div>
            <FormControl>
              <div>
                <div className="flex gap-x-4">
                  <Textarea
                    value={responsibility}
                    onChange={(e) => setResponsibility(e.target.value)}
                    className="w-96"
                    placeholder="Add Responsibility"
                  />
                  <Button
                  type="button"
                    onClick={() => handleAdd("responsibility", responsibility, setResponsibility)}
                    className="px-4 py-2 rounded-md border border-neutral-300 bg-orange-500 text-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md hover:bg-white hover:text-orange-500 hover:border-orange-500"
                  >
                    Add
                  </Button>
                </div>
                <div className="mt-5 max-w-lg">
                  <ul>
                    {field.value && field.value.map((el: string, index: number) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full bg-green-400 flex items-center justify-center">
                          <CiCircleCheck className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-black font-medium">{el}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="qualifications"
        render={({ field }) => (
          <FormItem className="flex gap-x-10 border-t border-b py-8">
            <div className="flex flex-col gap-y-2">
              <FormLabel className="font-medium text-md">
                Qualifications
              </FormLabel>
              <FormDescription>
                Add your preferred candidate qualifications
              </FormDescription>
            </div>
            <FormControl>
              <div>
                <div className="flex gap-x-5">
                  <Textarea
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-96"
                    placeholder="Add Qualification"
                  />
                  <Button
                   type="button"
                    onClick={() => handleAdd("qualifications", qualification, setQualification)}
                    className="px-4 py-2 rounded-md border border-neutral-300 bg-orange-500 text-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md hover:bg-white hover:text-orange-500 hover:border-orange-500"
                  >
                    Add
                  </Button>
                </div>
                <div className="mt-5 max-w-lg">
                  <ul>
                    {field.value && field.value.map((el: string, index: number) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full bg-green-400 flex items-center justify-center">
                          <CiCircleCheck className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-black font-medium">{el}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="niceToHave"
        render={({ field }) => (
          <FormItem className="flex gap-x-10 border-t border-b py-8">
            <div className="flex flex-col gap-y-2">
              <FormLabel className="font-medium text-md">
                Nice-To-Have
              </FormLabel>
              <FormDescription className="max-w-72">
                Add nice-to-have skills and qualifications for the role to
                encourage a more diverse set of candidates to apply
              </FormDescription>
            </div>
            <FormControl>
              <div>
                <div className="flex gap-x-4">
                  <Textarea
                    value={niceToHave}
                    onChange={(e) => setNiceToHave(e.target.value)}
                    className="w-96"
                    placeholder="Add additional skill"
                  />
                  <Button
                   type="button"
                    onClick={() => handleAdd("niceToHave", niceToHave, setNiceToHave)}
                    className="px-4 py-2 rounded-md border border-neutral-300 bg-orange-500 text-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md hover:bg-white hover:text-orange-500 hover:border-orange-500"
                  >
                    Add
                  </Button>
                </div>
                <div className="mt-5 max-w-lg">
                  <ul>
                    {field.value && field.value.map((el: string, index: number) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full bg-green-400 flex items-center justify-center">
                          <CiCircleCheck className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-black font-medium">{el}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <DialogFooter>
        <Button value="2" onClick={handleNext} type="button">
          Next
        </Button>
      </DialogFooter>
    </div>
  );
};

export default CreateJobModalTwo;