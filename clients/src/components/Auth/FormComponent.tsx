import React, { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { z } from 'zod';

// Define the schema using Zod, excluding phone validation in Form component
const formSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number"),
});

interface UserFormProps {
  firstInput: React.MutableRefObject<HTMLInputElement | null>
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  otpType: boolean;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  otpTypeHandler: (event: React.MouseEvent<HTMLParagraphElement>) => void
  showPassword: boolean;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  nextHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const FormComponent: React.FC<UserFormProps> = ({
  firstInput, setUserName, userName, otpType, phone, setPhone, email, setEmail,
  otpTypeHandler, showPassword, password, setPassword, setShowPassword, nextHandler
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleValidation = () => {
    try {
      formSchema.parse({ userName, email, password });
      setErrors({}); // Clear errors if validation passes
      nextHandler();  // Call nextHandler if validation is successful
    } catch (err) {
      const formattedErrors: { [key: string]: string } = {};
      if (err instanceof z.ZodError) {
        err.errors.forEach(error => {
          formattedErrors[error.path[0]] = error.message;
        });
      }
      setErrors(formattedErrors);
    }
  };

  const handleChange = (field: string, value: string) => {
    // Update field value and clear error for the specific field
    if (field === "userName") setUserName(value);
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);

    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  return (
    <form>
      <div className="mb-4">
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Username
        </label>
        <input
          ref={firstInput}
          onChange={(e) => handleChange("userName", e.target.value)}
          value={userName}
          type="text"
          id="fullName"
          className={`w-full px-3 py-2 border ${errors.userName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
          placeholder="Mike Foren"
        />
        {errors.userName && <p className="text-red-500 text-sm">{errors.userName}</p>}
      </div>

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {otpType ? "Phone" : "Email"}
        </label>
        {otpType ? (
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            id="phone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="+919085027632"
          />
        ) : (
          <input
            type="email"
            value={email}
            onChange={(e) => handleChange("email", e.target.value)}
            id="email"
            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
            placeholder="mikeforen96@gmail.com"
          />
        )}
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => handleChange("password", e.target.value)}
            id="password"
            className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-orange-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FaEyeSlash className="h-5 w-5 text-gray-400" />
            ) : (
              <FaEye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Must contain 1 uppercase letter, 1 number, min 8 characters.
        </p>
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </div>

      <button
        onClick={handleValidation}
        type="button"
        disabled={false}
        className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        Next
      </button>
    </form>
  );
};

export default FormComponent;
