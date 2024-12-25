// PricingPlans.tsx
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js'
import { useMutation, useQuery } from 'react-query';
import { PaymentApi } from '@/api/payment.api';
import { AxiosError } from 'axios';
import { useGetUser } from '@/hooks/useGetUser';
import { useParams } from 'react-router-dom';
interface Plan {
  name: string;
  color: 'blue' | 'green' | 'purple';
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
}

type BillingCycle = 'monthly' | 'yearly';

const plans: Plan[] = [
  {
    name: 'Basic Plan',
    color: 'blue',
    price: {
      monthly: 4.99,
      yearly: 49.99
    },
    features: [
      'Post up to 3 jobs/month',
      'Basic company profile',
      'View up to 20 resumes'
    ]
  },
  {
    name: 'Standard Plan',
    color: 'green',
    price: {
      monthly: 9.99,
      yearly: 99.99
    },
    features: [
      'Post up to 10 jobs/month',
      'Enhanced company profile',
      'View up to 100 resumes'
    ]
  },
  {
    name: 'Premium Plan',
    color: 'purple',
    price: {
      monthly: 199.99,
      yearly: 1999.99
    },
    features: [
      'Unlimited job postings',
      'Featured company profile',
      'Unlimited resume access'
    ]
  }
];

 const publishkey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
 const stripePromise = loadStripe(publishkey);

const Premium: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const user = useGetUser();
  const { id } = useParams()
  const { data } = useQuery({
    queryKey: ["premium"],
    queryFn: () => PaymentApi.getPlan()
  })
  const getColorClasses = (color: Plan['color']): string => {
    const colorMap = {
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      purple: 'bg-purple-600'
    };
    return colorMap[color];
  };

  const paymentMutation = useMutation({
    mutationFn: PaymentApi.create,
    onSuccess: async (data) => {
        console.log("payment created", data)
        const { id } = data?.data;
        const stripe = await stripePromise;
        if(id && stripe) {
          stripe.redirectToCheckout({ sessionId: id });
        }

    },
    onError: (err: AxiosError) => {
        console.log("error", err);
    }
  })

  const handlePlanSelection = (plan: Plan) => {
    console.log(`Selected plan: ${plan}`);

    const data = {
        name: plan.name,
        id: user._id,
        companyId: id,
        price: plan.price,
        planId: plan.id
    }
    paymentMutation.mutate({ data })
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-left mb-8">
        <h1 className="text-3xl font-bold mb-2">Choose your plan</h1>
        <div className="flex items-center gap-2 mb-4">
          <div className="text-green-600">
            <Check size={16} className="inline" />
          </div>
          <span className="text-gray-600">14 days free trial</span>
        </div>
        <p className="text-gray-500">
          Get the right plan for your business. Plans can be upgraded in the future.
        </p>
      </div>

      {/* <div className="flex justify-end mb-8">
        <div className="inline-flex rounded-lg border border-gray-200 p-1">
          {(['monthly', 'yearly'] as const).map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={`
                px-4 py-2 rounded-md transition-colors duration-200
                ${billingCycle === cycle 
                  ? 'bg-orange-700 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
            </button>
          ))}
        </div>
      </div> */}

      <div className="grid md:grid-cols-3 gap-8">
        { data && data.map((plan) => (
          <div 
            key={plan.name}
            className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100 transition-transform duration-200 hover:scale-105"
          >
          
            <div className="mb-6 flex items-center">
              <div 
                className={`h-3 w-3 rounded-full mr-2 bg-orange-700`}
              />
              <h2 className="text-xl font-semibold">{plan.name}</h2>
            </div>
       
            <div className="mb-6">
              <span className="text-4xl font-bold">
                {/* ${billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly} */}
                ₹{plan.price}
              </span>
              <span className="text-gray-500">/{billingCycle}</span>
            </div>

            <div className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <div className="text-orange-400">
                    <Check size={16} className="flex-shrink-0" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handlePlanSelection(plan)}
              className={`
                w-full rounded-lg py-3 px-4 text-center font-semibold
                transition-colors duration-200
                ${plan.color === 'green'
                  ? 'bg-orange-700 text-white hover:bg-orange-800'
                  : 'border border-orange-700 text-orange-700 hover:bg-orange-50'
                }
              `}
            >
              Get Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Premium;