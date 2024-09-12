import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { z } from "zod";

// Define the Zod schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

interface LoginFormProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setForgetPass: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (event: React.MouseEvent<HTMLButtonElement>) => void;
  forgetPass: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  setForgetPass,
  handleSubmit,
  forgetPass,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    try {
      loginSchema.parse({ email, password });
      setErrors({}); // Clear errors if validation passes
      handleSubmit(); // Call the handleSubmit function
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
    // Update field value and clear the error for that specific field
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);

    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <form>
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
          className={`w-full  px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
          placeholder="mikeforen96@gmail.com"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div className="mb-1">
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
            placeholder="**********"
            className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
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
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
      </div>

      <div className="flex justify-end ">
        <p
          onClick={() => setForgetPass(!forgetPass)}
          className="text-orange-500 select-none cursor-pointer"
        >
          Forget password?
        </p>
      </div>

      <button
        onClick={validateForm}
        type="button"
        disabled={false}
        className="w-full bg-orange-500 mt-2 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        Verify
      </button>
    </form>
  );
};

export default LoginForm;
