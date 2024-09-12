import React, { useEffect, useRef, useState } from "react";
import developerRoles from "../../data/Jobrole";
import CircleLoader from "react-spinners/BarLoader";

import { z } from "zod";

// Define the schema using Zod
const formSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(10, "Phone number should be at least 10 digits").optional(),
  jobRole: z.string().min(1, "Please select a job role"),
});

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
  loader: boolean,
  serLoader: React.Dispatch<React.SetStateAction<boolean>>;
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
  loader,
  serLoader,
}) => {
  const firstInput = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    firstInput.current?.focus();
  }, []);

  const validateForm = () => {
    try {
      formSchema.parse({ email, phone, jobRole });
      setErrors({}); // Clear errors if validation passes
      handleSubmit();  // Proceed to the form submission
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
    if (field === "phone") setPhone(value);
    if (field === "jobRole") setJobRole(value);

    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <form className="w-[23.657rem]">
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
            onChange={(e) => handleChange("phone", e.target.value)}
            id="phone"
            className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
            placeholder="+919085027632"
          />
        ) : (
          <input
            ref={firstInput}
            type="email"
            value={email}
            onChange={(e) => handleChange("email", e.target.value)}
            color="text-zinc-500"
            id="email"
            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
            placeholder="mikeforen96@gmail.com"
          />
        )}
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      </div>

      <div className="mb-4">
        <label
          htmlFor="jobRole"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Job Role
        </label>
        <select
          id="jobRole"
          onChange={(e) => handleChange("jobRole", e.target.value)}
          className={`w-full px-3 py-2 border ${errors.jobRole ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
        >
          <option value="">Select a role</option>
          {developerRoles &&
            developerRoles.map((job, index) => (
              <option key={index} value={job}>
                {job}
              </option>
            ))}
        </select>
        {errors.jobRole && <p className="text-red-500 text-sm">{errors.jobRole}</p>}
      </div>

      <button
        onClick={validateForm}
        type="button"
        className="w-full tracking-wide bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
       { loader ? (
         <CircleLoader
         color="#ffffff"
         loading={true}
         cssOverride={{
           display: "block",
           margin: ".7rem auto",
           borderColor: "red",
         }}
         size={20}
         aria-label="Loading Spinner"
         data-testid="loader"
       />
       ) : (
        "SignUp"
       )
      }
      </button>
    </form>
  );
};

export default NextComponent;
