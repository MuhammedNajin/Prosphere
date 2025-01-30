import React, { useEffect } from "react";
import { techStack } from "@/constants/techStack";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CircleCheck, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LocationSearch from "@/components/common/LocationField/LocationField";
import { MapboxResult } from "@/types/company";
import { useMutation, useQuery } from "react-query";
import { CompanyApi } from "@/api/Company.api";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Spinner } from "@/components/common/spinner/Loader";
import LoaderSubmitButton from "@/components/common/spinner/LoaderSubmitButton";
import { useToast } from "@/hooks/use-toast";
import { useSelectedCompany } from "@/hooks/useSelectedCompany";

export const CompanySettings: React.FC = () => {
  const selectedCompany = useSelectedCompany();
  const { toast } = useToast()
  const companyFormSchema = z.object({
    name: z.string().min(1, "Company name is required"),
    website: z.string().url("Please enter a valid URL"),
    foundedDate: z.date({
      required_error: "Add founded date",
    }),

    headquarters: z.object({
      placename: z.string(),
      coordinates: z.tuple([z.number(), z.number()]),
    }),

    location: z.array(
      z.object({
        placename: z.string(),
        coordinates: z.tuple([z.number(), z.number()]),
      })
    ),
    techStack: z.array(z.string()),
  });

  const company = useQuery({
    queryKey: ["company"],
    queryFn: () => CompanyApi.getCompany(selectedCompany._id),
  });

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: company.data ? company.data.name : "",
      headquarters: company.data ? company.data.headqaurters : "",
      foundedDate: company.data ? company.data.foundedDate : "",
      website: company.data ? company.data.website : "",
      location: company.data ? company.data.locations : [],
      techStack: company.data ? company.data.techStack : [],
    },
  });

  useEffect(() => {
    console.log(company.data);
    if (company.data) {
      form.reset({
        name: company.data.name,
        headquarters: company.data.headquarters,
        foundedDate: company.data.foundedDate
          ? new Date(company.data.foundedDate)
          : undefined,
        website: company.data.website,
        location: company.data.location || [],
        techStack: company.data.techStack || [],
      });
    }
  }, [company.data, form]);

  const { append, remove } = useFieldArray({
    control: form.control,
    name: "location",
  });

  type CompanyFormValues = z.infer<typeof companyFormSchema>;

  const companyProfileMutation = useMutation({
    mutationFn: CompanyApi.updateCompanyProfile,
    onSuccess: () => {
      console.log("success");
      toast({
        description: (
          <div className="flex items-center gap-2">
             <CircleCheck className="text-green-800" size={20}/>
             <h1>Saved.</h1>
          </div>
        )
      })
    },
    onError: (error: unknown) => {
      console.log(error);
    },
  });

  const onSubmit = (data: CompanyFormValues) => {
    companyProfileMutation.mutate({ data, id: selectedCompany._id });
  };

  const { isDirty } = form.formState

  return (
    <main className="flex flex-col justify-center items-center p-8 bg-white max-md:px-5">
      {company.isLoading ? (
        <div className="h-[80vh] flex justify-center mt-20">
          <Spinner size={30} />
        </div>
      ) : (
        <>
          <section className="flex flex-col self-stretch w-full leading-relaxed max-md:max-w-full">
            <h1 className="text-lg font-semibold text-slate-800">
              Basic Information
            </h1>
            <p className="mt-1 text-base text-slate-500 max-md:max-w-full">
              This is company information that you can update anytime.
            </p>
          </section>

          <hr className="mt-6 max-w-full min-h-0 border border-solid bg-zinc-200 border-zinc-200" />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <div className="border-t border-zinc-200" />

              <div className="grid grid-cols-1 md:grid-cols-[259px_1fr] gap-10">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-slate-800">
                    Company Details
                  </h2>
                  <p className="text-sm text-slate-500">
                    Introduce your company core info quickly to users by filling
                    up company details
                  </p>
                </div>

                <Card>
                  <CardContent className="pt-6 space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input {...field} type="url" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="foundedDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Founded Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="headquarters"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Headquaters</FormLabel>
                          <FormControl>
                            <div>
                              <div className="">
                                <LocationSearch
                                  placeholder={
                                    field.value?.placename ||
                                    "Select headquaters"
                                  }
                                  onSelectLocation={(
                                    location: MapboxResult
                                  ) => {
                                    form.setValue("headquarters", {
                                      placename: location?.place_name,
                                      coordinates: location.coordinates,
                                    });
                                    const exists = form
                                      .getValues("location")
                                      .find(({ placename }) => {
                                        if (placename == location?.place_name)
                                          return true;
                                      });
                                    console.log("exists", exists);
                                    if (!exists) {
                                      append({
                                        placename: location?.place_name,
                                        coordinates: location?.coordinates,
                                      });
                                    }
                                  }}
                                />
                              </div>
                            </div>
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
                          <FormLabel>Locations</FormLabel>
                          <FormControl>
                            <div>
                              <div className="">
                                <LocationSearch
                                  onSelectLocation={(
                                    location: MapboxResult
                                  ) => {
                                    append({
                                      placename: location?.place_name,
                                      coordinates: location?.coordinates,
                                    });
                                  }}
                                />
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {field?.value?.map((location, index) => (
                                  <Badge
                                    key={location?.placename}
                                    variant="secondary"
                                    className="text-indigo-600 inline-flex items-center gap-2"
                                  >
                                    {location?.placename?.split(",")[0]}
                                    <X
                                      size={20}
                                      onClick={() => {
                                        if (
                                          location.placename ==
                                          form.getValues(
                                            "headquarters.placename"
                                          )
                                        ) {
                                          form.resetField("headquarters");
                                        }
                                        remove(index);
                                      }}
                                    />
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="techStack"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tech Stack</FormLabel>
                          <FormControl>
                            <div className="flex items-center justify-between p-2 border rounded-md">
                              <div className="flex flex-wrap gap-2">
                                {field?.value?.map((tech) => (
                                  <Badge
                                    key={tech}
                                    variant="secondary"
                                    className="text-indigo-600"
                                  >
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[600px] p-0 right-0 mr-[10rem] mb-10">
                                  <Command>
                                    <CommandInput placeholder="Search Tech Stack" />
                                    <CommandList>
                                      <CommandEmpty>
                                        No language found.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {techStack?.map((techStack) => (
                                          <CommandItem
                                            value={techStack}
                                            key={techStack}
                                            onSelect={() => {
                                              const selectedArray = field.value;
                                              const isExists =
                                                selectedArray.includes(
                                                  techStack
                                                );
                                              console.log(isExists);
                                              if (!isExists) {
                                                form.setValue("techStack", [
                                                  ...selectedArray,
                                                  techStack,
                                                ]);
                                              }
                                            }}
                                          >
                                            {techStack}
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="border-t border-zinc-200" />
              <div className="flex justify-end">
                { 
                  !isDirty ? (
                     <Button 
                     disabled={true}
                     className="bg-blue-800 text-end hover:bg-blue-950 opacity-50 cursor-not-allowed">
                      Save Changes
                     </Button>
                  ) : (
                    <LoaderSubmitButton 
                
                state={companyProfileMutation?.isLoading}>
                  Save Changes
                </LoaderSubmitButton>
                  )
                }
              </div>
            </form>
          </Form>
        </>
      )}
    </main>
  );
};
