import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { app } from "../config/firebase";

export const useCaptcha = async () => {
  try {
    const auth = getAuth(app);

    // Render the reCAPTCHA container
    const containerElement = document.getElementById('recaptcha-container');
    if (!containerElement) {
      throw new Error('Recaptcha container not found');
    }

    // Create the reCAPTCHA verifier
    window.recaptchaVerifier = new RecaptchaVerifier(auth , containerElement, {
      size:'normal',
      callback: (response) => {
        console.log("Recaptcha response:", response);
        window.recaptchaToken = response;
      },
      expiredCallback: () => {
        // Handle reCAPTCHA expiration
        console.warn('Recaptcha expired. Ask user to solve again.');
      },
    });

    // Trigger the reCAPTCHA challenge
    // await window.recaptchaVerifier.render();

    // Return the reCAPTCHA token
    return window.recaptchaToken;
  } catch (error) {
    console.error('Error in useCaptcha:', error);
    throw error; // Re-throw the error for handling in the calling function
  }
};