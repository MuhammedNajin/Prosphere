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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import developerRoles from "@/constants/Jobrole";
import LocationSearch from "../common/LocationField/LocationField";
import { gender } from "@/constants/gender";
import { useMutation } from "react-query";
import { ApiErrorResponse, ApiService } from "@/api";
import { AxiosError, HttpStatusCode } from "axios";
import OTPInput from "./Otp.component";
import { Spinner } from "../common/spinner/Loader";
import { useToast } from "@/hooks/use-toast";
import ErrorMessage from "../common/Message/ErrorMessage";
import Logo from "../common/Logo/Logo";
import { MapboxResult } from "@/types/company";
import { signUpFormSchema } from "@/types/schema";

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [next, setNext] = React.useState<1 | 2 | 3>(1);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      otpType: false,
      gender: "",
      jobRole: "",
    },
    mode: "onChange",
  });

  const signUpMutation = useMutation({
    mutationFn: ApiService.signUp,
    onSuccess: (data) => {
      console.log("succcess", data);
      setNext(3);
    },
    onError: (err: AxiosError<ApiErrorResponse>) => {
      console.log(err);
      if (err.status === HttpStatusCode.BadRequest) {
        toast({
          variant: "destructive",
          duration: 3000,
          className: "bg-red-600 border-red-700 text-white",
          description: (
            <ErrorMessage message={err.response?.data?.errors[0]?.message || 'Something went wrong'} />
          ),
        });
      }
    },
  });

  function onSubmit(data: z.infer<typeof signUpFormSchema>) {
    console.log(data);
    signUpMutation.mutate({ data });
  }

  async function handleNext() {
    const validate: Array<keyof z.infer<typeof signUpFormSchema>> = ["password", "username"];

    if (form.getValues("otpType")) {
      validate.push("phone");
    } else {
      validate.push("email");
    }

    const error = await form.trigger(validate);
    console.log("error ", error);
   // here the error will be true if there is no error

    if (error) {
      setNext(2);
    }
  }

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
            <h2 className="text-3xl font-bold leading-tight text-center text-gray-800 mb-8">
              Get more opportunities
            </h2>

            <div className="w-full">
              {next == 3 ? (
                <OTPInput  email={form.getValues("email")} />
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    {next == 1 ? (
                      <>
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

                        <FormField
                          control={form.control}
                          name="otpType"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between">
                              <FormLabel>Use Phone Instead of Email</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {!form.watch("otpType") ? (
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
                        ) : (
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
                        )}

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
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                  >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    ) : (
                      <>
                        {form.watch("otpType") ? (
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
                        ) : (
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
                        )}

                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue="Male/Female"
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a Gender" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {gender.map((role) => (
                                      <SelectItem key={role} value={role}>
                                        {role}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <LocationSearch
                                  onSelectLocation={(
                                    location: MapboxResult
                                  ) => {
                                    console.log("location ", location);

                                    field.onChange({
                                      placename: location.place_name,
                                      coordinates: location.coordinates,
                                    });
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="jobRole"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Role</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {developerRoles.map((role) => (
                                    <SelectItem key={role} value={role}>
                                      {role}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                    <div className="w-full flex justify-center gap-x-2.5">
                      <span
                        onClick={() => setNext(1)}
                        className={`rounded-full w-2 h-2 cursor-pointer ${
                          next == 1 ? "bg-orange-700" : "bg-orange-200"
                        }`}
                      />

                      <span
                        className={`rounded-full w-2 h-2 cursor-pointer ${
                          next == 2 ? "bg-orange-700" : "bg-orange-200"
                        }`}
                      />
                    </div>
                    <Button
                      onClick={() => {
                        if (next === 1) {
                          handleNext();
                        }
                      }}
                      type={next === 1 ? "button" : "submit"}
                      className="w-full bg-orange-700 hover:bg-orange-900"
                    >
                      {next == 1 ? (
                        "Next"
                      ) : signUpMutation.isLoading ? (
                        <Spinner size={20} color="#ffffff" className="text-gray-100" />
                      ) : (
                        "SignUp"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SignUp;
