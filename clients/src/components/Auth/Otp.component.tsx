import React, { useState } from 'react';

const OTPInput = () => {
  const [otp, setOtp] = useState(Array(6).fill(''));

  const handleChange = (e, index) => {
    const { value } = e.target;
    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < length - 1) {
      
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
    }
  };

  return (
    <div className="flex justify-center items-center space-x-4">
      {otp.map((digit, index) => (
        <input
          key={index}
          id={`otp-${index}`}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-12 text-center text-xl bg-transparent border border-gray-600 focus:outline-none focus:border-white focus:ring-0 rounded"
        />
      ))}
    </div>
  );
};

export default OTPInput;
