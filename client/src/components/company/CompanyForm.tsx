import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { useNavigate } from 'react-router-dom';
import LocationSearch from '../common/LocationField/LocationField';
import { MapboxResult } from '@/types/company';
import { useMutation } from 'react-query';
import LoaderSubmitButton from '../common/spinner/LoaderSubmitButton';
import { companyformSchema } from '@/types/schema';
import { Companydata } from '@/types/formData';
import { useCurrentUser } from '@/hooks/useSelectors';
import { CompanyType } from '@/constants/constance';
import { useToast } from '@/hooks/use-toast';


export type CompanyDetails = {
  name: string;  
  website: string;
  industry: string;   
  size: string;
  type: string;
  location: string;  
};

const CompanyDetailsForm: React.FC = () => {
  const { toast } = useToast();
  const form = useForm<Companydata>({
    resolver: zodResolver(companyformSchema),
    defaultValues: {
      name: '',
      website: '',
      size: '',
      type: '',
      location: [],
    },
  });

  const user = useCurrentUser()
  const navigate = useNavigate()

  const companyMutation = useMutation({
    mutationFn: CompanyApi.createCompany,
    onSuccess: () => {
      navigate('/mycompany', { state: false });
    },
    onError: ({ errors }) => {
       console.log("errordddddddddddddddddd", errors);
       toast({
         title: "Error",
         description: errors.message ?? "Failed to create company. Please try again.",
         variant: "destructive",
       });
    }
  })

  const onSubmit = async (companyData: Companydata) => {
    console.log("companyData", companyData);
    
    // Match exactly what your current backend controller expects
    const data = { 
      name: companyData.name,
      website: companyData.website,
      location: companyData.location,   // Keep as location (singular) as controller expects
      size: companyData.size,
      type: companyData.type,
      id: user?.id 
    };
    
    companyMutation.mutate({ data });
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

            {/* Keep the disabled IT field as is since your backend doesn't handle industry */}
            <div className='space-y-4'>
              <Input disabled placeholder="IT"/>
            </div>
             
            <FormField
              control={form.control}
              name="location"
              render={() => (
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
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-1000">1001-5000 employees</SelectItem>
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
                      <SelectItem value={CompanyType.STARTUP}>{CompanyType.STARTUP}</SelectItem>
                      <SelectItem value={CompanyType.PUBLIC}>{CompanyType.PUBLIC}</SelectItem>
                      <SelectItem value={CompanyType.PRIVATE}>{CompanyType.PRIVATE}</SelectItem>
                      <SelectItem value={CompanyType.NON_PROFIT}>{CompanyType.NON_PROFIT}</SelectItem>
                      <SelectItem value={CompanyType.GOVERNMENT}>{CompanyType.GOVERNMENT}</SelectItem>
                      <SelectItem value={CompanyType.EDUCATIONAL}>{CompanyType.EDUCATIONAL}</SelectItem>
                      <SelectItem value={CompanyType.SELF_EMPLOYED}>{CompanyType.SELF_EMPLOYED}</SelectItem>
                      <SelectItem value={CompanyType.PARTNERSHIP}>{CompanyType.PARTNERSHIP}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

           <LoaderSubmitButton state={companyMutation.isLoading}>Save</LoaderSubmitButton>
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