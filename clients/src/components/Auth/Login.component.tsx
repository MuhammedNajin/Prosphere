import React from "react";
import SocialAuth from "../utils/SocialAuth";
import { FaFacebookF, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

interface Login {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginComponent: React.FC<Login> = ({ setModal }) => {
  return (
    <div className="col-span-2 bg-white mb-20 items-center justify-center p-8 shadow rounded-xl border border-zinc-300">
      <form>
        <div className="mb-3">
          <SocialAuth
            handler={() => {}}
            Icon={<FaFacebookF className="size-6 text-blue-600" />}
            text="SignIn with facebook"
          />
        </div>
        <div className="mb-3">
          <SocialAuth
            handler={() => {}}
            Icon={<FcGoogle className="size-6 text-black" />}
            text="SignIn with google"
          />
        </div>
        <div className="mb-3">
          <SocialAuth
            handler={() => {}}
            Icon={<FaGithub className="size-6 text-black" />}
            text="SignIn with github"
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
            to="/"
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
