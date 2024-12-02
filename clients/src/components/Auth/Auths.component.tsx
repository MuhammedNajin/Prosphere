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
import { ApiService } from "@/api";
import { AxiosError, HttpStatusCode } from "axios";
import OTPInput from "./Otp.component";
import { Spinner } from "../common/spinner/Loader";
import { useToast } from "@/hooks/use-toast";
import ErrorMessage from "../common/Message/ErrorMessage";


const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10).max(10),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain 1 uppercase letter and 1 number",
    }),
  otpType: z.boolean().optional(),
  gender: z.string(),
  location: z.object({
      placename: z.string(),
      coordinates: z.tuple([z.number(), z.number()]),
    }, {invalid_type_error:  'Location is required'})
  ,
  jobRole: z.string().min(1, { message: "Job role is required" }),
});

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [next, setNext] = React.useState<1 | 2 | 3>(1);
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      otpType: false,
      gender: "",
      jobRole: "",
    },
    mode: 'onChange'
  });

  const signUpMutation = useMutation({
    mutationFn: ApiService.signUp,
    onSuccess: (data) => {
       console.log("succcess",  data )
       setNext(3)
    },
    onError: (err: AxiosError) => {
          console.log(err);
          if(err.status === HttpStatusCode.BadRequest) {
            
                toast({
                  variant: "destructive",
                  duration: 3000,
                  className: "bg-red-600 border-red-700 text-white",
                  description: (
                    <ErrorMessage message={err.response?.data?.errors[0]?.message} />
                  ),
                });
          }
    }
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
     signUpMutation.mutate({ data })
  }

async function handleNext () {
  const validate = [ 'password', 'username']
  
   if(form.getValues('otpType')) {
      validate.push('phone')
   } else { 
     validate.push('email')
   }

   const error = await form.trigger(validate)
   console.log("error ", error);
   
   if(error) {
     setNext(2)
   }
 } 

  return (
    <>
      <main className=" bg-white mt-2">
        <div className="flex gap-5 max-md:flex-col">
          <section className="flex flex-col w-[50%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col justify-center px-16 pt-6 mx-auto w-full text-2xl font-bold tracking-tight text-gray-800 whitespace-nowrap bg-gray-100 max-md:px-5 max-md:mt-10 max-md:max-w-full">
              <div className="flex shrink-0 w-[386px]  h-[669px] max-md:mt-10 max-md:max-w-full">
                <img
                  src="/image.png"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </section>

          <section className="flex flex-col ml-5 w-[39%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col self-stretch mt-10 w-full text-base max-md:mt-6">
              
              <h2 className="mt-4 text-3xl leading-tight text-center text-gray-800">
                Get more opportunities
              </h2>

              <div className="flex justify-center mt-4">
                <div className="flex flex-col mt-4 w-full leading-relaxed max-w-[408px]">
                  { 
                    next == 3 ? ( 
                      <OTPInput email={form.getValues('email')} />
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
                                  <FormLabel>
                                    Use Phone Instead of Email
                                  </FormLabel>
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
                                        {showPassword ? (
                                          <FaEyeSlash />
                                        ) : (
                                          <FaEye />
                                        )}
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
                                  <FormLabel>
                                   Gender
                                  </FormLabel>
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
                                  <FormLabel>
                                  Location
                                  </FormLabel>
                                  <FormControl>
                                  <LocationSearch
                                    onSelectLocation={(
                                      location: MapboxResult
                                    ) => {
                                      console.log("location ", location);
                                      
                                     form.setValue('location', {placename: location.place_name, coordinates: location.coordinates})
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
                          className={`rounded-full w-2 h-2 cursor-pointer ${next == 1 ? "bg-orange-700" : "bg-orange-200"}`} 
                          />
  
                          <span 
                          className={`rounded-full w-2 h-2 cursor-pointer ${next == 2 ? "bg-orange-700" : "bg-orange-200"}`} 
                          />
  
                        </div>
                        <Button
                         onClick={() => {
                            if(next === 1) {
                              handleNext()
                            }
                         }}
                          type={ next === 1 ? "button" : "submit" }
                          className="w-full bg-orange-700 hover:bg-orange-900"
                        >
                         { next == 1 ? "Next" : signUpMutation.isLoading ? <Spinner size={20} className="text-gray-100" /> : "SignUp" }
                        </Button>
                      </form>
                    </Form>
                    )
                  }
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default LoginPage;
