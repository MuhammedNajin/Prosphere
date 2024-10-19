import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import Auth from "./components/Auth/Auth.component";
import ResetPasswordPage from "./pages/ResetPassword";
import LoginPage from "./components/Admin/Login/Login.component";
import UserComponent from "./components/Admin/User/User";
import Home from "./pages/User/Home";
import GoogleAuth from "./pages/User/GoogleAuth";
import { Toaster } from "react-hot-toast";
import AdminRouteWrapper from "./AdminRouteWrapper";
import UserRouteWrapper from "./userRouteWrapper";
import CompanyPage from "./pages/company/MycompanyPage";
import CompanyCreationPage from "./pages/company/CompanyCreationPage";
import CompanyManagemnetPage from "./pages/company/CompanyManagementPage";
import ProfilePage from "./pages/User/ProfilePage";
import JobListingPage from "./pages/job/JobLintingPage";
import JobDescriptionPage from "./pages/job/JobDescriptionPage";
import CompanyProfilePage from "./pages/company/CompanyProfilePage";
import CompanyJobApplicatonPage from "./pages/company/CompanyJobApplicatonPage";
import { routes } from "./routes/router";
function App() {
  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
      {/* <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<UserRouteWrapper> <Auth type /> </UserRouteWrapper>} />
          <Route path="/login" element={<UserRouteWrapper> <Auth type={false} /> </UserRouteWrapper>} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminRouteWrapper> <UserComponent /> </AdminRouteWrapper>} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          
          <Route path="/google/auth/flow" element={<GoogleAuth />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/company/setup" element={<CompanyCreationPage />} />
          <Route path="/company/management/:id" element={<CompanyManagemnetPage />} />
          <Route path="/company/management/profile/" element={<CompanyProfilePage />} />
          <Route path="/company/management/application/" element={<CompanyJobApplicatonPage />} />
          <Route path="/company/management/job/:id" element={<CompanyProfilePage />} />
          <Route path="/job" element={<JobListingPage />} />
          <Route path="/job-description" element={<JobDescriptionPage />} />
          <Route path="/job-description" element={<JobDescriptionPage />} />

        </Routes>
      </BrowserRouter> */}
      <RouterProvider router={ routes } />
    </>
  );
}

export default App;


