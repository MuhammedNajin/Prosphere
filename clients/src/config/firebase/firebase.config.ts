// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3yFRFXBaDaT0i0gGm4VidVqCxfdnBN30",
  authDomain: "prosphere-9a0ea.firebaseapp.com",
  projectId: "prosphere-9a0ea",
  storageBucket: "prosphere-9a0ea.appspot.com",
  messagingSenderId: "511792437176",
  appId: "1:511792437176:web:457cf75fab6a49c90f214d",
  measurementId: "G-TQ7ZJKYK33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;