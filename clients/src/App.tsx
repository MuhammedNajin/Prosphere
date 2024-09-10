import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./components/Auth/Auth.component";
import ResetPasswordPage from "./pages/ResetPassword";
import LoginPage from "./components/Admin/Login/Login.component";
import UserComponent from "./components/Admin/User/User";
import Home from "./pages/User/Home";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Auth type />} />
          <Route path="/login" element={<Auth type={false} />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<UserComponent />} />
          <Route path="/forget-password/:id" element={<ResetPasswordPage/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
