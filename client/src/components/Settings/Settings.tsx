import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ApiService } from "@/api";
import SuccessMessage from "../common/Message/SuccessMessage";
import ErrorMessage from "../common/Message/ErrorMessage";
import { resetPasswordSchema } from "@/types/schema";
import { ResetFormData } from "@/types/formData";
import { useGetUser } from "@/hooks/useGetUser";



const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const user = useGetUser()
    const form = useForm({
      resolver: zodResolver(resetPasswordSchema),
      defaultValues: {
        oldPassword: "",
        newPassword: "",
      },
    });

    
  
    const onSubmit = async (data: ResetFormData) => {
        console.log("data from djfdihfifhiewifwei ", data, user)

      setIsLoading(true);
      try {

        if(!user?._id) return 

        
        const newData = { 
            id: user?._id,
        }
        
        await ApiService.changePassword(newData);
        toast({
          description: <SuccessMessage message="Password reset Successfully" />,
        });
        form.reset();
      } catch (error) {
        const err = error as any;
        if (err.response?.data?.errors) {
          err.response.data.errors.forEach((errMsg: any) => {
              toast({
                  description: <ErrorMessage message={errMsg.message} />,
                  className: 'text-red'
                });
          });
        } else {
          toast({
              description: (
                <ErrorMessage message="An unexpected error occurred." />
              ),
            });
        }
      } finally {
        setIsLoading(false);
      }
    };
  

  return (
    <div className="mx-auto p-6 h-100vh">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <div className="flex items-center gap-4"></div>
      </div>

      <div className="border-b border-gray-200 mb-8">
        <nav className="flex gap-8">
          <button
            className={`pb-4 ${
              "border-b-2 border-orange-600 text-orange-600"
            }`}
            // onClick={() => setActiveTab("login")}
          >
            Login Details
          </button>
          {/* <button
            className={`pb-4 ${
              activeTab === "notifications"
                ? "text-gray-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </button> */}
        </nav>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Basic Information
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            This is login information that you can update anytime.
          </p>
        </div>

        <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="oldPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your old password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="newPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
            >
              {isLoading ? "Loading..." : "Change Password"}
            </Button>
          </form>
        </Form>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-red-500">Close Account</span>
            <button className="text-gray-400">
              <span className="sr-only">Info</span>
              ⓘ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
