import React, { useState } from 'react';
import { ApiService } from '../../api';
import { useParams } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { token  } = useParams();
    if(!token) return null;
      const response = await ApiService.resetPassword({ password, token });
      console.log(response);
  };

  const handleClose = () => {
    setConfirmPassword('');
  };

  return (
    <div className='flex justify-center  h-screen'>
        <div className=" mx-auto mt-32 p-6 ">
      <h1 className="text-2xl font-semibold mb-4 font-roboto text-center">Reset account password</h1>
      <p className="text-sm text-zinc-600 mb-6 text-center font-roboto">
        Enter a new password for noreply@shopify.com
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full  pr-60 ps-4  py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="relative">
          <input
            type="password"
            placeholder="Confirm password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmPassword && (
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-gray-200 px-2 py-1 rounded"
            >
              Close
            </button>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          Reset password
        </button>
      </form>
    </div>
    </div>
  );
};

export default ResetPassword;