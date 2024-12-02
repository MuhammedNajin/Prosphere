import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import { signInThunk } from '@/redux/reducers/authSlice';
import { ApiService } from '../../api';
import * as z from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const LoginComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const LoginFormSchema = z.object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    password: z
      .string()
      .min(1, 'Enter required Field'),
  });
  
 useEffect(() => {
   console.log(LoginFormSchema)
 })

  const handleSubmit = async (data) => {
    dispatch(signInThunk(data))
      .unwrap()
      .then((data) => {
        console.log("data.profile", data.profile)
        navigate('/');
      })
      .catch((err) => {
        toast.error(err);
      });
  };
  
  const form = useForm({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit() {

  }

  const handleGoogleAuth = async (credentialResponse) => {
    const token = credentialResponse.credential;
    const { status, user } = await ApiService.googleAuth(token);
    
    if (status === 'new') {
      navigate('/google/auth/flow', { state: user });
    } else if (status === 'exist') {
      dispatch(googleAuth(user));
      navigate('/');
    }
  };

  return (
    <div className="max-w-96  bg-white items-center justify-center p-8 shadow rounded-xl border border-zinc-300">
      <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Sign In
        </Button>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-zinc-300"></div>
          <p className="px-4 text-zinc-500">Or</p>
          <div className="flex-1 h-px bg-zinc-300"></div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleAuth}
            width="330"
            size="large"
            text="signup_with"
            onError={() => toast.error('Google Login Failed')}
          />
        </div>
      </form>
    </Form>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">
          Don't have an account?{' '}
          <Link className="text-blue-500 hover:underline" to="/signup">
            Sign Up
          </Link>
        </h2>
        <p className="text-sm text-zinc-500 mt-2">
          By signing up, you agree to the{' '}
          <span className="text-blue-500 cursor-pointer hover:underline">
            Terms of Service and Privacy Policy
          </span>
          , including Cookie Use.
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;