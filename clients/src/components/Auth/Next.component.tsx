import React, { useEffect, useRef } from "react";

interface FormProps {
  email: string;
  phone: string;
  jobRole: string;
  companyName: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setJobRole: React.Dispatch<React.SetStateAction<string>>;
  setCompany: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (event: React.MouseEvent<HTMLButtonElement>) => void;
  firstInput: React.MutableRefObject<HTMLInputElement | null>; 
}

const NextComponent: React.FC<FormProps> = ({
  email,
  phone,
  jobRole,
  companyName,
  setPhone,
  setEmail,
  handleSubmit,
  setJobRole,

  setCompany,
}) => {


    const firstInput = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        firstInput.current?.focus()
    })
    
  return (
    <form className=" w-[23.657rem] ">
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {email !== "" ? "Phone" : "Email"}
        </label>
        {email !== "" ? (
          <input
            ref={firstInput}
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            id="phone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="+919085027632"
          />
        ) : (
          <input
            ref={firstInput}
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
      <div className="mb-4">
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          JobRole
        </label>
        <input
          type="text"
          id="jobRole"
          onChange={(e) => setJobRole(e.target.value)}
          value={jobRole}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Software Developer"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Company name
        </label>
        <input
         
          type="text"
          id="companyName"
          value={companyName}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Google"
        />
      </div>

      <button
        onClick={handleSubmit}
        type="button"
        className="w-full tracking-wide bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        SignUp
      </button>
    </form>
  );
};

export default NextComponent;
