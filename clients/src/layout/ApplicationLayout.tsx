import ApplicantProfile from "@/components/company/Application/ApplicantProfile";
import { ApplicantProfileProps } from '@/types/company';

export function ApplicantLayout({ applicant }: ApplicantProfileProps) {

  return (
    <ApplicantProfile applicant={applicant}/>
  );
}