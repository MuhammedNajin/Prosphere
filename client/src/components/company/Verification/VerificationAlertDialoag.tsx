import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Clock, Shield, XCircle, FileCheck2, ArrowRight, AlertCircle, LucideIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import { useSelectedCompany } from "@/hooks/useSelectedCompany";
import { format } from "date-fns";
import { Company, VerificationStatus } from "@/types/company";



interface VerificationAlertProps {
  uploadedAt?: string;
  companyDocType?: string;
  ownerDocType?: string;
  rejectionReason?: string;
}

export function VerificationAlert({
  // uploadedAt,
  // companyDocType,
  // ownerDocType,
  rejectionReason,
}: VerificationAlertProps) {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const company = useSelectedCompany() as Company

  const selectStatus: Record<VerificationStatus, {
    title: string;
    badge: string;
    badgeClass: string;
    icon: LucideIcon;
    iconClass: string;
    bgClass: string;
    description: string;
    buttonText: string;
    buttonClass: string;
  }> = {
    uploaded: {
      title: "Document Verification In Progress",
      badge: "Under Review",
      badgeClass: "text-amber-700 bg-amber-50 border-amber-200",
      icon: Clock,
      iconClass: "text-amber-600",
      bgClass: "bg-gradient-to-br from-amber-50 to-amber-100",
      description: "Your verification documents are currently being reviewed by our team. We'll notify you once the process is complete.",
      buttonText: "Close Notification",
      buttonClass: "bg-amber-600 hover:bg-amber-700 text-white transition-colors duration-200"
    },
    
    pending: {
      title: "Verification Required",
      badge: "Action Required",
      badgeClass: "text-blue-700 bg-blue-50 border-blue-200",
      icon: Shield,
      iconClass: "text-blue-600",
      bgClass: "bg-gradient-to-br from-blue-50 to-blue-100",
      description: "To access all platform features, please complete the verification process by uploading the required documents.",
      buttonText: "Start Verification",
      buttonClass: "bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
    },

    rejected: {
      title: "Verification Documents Declined",
      badge: "Action Required",
      badgeClass: "text-red-700 bg-red-50 border-red-200",
      icon: XCircle,
      iconClass: "text-red-600",
      bgClass: "bg-gradient-to-br from-red-50 to-red-100",
      description: "Your documents couldn't be verified. Please review the details below and submit new documentation.",
      buttonText: "Upload New Documents",
      buttonClass: "bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
    }
  };

  const config = selectStatus[company.status];
  const StatusIcon = config.icon;

  const handleAction = () => {
    if (company.status === 'pending' || company.status === 'rejected') {
      navigate(`/company/verification/${id}`);
    } else {
      navigate(`/mycompany`);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-2xl rounded-xl shadow-lg bg-white p-0 overflow-hidden">
        <div className={`w-full ${config.bgClass} px-6 pt-6 pb-8`}>
          <AlertDialogHeader>
            <div className="flex items-start space-x-4">
              <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm">
                <StatusIcon className={`h-7 w-7 ${config.iconClass}`} />
              </div>
              <div className="flex-1">
                <AlertDialogTitle className="text-2xl font-semibold text-gray-900">
                  {config.title}
                </AlertDialogTitle>
                <Badge 
                  variant="outline" 
                  className={`mt-2 ${config.badgeClass} text-sm font-medium px-3 py-1`}
                >
                  {config.badge}
                </Badge>
                <AlertDialogDescription className="mt-3 text-gray-700">
                  {config.description}
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
        </div>

        <div className="px-6 py-6">
          {company.status === 'rejected' && rejectionReason && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
              <h4 className="font-semibold text-red-800 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Verification Issue Details
              </h4>
              <p className="text-red-700 mt-2">{rejectionReason}</p>
            </div>
          )}

          {(company.status === 'uploaded' || company.status === 'rejected') && (
            <div className="space-y-6">
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <FileCheck2 className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Submitted Documents</h4>
                      <dl className="mt-2 text-sm text-gray-600 space-y-1">
                        <div>
                          <dt className="inline font-medium">Company:</dt>
                          <dd className="inline ml-1">{company?.companyVerificationDoc?.documentType}</dd>
                        </div>
                        <div>
                          <dt className="inline font-medium">Owner:</dt>
                          <dd className="inline ml-1">{company?.ownerVerificationDoc?.documentType}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {company.status === 'rejected' ? 'Review Date' : 'Submission Date'}
                      </h4>
                      <p className="text-sm text-gray-600 mt-2">
                        { company?.ownerVerificationDoc && format(company?.ownerVerificationDoc?.uploadedAt, 'PPP')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <AlertDialogFooter className="mt-6">
            <AlertDialogAction 
              className={`w-full ${config.buttonClass} py-3 text-base font-medium rounded-lg 
                flex items-center justify-center space-x-2 group`}
              onClick={handleAction}
            >
              <span>{config.buttonText}</span>
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default VerificationAlert;