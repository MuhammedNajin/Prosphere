import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Edit, Trash2 } from "lucide-react";
import { PlanData } from "@/types/subscription";
import { useMutation } from "react-query";
import { PaymentApi } from "@/api/Payment.api";
import SuccessMessage from "@/components/common/Message/SuccessMessage";
import { AxiosError } from "axios";
import ErrorMessage from "@/components/common/Message/ErrorMessage";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/common/spinner/Loader";

interface TableActionsPopoverProps {
  onEdit: (plan: PlanData) => void;

  plan: PlanData;
}

const TableActionsPopover: React.FC<TableActionsPopoverProps> = ({
  onEdit,
  plan,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const planDeleteMutation = useMutation({
    mutationFn: (id: number) => PaymentApi.deletePlan(id),
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      toast({
        description: <SuccessMessage message="Plan deleted successfully..." />,
      });
    },
    onError: (err: AxiosError) => {
      console.log("err", err);

      toast({
        className: "bg-red-400",
        description: (
          <ErrorMessage message="Something went wrong, please try again..." />
        ),
      });
    },
  });

  const handleDelete = () => {
    planDeleteMutation.mutate(plan.id);
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <EllipsisVertical size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-48 p-2">
          <div className="flex flex-col space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(plan)}
              className="justify-start px-2 hover:bg-secondary"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="justify-start px-2 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undo. This will permanently delete the plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              className="bg-red-600 text-white hover:bg-red-800"
              onClick={handleDelete}
            >
              {planDeleteMutation.isLoading ? (
                <Spinner size={20} className="text-white" />
              ) : (
                "Continue"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TableActionsPopover;
