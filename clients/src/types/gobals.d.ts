// src/types/globals.d.ts
export {};

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
    recaptchaToken: any
  }
}
