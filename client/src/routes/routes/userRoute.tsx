import CompanyOverview from "@/components/company/Profile/About";
import Home from "@/components/company/Profile/Home";
import Dashboard from "@/components/Dashboard/Dashboard";
import UserLayout from "@/layout/UserLayout";
import UserChatPage from "@/pages/Chat/UserChatPage";
import CompanyCreationPage from "@/pages/Company/CompanyCreationPage";
import CompanyProfilePage from "@/pages/Company/CompanyProfilePage";
import MyCompanyPage from "@/pages/Company/MycompanyPage";
import JobDescriptionPage from "@/pages/Job/JobDescriptionPage";
import JobListingPage from "@/pages/Job/JobLintingPage";
import NotificationPage from "@/pages/Notification/Notification";
import ProfilePage from "@/pages/User/ProfilePage";
import UserRouteWrapper from "../protected/UserRouteWrapper";
import MyApplicationPage from "@/pages/Job/MyApplicationPage";
import JobPosts from "@/components/company/Profile/Job";
import MemberManagementPage from "@/components/company/Profile/People";
import LandingPage from "@/pages/User/LandingPage";

export const userRoute = [
  {
    path: "/",
    element: (
      <UserRouteWrapper>
        {" "}
        <UserLayout />{" "}
      </UserRouteWrapper>
    ),
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },

      {
        path: "/profile",
        element: <ProfilePage />,
      },

      {
        path: "/profile/:companyName/:id",
        element: <CompanyProfilePage />,
        children: [
          {
            path: "home",
            element: <Home />,
          },
          {
            path: "about",
            element: <CompanyOverview />,
          },
          {
            path: "job",
            element: <JobPosts />,
          },
          {
            path: "team",
            element: <MemberManagementPage />,
          },
        ],
      },

      {
        path: "/jobs",
        element: <JobListingPage />,
      },

      {
        path: "/job-description/:id",
        element: <JobDescriptionPage />,
      },

      {
        path: "/myapplication",
        element: <MyApplicationPage />,
      },

      {
        path: "/mycompany",
        element: <MyCompanyPage />,
      },

      {
        path: "/mycompany/setup",
        element: <CompanyCreationPage />,
      },

      {
        path: "/notification",
        element: <NotificationPage />,
      },
    ],
  },

  {
    path: "/chat",
    element: (
      <UserRouteWrapper>
        {" "}
        <UserChatPage />{" "}
      </UserRouteWrapper>
    ),
  },

  {
     path: '/in',
     element: <LandingPage />
  }
];
