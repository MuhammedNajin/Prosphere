import React, { useState } from 'react';
import { Plus, Download, Trash2, Eye } from 'lucide-react';
import { useMutation, useQuery } from 'react-query';
import { UserApi } from '@/api/user.api';
import { useToast } from '@/hooks/use-toast';
import ResumeViewer from './ResumeVeiw';
import { useCurrentUser } from '@/hooks/useSelectors';
import { ModalContent } from '@/types/profile';
import ErrorMessage from '../common/Message/ErrorMessage';
import SuccessMessage from '../common/Message/SuccessMessage';

interface ResumeSectionProps {
  setContent: (content: ModalContent) => void;
  setModal: (show: boolean) => void;
  resumeKeys?: string[];
}

const ResumeSection: React.FC<ResumeSectionProps> = ({
  setContent,
  setModal,
  resumeKeys = [],
}) => {
  const user = useCurrentUser();
  const { toast } = useToast();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [loadingUrl, setLoadingUrl] = useState<string | null>(null);

  const { refetch } = useQuery(
    ['profile', user?.id],
    () => UserApi.getProfile(),
    {
      enabled: !!user?.id,
    }
  );

  const deleteMutation = useMutation({
    mutationFn: (key: string) => UserApi.deleteResume(key),
    onSuccess: () => {
      toast({
        description: (
          <SuccessMessage message="Resume deleted successfully" />
        ),
      });
      refetch();
    },
    onError: () => {
      toast({
        description: (
          <ErrorMessage message="Error deleting resume" />
        ),
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (key: string) => {
    if (!key) {
      toast({
        description: <ErrorMessage message="Resume key is missing" />,
        variant: 'destructive',
      });
      return;
    }
    deleteMutation.mutate(key);
  };

  const handleGetUrl = async (key: string): Promise<string | null> => {
    try {
      setLoadingUrl(key);
      const {url} = await UserApi.getUploadedFile(key);
      setLoadingUrl(null);
      return url;
    } catch (error) {
      setLoadingUrl(null);
      toast({
        description: <ErrorMessage message="Error loading resume file" />,
        variant: 'destructive',
      });
      return null;
    }
  };

  const handleViewResume = async (key: string) => {
    if (!key) {
      toast({
        description: <ErrorMessage message="Resume key is missing" />,
        variant: 'destructive',
      });
      return;
    }
    setSelectedKey(key);
    setViewerOpen(true);
  };

  const handleDownload = async (key: string) => {
    const url = await handleGetUrl(key);
    if (url) {
      window.open(url, '_blank');
    }
  };

  const ResumeFile = ({
    fileName,
    onDownload,
    onDelete,
    onView,
    isLoading,
  }: {
    fileName: string;
    onDownload: () => void;
    onDelete: () => void;
    onView: () => void;
    isLoading: boolean;
  }) => (
    <div className="flex items-center w-full max-w-3xl rounded-lg border border-gray-200 bg-white mb-2">
      <div className="flex items-center justify-center w-16 h-16 bg-orange-600 rounded-l-lg">
        <span className="text-white font-bold text-sm">PDF</span>
      </div>
      <div className="flex-1 px-4 py-2">
        <h3 className="text-sm font-medium text-gray-900">{fileName}</h3>
      </div>
      <div className="flex items-center gap-2 px-4">
        <button
          onClick={onView}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          aria-label="View resume"
          disabled={isLoading}
        >
          <Eye className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={onDownload}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          aria-label="Download resume"
          disabled={isLoading}
        >
          <Download className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          aria-label="Delete resume"
          disabled={isLoading}
        >
          <Trash2 className="w-5 h-5 text-red-500" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 rounded border bg-white mt-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-clash text-gray-800">Resume</h1>
        <button
          className="p-2 bg-orange-50 rounded-md hover:bg-orange-100 transition-colors"
          onClick={() => {
            setContent(ModalContent.AddResume);
            setModal(true);
          }}
          aria-label="Add new resume"
        >
          <Plus className="w-5 h-5 text-orange-600" />
        </button>
      </div>

      {resumeKeys.length === 0 ? (
        <p className="text-gray-600 text-sm">
          Upload your resume in PDF or Word format (max 5MB)
        </p>
      ) : (
        <div className="space-y-2">
          {resumeKeys.map((key) => (
            <ResumeFile
              key={key}
              fileName={key}
              onDownload={() => handleDownload(key)}
              onDelete={() => handleDelete(key)}
              onView={() => handleViewResume(key)}
              isLoading={loadingUrl === key}
            />
          ))}
        </div>
      )}

      {selectedKey && (
        <ResumeViewer
          isOpen={viewerOpen}
          onClose={() => {
            setViewerOpen(false);
            setSelectedKey(null);
          }}
          fileUrl={selectedKey}
          fileName={selectedKey}
        />
      )}
    </div>
  );
};

export default ResumeSection;