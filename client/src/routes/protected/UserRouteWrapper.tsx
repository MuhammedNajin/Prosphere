import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useCurrentUser } from "@/hooks/useSelectors";
import { UserRole } from "@/types/user";

interface UserRouteWrapperProps {
  children: React.ReactNode;
}

const UserRouteWrapper: React.FC<UserRouteWrapperProps> = (props) => {
  const { children } = props;
  const user = useCurrentUser();
  const [showSessionModal, setShowSessionModal] = useState(false);

  const handleLoginRedirect = () => {
    window.location.href = "/signin";
  };

  useEffect(() => {
    console.log("user", user, showSessionModal);
    
    // Only show modal when user data is loaded and user is not authorized
    if (user !== null && user?.role !== UserRole.User) {
      setShowSessionModal(true);
    } else if (user?.role === UserRole.User) {
      setShowSessionModal(false);
    }
    
    // Cleanup function - don't set state here as component might be unmounting
    return () => {
      console.log("unMounting....", showSessionModal);
    };
  }, [user]); // Add user as dependency

  const SessionTimeoutModal = () => (
    <Dialog 
      open={showSessionModal} 
      onOpenChange={(open) => {
        // Prevent closing the modal by clicking outside or ESC
        // Only allow closing through the login button
        if (!open) {
          console.log("Attempted to close modal - redirecting to login");
          handleLoginRedirect();
        }
      }}
    >
      <DialogContent 
        className="sm:max-w-md bg-white rounded-lg p-6"
        // Prevent closing on escape key or clicking outside
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
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

  console.log("user role", user?.role);

  // Show loading state while user data is being fetched
  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // Show modal for unauthorized users
  if (user === null || user?.role !== UserRole.User) {
    console.log("not authorized");
    
    return (
      <>
        <SessionTimeoutModal />
        {/* Optionally hide children when showing modal */}
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
      </>
    );
  }

  console.log("authorized");
  return <>{children}</>;
};

export default UserRouteWrapper;