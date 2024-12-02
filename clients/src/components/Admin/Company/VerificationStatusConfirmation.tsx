
import { Spinner } from "@/components/common/spinner/Loader";
import LoaderSubmitButton from "@/components/common/spinner/LoaderSubmitButton";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CompanyStatus } from "@/types/company";
import { useParams } from "react-router-dom";

type AdminActionStatus = CompanyStatus.Verified | CompanyStatus.Rejected;

interface VerificationStatusConfirmationProps {
  status: AdminActionStatus;
  onSubmit: (id: string, status: AdminActionStatus) => void
  isLoading: boolean,
}
export const VerificationStatusConfirmation: React.FC<
  VerificationStatusConfirmationProps
> = ({ status, onSubmit, isLoading,}) => {
  const { id } = useParams();
  
  return (
    <AlertDialog >
      <AlertDialogTrigger asChild>
        <button
          className={`${
            status === CompanyStatus.Verified
              ? "text-emerald-600 font-medium"
              : "text-red-500 font-medium"
          }`}
        >
          {status}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="mt-4">
              <div className="flex gap-4 mt-2">
                {status === CompanyStatus.Verified ? (
                  <div>
                    <p className="text-sm text-gray-500">
                      Mark the item as Verify and ready for next step.
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-500">
                      Mark the item as rejected and provide feedback.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="flex items-center gap-2"
            onClick={() => {
              onSubmit(id!, status);
            }}
          >

           {
             isLoading ?(
                <>
                <Spinner size={20} className="bg-gray-100" />
                <span>Proccesing...</span>
                </>
             ) : (
                "Confirm"
             )
           }
           
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
