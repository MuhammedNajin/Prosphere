import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfileApi } from '@/api/Profile.api';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

interface ResumeViewerProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string | null;
  fileName: string;
}

const ResumeViewer: React.FC<ResumeViewerProps> = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
}) => {
  const [url, setUrl] = useState('');
  const { toast } = useToast();

  const handleGetUrl = async (key: string) => {
    try {
      const url = await ProfileApi.getUploadedFile(key);
      return url;
    } catch (error) {
      toast({
        description: (
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-800" size={20} />
            <h1>Error loading file</h1>
          </div>
        ),
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    handleGetUrl(fileName)
      .then((url) => {
        setUrl(url);
      });
    console.log("url", url);
  }, [fileName]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader className="px-6 py-2 border-b">
          <DialogTitle>{fileName}</DialogTitle>
        </DialogHeader>
      <DialogContent className="max-w-4xl w-full h-[80vh] mt-1">
        
        {fileUrl && (
          <div className="w-full h-[calc(100%-3rem)]">
            <iframe 
              src={`${url}#toolbar=0`}
              className="w-full h-full border-0"
              title="Resume Preview"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResumeViewer;