import React from 'react';
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
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from 'react-router-dom';
import { Crown, Rocket, Shield } from 'lucide-react';

interface SubscriptionAlertModalProps {
    isOpen:  boolean;
    onClose: React.Dispatch<React.SetStateAction<{
      state: boolean;
      currentFeature: string;
  }>>
  currentFeature: string
}

const SubscriptionAlertModal: React.FC<SubscriptionAlertModalProps> = ({ 
  isOpen,
  onClose, 
  planPrice = 200,
  currentFeature = "this feature"
}) => {
 const { id } = useParams()
  const navigate = useNavigate();

  const handleUpgradeClick = () => {
    navigate(`/company/plan/${id}`);
    onClose(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={() => onClose({state: false,})}>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <div className="flex items-center space-x-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            <AlertDialogTitle className="text-xl">
              Unlock Premium Features
            </AlertDialogTitle>
          </div>
          
          <Badge 
            variant="secondary" 
            className="mb-4 text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
          >
            Starting at ${planPrice}/month
          </Badge>

          <AlertDialogDescription className="space-y-4">
            <p className="text-base text-gray-700">
              To access {currentFeature}, you'll need an active subscription. Upgrade now to unlock:
            </p>

            <div className="grid grid-cols-1 gap-3 mt-4">
              <div className="flex items-start space-x-3">
                <Rocket className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Premium Features Access</p>
                  <p className="text-sm text-gray-600">Get unlimited access to all premium features and tools</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Priority Support</p>
                  <p className="text-sm text-gray-600">Dedicated support team to help you succeed</p>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel className="text-gray-500">
            Maybe Later
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUpgradeClick}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8"
          >
            Upgrade Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SubscriptionAlertModal;