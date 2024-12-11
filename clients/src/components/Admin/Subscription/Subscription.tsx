import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { CiCircleCheck } from "react-icons/ci";
import { useMutation, useQuery } from "react-query";
import { PaymentApi } from "@/api/payment.api";
import LoaderSubmitButton from "@/components/common/spinner/LoaderSubmitButton";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import SuccessMessage from "@/components/common/Message/SuccessMessage";
import ErrorMessage from "@/components/common/Message/ErrorMessage";
import { AdminApi } from "@/api";

enum PlanType {
  BASIC = "basic",
  Premium = "Premium",
}

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

const initialPlans = [
  {
    id: 1,
    name: "Basic Plan",
    price: 9.99,
    type: PlanType.BASIC,
    durationInDays: 30,
    features: {
      jobPostLimit: 5,
      featuredJobs: 1,
      resumeAccess: 10,
      emailSupport: true,
      phoneSupport: false,
      priorityListing: false,
    },
  },
  {
    id: 2,
    name: "Premium Plan",
    price: 29.99,
    type: PlanType.Premium,
    durationInDays: 30,
    features: {
      jobPostLimit: 20,
      featuredJobs: 5,
      resumeAccess: 50,
      emailSupport: true,
      phoneSupport: true,
      priorityListing: true,
    },
  },
];
interface PlanData {
  featuresLimit: {
    jobPostLimit: number;
    videoCallLimit: number;
    resumeAccess: number;
  };
  name: string;
  price: number;
  type: PlanType;
  durationInDays: number;
  jobPostLimit?: number;
  videoCallLimit?: number;
  resumeAccess?: number;
  features: string[];
}

export const PlanManagement: React.FC = () => {
  const [plans, setPlans] = useState(initialPlans);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const planMutation = useMutation({
    mutationFn: PaymentApi.createPlan,
    onSuccess: (data) => {
      console.log("plan created", data);
      setIsDialogOpen(false);
      form.reset();
      toast({
       children: <SuccessMessage message="Plan has been created successfully.." />
      })
    },
    onError: (err: AxiosError) => {
      console.log("err", err);
      toast({
        children: <ErrorMessage message="Something went wrong, please try again..." />
       })
    },
  });

  const { data } = useQuery({
     queryKey: ["plans"],
     queryFn: () => AdminApi.getSubscriptionPlans()
  })

  const onSubmit = (values: z.infer<typeof planSchema>) => {
    console.log("values", values);
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

    planMutation.mutate({ newPlan });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Plan Management</h1>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4" onClick={() => setIsDialogOpen(true)}>
            Add New Plan
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Plan</DialogTitle>
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
                    <FormItem>
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
                    <FormItem>
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
                        <SelectContent className="">
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

              <div className="flex gap2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
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
                    <FormItem>
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
                    <FormItem>
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
                    <FormItem>
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
                            placeholder=" Metion the features here"
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              form.setValue("features", [
                                ...field.value,
                                feature,
                              ]);
                              setFeatures("");
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
                                  className="flex items-center space-x-2"
                                >
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

              <LoaderSubmitButton state={planMutation.isLoading}>
                Save
              </LoaderSubmitButton>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Table>
        <TableCaption>List of Available Plans</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Job Posts</TableHead>
            <TableHead>Resume Access</TableHead>
            <TableHead>Vedio call limit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          { data && data?.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell>{plan.id}</TableCell>
              <TableCell>{plan.name}</TableCell>
              <TableCell>{plan.type}</TableCell>
              <TableCell>₹{plan.price}</TableCell>
              <TableCell>{plan.durationInDays} days</TableCell>
              <TableCell>{plan.featuresLimit.jobPostLimit} times</TableCell>
              <TableCell>{plan.featuresLimit.resumeAccess} times</TableCell>
              <TableCell>{plan.featuresLimit.videoCallLimit} times</TableCell>         
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PlanManagement;
