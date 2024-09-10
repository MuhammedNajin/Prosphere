import React from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";


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
  

const FormComponent:React.FC<UserFormProps> = ({firstInput, setUserName, userName, otpType, phone,setPhone, email, setEmail, otpTypeHandler, showPassword, password, setPassword, setShowPassword, nextHandler  }) => {
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
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
          type="text"
          id="fullName"
          className="w-full caret-orange-500 cur px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Mike Foren"
        />
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
            onChange={(e) => setEmail(e.target.value)}
            color="text-zinc-500"
            id="email"
            className="w-full  px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="mikeforen96@gmail.com"
          />
        )}
      </div>
      <div className="mb-4 flex justify-end cursor-pointer transition transform active:scale-95">
        <p
          onClick={otpTypeHandler}
          className="text-orange-500 hover:underline select-none"
        >
          {otpType ? "Use email instead" : "Use phone instead"}
        </p>
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
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
      </div>

      <button
        onClick={nextHandler}
        type="button"
        disabled={false}
        className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        Next
      </button>
    </form>
  );
}

export default FormComponent;
