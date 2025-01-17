
import CompanyOverview from "@/components/company/Profile/About"
import Home from "@/components/company/Profile/Home"
import { CompanySettings } from "@/components/company/Settings/ProfileSettings"
import { ApplicantLayout } from "@/layout/ApplicationLayout"
import CompanyLayout from "@/layout/CompanyLayout"
import CompanyCreationPage from "@/pages/company/CompanyCreationPage"
import CompanyJobApplicatonPage from "@/pages/company/CompanyJobApplicatonPage"
import CompanyManagemnetPage from "@/pages/company/CompanyManagementPage"
import CompanyProfilePage from "@/pages/company/CompanyProfilePage"

import { exampleApplicant } from "@/constants/popularSkill"
import ApplicantProfile from "@/components/company/Application/ApplicantProfile"
import ApplicatDetails from "@/components/company/Application/ApplicatDetails"
import HiringStage from "@/components/company/Application/HiringStage"
import ApplicantResume from "@/components/company/Application/ApplicantResume"
import CompanyWrapper from "../protected/CompanyWrapper"
import DocumentVerification from "@/components/company/Verification/docVerification"
import DocumentVerificationPage from "@/pages/company/DocumentVerificationPage"
import Dashboard from "@/components/company/Dashboard/Dashboard"
import JobInspectPage from "@/pages/company/JobInspectPage"
import ApplicationTable from "@/components/company/Jobs/ApplicationTable"
import JobDescription from "@/components/job/JobDescription"

import PremiumPage from "@/pages/User/Premium"
import { PaymentSuccessPage } from "@/pages/payment/Payment"
import CompanyChatPage from "@/pages/Chat/CompanyChatPage"
import MemberManagementPage from "@/components/company/Profile/Team"

export const companyRoute = [
    {
      path: '/company',
      element: <CompanyLayout />,
      children: [
        {
          path: ":id",
          element: <CompanyWrapper><Dashboard /></CompanyWrapper>
        },

        {
          path: "verification/:id",
          element: <DocumentVerificationPage />
        },

        {
          path: "message/:id",
          element: <CompanyChatPage />
        },

        {
          path: "plan/:id",
          element: <PremiumPage />
       },

      
        {
          path: "profile/:id",
          element: <CompanyWrapper><CompanyProfilePage /></CompanyWrapper>,
          children: [
            {
              path: "home",
              element: <Home />
            },
            {
              path: "about",
              element: <CompanyOverview />
            },
            {
              path: "team",
              element: <MemberManagementPage />
            }
          ]
        },
        // Other routes...
        {
          path: "profile/settings/:id",
          element: <CompanyWrapper><CompanySettings /></CompanyWrapper>
        },
        {
          path: "jobs/:id",
          element: <CompanyWrapper><CompanyManagemnetPage /></CompanyWrapper>
        },
        {
          path: "jobs/inspect/:id",
          element: <CompanyWrapper> <JobInspectPage /></CompanyWrapper>,
          children: [
             {
                path: 'applicants',
                element: <CompanyWrapper> <ApplicationTable /> </CompanyWrapper>
             },

             {
                path: 'job-details',
                element: <CompanyWrapper> <JobDescription /> </CompanyWrapper>
             },

             {
                path: 'analytics',
                element: <CompanyWrapper> <ApplicationTable /> </CompanyWrapper>
             },
          ]
        },
        {
          path: "application/:id",
          element: <CompanyWrapper><CompanyJobApplicatonPage /></CompanyWrapper>
        },
        {
          path: "application/applicant/:id",
          element: <CompanyWrapper><ApplicantLayout applicant={exampleApplicant}/></CompanyWrapper>,
          children: [
            {
              path: "profile",
              element: <ApplicatDetails />
            },
            {
              path: "resume",
              element: <ApplicantResume />
            },
            {
              path: "hiringstage",
              element: <HiringStage />
            }
          ]
        }
      ],
     


    },

    {
      path: "/company/payment/success",
      element: <PaymentSuccessPage />
    },
  ];