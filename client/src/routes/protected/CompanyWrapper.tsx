import { useLocation, Navigate } from 'react-router-dom';
import { useCurrentCompany } from '@/hooks/useSelectedCompany';
import { VerificationAlert } from '@/components/company/Verification/VerificationAlertDialoag';
import React, { useEffect } from 'react';
import { CompanyStatus } from '@/types/company';

const VERIFICATION_ROUTES = [
  '/company/verification',
  '/company/verification/'
];

interface CompanyWrapperProps {
   children: React.ReactNode
}

const CompanyWrapper: React.FC<CompanyWrapperProps> = ({ children }) => {
  const company = useCurrentCompany();
  const location = useLocation();

  useEffect(() => {
    console.log("CompanyWrapper mounted or company changed", company);  
  }, [company]);
  
  const isVerificationRoute = () => {
    return VERIFICATION_ROUTES.some(route => location.pathname.startsWith(route));
  };

  if (company?.verified) {
    console.log("verified")
    return <>{children}</>;
  }

  switch (company?.status) {
    case CompanyStatus.PENDING:

      if (!isVerificationRoute()) {
        return <VerificationAlert />;
      }
    
      return <>{children}</>;

    case CompanyStatus.SUSPENDED:
      if (!isVerificationRoute()) {
        return <VerificationAlert 
          rejectionReason={company.rejectionReason}
          uploadedAt={company.lastVerificationAttempt}
          companyDocType={company.companyVerificationDoc?.documentType}
          ownerDocType={company.ownerVerificationDoc?.documentType}
        />;
      }
      return <>{children}</>;

    case CompanyStatus.UNDER_REVIEW:
      console.log("under review")
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