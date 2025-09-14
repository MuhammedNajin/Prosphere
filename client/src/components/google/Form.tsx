import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { Phone } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "../common/spinner/Loader";
import Logo from "../common/Logo/Logo";
import { googleAuthThunk } from "@/redux/action/actions";
import { AppDispatch } from "@/redux/store";


const googleProfileSchema = z.object({
  username: z.string()
    .min(2, "Username must be at least 2 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(/^[a-zA-Z0-9_\s]+$/, "Username can only contain letters, numbers, spaces and underscores"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format"),
});

type GoogleProfileFormData = z.infer<typeof googleProfileSchema>;

const GoogleAuthForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<GoogleProfileFormData>({
    resolver: zodResolver(googleProfileSchema),
    defaultValues: {
      username: "",
      phone: "",
    },
  });

  useEffect(() => {
    console.log("Location state:", location.state);
    
    // Redirect if no email is provided
    if (!location.state?.email) {
      toast.error("Authentication session expired. Please try again.");
      navigate("/signin");
    }
  }, [location.state, navigate]);

  const onSubmit = async (data: GoogleProfileFormData) => {
    setIsLoading(true);
    try {
      const { email } = location.state;
      console.log("Submitting profile:", { ...data, email });

      await dispatch(googleAuthThunk({
        username: data.username,
        phone: data.phone,
        email
      })).unwrap();

      toast.success("SignUp completed successfully!");
      navigate("/in");
    } catch (error: any) {
      console.error("Google auth profile completion error:", error);
      toast.error(error || "Failed to complete profile setup");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading if no location state
  if (!location.state?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size={40} color="#ea580c" />
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen h-screen overflow-hidden">
      <div className="flex h-full">
        {/* Left side - Branding */}
        <section className="w-1/2 relative hidden lg:block">
          <div className="absolute top-0 left-0 w-full p-6 z-10">
            <div className="flex items-center gap-2 max-w-[200px]">
              <Logo />
              <span className="text-lg font-bold text-orange-700">
                ProSphere
              </span>
            </div>
          </div>

          <div className="h-full bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col justify-center px-8 lg:px-16 relative">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-12 h-12 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Complete Your Details
                </h2>
                <p className="text-gray-600">
                  Just a few more details to get you started with ProSphere
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right side - Form */}
        <section className="w-full lg:w-1/2 flex flex-col h-full">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-white shadow-sm">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="text-lg font-bold text-orange-700">ProSphere</span>
            </div>
          </div>

          {/* Form container with proper scrolling */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-[440px] mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 my-4">
                <div className="text-center mb-6">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                    Complete Your Profile
                  </h2>
                  <p className="text-gray-600 text-sm lg:text-base">
                    Welcome to ProSphere! We need a few more details to set up your account.
                  </p>
                </div>

                {/* User info display */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-600 font-semibold">
                        {location.state?.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-600">Signing in as</p>
                      <p className="font-medium text-gray-800 truncate">{location.state?.email}</p>
                    </div>
                  </div>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Username *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., john_doe or John Smith"
                              className="h-11 lg:h-12 text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-gray-500">
                            This will be your display name on ProSphere
                          </p>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Phone Number *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., +91 9876543210"
                              className="h-11 lg:h-12 text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-gray-500">
                            We'll use this to send important account updates
                          </p>
                        </FormItem>
                      )}
                    />

                    <div className="pt-2">
                      <Button
                        type="submit"
                        className="w-full bg-orange-700 hover:bg-orange-800 h-11 lg:h-12 text-base font-medium"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <Spinner size={20} color="#ffffff" />
                            <span>Completing Setup...</span>
                          </div>
                        ) : (
                          "Complete Profile & Continue"
                        )}
                      </Button>
                    </div>

                    <div className="text-center pt-2">
                      <p className="text-xs text-gray-500">
                        By continuing, you agree to our{" "}
                        <button
                          type="button"
                          className="text-orange-700 hover:text-orange-800 font-medium"
                        >
                          Terms of Service
                        </button>{" "}
                        and{" "}
                        <button
                          type="button"
                          className="text-orange-700 hover:text-orange-800 font-medium"
                        >
                          Privacy Policy
                        </button>
                      </p>
                    </div>
                  </form>
                </Form>

                {/* Back to sign in */}
                <div className="mt-4 text-center">
                  <Button
                    variant="link"
                    className="text-gray-600 hover:text-gray-800 p-0"
                    onClick={() => navigate("/signin")}
                  >
                    ← Back to Sign In
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default GoogleAuthForm;