import LoginPage from "@/components/Admin/Login/Login.component"
import Auth from "@/components/Auth/Auth.component"
import AuthLayout from "@/layout/AuthLayout"
import ResetPasswordPage from "@/pages/ResetPassword"
import GoogleAuth from "@/pages/User/GoogleAuth"
import UserRouteWrapper from "@/userRouteWrapper"


export const authRoute = {
     path: '',
     element: <AuthLayout />,
     children: [
        {
            path: "/signup",
            element: <UserRouteWrapper> <Auth type /> </UserRouteWrapper>
        },

        {
            path: "/signin",
            element: <UserRouteWrapper> <Auth type={false} /> </UserRouteWrapper>
        },

        {
            path: "/admin/signin",
            element: <LoginPage />
        },

        {
            path: "/reset-password/:token",
            element: <ResetPasswordPage />
        },

        {
            path: "/google/auth/flow",
            element: <GoogleAuth />
        },
     ]
}