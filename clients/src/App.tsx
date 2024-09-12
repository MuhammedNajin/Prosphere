import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./components/Auth/Auth.component";
import ResetPasswordPage from "./pages/ResetPassword";
import LoginPage from "./components/Admin/Login/Login.component";
import UserComponent from "./components/Admin/User/User";
import Home from "./pages/User/Home";
import GoogleAuth from "./pages/User/GoogleAuth";
import { Toaster } from "react-hot-toast";
import AdminRouteWrapper from "./AdminRouteWrapper";
import UserRouteWrapper from "./userRouteWrapper";
function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
