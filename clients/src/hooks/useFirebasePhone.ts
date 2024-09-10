import { getAuth, signInWithPhoneNumber } from "firebase/auth";
import { useCaptcha } from "./useCaptcha";
import { app } from "../config/firebase";

const useFirebasePhone = async (phoneNumber: string) => {
    console.log("app", app)
  await useCaptcha();
  const appVerifier = window.recaptchaVerifier;
  const auth = getAuth(app);
  console.log(auth, appVerifier)
  const result = await signInWithPhoneNumber(auth, `+91${phoneNumber}`, appVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      console.log("confirmationResult", confirmationResult);
       
      return true;
    })
    .catch((error) => {
      console.log(error);
      
      return false;
    });

  return result;
};

export { useFirebasePhone };
