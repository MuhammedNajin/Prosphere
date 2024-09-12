import React, { useState } from "react";
import { ApiService } from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";
import toast, { Toaster } from "react-hot-toast";


const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const navigate = useNavigate();
  const { token } = useParams(); 

  const handleSubmit = async () => {
    console.log("submit");
    
    const validation = resetPasswordSchema.safeParse({
      password,
      confirmPassword,
    });
      console.log(validation.success, token);
      
    if (!validation.success) {
      
      const fieldErrors = validation.error.formErrors.fieldErrors;
      setErrors({
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });
      return;
    }

    
    setErrors({});
   
    if (!token) return;

    try {
    
      console.log(password, token);

      const response = await ApiService.resetPassword({ password, token });
      if(response.status) {
        toast.success("Your password has been successfully reset.", {ariaProps:{ role: "alert", "aria-live": "assertive"}, });
        setTimeout(() => {
          navigate('/login', {state: true});
        }, 2000);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  const handleClose = () => {
    setConfirmPassword("");
  };

  return (
    <div className="flex justify-center h-screen">
    
      <div className="mx-auto mt-32 p-6">
        <h1 className="text-2xl font-semibold mb-4 font-roboto text-center">
          Reset account password
        </h1>
        <p className="text-sm text-zinc-600 mb-6 text-center font-roboto">
          Enter a new password for noreply@shopify.com
        </p>
        <form className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Password"
              className={`w-full pr-60 ps-4 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Confirm password"
              className={`w-full px-3 py-2 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
            {confirmPassword && (
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-gray-200 px-2 py-1 rounded"
              >
                Close
              </button>
            )}
          </div>
          <button
            onClick={handleSubmit}
            type="button"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Reset password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
