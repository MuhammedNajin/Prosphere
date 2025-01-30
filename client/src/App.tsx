import "./App.css";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { routes } from "./routes/router";
import { Toaster as CNToast } from "@/components/ui/toaster";
import ErrorAlert from "./components/ErrorAlert/ErrorAlert";
import { useAlertStore } from "./api";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "./redux/reducers/authSlice";

function App() {
  const { isLogout, isOpen, title, message, type, retryAction, closeAlert,  } =
    useAlertStore();
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("fdfdsfds",isLogout);
    if (isLogout) {
      console.log("logout", isLogout);

      dispatch(logout());
    }
  }, [isLogout]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <CNToast />
      <RouterProvider router={routes} />
      <ErrorAlert
        isOpen={isOpen}
        onClose={closeAlert}
        title={title}
        message={message}
        type={type}
        retryAction={retryAction}
      />
    </>
  );
}

export default App;
