import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import { AiFillGithub } from "react-icons/ai";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "../common/spinner/Loader";
import Logo from "../common/Logo/Logo";
import { ApiService } from "@/api";
import { signInThunk } from "@/redux/action/actions";
import { AppDispatch } from "@/redux/store";
import { SignInFormData } from "@/types/formData";
import { signInSchema } from "@/types/schema";
import { googleAuth } from "@/redux/reducers/userSlice";
import { AxiosError, HttpStatusCode } from "axios";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  const [isSendingReset, setIsSendingReset] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const forgotPasswordForm = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      await dispatch(signInThunk(data)).unwrap();
      navigate("/in");
    } catch (err: any) {
      console.error("error from login", err);
      toast.error(err || "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async (credentialResponse: CredentialResponse) => {
    try {
      const token = credentialResponse.credential;
      if (!token) {
        toast.error("Google authentication failed");
        return;
      }

      const { payload } = await ApiService.googleAuth(token);

      console.log("response from google signin", payload);
      
      // Handle profile complete user (existing user)
      if (payload.profile_complete) {
        dispatch(googleAuth(payload));
        toast.success("Successfully signed in with Google");
        navigate("/in");
      } 
      // Handle new user (profile incomplete)
      else {
        toast.success("Complete your profile to continue");
        navigate("/google/auth/flow", { state: { email: payload.email } });
      }
      
    } catch (error: any) {
      console.error("Google auth error:", error);
      
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || "Google Login Failed";
        toast.error(errorMessage);
      } else {
        toast.error("Google Login Failed");
      }
    }
  };

  const handleForgotPassword = async (data: { email: string }) => {
    setIsSendingReset(true);
    try {
      console.log("reset pass", data);

      const response = await ApiService.fogetPassword(data.email);
      console.log("forget pass responce", response)
      toast.success("Password reset link sent to your email");
      setShowForgotPassword(false);
      forgotPasswordForm.reset();
    } catch (error) {
      console.log("error from reset pass", error);
      if(error instanceof AxiosError && error.status === HttpStatusCode.BadRequest) {
        toast.error("Reset request already in progress. Please check your email.");
      } else {
          toast.error("Failed to send reset email");
      }
      
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <main className="bg-white min-h-screen">
      <div className="flex gap-5 max-md:flex-col">
        <section className="w-1/2 relative max-md:hidden">
          <div className="absolute top-0 left-0 w-full p-6 z-10">
            <div className="flex items-center gap-2 max-w-[200px]">
              <Logo />
              <span className="text-lg font-bold text-orange-700">
                ProSphere
              </span>
            </div>
          </div>

          <div className="h-screen bg-gray-100 flex flex-col justify-center px-8 lg:px-16 relative">
            <div className="flex-1 flex items-center justify-center">
              <img
                src="/image.png"
                alt="Career Growth Illustration"
                className="h-[100vh] w-auto object-fill"
              />
            </div>
          </div>
        </section>

        <div className="hidden max-md:flex items-center justify-between p-6 bg-white">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-bold text-orange-700">ProSphere</span>
          </div>
        </div>

        <section className="w-1/2 max-md:w-full flex flex-col px-4 sm:px-6 lg:px-8">
          <div className="max-w-[408px] mx-auto w-full pt-10">
            <h2 className="text-3xl font-bold leading-tight text-center text-gray-800 mb-2">
              Welcome Back
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Sign in to continue to your account
            </p>

            <div className="flex flex-row gap-4 mb-8">
              <div className="flex-1">
                <GoogleLogin
                  onSuccess={handleGoogleAuth}
                  width="100%"
                  size="large"
                  text="signin_with"
                  onError={() => toast.error("Google Login Failed")}
                  useOneTap={false}
                  ux_mode="popup"
                />
              </div>
              <button
                className="flex-1 flex items-center rounded justify-center gap-2 border text-orange-950"
              >
                <AiFillGithub size={24} />
                <span>GitHub</span>
              </button>
            </div>

            <div className="flex items-center mb-8">
              <div className="flex-1 h-px bg-gray-200"></div>
              <p className="px-4 text-gray-500 text-sm font-medium">
                Or continue with email
              </p>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Email address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="h-11"
                            placeholder="Enter your password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="link"
                          className="text-orange-700 hover:text-orange-800 p-0 text-sm"
                          onClick={() => setShowForgotPassword(true)}
                        >
                          Forgot password?
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-orange-700 hover:bg-orange-800 h-11 text-base font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Spinner
                      size={20}
                      color="#ffffff"
                      className="text-gray-100"
                    />
                  ) : (
                    "Sign in"
                  )}
                </Button>

                <div className="mt-6 space-y-4">
                  <p className="text-sm text-center">
                    Don't have an account?{" "}
                    <Button
                      variant="link"
                      className="text-orange-700 hover:text-orange-800 p-0 font-semibold"
                      onClick={() => navigate("/signup")}
                    >
                      Create an account
                    </Button>
                  </p>
                  <p className="text-xs text-gray-500 text-center">
                    By signing in, you agree to our{" "}
                    <Button
                      variant="link"
                      className="text-orange-700 hover:text-orange-800 p-0 text-xs font-medium"
                    >
                      Terms of Service
                    </Button>{" "}
                    and{" "}
                    <Button
                      variant="link"
                      className="text-orange-700 hover:text-orange-800 p-0 text-xs font-medium"
                    >
                      Privacy Policy
                    </Button>
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </section>
      </div>

      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset your password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <Form {...forgotPasswordForm}>
            <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
              <FormField
                control={forgotPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        className="h-11"
                        type="email"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForgotPassword(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-700 hover:bg-orange-800"
                  disabled={isSendingReset}
                >
                  {isSendingReset ? (
                    <Spinner size={20} color="#ffffff" className="text-gray-100" />
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default SignIn;