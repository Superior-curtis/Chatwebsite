import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyBY8oUUv75AKZ21RBepBgoLWdNm5A7Dwb4",
  authDomain: "gibc-cet.firebaseapp.com",
  projectId: "gibc-cet",
  storageBucket: "gibc-cet.firebasestorage.app",
  messagingSenderId: "240565383245",
  appId: "1:240565383245:web:2f6e7db90401c0ed0d6c04",
  measurementId: "G-QL0DP656D0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);

export default app;
