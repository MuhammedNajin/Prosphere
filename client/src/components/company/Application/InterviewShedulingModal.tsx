import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, Plus, UserCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from 'react-query';
import { CompanyApi } from '@/api';

// Validation schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  scheduledTime: z.string().min(1, "Date and time are required"),
  duration: z.string()
    .min(1, "Duration is required")
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0 && val <= 480, "Duration must be between 1 and 480 minutes"),
  interviewType: z.enum(["in-person", "video", "phone"], {
    required_error: "Please select an interview type",
  }),
  locationOrLink: z.string().min(1, "Location or link is required"),
  interviewerId: z.string().min(1, "Please select an interviewer"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const InterviewSchedulerModal = () => {
  const [open, setOpen] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      scheduledTime: "",
      duration: "60",
      interviewType: undefined,
      locationOrLink: "",
      interviewerId: "",
      notes: "",
    },
  });


  const { data: employeesData = { team: [] }, isLoading, isError } = useQuery({
    queryKey: ['employees'],
    queryFn: () => CompanyApi.getEmployees(),
    enabled: open, 
    staleTime: 5 * 60 * 1000,
  });

  // Get the team array from the response data
  const employees = employeesData.team || [];

  const handleSubmit = (data: FormValues) => {
    console.log("Interview scheduled:", data);
    form.reset();
    setOpen(false);
  };

  const getSelectedInterviewer = () => {
    const interviewerId = form.watch("interviewerId");
    return employees.find(emp => emp.id === interviewerId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white">
          <Plus className="w-4 h-4" />
          Schedule Interview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            Schedule Interview
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel className="text-sm font-medium">Interview Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter interview title" 
                        className="h-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduledTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Date & Time</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        className="h-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="60" 
                        className="h-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interviewType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Interview Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="in-person">In Person</SelectItem>
                        <SelectItem value="video">Video Call</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="locationOrLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      {form.watch("interviewType") === "in-person" ? "Location" : "Meeting Link"}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={
                          form.watch("interviewType") === "in-person" 
                            ? "Enter location" 
                            : "Enter meeting link"
                        } 
                        className="h-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interviewerId"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel className="text-sm font-medium">Select Interviewer</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                              <SelectValue placeholder="Select interviewer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isLoading ? (
                              <SelectItem value="loading">Loading employees...</SelectItem>
                            ) : isError ? (
                              <SelectItem value="error">Error loading employees</SelectItem>
                            ) : employees.length > 0 ? (
                              employees.map(({userId}) => (
                                <SelectItem key={userId.id} value={userId._id}>
                                  {userId.username}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none">No employees found</SelectItem>
                            )}
                          </SelectContent>
                        </Select>

                        {/* Show selected interviewer card */}
                        {field.value && getSelectedInterviewer() && (
                          <Card className="border border-orange-200 bg-orange-50">
                            <CardContent className="p-4 flex items-center gap-4">
                              <Avatar className="h-12 w-12 border-2 border-orange-200">
                                <AvatarImage src={getSelectedInterviewer().avatar} />
                                <AvatarFallback className="bg-orange-100 text-orange-700">
                                  <UserCircle className="h-6 w-6" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium text-orange-900">{getSelectedInterviewer().name}</h4>
                                <p className="text-sm text-orange-700">{getSelectedInterviewer().position || 'Team Member'}</p>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel className="text-sm font-medium">Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any additional notes or instructions"
                        className="min-h-24 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                type="button" 
                className="border-gray-300 hover:bg-gray-50"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Schedule Interview
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewSchedulerModal;