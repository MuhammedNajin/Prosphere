"use client";

import { useEffect, useRef } from "react";

import type { ConfettiRef } from "@/components/ui/confetti"
import Confetti from "@/components/ui/confetti";

export function PaymentSuccessPage() {
  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    confettiRef.current?.fire({});
  }, [])

  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        Payment Successfull
      </span>

      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-0 size-full"
        onMouseEnter={() => {
          confettiRef.current?.fire({});
        }}
      />
    </div>
  );
}
