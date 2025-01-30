import CompanyOverview from "@/components/company/Profile/About"
import Home from "@/components/company/Profile/Home"
import { CompanySettings } from "@/components/company/Settings/ProfileSettings"
import { ApplicantLayout } from "@/layout/ApplicationLayout"
import CompanyLayout from "@/layout/CompanyLayout"
import CompanyJobApplicatonPage from "@/pages/Company/CompanyJobApplicatonPage"
import CompanyManagemnetPage from "@/pages/Company/CompanyManagementPage"
import CompanyProfilePage from "@/pages/Company/CompanyProfilePage"
import { exampleApplicant } from "@/constants/popularSkill"
import ApplicatDetails from "@/components/company/Application/ApplicatDetails"
import HiringStage from "@/components/company/Application/HiringStage"
import ApplicantResume from "@/components/company/Application/ApplicantResume"
import CompanyWrapper from "../protected/CompanyWrapper"
import DocumentVerificationPage from "@/pages/Company/DocumentVerificationPage"
import Dashboard from "@/components/company/Dashboard/Dashboard"
import JobInspectPage from "@/pages/Company/JobInspectPage"
import ApplicationTable from "@/components/company/Jobs/ApplicationTable"
import JobDescription from "@/components/job/JobDescription"
import PremiumPage from "@/pages/User/Premium"
import { PaymentSuccessPage } from "@/pages/Payment/Payment"
import CompanyChatPage from "@/pages/Chat/CompanyChatPage"
import MemberManagementPage from "@/components/company/Profile/People"
import JobPosts from "@/components/company/Profile/Job"
import UserRouteWrapper from "../protected/UserRouteWrapper"

export const companyRoute = [
    {
      path: '/company',
      element: <UserRouteWrapper> <CompanyLayout /> </UserRouteWrapper>,
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
              path: "job",
              element: <JobPosts />
            },
            {
              path: "team",
              element: <MemberManagementPage />
            }
          ]
        },
  
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
          element: <CompanyWrapper><ApplicantLayout /></CompanyWrapper>,
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