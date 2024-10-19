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
    <div className="space-y-6 max-w-3xl mx-auto p-4">
    <FormField
      control={form.control}
      name="jobDescription"
      render={({ field }) => (
        <FormItem className="space-y-4 sm:space-y-0 sm:flex sm:items-start sm:gap-4 border-t border-b py-6">
          <div className="space-y-1 sm:w-1/3">
            <FormLabel className="font-medium text-md">Job Description</FormLabel>
            <FormDescription>Describe the job role in detail</FormDescription>
          </div>
          <FormControl className="sm:w-2/3">
            <Textarea {...field} placeholder="Enter your job description" className="min-h-[100px]" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="responsibility"
      render={({ field }) => (
        <FormItem className="space-y-4 sm:space-y-0 sm:flex sm:items-start sm:gap-4 border-t border-b py-6">
          <div className="space-y-1 sm:w-1/3">
            <FormLabel className="font-medium text-md">Responsibilities</FormLabel>
            <FormDescription>Outline the core responsibilities of the position</FormDescription>
          </div>
          <FormControl className="sm:w-2/3">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Textarea
                  value={responsibility}
                  onChange={(e) => setResponsibility(e.target.value)}
                  className="flex-grow"
                  placeholder="Add Responsibility"
                />
                <Button
                  type="button"
                  onClick={() => handleAdd("responsibility", responsibility, setResponsibility)}
                  className="w-full sm:w-auto px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                >
                  Add
                </Button>
              </div>
              <div className="mt-2">
                <ul className="space-y-2">
                  {field.value && field.value.map((el, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CiCircleCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{el}</span>
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
        <FormItem className="space-y-4 sm:space-y-0 sm:flex sm:items-start sm:gap-4 border-t border-b py-6">
          <div className="space-y-1 sm:w-1/3">
            <FormLabel className="font-medium text-md">Qualifications</FormLabel>
            <FormDescription>Add your preferred candidate qualifications</FormDescription>
          </div>
          <FormControl className="sm:w-2/3">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Textarea
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="flex-grow"
                  placeholder="Add Qualification"
                />
                <Button
                  type="button"
                  onClick={() => handleAdd("qualifications", qualification, setQualification)}
                  className="w-full sm:w-auto px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                >
                  Add
                </Button>
              </div>
              <div className="mt-2">
                <ul className="space-y-2">
                  {field.value && field.value.map((el, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CiCircleCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{el}</span>
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
        <FormItem className="space-y-4 sm:space-y-0 sm:flex sm:items-start sm:gap-4 border-t border-b py-6">
          <div className="space-y-1 sm:w-1/3">
            <FormLabel className="font-medium text-md">Nice-To-Have</FormLabel>
            <FormDescription>Add nice-to-have skills and qualifications for the role</FormDescription>
          </div>
          <FormControl className="sm:w-2/3">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Textarea
                  value={niceToHave}
                  onChange={(e) => setNiceToHave(e.target.value)}
                  className="flex-grow"
                  placeholder="Add additional skill"
                />
                <Button
                  type="button"
                  onClick={() => handleAdd("niceToHave", niceToHave, setNiceToHave)}
                  className="w-full sm:w-auto px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                >
                  Add
                </Button>
              </div>
              <div className="mt-2">
                <ul className="space-y-2">
                  {field.value && field.value.map((el, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CiCircleCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{el}</span>
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

    <div className="flex justify-end pt-4">
      <Button value="2" onClick={handleNext} type="button">
        Next
      </Button>
    </div>
  </div>
  );
};

export default CreateJobModalTwo;