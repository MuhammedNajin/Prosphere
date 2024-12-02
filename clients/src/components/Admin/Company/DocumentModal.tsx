import { AdminApi } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Eye, Download } from "lucide-react";
import { useEffect } from "react";
import { useQuery } from "react-query";

const DocumentReviewModal = ({ document }) => {
   const { data } = useQuery({
     queryFn: () =>  AdminApi.getVerificationDocs(document.documentUrl) 
   })

   useEffect(() => {
    
    
   }, [data])
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Eye className="w-4 h-4" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] h-[80vh]">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-lg font-medium">
            {document?.documentType || 'Document Review'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 h-full overflow-hidden">
          <div className="bg-slate-50 rounded-lg h-[calc(80vh-8rem)] flex items-center justify-center">
          <iframe className="w-full h-full scale-100"  src={data && data.url} />
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