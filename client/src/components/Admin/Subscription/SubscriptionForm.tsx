import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoaderSubmitButton from "@/components/common/spinner/LoaderSubmitButton";
import { Textarea } from "@/components/ui/textarea";
import { CiCircleCheck } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useMutation } from "react-query";
import { PaymentApi } from "@/api/Payment.api";
import { AxiosError, HttpStatusCode } from "axios";
import { useToast } from "@/hooks/use-toast";
import SuccessMessage from "@/components/common/Message/SuccessMessage";
import ErrorMessage from "@/components/common/Message/ErrorMessage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlanData } from "@/types/subscription";

const DURATION_OPTIONS = {
  "1 Month": 30,
  "2 Months": 60,
  "3 Months": 90,
  "6 Months": 180,
  "1 Year": 365,
} as const;

type DurationOption = keyof typeof DURATION_OPTIONS;

const planSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Plan name must be at least 2 characters" }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number" }),
  duration: z.enum(Object.keys(DURATION_OPTIONS) as [DurationOption, ...DurationOption[]]),
  features: z.array(z.string()),
});

interface SubscriptionFormProps {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDialogOpen: boolean;
  initialData?: PlanData;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  initialData,
}) => {
  const [feature, setFeatures] = useState("");
  const { toast } = useToast();

  const getDurationOption = (days: number): DurationOption => {
    const options = Object.entries(DURATION_OPTIONS);
    return options.reduce((closest, [option, value]) => {
      if (Math.abs(value - days) < Math.abs(DURATION_OPTIONS[closest as DurationOption] - days)) {
        return option as DurationOption;
      }
      return closest;
    }, "1 Month" as DurationOption);
  };

  const form = useForm<z.infer<typeof planSchema>>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      price: 0,
      duration: "1 Month",
      features: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || "",
        price: initialData.price || 0,
        duration: getDurationOption(initialData.durationInDays || 30),
        features: initialData.features || [],
      });
    }
  }, [initialData, form.reset]);

  const getChangedFields = (values: z.infer<typeof planSchema>, initial: PlanData) => {
    const changes: Partial<PlanData> = {};
    
    if (values.name !== initial.name) changes.name = values.name;
    if (values.price !== initial.price) changes.price = values.price;
    
    const newDurationInDays = DURATION_OPTIONS[values.duration];
    if (newDurationInDays !== initial.durationInDays) {
      changes.durationInDays = newDurationInDays;
    }

    if (JSON.stringify(values.features) !== JSON.stringify(initial.features)) {
      changes.features = values.features;
    }

    return changes;
  };

  const onSubmit = (values: z.infer<typeof planSchema>) => {
    
    const submissionData = {
      ...values,
      durationInDays: DURATION_OPTIONS[values.duration],
    };
    delete (submissionData as any).duration;

    if (initialData) {
      const changedData = getChangedFields(values, initialData);
      
      if (Object.keys(changedData).length > 0) {
        planMutation.mutate(() => PaymentApi.updatePlan(initialData.id!, changedData));
      } else {
        setIsDialogOpen(false);
        toast({
          description: <SuccessMessage message="No changes were made to the plan." />
        });
      }
    } else {
      planMutation.mutate(() => PaymentApi.createPlan(submissionData));
    }
  };

  const planMutation = useMutation({
    mutationFn: (fn: () => Promise<any>) => fn(),
    onSuccess: (data) => {
      console.log(initialData ? "plan updated" : "plan created", data);
      setIsDialogOpen(false);
      form.reset();
      toast({
        description: (
          <SuccessMessage
            message={`Plan has been ${
              initialData ? "updated" : "created"
            } successfully..`}
          />
        ),
      });
    },
    onError: (err: AxiosError) => {
      console.log("err", err);
      let message = "Something went wrong, please try again..."
      if(err.status == HttpStatusCode.BadRequest) {
        message = "Plan already exist's"
      }
      toast({
        className: "bg-red-400",
        description: <ErrorMessage message={message} />,
      });
    },
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {!initialData && (
        <DialogTrigger asChild>
          <Button className="mb-4" onClick={() => setIsDialogOpen(true)}>
            Add New Plan
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Plan" : "Create New Plan"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 overflow-y-auto max-h-[80vh] scrollbar-hide p-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter plan name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter price"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Duration</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(DURATION_OPTIONS).map((duration) => (
                          <SelectItem key={duration} value={duration}>
                            {duration}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem className="space-y-4 sm:space-y-0 flex flex-col sm:items-start sm:gap-4 border-t border-b py-6">
                  <div className="space-y-1 sm:w-1/3">
                    <FormLabel className="font-medium text-md">
                      Features
                    </FormLabel>
                  </div>
                  <FormControl className="w-full">
                    <div className="space-y-4">
                      <div className="flex flex-col flex-1 sm:flex-row gap-2">
                        <Textarea
                          value={feature}
                          onChange={(e) => setFeatures(e.target.value)}
                          className="w-full"
                          placeholder="Mention the features here"
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            if (feature.trim()) {
                              form.setValue("features", [
                                ...field.value,
                                feature.trim(),
                              ]);
                              setFeatures("");
                            }
                          }}
                          className="w-full self-end sm:w-auto px-4 py-2 bg-orange-700 text-white hover:bg-orange-800 transition-colors"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="mt-2">
                        <ul className="space-y-2">
                          {field.value &&
                            field.value.map((el, index) => (
                              <li
                                key={index}
                                className="flex items-center space-x-2 justify-between"
                              >
                                <div className="flex items-center space-x-2">
                                  <CiCircleCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                                  <span className="text-sm">{el}</span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    const updatedFeatures = field.value.filter(
                                      (_, i) => i !== index
                                    );
                                    form.setValue("features", updatedFeatures);
                                  }}
                                  className="text-destructive hover:bg-destructive/10 h-8 w-8"
                                >
                                  ✕
                                </Button>
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

            <LoaderSubmitButton state={planMutation.isLoading}>
              {initialData ? "Update" : "Save"}
            </LoaderSubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionForm;