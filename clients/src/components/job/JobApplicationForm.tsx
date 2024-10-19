import React from 'react';
import { X, Paperclip } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// Note: In a real implementation, you would define your Zod schema here
// const formSchema = z.object({ ... });

const JobApplicationForm = () => {
  // Note: In a real implementation, you would use the Zod schema here
  // const form = useForm({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: { ... },
  // });

  const form = useForm(); // Simplified for this example

  function onSubmit(values) {
    // Handle form submission
    console.log(values);
  }

  return (
    <div className="bg-white p-6 rounded w-full mx-auto ">
      <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentJob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current or previous job title</FormLabel>
                  <FormControl>
                    <Input placeholder="What's your current or previous job title?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="LinkedIn URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="portfolioUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="Portfolio URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="additionalInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional information</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Add a cover letter or anything else you want to share" 
                    className="resize-none" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription className="flex justify-between text-sm text-gray-500 mt-1">
                  <div className="flex space-x-2">
                    <button type="button" className="p-1 hover:bg-gray-100 rounded">B</button>
                    <button type="button" className="p-1 hover:bg-gray-100 rounded">I</button>
                    <button type="button" className="p-1 hover:bg-gray-100 rounded">U</button>
                    <button type="button" className="p-1 hover:bg-gray-100 rounded">=</button>
                  </div>
                  <span>0 / 500</span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="resume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attach your resume</FormLabel>
                <FormControl>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="resume" className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Paperclip className="w-6 h-6 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Attach Resume/CV</p>
                      </div>
                      <input id="resume" type="file" className="hidden" {...field} value={undefined} />
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Submit Application</Button>
        </form>
      </Form>
      
      <p className="text-xs text-gray-500 mt-4">
        By sending this, you confirm that you agree to our Terms of Service and Privacy Policy
      </p>
      </div>
    </div>
  );
};

export default JobApplicationForm;