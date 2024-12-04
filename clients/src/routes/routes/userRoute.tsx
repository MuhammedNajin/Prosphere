import CompanyOverview from "@/components/company/Profile/About"
import Home from "@/components/company/Profile/Home"
import Dashboard from "@/components/Dashboard/Dashboard"
import MyApplication from "@/components/job/MyApplication"
import UserLayout from "@/layout/UserLayout"
import ChatPage from "@/pages/Chat/ChatPage"
import CompanyCreationPage from "@/pages/company/CompanyCreationPage"
import CompanyProfilePage from "@/pages/company/CompanyProfilePage"
import MyCompanyPage from "@/pages/company/MycompanyPage"
import JobDescriptionPage from "@/pages/job/JobDescriptionPage"
import JobListingPage from "@/pages/job/JobLintingPage"
import PremiumPage from "@/pages/User/Premium"
import ProfilePage from "@/pages/User/ProfilePage"


export const userRoute = {
     path: '/',
     element: <UserLayout />,
     children: [
        {
            path: "/",
            element: <Dashboard />
        },

        {
            path: "/profile",
            element: <ProfilePage />
        },

        {
            path: "/profile/:companyName/:id",
            element: <CompanyProfilePage />,
            children: [
                {
                  path: "home",
                  element: <Home />
                },
                {
                  path: "about",
                  element: <CompanyOverview />
                }
              ]
        },

        {
           path: "/premium",
           element: <PremiumPage />
        },
        
        {
            path: "/jobs",
            element: <JobListingPage />
        },

        {
            path: "/job-description/:id",
            element: <JobDescriptionPage />
        },

        {
            path: "/myapplication",
            element: <MyApplication />
        },

        {
            path: "/mycompany",
            element: <MyCompanyPage />
        },

        {
            path: "/mycompany/setup",
            element: <CompanyCreationPage />
        },

        {
            path: "/chat",
            element: <ChatPage />
        },
     ]
}