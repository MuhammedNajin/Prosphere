import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useSelectedCompany } from '@/hooks/useSelectedCompany';
import { VerificationAlert } from '@/components/company/Verification/VerificationAlertDialoag';

const VERIFICATION_ROUTES = [
  '/company/verification',
  '/company/verification/'
];

const CompanyWrapper = ({ children }) => {
  const company = useSelectedCompany();
  const location = useLocation();
  
  const isVerificationRoute = () => {
    return VERIFICATION_ROUTES.some(route => location.pathname.startsWith(route));
  };

  if (company?.verified) {
    console.log("verified")
    return <>{children}</>;
  }

  switch (company?.status) {
    case 'pending':

      if (!isVerificationRoute()) {
        return <VerificationAlert />;
      }
    
      return <>{children}</>;

    case 'rejected':
      if (!isVerificationRoute()) {
        return <VerificationAlert 
          rejectionReason={company.rejectionReason}
          uploadedAt={company.lastVerificationAttempt}
          companyDocType={company.companyVerificationDoc?.documentType}
          ownerDocType={company.ownerVerificationDoc?.documentType}
        />;
      }
      return <>{children}</>;

    case 'uploaded':
      return <VerificationAlert 
        uploadedAt={company.lastVerificationAttempt}
        companyDocType={company.companyVerificationDoc?.documentType}
        ownerDocType={company.ownerVerificationDoc?.documentType}
      />;

    default:
      if (!isVerificationRoute()) {
        return <Navigate to={`/company/verification/${company?.id}`} replace />;
      }
      return <>{children}</>;
  }
};

export default CompanyWrapper;