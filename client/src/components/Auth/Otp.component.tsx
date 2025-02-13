import React, { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ApiService } from "../../api";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Timer } from "lucide-react";
import { Spinner } from "../common/spinner/Loader";
import { useDispatch } from "react-redux";
import { verifyOtpThunk } from "@/redux/action/actions";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "@/redux/store";

const otpSchema = z.object({
  otp: z.string()
    .min(6, { message: "OTP must be 6 digits" })
    .max(6, { message: "OTP must be 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
});

interface OTPInputProps {
  handleVerify?: (otp: string) => void;
  email: string;
  userId?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({ 
  email, 
}) => {
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  
  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (resendTimer > 0) {
      intervalId = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [resendTimer]);

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      await ApiService.resetOtp({ email });
      toast.success("OTP sent successfully");
      setResendTimer(60);
      setCanResend(false);
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  const onSubmit = (values: z.infer<typeof otpSchema>) => {
    setLoading(true)
    dispatch(verifyOtpThunk({ email, otp: values.otp }))
    .unwrap()
    .then(() => {
      navigate('/in')
    })
    .catch((err: string) => {
      toast.error(err)
      setLoading((prev) => !prev);
    })
 
  };

  return (
    <div className="max-w-lg w-full mx-auto my-10 bg-white  rounded-xl space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</h2>
        <p className="text-gray-500">
          Enter the 6-digit code sent to {email}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  Enter OTP
                  <div className="flex items-center text-sm text-gray-500">
                    <Timer className="w-4 h-4 mr-1" />
                    {resendTimer > 0 ? `${resendTimer}s` : ''}
                  </div>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="XXXXXX"
                    maxLength={6}
                    className="tracking-wide bg-white border-gray-200 "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-center">
            <Button 
              type="submit" 
              className="w-full bg-orange-700 hover:bg-orange-800"
            >
              {
                loading ? (
                  <Spinner size={20} color="#f3f4f6" />
                ) : (
                    "Verify OTP"
                )
              }
            </Button>
          </div>
        </form>
      </Form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={!canResend}
            className={`
              text-orange-700 font-semibold 
              ${canResend 
                ? 'hover:underline' 
                : 'opacity-50 cursor-not-allowed'}
            `}
          >
            {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
          </button>
        </p>
      </div>
    </div>
  );
};

export default OTPInput;