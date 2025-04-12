// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_FIREBASE_KEY}`,
  authDomain: "fir-8c1ee.firebaseapp.com",
  projectId: "fir-8c1ee",
  storageBucket: "fir-8c1ee.firebasestorage.app",
  messagingSenderId: "657211910408",
  appId: "1:657211910408:web:02aa614818a26ae6db24bd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
