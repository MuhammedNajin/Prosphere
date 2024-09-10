import React, { useState } from "react";
import { ApiService } from "../../api";
interface OTPInput {
  handleVerify: () => void,
  otp: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  email: string,
  userId: string,
}

const OTPInput: React.FC<OTPInput> = ({
  handleVerify,
  otp,
  setOtp,
  email,
  userId
}: OTPInput) => {
  return (
    <div className="">
      <div className="mb-4">
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-gray-700 mb-4"
        >
          Enter your otp
        </label>
        <input
          maxLength={6}
          onChange={(e) => setOtp(e.target.value)}
          value={otp}
          type="text"
          id="fullName"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="XXXXXX"
        />
        <p className="mt-1 flex justify-between">
          Didn't you receive.{" "}
          <span onClick={() => ApiService.resetOtp({email, userId})} className=" text-orange-500 select-none  transition transform active:scale-95">
            Resend otp
          </span>
        </p>
      </div>

      <button
        onClick={handleVerify}
        type="button"
        className="w-full tracking-wide bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        Verify
      </button>
      <div
        id="recaptcha-container"
        style={{
          position: "fixed",
          top: "300px",
          zIndex: "100",
          left: "50%",
          transform: `translateX(-50%)`,
        }}
      ></div>
    </div>
  );
};

export default OTPInput;
