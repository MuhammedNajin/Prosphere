import React, { useState } from "react";
import { Plus, Download, Trash2, Eye } from "lucide-react";
import { useMutation, useQuery } from "react-query";
import { ProfileApi } from "@/api/Profile.api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CircleCheck } from "lucide-react";
import ResumeViewer from "./ResumeVeiwModal";

interface ResumeProps {
  setContent: (content: string) => void;
  setModal: (show: boolean) => void;
  resumeKeys?: string[];
  activeResume?: string;
  onResumeSelect?: (key: string) => void;
}

const ResumeSection: React.FC<ResumeProps> = ({
  setContent,
  setModal,
  resumeKeys = [],
  activeResume,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [loadingUrl, setLoadingUrl] = useState<string | null>(null);

  const { refetch } = useQuery(
    ["profile"],
    () => ProfileApi.getProfile(user?._id!),
    {
      enabled: false,
    }
  );

  const deleteMutation = useMutation({
    mutationFn: ProfileApi.deleteResume,
    onSuccess: () => {
      toast({
        description: (
          <div className="flex items-center gap-2">
            <CircleCheck className="text-green-800" size={20} />
            <h1>Resume deleted successfully</h1>
          </div>
        ),
      });
      refetch();
    },
    onError: () => {
      toast({
        description: (
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-800" size={20} />
            <h1>Error deleting resume</h1>
          </div>
        ),
        variant: "destructive",
      });
    },
  });

  const handleDelete = (key: string) => {
    if (key) {
      deleteMutation.mutate(key);
    }
  };

  const handleGetUrl = async (key: string) => {
    try {
      setLoadingUrl(key);
      const url = await ProfileApi.getUploadedFile(key);
      setLoadingUrl(null);
      return url;
    } catch (error) {
      setLoadingUrl(null);
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

  const handleViewResume = async (key: string) => {
    console.log("key", key);
    
    if (key) {
      setSelectedKey(key);
      setViewerOpen(true);
    }
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
    active: boolean;
    onDelete: () => void;
    onView: () => void;
    isLoading: boolean;
  }) => {
    return (
      <div className="flex items-center w-full max-w-3xl rounded-lg border border-gray-200 bg-white mb-2">
        <div className="flex items-center justify-center w-16 h-16 bg-red-600 rounded-l-lg">
          <span className="text-white font-bold text-sm">PDF</span>
        </div>

        <div className="flex-1 px-4 py-2">
          <h3 className="text-sm font-medium text-gray-900">{fileName}</h3>
        </div>

        <div className="flex items-center gap-2 px-4">
          <button
            onClick={onView}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            aria-label="View file"
            disabled={isLoading}
          >
            <Eye className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={onDownload}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            aria-label="Download file"
            disabled={isLoading}
          >
            <Download className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            aria-label="Delete file"
            disabled={isLoading}
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>
    );
  };

  if (resumeKeys.length === 0) {
    return (
      <div className="flex justify-between p-4 px-8 rounded mt-4 border items-center">
        <div>
          <h1 className="text-lg font-bold font-clash">Resume</h1>
          <p className="text-xs text-gray-600">
            Upload your resume in PDF or Word format (max 5MB)
          </p>
        </div>
        <div>
          <button
            className="p-1 rounded-full hover:bg-gray-200"
            onClick={() => {
              setContent("Add Resume");
              setModal(true);
            }}
          >
            <Plus size={24} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 px-8 rounded mt-4 border">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold font-clash">Resume</h1>
        <button
          className="p-1 rounded-full hover:bg-gray-200"
          onClick={() => {
            setContent("Add Resume");
            setModal(true);
          }}
        >
          <Plus size={20} />
        </button>
      </div>
      
      <div className="space-y-2">
        {resumeKeys.map((key) => (
          <ResumeFile
            key={key}
            fileName={key}
            onDownload={() => handleDownload(key)}
            active={key === activeResume}
            onDelete={() => handleDelete(key)}
            onView={() => handleViewResume(key)}
            isLoading={loadingUrl === key}
          />
        ))}
      </div>

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