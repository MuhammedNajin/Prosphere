import AdminRouteWrapper from "@/AdminRouteWrapper";
import UserComponent from "@/components/Admin/User/User";
import AdminLayout from "@/layout/AdminLayout";

export const adminRoute = {
    path: '/admin',
    element: <AdminLayout/>,
    children: [
       {
           path: "/",
           element: <AdminRouteWrapper> <UserComponent /> </AdminRouteWrapper>
       }
    ]
}