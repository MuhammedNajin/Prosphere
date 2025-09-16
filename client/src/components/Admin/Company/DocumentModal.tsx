import { AdminApi } from "@/api/admin.api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

export interface Document {
  document: {
    documentType: string;
    documentUrl: string;
    uploadedAt: string;
  };
}

const DocumentReviewModal: React.FC<Document> = ({ document }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Only fetch when modal is open
  const { data, isLoading } = useQuery({
    queryKey: ['verification-doc', document.documentUrl],
    queryFn: () => AdminApi.getVerificationDocs(document.documentUrl),
    enabled: isOpen, // This prevents the query from running until modal is opened
  });

  useEffect(() => {
    console.log("Fetched document data:", data);
  }, [data])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Eye className="w-4 h-4" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] h-[80vh]">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-lg font-medium">
            {document?.documentType || "Document Review"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 h-full overflow-hidden">
          <div className="bg-slate-50 rounded-lg h-[calc(80vh-8rem)] flex items-center justify-center">
            {isLoading ? (
              <div className="text-gray-500">Loading document...</div>
            ) : (
              <iframe
                className="w-full h-full scale-100"
                src={data?.url}
                title="Document Preview"
              />
            )}
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <DialogClose>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentReviewModal;