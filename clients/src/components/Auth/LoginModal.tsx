import React, { useEffect, useState, useRef, MouseEvent } from "react";
import { IoClose } from "react-icons/io5";
import Spinner from "../utils/Spinner";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { signInThunk } from "../../redux";
import LoginForm from "./LoginForm.component";

interface Modal {
  closeModal: () => void;
  modal?: boolean;
}

const LoginModal: React.FC<Modal> = ({ closeModal }) => {
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const firstInput = useRef<HTMLInputElement | null>(null);
  const [forgetPass, setForgetPass] = useState<boolean>(false);
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

  const handleSubmit = async () => {
    console.log(email, password);
    dispatch(signInThunk({ email, password }));
  };

  return (
    <div className="flex items-center justify-center bg-white absolute rounded-lg -top-10 transition-opacity duration-300 ">
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
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-semibold mb-1">Welcome back</h2>
                <p className="text-gray-600 mb-6">
                  Enter your details to signIn
                </p>
              </div>
            )}

            <IoClose className="size-8 font-thin" onClick={closeModal} />
          </div>

          {forgetPass ? (
              <div>
                <h2 className="text-2xl font-semibold mb-1">
                  Reset your password
                </h2>
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
