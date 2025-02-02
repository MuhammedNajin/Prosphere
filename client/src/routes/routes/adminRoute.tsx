import AdminRouteWrapper from "@/routes/protected/AdminRouteWrapper";
import CompanyVerificationDetails from "@/components/Admin/Company/CompanyVerificationDetails";
import CompanyVerificationRequest from "@/components/Admin/Company/CompanyVerificationRequest";
import UserComponent from "@/components/Admin/User/User";
import AdminLayout from "@/layout/AdminLayout";
import PlanManagement from "@/components/Admin/Subscription/Subscription";
import AdminDashboardPage from "@/pages/Admin/AdminDashboardPage";

export const adminRoute = {
    path: '/admin/',
    element: <AdminLayout />,
    children: [
       {
           path: "dashboard",
           element: <AdminRouteWrapper> <AdminDashboardPage /> </AdminRouteWrapper> 
       },
       {
           path: "company/verification",
           element: <AdminRouteWrapper> <CompanyVerificationRequest /> </AdminRouteWrapper> 
       },

       {
           path: "company/verification/details/:id",
           element: <AdminRouteWrapper> <CompanyVerificationDetails /> </AdminRouteWrapper> 
       },

       {
           path: "user",
           element: <AdminRouteWrapper> <UserComponent /> </AdminRouteWrapper>,
       },

       {
           path: "subscription",
           element: <PlanManagement />
       }
    ]
}