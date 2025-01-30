import React, { useState, useRef, createRef } from "react";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { ProfileApi } from "@/api/Profile.api";
import { IMAGEKEY } from "@/types/profile";
import { useMutation, useQueryClient } from "react-query";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/api";
import { FormValues } from "@/types/formData";
import { coverImageFormSchema } from "@/types/schema";

export const MAX_FILE_SIZE = 5000000;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];





interface CoverImageModalProps {
  currentImageUrl?: string;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  coverKey: string;
}

export function CoverImageModal({
  onClose,
  currentImageUrl,
  coverKey,
}: CoverImageModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || "");
  const [isCropping, setIsCropping] = useState(false);
  const [cropResult, setCropResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropperRef = createRef<ReactCropperElement>();
  const client = useQueryClient();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(coverImageFormSchema),
    defaultValues: {
      image: undefined,
    },
  });

  const uploadMutation = useMutation({
    mutationFn: ProfileApi.uploadProfilePhoto,
    onSuccess: () => {
      client.invalidateQueries("profile");
      handleReset();
      onClose(false);
    },
    onError: (err: ApiError) => {
      const error = err.response.data?.errors?.[0].message;

      toast({
        title: "Opp!, something went wrong",
        description: error,
      });

      form.setError("image", {
        type: "manual",
        message: "Failed to upload image. Please try again.",
      });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
      form.setValue("image", files, {
        shouldValidate: true,
      });
    }
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas();
      const croppedImage = croppedCanvas.toDataURL();
      setCropResult(croppedImage);
      setIsCropping(false);

      croppedCanvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "cropped-cover-image.jpg", {
            type: "image/jpeg",
          });
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          form.setValue("image", dataTransfer.files, { shouldValidate: true });
        }
      }, "image/jpeg");
    }
  };

  const onSubmit = async (data: FormValues) => {
    uploadMutation.mutate({
      data,
      key: IMAGEKEY.COVER,
      existingKey: coverKey ?? null,
    });
  };

  const handleReset = () => {
    form.reset();
    setPreviewUrl("");
    setCropResult(null);
    setIsCropping(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="image"
          render={ () => (
            <FormItem>
              <FormControl>
                <div className="flex flex-col items-center justify-center">
                  {isCropping && previewUrl ? (
                    <div className="w-full space-y-4">
                      <Cropper
                        ref={cropperRef}
                        className="h-[400px] w-full"
                        zoomTo={0.5}
                        initialAspectRatio={16 / 9}
                        preview=".img-preview"
                        src={previewUrl}
                        viewMode={1}
                        minCropBoxHeight={10}
                        minCropBoxWidth={10}
                        background={false}
                        responsive={true}
                        autoCropArea={1}
                        checkOrientation={false}
                        guides={true}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCropping(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="button" onClick={getCropData}>
                          Crop Image
                        </Button>
                      </div>
                    </div>
                  ) : cropResult ? (
                    <div className="relative w-full h-[250px] border-4 rounded-lg overflow-hidden">
                      <img
                        src={cropResult}
                        alt="Cropped preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : previewUrl ? (
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
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
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

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              handleReset();
              onClose(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            
          >
            {uploadMutation.isLoading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CoverImageModal;
