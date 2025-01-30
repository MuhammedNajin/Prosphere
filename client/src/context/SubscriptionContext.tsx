import SubscriptionAlertModal from "@/components/Premium/SubscriptionAlertModal";
import React, { createContext, useState } from "react";

interface SubscriptionContext {
  setSubscription:React.Dispatch<React.SetStateAction<{
    state: boolean;
    currentFeature?: string;
}>>
}

export const subscriptionContext = createContext<SubscriptionContext | null>(
  null
);

interface SubscriptionWrapperProps {
  children: React.ReactNode;
}

const SubscriptionWrapper: React.FC<SubscriptionWrapperProps> = ({
  children,
}) => {
  const [subscription, setSubscription] = useState<{state: boolean, currentFeature?: string}>({ state: false, currentFeature: 'this feature'});

  return (
    <subscriptionContext.Provider value={{ setSubscription }}>
      <>
        {subscription && (
          <SubscriptionAlertModal
            isOpen={subscription.state}
            onClose={setSubscription}
            currentFeature={subscription.currentFeature}
          />
        )}
        {children}
      </>
    </subscriptionContext.Provider>
  );
};

export default SubscriptionWrapper;
