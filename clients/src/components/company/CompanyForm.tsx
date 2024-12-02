import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CompanyPreview from './CompanyPreview'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CompanyApi } from '@/api/Company.api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LocationSearch from '../common/LocationField/LocationField';
import { Location } from '@/types/Settings';
import { MapboxResult } from '@/types/company';
import { useMutation } from 'react-query';
import LoaderSubmitButton from '../common/spinner/LoaderSubmitButton';

// Types
export type CompanyDetails = {
  name: string;
  url: string;
  website: string;
  industry: string;
  size: string;
  type: string;
  location: string;
};

// Schema
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  website: z.string().url({ message: "Invalid URL" }).optional().or(z.literal('')),
  location: z.array(z.object({
    placename: z.string(),
    coordinates: z.array(z.number()),
  })).min(1, "Comapany location required"),
  size: z.string().min(1, { message: "Organization size is required" }),
  type: z.string().min(1, { message: "Organization type is required" }),
});

// Components
type Companydata = z.infer<typeof formSchema>



const CompanyDetailsForm: React.FC = () => {
  const form = useForm<Companydata>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      website: '',
      size: '',
      type: '',
      location: [],
    },
  });

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate()

  const companyMutation = useMutation({
    mutationFn: CompanyApi.createCompany,
    onSuccess: () => {
      navigate('/mycompany', { state: false });
    },
    onError: (error) => {
       console.log(error);
       
    }
  })
  console.log(user)
  const onSubmit = async (companyData: Companydata) => {
    console.log("companyData", companyData);
    const data = { ...companyData, id: user?._id }
    companyMutation.mutate({ data })
  
  };



  return (
    <div className="max-w-4xl mx-auto p-6 mb-8">
      <div className='p-2'>
         <h1 className='inline-flex gap-2'><span className='text-red-500'>*</span>indicates required field</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name<span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Add your organization's name" {...field} />
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
                    <Input placeholder="Begin with http://, https:// or www." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry<span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input disabled placeholder="IT" {...field} />
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
                  <FormLabel>Location<span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <LocationSearch onSelectLocation={(location: MapboxResult) => {
                      console.log(location.place_name)
                      form.setValue('location', [{ placename: location.place_name, coordinates: location.coordinates }])
                    }} placeholder='Company location'/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization size<span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 employees</SelectItem>
                      <SelectItem value="2-10">2-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="501-1000">501-1000 employees</SelectItem>
                      <SelectItem value="1001-5000">1001-5000 employees</SelectItem>
                      <SelectItem value="5001-10000">5001-10000 employees</SelectItem>
                      <SelectItem value="10001+">10001+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization type<span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="public">Public company</SelectItem>
                      <SelectItem value="private">Private company</SelectItem>
                      <SelectItem value="nonprofit">Nonprofit</SelectItem>
                      <SelectItem value="government">Government agency</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="soleProprietorship">Sole proprietorship</SelectItem>
                      <SelectItem value="selfEmployed">Self-employed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
           <LoaderSubmitButton state={companyMutation.isLoading} >Save</LoaderSubmitButton>
          </form>
        </Form>
        <div>
          <Card className="p-4 bg-gray-50">
            <h2 className="text-lg font-semibold mb-4">Page preview</h2>
            <CompanyPreview details={form.watch()} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsForm;