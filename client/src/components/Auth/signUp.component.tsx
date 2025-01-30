import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin,} from "@react-oauth/google";
import { googleAuth } from "@/redux/reducers/authSlice";
import { ApiService } from "../../api";

interface SignUP {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignUpComponent: React.FC<SignUP> = ({ setModal }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
 async function handle(credentialResponse: any) {
     const token = credentialResponse.credential
    const { status, user } = await ApiService.googleAuth(token);

    if(status === 'new') {
        navigate('/google/auth/flow', { state: user });
    } else if(status === "exsist")
      dispatch(googleAuth(user))
      navigate('/');
    }
 
  return (
    <div className="max-w-96 bg-white items-center justify-center p-8 shadow rounded-xl border border-zinc-300 mr-6">
      <form>
        {/* <div className="mb-3">
          <SocialAuth
            handler={() => {}}
            Icon={<FaLinkedinIn className="size-5 text-black" />}
            text="SignUp with github"
          />
        </div> */}
        <GoogleLogin
          onSuccess={handle}
          width="330"
          size="large"
          text="signup_with"
          onError={() => {
            console.log("Login Failed");
          }}
        />

        <div className="flex  w-full justify-between relative mt-6">
          <div className="w-36 h-px  bg-zinc-400"></div>
          <p className="absolute left-[9.5rem] -top-3">Or</p>
          <div className="w-36 h-px bg-zinc-400"></div>
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setModal((state) => !state)}
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
