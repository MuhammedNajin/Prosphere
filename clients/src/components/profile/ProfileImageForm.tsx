import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Camera, ImagePlus, Trash2, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ProfileApi } from '@/api/Profile.api';
import { useMutation } from 'react-query';
import { IMAGEKEY } from '@/types/profile';
import { useToast } from '@/hooks/use-toast';
import ErrorMessage from '../common/Message/ErrorMessage';
import { queryClient } from '@/main';

interface ProfileImageFormProps {
   avatarKey: string,
   avatarUrl: string
   onClose: React.Dispatch<React.SetStateAction<boolean>>
}

const ProfileImageForm: React.FC<ProfileImageFormProps> = ({ avatarKey, avatarUrl, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast()
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async () => {
    try {
      setPreview(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Error deleting profile photo:", error);
    }
  };

  useEffect(() => {
     setPreview(avatarUrl)
  }, [])

  const profileImageMutation = useMutation({
    mutationFn: ProfileApi.uploadProfilePhoto,
    onSuccess: (data) => {
      console.log("Upload successful:", data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      onClose(false)
      
    },
    onError: (error) => {
      console.log("Upload failed:", error);
      toast({
        title: (
          <ErrorMessage message='Opps!, Somehing went wrong try again'/>
        )
      })
    },
  });

  const handleSave = async () => {
    if (!selectedFile) return;

    // Create FormData object
    const formData = new FormData();
    formData.append('image', selectedFile);

    profileImageMutation.mutate({
      data: formData,
      key: IMAGEKEY.AVATAR, 
      existingKey: avatarKey ?? null
    });
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="relative w-48 h-48">
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
            <Camera className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>

      <div className="flex justify-center w-full space-x-4 p-4 border-t">
        <Button
          variant="ghost"
          className="flex flex-col items-center space-y-1 flex-1"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus className="h-5 w-5" />
          <span className="text-xs">Add photo</span>
        </Button>

        {preview && (
          <>
            <Button
              variant="ghost"
              className="flex flex-col items-center space-y-1 flex-1 text-red-700 hover:text-red-600"
              onClick={handleDelete}
            >
              <Trash2 className="h-5 w-5" />
              <span className="text-xs">Delete</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center space-y-1 flex-1 text-gray-700 hover:text-accent-purple"
              onClick={handleSave}
              disabled={profileImageMutation.isLoading}
            >
              <Save className="h-5 w-5" />
              <span className="text-xs">
                {profileImageMutation.isLoading ? 'Saving...' : 'Save'}
              </span>
            </Button>
          </>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default ProfileImageForm;