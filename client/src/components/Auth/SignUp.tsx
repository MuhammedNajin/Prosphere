import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
import { useMutation } from "react-query";
import { ApiErrorResponse, ApiService } from "@/api";
import { AxiosError, HttpStatusCode } from "axios";
import OTPInput from "./Otp.component";
import { Spinner } from "../common/spinner/Loader";
import { useToast } from "@/hooks/use-toast";
import ErrorMessage from "../common/Message/ErrorMessage";
import Logo from "../common/Logo/Logo";
import { signUpFormSchema } from "@/types/schema";
import { useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [next, setNext] = React.useState<1 | 2 | 3>(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
    },
    mode: "onChange",
  });

  const signUpMutation = useMutation({
    mutationFn: ApiService.signUp,
    onSuccess: (data) => {

      console.log("data", data)
      setNext(3); 
    },
    onError: (err: AxiosError<ApiErrorResponse>) => {
      if (err.status === HttpStatusCode.BadRequest) {
        toast({
          variant: "destructive",
          duration: 3000,
          className: "bg-red-600 border-red-700 text-white",
          description: (
            <ErrorMessage
              message={
                err.response?.data?.errors[0]?.message ||
                "Something went wrong"
              }
            />
          ),
        });
      }
    },
  });

  function onSubmit(data: z.infer<typeof signUpFormSchema>) {
    console.log("pressed", data)
    signUpMutation.mutate({ data });
  }

  return (
    <main className="bg-white min-h-screen">
      <div className="flex gap-5 max-md:flex-col">
        {/* Left Image Section */}
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

        {/* Mobile Logo */}
        <div className="hidden max-md:flex items-center justify-between p-6 bg-white">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-bold text-orange-700">ProSphere</span>
          </div>
        </div>

        {/* Form Section */}
        <section className="w-1/2 max-md:w-full flex flex-col px-4 sm:px-6 lg:px-8">
          <div className="max-w-[408px] mx-auto w-full pt-10">
            <h2 className="text-3xl font-bold leading-tight text-center text-gray-800 mb-8">
              Get more opportunities
            </h2>
            <div className="w-full">
              {next === 3 ? (
                <OTPInput email={form.getValues("email")} />
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    {/* Username */}
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Mike Foren" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="mikeforen96@gmail.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phone */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+919085027632"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="********"
                                type={showPassword ? "text" : "password"}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-1/2 right-2 -translate-y-1/2"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit */}
                    <Button
                      type="submit"
                      className="w-full bg-orange-700 hover:bg-orange-900"
                      disabled={signUpMutation.isLoading}
                    >
                      {signUpMutation.isLoading ? (
                        <Spinner
                          size={20}
                          color="#ffffff"
                          className="text-gray-100"
                        />
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm mt-4">
            <span className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/signin")}
                className="text-orange-700 hover:underline font-medium"
              >
                Sign in
              </button>
            </span>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SignUp;
