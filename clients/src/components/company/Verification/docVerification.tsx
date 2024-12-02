import React, { useEffect } from 'react';
import { Upload, AlertTriangle, X, FileCheck, FileX, AlertCircle, RefreshCw, File } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSelectedCompany } from '@/hooks/useSelectedCompany';
import { Navigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useMutation } from 'react-query';
import { CompanyApi } from '@/api';
import { useToast } from '@/hooks/use-toast';
import SuccessMessage from '@/components/common/Message/SuccessMessage';
import ErrorMessage from '@/components/common/Message/ErrorMessage';

const DocumentVerification = () => {
  const { id } = useParams();
  const company = useSelectedCompany();
  const [remainingAttempts] = React.useState(3);
  const [uploadStatus, setUploadStatus] = React.useState({
    companyDocs: false,
    ownerDocs: false
  });
  const { toast } = useToast()
  const form = useForm({
    defaultValues: {
      companyDocType: '',
      ownerDocType: '',
      companyDoc: null,
      ownerDoc: null
    }
  });

  const companyDocTypes = [
    'Certificate of Incorporation',
    'Business License',
    'Tax Registration',
    'Operating Permit',
    'Articles of Organization',
    'Other'
  ];

  const ownerDocTypes = [
    'Passport',
    'Driver\'s License',
    'National ID',
    'Residence Permit',
    'Other'
  ];

  if (company?.verified) {
    return <Navigate to={`/company/${id}`} />;
  }
 

  
  const companyVerificationMutation = useMutation({
    mutationFn: CompanyApi.uploadVerificationDocs,
    onSuccess: (data) => {
      console.log("data", data);
      setUploadStatus({
        companyDocs: true,
        ownerDocs: true
      });
      toast({
        title: <SuccessMessage message='Document uploaded successfully' />
      })
    },
    onError: (err) => {
      console.log("error from doc verification ", err);
      toast({
        title: <ErrorMessage message='Failed to upload documents, Try again' />
      })
    }
  });

  const onSubmit = async (data) => {
    try {
      console.log('Form data:', data);
      companyVerificationMutation.mutate({ data, id });
    } catch (error) {
      console.error('Error submitting documents:', error);
    }
  };

  useEffect(() => {
     console.log("mounted", company.status);
     
  })

  const renderFileUploadSection = (
    title,
    docTypeField,
    fileField,
    docTypes,
    acceptedFormats
  ) => {
    const fileValue = form.watch(fileField);
    const docType = form.watch(docTypeField);

    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200 ">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name={docTypeField}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Document Type
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {docTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={fileField}
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormControl>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
                    {!fileValue ? (
                      <div className="flex flex-col items-center">
                        <Upload className="h-12 w-12 text-gray-400 mb-4" />
                        <div className="text-center">
                          <label className="cursor-pointer">
                            <span className="mt-2 text-base text-blue-600 hover:text-blue-700">
                              Upload {title.toLowerCase()}
                            </span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  onChange(file);
                                }
                              }}
                              accept={acceptedFormats}
                              disabled={!docType}
                              {...field}
                            />
                          </label>
                          <p className="text-sm text-gray-500 mt-1">
                            Supported formats: {acceptedFormats.replace(/\./g, '').toUpperCase()} 
                            {fileField === 'ownerDoc' ? ' (Max 5MB)' : ' (Max 10MB)'}
                          </p>
                          {!docType && (
                            <p className="text-sm text-amber-600 mt-2">
                              Please select document type first
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <FileCheck className="h-5 w-5 text-green-500" />
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-700">
                              {fileValue.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {docType}
                            </span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            onChange(null);
                            form.setValue(docTypeField, '');
                          }}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl p-6 mx-auto">
      

      { companyVerificationMutation.isSuccess || company.status === 'uploaded' ? (
        <div className="space-y-4 mt-6">
        <Alert className="bg-blue-50 border-blue-200">
          <FileCheck className="h-5 w-5 text-blue-600" />
          <AlertTitle className="text-blue-800">
            Documents Uploaded Successfully
          </AlertTitle>
          <AlertDescription className="text-blue-700">
            <div className="space-y-2">
              <p>Your documents have been successfully uploaded and are pending review.</p>
              <div className="bg-white p-4 rounded-lg border border-blue-100 mt-2">
                <h4 className="font-medium mb-2 text-blue-900">What happens next?</h4>
                <ul className="list-disc pl-4 space-y-1 text-sm">
                  <li>Our admin team will review your submitted documents</li>
                  <li>The review process typically takes 1-2 business days</li>
                  <li>You will receive a notification once the review is complete</li>
                  <li>Please ensure your contact information is up to date</li>
                </ul>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>
      ) : (
         <>
         <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Company Verification Documents
        </h1>
        <p className="text-gray-600">
          Please submit the required documents for verification
        </p>
      </div>

      <Alert variant="destructive" className="border-red-200 bg-red-50 mb-4">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className={`flex items-center gap-2 ${company.status === 'rejected' ? "text-red-900" : ""}`}>
          {company.status === 'rejected' ? <FileX className="h-5 w-5" /> : <File className="h-5 w-5"/>}
          {company.status === 'rejected' ? "Document Rejected" : "Upload Document"}
        </AlertTitle>
        <AlertDescription className="mt-4 space-y-4">
          <div className="bg-white p-4 rounded-lg border border-red-100 text-gray-700 text-sm">
            <h4 className="font-medium mb-2">Next Steps:</h4>
            <p>{company.status === 'rejected' ? "Reupload your documents" : "Upload your documents"}</p>
          </div>
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {renderFileUploadSection(
            'Company Documents',
            'companyDocType',
            'companyDoc',
            companyDocTypes,
             '.pdf,.doc,.docx,.jpg,.jpeg,.png'
          )}
          {renderFileUploadSection(
            'Owner Documents',
            'ownerDocType',
            'ownerDoc',
            ownerDocTypes,
            '.pdf,.doc,.docx,.jpg,.jpeg,.png'
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              className="px-6 py-2"
              disabled={
                !form.watch('companyDoc') ||
                !form.watch('ownerDoc') ||
                !form.watch('companyDocType') ||
                !form.watch('ownerDocType') ||
                companyVerificationMutation.isLoading
              }
            >
              {companyVerificationMutation.isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Submit Documents'
              )}
            </Button>
          </div>
        </form>
      </Form>
      </>
      )
    }
    </div>
  );
};

export default DocumentVerification;