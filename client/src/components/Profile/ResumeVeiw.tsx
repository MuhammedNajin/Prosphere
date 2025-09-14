import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserApi } from '@/api/user.api';
import { useToast } from '@/hooks/use-toast';
import ErrorMessage from '../common/Message/ErrorMessage';
import { Loader2 } from 'lucide-react';

interface ResumeViewerProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string | null;
  fileName: string;
}

const ResumeViewer: React.FC<ResumeViewerProps> = ({ isOpen, onClose, fileUrl, fileName }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetUrl = async (key: string): Promise<string | null> => {
    try {
      setIsLoading(true);
      const fetchedUrl = await UserApi.getUploadedFile(key);
      setIsLoading(false);
      console.log("fetchedUrl", fetchedUrl);
      return fetchedUrl?.url;
    } catch (error) {
      setIsLoading(false);
      toast({
        description: <ErrorMessage message="Error loading resume file" />,
        variant: 'destructive',
      });
      return null;
    }
  };

  useEffect(() => {
    console.log("resume veiwer", isOpen, fileUrl);
    if (isOpen && fileUrl) {
      handleGetUrl(fileUrl).then((fetchedUrl) => {
        setUrl(fetchedUrl);
      });
    }
    return () => setUrl(null); // Cleanup on unmount or when dialog closes
  }, [isOpen, fileUrl]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader className="px-6 py-3 border-b">
        <DialogTitle className="text-xl font-bold text-gray-800">{fileName}</DialogTitle>
      </DialogHeader>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : url ? (
          <div className="w-full h-full">
            <iframe
              src={`${url}#toolbar=0`}
              className="w-full h-full border-0"
              title={`Resume preview for ${fileName}`}
              aria-label="Resume document preview"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600">
            Unable to load resume. Please try again.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResumeViewer;