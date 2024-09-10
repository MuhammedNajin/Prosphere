import React, { useEffect, useState, useRef, MouseEvent } from "react";
import { IoClose } from "react-icons/io5";
import Spinner from "../utils/Spinner";
import OTPInput from "../utils/Otp";
import { useFirebasePhone } from "../../hooks/useFirebasePhone";
import { ApiService } from "../../api";
import { useDispatch } from "react-redux";
import { verifyOtpThunk } from "../../redux";
import NextComponent from "./Next.component";
import FormComponent from "./FormComponent";

interface Modal {
  closeModal: () => void;
  modal?: boolean;
}

export const SignUpModal: React.FC<Modal> = ({ closeModal }) => {
  const [loading, setLoading] = useState(true);
  const [otpType, setOtpType] = useState(false);
  const [otpPage, setOtpPage] = useState(false);
  const [next, setNext] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [companyName, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [otp, setOtp] = useState("");
  const [user, setUser] = useState({id:''});
  const firstInput = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();

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

  const otpTypeaHandler = () => {
    setOtpType((state) => !state);
  };
  const nextHandler = () => {
    setNext((state) => !state);
  };

  const handleSubmit = async () => {
    console.log(userName, password, email, jobRole, phone, companyName, otp);

    if (otpType) {
      const firebaseOTP = await useFirebasePhone(phone);
      if (firebaseOTP) {
        console.log("firebaseOTP is successfully sent");
      }
    } else {
      const user = {
        username: userName,
        password,
        email,
        jobRole,
        phone: phone,
      };
      const response = await ApiService.signUp(user);
      console.log("response", response._id);

      if (response) {
        setUser({ id: response._id });
        setOtpPage((state) => !state);
      }
    }
  };

  const handleVerify = () => {
    try {
      dispatch(verifyOtpThunk({ userId: user.id, otp }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center bg-white absolute rounded-lg -top-10 transition-opacity duration-300 ">
      {loading ? (
        <div
          style={{
            width: "27.625rem",
            height: "31.25rem",
          }}
          className="flex justify-center items-center w- h-1/2 p-6 ms-4"
        >
          <Spinner />
        </div>
      ) : (
        <div className="w-full max-w-md p-10 bg-white rounded-lg shadow-md transition-opacity duration-75">
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-1">
                Create a new account
              </h2>
              <p className="text-gray-600 mb-6">
                Enter your details to register
              </p>
            </div>
            <IoClose className="size-8 font-thin" onClick={closeModal} />
          </div>

          {!next ? (
            <FormComponent
              email={email}
              phone={phone}
              password={password}
              userName={userName}
              setEmail={setEmail}
              setPhone={setPhone}
              setPassword={setPassword}
              setShowPassword={setShowPassword}
              setUserName={setUserName}
              showPassword={showPassword}
              nextHandler={nextHandler}
              otpType={otpType}
              otpTypeHandler={otpTypeaHandler}
              firstInput={firstInput}
            />
          ) : !otpPage ? (
            <NextComponent
              companyName={companyName}
              email={email}
              firstInput={firstInput}
              handleSubmit={handleSubmit}
              jobRole={jobRole}
              setCompany={setCompany}
              setEmail={setEmail}
              phone={phone}
              setJobRole={setJobRole}
              setPhone={setPhone}
            />
          ) : (
            <div className=" w-[23.657rem] ">
              <OTPInput otp={otp} setOtp={setOtp} handleVerify={handleVerify} email={email} userId={user.id}/>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SignUpModal;
