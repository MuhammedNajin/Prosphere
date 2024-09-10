import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
          onChange={(e) => setEmail(e.target.value)}
          color="text-zinc-500"
          id="email"
          className="w-full  px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="mikeforen96@gmail.com"
        />
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
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            placeholder="**********"
            className="w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
        onClick={handleSubmit}
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
