import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApiService } from "../../api";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { googleAuth } from "../../redux";

interface Login {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginComponent: React.FC<Login> = ({ setModal }) => {
const navigate = useNavigate()
const location = useLocation();
const dispatch = useDispatch();
useEffect(() => {
  console.log("location", location);
  
   if(location.state) {
      setModal((state) => !state);
   }
},[])

  async function handle(credentialResponse: any) {
    const token = credentialResponse.credential
   const { status, user } = await ApiService.googleAuth(token);
   console.log("user from google auth", user)
   if(status === 'new') {
       navigate('/google/auth/flow', { state: user });
   } else if(status === "exsist")
      dispatch(googleAuth(user))
      navigate('/');
   }
  
  return (
    <div className="bg-white mb-20 items-center justify-center p-8 shadow rounded-xl border border-zinc-300">
      <form>
        
        
        <div className="mb-3">
        <GoogleLogin
          onSuccess={handle}
          width="330"
          size="large"
          text="signup_with"
          onError={() => {
            console.log("Login Failed");
          }}
        />
        </div>
        <div className="flex justify-between relative mt-6">
          <span className="w-36 h-px bg-zinc-400"></span>
          <p className="absolute left-40 -top-3">Or</p>
          <span className="w-36 h-px bg-zinc-400"></span>
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={(e) => setModal((state) => !state)}
            className="shadow text-lg text-center w-full bg-orange-500 text-white px-12 py-3 rounded-full tracking-normal capitalize border-0  font-bold bg-inherit hover:bg-orange-600 transition duration-200"
          >
            SignIn
          </button>
        </div>
      </form>
      <div className="mt-3">
        <h2 className="ms-2 text-lg font-semibold">
          Don't have an account?{" "}
          <Link
            className="text-orange-500 hover:underline tracking-tight"
            to="/signup"
          >
            SignUp
          </Link>
        </h2>
        <p className="text-sm ms-2  text-zinc-500">
          By signing up, you agree to the
          <span className="text-orange-500 select-none hover:underline">
            Terms of Service and Privacy Policy
          </span>
          , including Cookie Use.
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;
