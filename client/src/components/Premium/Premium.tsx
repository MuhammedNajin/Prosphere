import React, { useEffect, useState } from 'react';
import { Check, Crown, AlertCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation, useQuery } from 'react-query';
import { PaymentApi } from '@/api/Payment.api';
import { AxiosError } from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { PlanData } from '@/types/subscription';
import { useCurrentCompany } from '@/hooks/useSelectedCompany';
import { useCurrentUser } from '@/hooks/useSelectors';

const Premium: React.FC = () => {
  const [billingCycle] = useState('monthly');
  const [currentPlanId, setCurrentPlanId] = useState(-1)
  const user = useCurrentUser();
  const company = useCurrentCompany()

  const { data: plans } = useQuery({
    queryKey: ["premium"],
    queryFn: () => PaymentApi.getPlan()
  });

  const { data: currentPlan } = useQuery({
    queryKey: ["currentPlan"],
    queryFn: () => PaymentApi.getCurrentPlan(company.id!)
  });

  useEffect(() => {
    console.log("currentPlan", currentPlan);
    setCurrentPlanId(currentPlan?.planSnapshot?.id)
  }, [currentPlan]);

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  const paymentMutation = useMutation({
    mutationFn: PaymentApi.create,
    onSuccess: async (data) => {
      const { id: sessionId } = data?.data;
      const stripe = await stripePromise;
      if (sessionId && stripe) {
        stripe.redirectToCheckout({ sessionId });
      }
    },
    onError: (err: AxiosError) => {
      console.error("Payment error:", err);
    }
  });

  const upgradeSubscriptionMutation = useMutation({
    mutationFn: PaymentApi.upgradeSubscription,
    onSuccess: async (data) => {
      console.log(" upgradeSubscriptionMutation", data.data);
      const { id: sessionId } = data?.data;
      const stripe = await stripePromise;
     console.log("debug", sessionId, stripe);
     
      if (sessionId && stripe) {
        console.log("redirecting to checkout");
        stripe.redirectToCheckout({ sessionId });
      }
    },
    onError: (err: AxiosError) => {
      console.error("Payment error:", err);
    }
  });

  const handlePlanSelection = (plan: PlanData) => {
    if(!user) return;
    const data = {
      name: plan.name,
      id: user.id,
      companyId: company.id,
      price: plan.price,
      planId: plan.id
    };
    paymentMutation.mutate({ data });
  };

  const handleUpgradeSubscription = (plan: PlanData) => {
    console.log("upgradeSubscriptionMutation", plan);
    if(!user?.id) return;
    const data = {
      name: plan.name,
      id: user.id,
      companyId: company.id as string,
      price: plan.price,
      planId: plan.id
    };
    upgradeSubscriptionMutation.mutate({ data });
  }


  const handlePlanAction = (plan: PlanData) => {
    console.log("plan", plan);
    if(currentPlanId === plan.id) return;

    if(plan.price > currentPlan?.planSnapshot?.price) {
      console.log("upgrade");
      handleUpgradeSubscription(plan);
    } else {
      console.log("select");
      handlePlanSelection(plan);
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Perfect Plan</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Scale your recruitment efforts with our flexible plans.
        </p>
      </div>

      {currentPlan ? (
        <Card className="bg-orange-50 border-orange-200 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Crown className="text-orange-700 h-8 w-8" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Current Plan: <span className='text-orange-700'>{currentPlan?.planSnapshot?.name}</span></h2>
                  <p className="text-gray-600">Valid until {format(currentPlan.endDate, 'PPP')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Monthly Payment</p>
                <p className="text-2xl font-bold text-orange-700">₹{currentPlan?.planSnapshot?.price}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gray-50 border-gray-200 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <AlertCircle className="text-gray-500 h-8 w-8" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">No Active Plan</h2>
                <p className="text-gray-600">Choose a plan below to get started with our premium features.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {plans?.map((plan: PlanData) => (
          <div 
            key={plan.name}
            className={`
              rounded-2xl bg-white p-8 shadow-lg border transition-all duration-300
              ${currentPlanId === plan.id 
                ? 'border-orange-500 ring-2 ring-orange-200' 
                : 'border-gray-100 hover:shadow-xl'
              }
            `}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-orange-700" />
                <h2 className="text-xl font-semibold">{plan.name}</h2>
              </div>
              {currentPlanId === plan.id && (
                <span className="px-3 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">
                  Current Plan
                </span>
              )}
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold">₹{plan.price}</span>
              <span className="text-gray-500">/{billingCycle}</span>
            </div>

            <div className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 flex-shrink-0 text-orange-500" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handlePlanAction(plan)}
              disabled={currentPlanId === plan.id || currentPlan?.planSnapshot?.price > plan.price}
              className={`
                w-full rounded-lg py-3 px-4 text-center font-semibold
                transition-all duration-200
                ${currentPlanId === plan.id || currentPlan?.planSnapshot?.price >= plan.price
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-600 text-white hover:bg-orange-700 active:transform active:scale-95'
                }
              `}
            >
              {currentPlanId === plan.id ? 'Current Plan' : currentPlan && currentPlan?.planSnapshot?.price < plan.price ? 'Upgrade Plan' : 'Choose Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Premium;