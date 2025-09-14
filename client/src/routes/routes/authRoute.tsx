import LoginPage from "@/components/Admin/Login/Login.component";
import AuthLayout from "@/layout/AuthLayout";
import SignInPage from "@/pages/Auth/SigninPage";
import SignUpPage from "@/pages/Auth/SignUpPage";
import ResetPasswordPage from "@/pages/Auth/ResetPassword";
import GoogleAuth from "@/pages/User/GoogleAuth";
import AuthRouteWrapper from "../protected/AuthWrapper";

export const authRoute = {
  path: "",
  element: <AuthLayout />,
  children: [
    {
      path: "/signup",
      element: (
        <AuthRouteWrapper>
          {" "}
          <SignUpPage />{" "}
        </AuthRouteWrapper>
      ),
    },

    {
      path: "/signin",
      element: (
        <AuthRouteWrapper>
          {" "}
          <SignInPage />{" "}
        </AuthRouteWrapper>
      ),
    },

    {
      path: "/admin/signin",
      element: <LoginPage />,
    },

    {
      path: "/reset-password",
      element: <ResetPasswordPage />,
    },

    {
      path: "/google/auth/flow",
      element: <GoogleAuth />,
    },
  ],
};
