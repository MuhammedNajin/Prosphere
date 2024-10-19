import CompanyLayout from "@/layout/CompanyLayout"
import CompanyCreationPage from "@/pages/company/CompanyCreationPage"
import CompanyJobApplicatonPage from "@/pages/company/CompanyJobApplicatonPage"
import CompanyManagemnetPage from "@/pages/company/CompanyManagementPage"
import CompanyPage from "@/pages/company/MycompanyPage"


export const companyRoute = {
     path: '/company',
     element: <CompanyLayout />,
     children: [
        {
            path: "/",
            element: <CompanyPage />
        },

        {
            path: "/setup",
            element: <CompanyCreationPage />
        },

        {
            path: "/management/:id",
            element: <CompanyManagemnetPage />
        },

        {
            path: "/management/management/application",
            element: <CompanyJobApplicatonPage />
        },

        {
            path: "/management/job/:id",
            element: <CompanyJobApplicatonPage />
        },  
     ]
}