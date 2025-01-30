"use client";
import { useEffect, useRef } from "react";
import { Check, Home, Loader2, AlertCircle } from "lucide-react";

import type { ConfettiRef } from "@/components/ui/confetti";
import Confetti from "@/components/ui/confetti";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation, Navigate } from "react-router-dom";
import { useVerifyStripeSession } from "@/hooks/useVerifyStripeSession";

export function PaymentSuccessPage() {
  const confettiRef = useRef<ConfettiRef>(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get("session_id");
  const id = searchParams.get("id");
  const { isValid, isLoading } = useVerifyStripeSession(sessionId || "");

  useEffect(() => {
    console.log("payment success page", sessionId, id);
    
    if (isValid) {
      const timer = setTimeout(() => {
        confettiRef.current?.fire({});
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isValid]);

  if (!sessionId) {
    return <Navigate to="/mycompany" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="relative max-w-2xl w-full overflow-hidden p-8">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-300">
              Verifying your payment...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="relative max-w-2xl w-full overflow-hidden p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="bg-yellow-100 dark:bg-yellow-900/20 rounded-full p-8 mb-4">
              <AlertCircle className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Session Timed Out</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your session has expired due to inactivity. Please log in again to
              continue.
            </p>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => (window.location.href = "/mycompany")}
            >
              <Home className="w-4 h-4" />
              Got it
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="relative max-w-2xl w-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-scale-up bg-green-100 dark:bg-green-900/20 rounded-full p-8">
            <Check className="w-16 h-16 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center p-8 pt-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-b from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Payment Successful!
          </h1>

          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
            Thank you for your payment. We've sent a confirmation email with the
            transaction details.
          </p>

          <div className="w-full max-w-md bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 dark:text-gray-400">
                Session ID
              </span>
              <span className="font-mono text-sm">{sessionId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Date</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={() => (window.location.href = `/company/${id}`)}
            >
              <Home className="w-4 h-4" />
              Return Home
            </Button>
          </div>
        </div>

        <Confetti
          ref={confettiRef}
          className="absolute left-0 top-0 z-0 size-full"
          onMouseEnter={() => {
            confettiRef.current?.fire({});
          }}
        />
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;
