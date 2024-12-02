import { useState } from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { routes } from "./routes/router";
import { Toaster as CNToast } from "@/components/ui/toaster"

function App() {
  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <CNToast />
      <RouterProvider router={ routes } />
    </>
  );
}

export default App;


