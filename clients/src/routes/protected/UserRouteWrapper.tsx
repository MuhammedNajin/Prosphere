import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface UserRouteWrapperProps {
  children: React.ReactNode;
}

const UserRouteWrapper: React.FC<UserRouteWrapperProps> = (props) => {
  const { children } = props;
  const { user } = useSelector((state) => state.auth);
  const [showSessionModal, setShowSessionModal] = useState(true);

  const handleLoginRedirect = () => {
    window.location.href = "/signin";
    setShowSessionModal(false);
  };

  useEffect(() => {
    return () => {
      // setShowSessionModal(false);
      console.log("unMounting....")
    }
  }, []);

  const SessionTimeoutModal = () => (
    <Dialog open={showSessionModal} onOpenChange={() => {
      handleLoginRedirect()
      setShowSessionModal(false)
    }}>
      <DialogContent className="sm:max-w-md bg-white rounded-lg p-6">
        <DialogHeader className="space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <div className="text-center">
            <DialogTitle className="text-2xl font-semibold text-gray-900 mb-2">
              Session Expired
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              For your security, your session has expired due to inactivity.
              Please log in again to continue your work.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="mt-8">
          <Button
            onClick={handleLoginRedirect}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Return to Login
          </Button>
          <p className="mt-4 text-center text-sm text-gray-500">
            All your data is safely stored and will be available after you log
            in.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (!user) {
    return (
      <>
        <SessionTimeoutModal />
        {children}
      </>
    );
  }

  return <>{ children }</>;
};

export default UserRouteWrapper;
