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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Eye, EyeOff, Lock, User, Shield, Info } from "lucide-react";
import { ApiService } from "@/api";
import SuccessMessage from "../common/Message/SuccessMessage";
import ErrorMessage from "../common/Message/ErrorMessage";
import { resetPasswordSchema } from "@/types/schema";
import { ResetFormData } from "@/types/formData";
import { useCurrentUser } from "@/hooks/useSelectors";

interface ApiError {
  response?: {
    data?: {
      errors?: {
        errorCode: string;
        message: string;
        details: Array<{
          message: string;
          field: string;
        }>;
      };
    };
  };
}

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const { toast } = useToast();
  const user = useCurrentUser();
  
  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = async (data: ResetFormData) => {
    setIsLoading(true);
    
    // Clear any previous form errors
    form.clearErrors();
    
    try {
      const newData = {
        ...data,
        id: user?.id,
      };

      await ApiService.changePassword(newData);
      
      toast({
        description: <SuccessMessage message="Password changed successfully!" />,
      });
      
      form.reset();
    } catch (error) {
      const err = error as ApiError;
      
      // Handle the specific error format from your API
      if (err.response?.data?.errors) {
        const apiErrors = err.response.data.errors;
        
        // Show general error message in toast
        toast({
          description: <ErrorMessage message={apiErrors.message || "An error occurred"} />,
          className: "text-red-500",
        });
        
        // Set field-specific errors if available
        if (apiErrors.details && Array.isArray(apiErrors.details)) {
          apiErrors.details.forEach((detail) => {
            if (detail.field && detail.message) {
              form.setError(detail.field as keyof ResetFormData, {
                type: "server",
                message: detail.message,
              });
            }
          });
        } else {
          // If no field-specific errors, show general error
          // You can also set a general form error here if needed
          console.error("API Error:", apiErrors);
        }
        
        // Handle specific error codes if needed
        switch (apiErrors.errorCode) {
          case "INVALID_PASSWORD":
            // Additional handling for invalid password
            break;
          case "WEAK_PASSWORD":
            // Additional handling for weak password
            break;
          default:
            break;
        }
      } else {
        // Fallback for unexpected error format
        console.error("Unexpected error:", err);
        toast({
          description: <ErrorMessage message="An unexpected error occurred. Please try again." />,
          className: "text-red-500",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-4xl p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account preferences and security</p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {user?.email || "User"}
          </Badge>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex items-center gap-2 pb-4 border-b-2 transition-colors ${
                activeTab === "login"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Lock className="w-4 h-4" />
              Login & Security
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-2 pb-4 border-b-2 transition-colors ${
                activeTab === "notifications"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Shield className="w-4 h-4" />
              Notifications
              <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="grid gap-6">
          {activeTab === "login" && (
            <>
              {/* Account Overview */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    <CardTitle className="text-xl">Account Overview</CardTitle>
                  </div>
                  <CardDescription>
                    Your current account information and status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-900">{user?.email || "user@example.com"}</span>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Verified
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Account Status</label>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-900">Active</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Password Change */}
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-orange-500" />
                    <CardTitle className="text-xl">Change Password</CardTitle>
                  </div>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          name="oldPassword"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Current Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showOldPassword ? "text" : "password"}
                                    placeholder="Enter current password"
                                    className="pr-10"
                                    {...field}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                  >
                                    {showOldPassword ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
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
                              <FormLabel className="text-sm font-medium">New Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    className="pr-10"
                                    {...field}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                  >
                                    {showNewPassword ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Password Requirements */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-blue-900">Password Requirements</h4>
                            <ul className="text-sm text-blue-700 mt-1 space-y-1">
                              <li>• At least 8 characters long</li>
                              <li>• Include uppercase and lowercase letters</li>
                              <li>• Include at least one number</li>
                              <li>• Include at least one special character</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Updating...
                            </>
                          ) : (
                            "Update Password"
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            form.reset();
                            form.clearErrors();
                          }}
                          className="px-6 py-2"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <CardTitle className="text-xl text-red-900">Danger Zone</CardTitle>
                  </div>
                  <CardDescription>
                    Actions that can't be undone. Proceed with caution.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-red-900">Close Account</h3>
                      <p className="text-sm text-red-700 mt-1">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                      onClick={() => {
                        toast({
                          description: (
                            <div className="flex items-center gap-2">
                              <Info className="w-4 h-4" />
                              Account deletion feature coming soon
                            </div>
                          ),
                        });
                      }}
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Notification Settings</CardTitle>
                <CardDescription>
                  Manage how you receive notifications and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-32 text-gray-500">
                  <div className="text-center">
                    <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Notification settings coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;