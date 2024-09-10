import React from "react";
import SocialAuth from "../utils/SocialAuth";
import {FaLinkedinIn } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { GoogleLogin,} from "@react-oauth/google";
import { googleAuthThunk } from "../../redux";
import { LinkedIn } from "react-linkedin-login-oauth2";
import linkedin from 'react-linkedin-login-oauth2/assets/linkedin.png';

interface SignUP {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignUpComponent: React.FC<SignUP> = ({ setModal }) => {
  const dispatch = useDispatch()
  function handle(credentialResponse: any) {
    console.log(credentialResponse);
    
     const token = credentialResponse.credential
    dispatch(googleAuthThunk(token))
  }

  function hangleLinkedIn(res: any) {
     console.log(res)
  }

 

  return (
    <div className="md:col-span-1 md:col-start-4 md:col-end-6 lg:col-span-2 col-span-1 bg-white items-center justify-center p-8 shadow rounded-xl border border-zinc-300">
      <form>
        <LinkedIn
         
         clientId="86krujw8htl80w"
         onSuccess={hangleLinkedIn}
         onError={(error: any, msg: any) => console.log(error, msg)}
         redirectUri={`${window.location.origin}/linkedin`}
        >
            {({ linkedInLogin }) => (
        <img
          onClick={linkedInLogin}
          src={linkedin}
          alt="Sign in with Linked In"
          style={{ maxWidth: '180px', cursor: 'pointer' }}
        />
      )}
        </LinkedIn>
        <div className="mb-3">
          <SocialAuth
            handler={() => {}}
            Icon={<FaLinkedinIn className="size-5 text-black" />}
            text="SignUp with github"
          />
        </div>
        <GoogleLogin
          onSuccess={handle}
          width="330"
          size="large"
          text="signup_with"
          onError={() => {
            console.log("Login Failed");
          }}
        />
        

        <div className="flex justify-between relative mt-6">
          <span className="lg:w-36 h-px  bg-zinc-400"></span>
          <p className="absolute left-40 -top-3">Or</p>
          <span className="lg:w-36 h-px bg-zinc-400"></span>
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={(e) => setModal((state) => !state)}
            className="shadow text-lg text-center w-full bg-orange-500 text-white px-12 py-3 rounded-full tracking-normal capitalize border-0  font-bold hover:bg-orange-600 transition duration-200"
          >
            Create account
          </button>
        </div>
      </form>
      <div className="mt-3">
        <h2 className="ms-2 text-lg font-semibold">
          Already have an account?{" "}
          <Link className="text-orange-500 hover:underline" to="/login">
            SignIn
          </Link>
        </h2>
        <p className="text-sm ms-2 text-zinc-500">
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

export default SignUpComponent;
