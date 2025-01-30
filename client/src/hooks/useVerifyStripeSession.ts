import { PaymentApi } from "@/api/Payment.api";
import { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";

export const useVerifyStripeSession = (sessionId: string) => {
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const verifySession = async () => {
        if (!sessionId) {
          setIsLoading(false);
          return;
        }
        
        try {
          const response = await PaymentApi.checkSession(sessionId);
  
          if (response.status !== HttpStatusCode.Ok) {
            throw new Error('Invalid session');
          }

          setIsValid(true);
        } catch (error) {
          console.error('Session verification failed:', error);
          setIsValid(false);
        } finally {
          setIsLoading(false);
        }
      };
  
      verifySession();
    }, [sessionId]);
  
    return { isValid, isLoading };
  };