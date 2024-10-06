import React, { useState, useRef } from 'react';
import { ImageIcon, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { ProfileApi } from '@/api/Profile.api';
import { useSelector } from 'react-redux';

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];


type FormValues = z.infer<typeof formSchema>;

interface CoverImageModalProps {
  onUpload: (file: File) => Promise<void>;
  currentImageUrl?: string;
}

export function CoverImageModal({ onUpload, currentImageUrl }: CoverImageModalProps) {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useSelector((state) => state.auth)


  const formSchema = z.object({
    image: z
      .any()
      .refine((files) => files.length > 0, "Cover image is required.")
      .transform((files) => files[0])
      .refine(
        (files) => files?.size <= MAX_FILE_SIZE,
        "File size must be less than 5MB."
      )
      .refine(
        (files) => ACCEPTED_IMAGE_TYPES.includes(files?.type),
        "Only .jpg, .png, and .webp formats are accepted."
      ),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
        console.log("files", files, files[0])
      const file = files[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      form.setValue('image', files, {
        shouldValidate: true,
      });
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsUploading(true);
      console.log("data", data)
      const file = data.image[0];
      await ProfileApi.uploadProfilePhoto(data, 'coverImageKey', user.email)
      handleReset();
    } catch (error) {
      console.error('Error uploading image:', error);
      form.setError('image', {
        type: 'manual',
        message: 'Failed to upload image. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setOpen(false);
  };

  return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field: { ref } }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col items-center justify-center">
                      {previewUrl ? (
                        <div className="relative w-full h-[250px] rounded-lg overflow-hidden">
                          <img
                            src={previewUrl}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-[250px] rounded-lg border-2 border-gray-300 bg-gray-50">
                          <Upload className="h-10 w-10 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">
                            Select an image to upload
                          </p>
                          <p className="text-xs text-gray-400">
                            PNG, JPG or WEBP (max. 5MB)
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept={ACCEPTED_IMAGE_TYPES.join(',')}
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        value={undefined}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Select Image
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.image && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {form.formState.errors.image.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUploading || !form.formState.isValid}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </form>
        </Form>
  );
}