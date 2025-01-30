import React, { useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface ErrorAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  retryAction?: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type,
  retryAction
}) => {
 
  const iconMap = {
    error: <AlertCircle className="w-6 h-6 text-red-500" />,
    warning: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
    info: <Info className="w-6 h-6 text-blue-500" />
  };

  useEffect(() => {
   console.log(isOpen,
    onClose,
    title,
    message,
    type,
    retryAction);
   
  }, [])

  const backgroundColorClass = {
    error: 'bg-red-50',
    warning: 'bg-yellow-50',
    info: 'bg-blue-50'
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className={backgroundColorClass[type]}>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {iconMap[type]}
            <span>{title}</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-700">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {retryAction && (
            <AlertDialogCancel
              onClick={onClose}
              className="bg-white hover:bg-gray-100"
            >
              Cancel
            </AlertDialogCancel>
          )}
          <AlertDialogAction
            onClick={retryAction || onClose}
            className={`${
              type === 'error'
                ? 'bg-red-600 hover:bg-red-700'
                : type === 'warning'
                ? 'bg-yellow-600 hover:bg-yellow-700'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {retryAction ? 'Retry' : 'OK'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ErrorAlert;