import React, { useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { DialogFooter } from "@/components/ui/dialog";
import { CiCircleCheck, CiTrash } from "react-icons/ci";
import { cn } from "@/lib/utils";

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
    if (!value.trim()) return;
    const currentValues = form.getValues(fieldName) || [];
    form.setValue(fieldName, [...currentValues, value.trim()]);
    setValue("");
  };

  const handleRemove = (fieldName: string, index: number) => {
    const currentValues = form.getValues(fieldName) || [];
    const newValues = currentValues.filter((_, i) => i !== index);
    form.setValue(fieldName, newValues);
  };

  const renderField = (
    fieldName: string,
    label: string,
    description: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    placeholder: string
  ) => (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState }) => (
        <FormItem className="space-y-4 sm:space-y-0 sm:flex sm:items-start bg-white sm:gap-6 border-b py-8">
          <div className="space-y-2 sm:w-1/3">
            <FormLabel className="text-lg font-semibold text-gray-900">{label}</FormLabel>
            <FormDescription className="text-sm text-gray-600">{description}</FormDescription>
          </div>
          <div className="sm:w-2/3 space-y-2">
            <FormControl>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-grow">
                    <Textarea
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className={cn(
                        "resize-none bg-white focus:ring-2 focus:ring-orange-500/20",
                        fieldState?.error && "border-red-500 focus:ring-red-500/20"
                      )}
                      placeholder={placeholder}
                    />
                    {/* Error message positioned directly under the textarea */}
                    <FormMessage className="mt-1 text-xs" />
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleAdd(fieldName, value, setValue)}
                    disabled={!value.trim()}
                    className={cn(
                      "w-full sm:w-24 bg-orange-500 text-white hover:bg-orange-600 transition-colors",
                      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-500"
                    )}
                  >
                    Add
                  </Button>
                </div>
                <div className="mt-4">
                  <ul className="space-y-3">
                    {field.value && field.value.map((el: string, index: number) => (
                      <li 
                        key={index} 
                        className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
                      >
                        <CiCircleCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 flex-grow">{el}</span>
                        <button
                          type="button"
                          onClick={() => handleRemove(fieldName, index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove item"
                        >
                          <CiTrash className="w-5 h-5 text-red-500 hover:text-red-600" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FormControl>
          </div>
        </FormItem>
      )}
    />
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Job Details</h2>
        <p className="text-gray-600">Fill in the details about the position you're hiring for.</p>
      </div>

      <FormField
        control={form.control}
        name="jobDescription"
        render={({ field, fieldState }) => (
          <FormItem className="space-y-4 sm:space-y-0 sm:flex sm:items-start sm:gap-6 border-b py-8">
            <div className="space-y-2 sm:w-1/3">
              <FormLabel className="text-lg font-semibold text-gray-900">Job Description</FormLabel>
              <FormDescription className="text-sm text-gray-600">
                Provide a comprehensive overview of the role and its context within your organization.
              </FormDescription>
            </div>
            <div className="sm:w-2/3 space-y-2">
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Enter a detailed job description..." 
                  className={cn(
                    "min-h-[200px] bg-white resize-none focus:ring-2 focus:ring-orange-500/20",
                    fieldState?.error && "border-red-500 focus:ring-red-500/20"
                  )}
                />
              </FormControl>
              {/* Error message positioned directly under the textarea */}
              <FormMessage className="text-xs" />
            </div>
          </FormItem>
        )}
      />

      {renderField(
        "responsibility",
        "Responsibilities",
        "List the key duties and expectations for this role",
        responsibility,
        setResponsibility,
        "Add a key responsibility..."
      )}

      {renderField(
        "qualifications",
        "Required Qualifications",
        "Specify the essential qualifications candidates must have",
        qualification,
        setQualification,
        "Add a required qualification..."
      )}

      {renderField(
        "niceToHave",
        "Nice-to-Have Skills",
        "Add preferred skills that would be beneficial but aren't mandatory",
        niceToHave,
        setNiceToHave,
        "Add a preferred skill..."
      )}

      <div className="flex justify-end pt-8">
        <Button 
          value="2" 
          onClick={handleNext} 
          type="button"
          className="bg-orange-500 text-white hover:bg-orange-600 transition-colors px-6"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
};

export default CreateJobModalTwo;