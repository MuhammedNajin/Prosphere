import React, { useEffect, useState, useRef } from "react";
import { IoClose } from "react-icons/io5";
import Spinner from "../utils/Spinner";
import { useDispatch } from "react-redux";
import { signInThunk } from "../../redux";
import LoginForm from "./LoginForm.component";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../api";
import { Toaster, toast } from "react-hot-toast";
import * as z from "zod";

interface Modal {
  closeModal: () => void;
  modal?: boolean;
}

const LoginModal: React.FC<Modal> = ({ closeModal }) => {
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgetPass, setForgetPass] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const firstInput = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [disable, setDisable] = useState<boolean>(false);

  // Zod schema for validating email
  const resetPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      firstInput.current?.focus();
    }
  }, [loading]);

  // Validate the form using Zod
  const validateForm = () => {
    const validation = resetPasswordSchema.safeParse({ email });

    if (!validation.success) {
      setErrors({
        email: validation.error.formErrors.fieldErrors.email?.[0] || "",
      });
      return false;
    }

    // Clear errors if validation passes
    setErrors({});
    return true;
  };

  const handleChange = (field: string, value: string) => {
    if (field === "email") {
      setEmail(value);
    }
  };

  const handleSubmit = async () => {
    if (forgetPass) {
      if (!validateForm()) {
        return;
      }
      console.log("Password reset link sent to:", email);
      setDisable(!disable);
      const response = await ApiService.fogetPassword(email);
      console.log(response);
      if (response.status) {
        // show toast here
        toast.success("Check your Email to reset password");
        setTimeout(() => {
             closeModal(false)
        }, 2000)
      }
    } else {
      dispatch(signInThunk({ email, password }))
        .unwrap()
        .then(() => {
          navigate("/");
        })
        .catch((err) => {
          toast.error(err)
        })
    }
  };

  return (
    <div className="flex items-center justify-center bg-white absolute rounded-lg -top-10 transition-opacity duration-300">
      {loading ? (
        <div
          style={{
            width: "27.625rem",
            height: "31.25rem",
          }}
          className="flex justify-center items-center  h-1/2 p-6 ms-4"
        >
          <Spinner />
        </div>
      ) : (
        <div
          style={{
            width: "27.625rem",
          }}
          className="w-full max-w-md p-10 bg-white rounded-lg shadow-md transition-opacity duration-75"
        >
         
          <div className="flex justify-between">
            {forgetPass ? (
              <div>
                <h2 className="text-2xl font-semibold mb-1">
                  Reset your password
                </h2>
                <p className="text-zinc-500">
                  Enter your email address to receive a password reset link
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-semibold mb-1">Welcome back</h2>
                <p className="text-gray-600 mb-6">
                  Enter your details to sign in
                </p>
              </div>
            )}

            <IoClose className="size-8 font-thin" onClick={closeModal} />
          </div>

          {forgetPass ? (
            <div className="mt-4">
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  color="text-zinc-500"
                  id="email"
                  className={`w-full px-3 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="mikeforen96@gmail.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <button
                onClick={handleSubmit}
                type="button"
                disabled={disable}
                className="w-full tracking-wide bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                Send
              </button>
            </div>
          ) : (
            <LoginForm
              email={email}
              password={password}
              forgetPass={forgetPass}
              handleSubmit={handleSubmit}
              setEmail={setEmail}
              setForgetPass={setForgetPass}
              setPassword={setPassword}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default LoginModal;
