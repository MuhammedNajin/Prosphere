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
import { PaymentApi } from "@/api/payment.api";
import { AxiosError, HttpStatusCode } from "axios";
import { useToast } from "@/hooks/use-toast";
import SuccessMessage from "@/components/common/Message/SuccessMessage";
import ErrorMessage from "@/components/common/Message/ErrorMessage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlanData, PlanType } from "@/types/subscription";

const planSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Plan name must be at least 2 characters" }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number" }),
  type: z.nativeEnum(PlanType),
  durationInDays: z.coerce
    .number()
    .positive({ message: "Duration must be a positive number" }),
  jobPostLimit: z.coerce
    .number()
    .int()
    .min(0, { message: "Job post limit must be non-negative" }),
  videoCallLimit: z.coerce
    .number()
    .int()
    .min(0, { message: "Featured jobs must be non-negative" }),
  resumeAccess: z.coerce
    .number()
    .int()
    .min(0, { message: "Resume access must be non-negative" }),
  features: z.array(z.string()),
});

interface SubscriptionFormProps {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDialogOpen: boolean;
  initialData?: PlanData & {
    jobPostLimit?: number;
    videoCallLimit?: number;
    resumeAccess?: number;
  };
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  initialData,
}) => {
    const [feature, setFeatures] = useState("");
    const { toast } = useToast();
  
    const form = useForm<z.infer<typeof planSchema>>({
      resolver: zodResolver(planSchema),
      defaultValues: {
        name: "",
        price: 0,
        type: PlanType.BASIC,
        durationInDays: 30,
        jobPostLimit: 0,
        videoCallLimit: 0,
        resumeAccess: 0,
        features: [],
      },
    });
  
    useEffect(() => {
      if (initialData) {
        form.reset({
          name: initialData.name || "",
          price: initialData.price || 0,
          type: initialData.type || PlanType.BASIC,
          durationInDays: initialData.durationInDays || 30,
          jobPostLimit: initialData.featuresLimit?.jobPostLimit || 0,
          videoCallLimit: initialData.featuresLimit?.videoCallLimit || 0,
          resumeAccess: initialData.featuresLimit?.resumeAccess || 0,
          features: initialData.features || [],
        });
      }
    }, [initialData, form.reset]);
  
    const getChangedFields = (values: z.infer<typeof planSchema>, initial: PlanData) => {
      const changes: Partial<PlanData> = {};
      
      if (values.name !== initial.name) changes.name = values.name;
      if (values.price !== initial.price) changes.price = values.price;
      if (values.type !== initial.type) changes.type = values.type;
      if (values.durationInDays !== initial.durationInDays) 
        changes.durationInDays = values.durationInDays;
  
  
      const featuresLimit: Partial<typeof initial.featuresLimit> = {};
      let hasFeatureLimitChanges = false;
  
      if (values.jobPostLimit !== initial.featuresLimit?.jobPostLimit) {
        featuresLimit.jobPostLimit = values.jobPostLimit;
        hasFeatureLimitChanges = true;
      }
      if (values.videoCallLimit !== initial.featuresLimit?.videoCallLimit) {
        featuresLimit.videoCallLimit = values.videoCallLimit;
        hasFeatureLimitChanges = true;
      }
      if (values.resumeAccess !== initial.featuresLimit?.resumeAccess) {
        featuresLimit.resumeAccess = values.resumeAccess;
        hasFeatureLimitChanges = true;
      }
  
      if (hasFeatureLimitChanges) {
        changes.featuresLimit = featuresLimit;
      }
  
    
      if (JSON.stringify(values.features) !== JSON.stringify(initial.features)) {
        changes.features = values.features;
      }
  
      return changes;
    };
  
    const onSubmit = (values: z.infer<typeof planSchema>) => {
      if (initialData) {

        const changedData = getChangedFields(values, initialData);
        
        if (Object.keys(changedData).length > 0) {
          planMutation.mutate(() => PaymentApi.updatePlan(initialData.id!, changedData));
        } else {
          setIsDialogOpen(false);
          toast({
            title: <SuccessMessage message="No changes were made to the plan." />
          });
        }
      } else {
   
        const newPlan: PlanData = {
          ...values,
          featuresLimit: {
            jobPostLimit: values.jobPostLimit,
            videoCallLimit: values.videoCallLimit,
            resumeAccess: values.resumeAccess,
          },
        };
  
        delete newPlan.jobPostLimit;
        delete newPlan.videoCallLimit;
        delete newPlan.resumeAccess;
  
        planMutation.mutate(() => PaymentApi.createPlan(newPlan));
      }
    };

    const planMutation = useMutation({
      mutationFn: (fn: () => Promise<any>) => fn(),
      onSuccess: (data) => {
        console.log(initialData ? "plan updated" : "plan created", data);
        setIsDialogOpen(false);
        form.reset();
        toast({
          title: (
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
          title: <ErrorMessage message={message} /> ,
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
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Plan Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter plan name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Plan Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select plan type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(PlanType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                name="durationInDays"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Duration (Days)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter duration"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="jobPostLimit"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Job Post Limit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Number of job posts"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoCallLimit"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Featured Jobs</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Number of featured jobs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="resumeAccess"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Resume Access</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Number of resume accesses"
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
