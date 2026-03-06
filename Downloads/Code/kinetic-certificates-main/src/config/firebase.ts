// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBY8oUUv75AKZ21RBepBgoLWdNm5A7Dwb4",
  authDomain: "gibc-cet.firebaseapp.com",
  projectId: "gibc-cet",
  storageBucket: "gibc-cet.firebasestorage.app",
  messagingSenderId: "240565383245",
  appId: "1:240565383245:web:2f6e7db90401c0ed0d6c04",
  measurementId: "G-QL0DP656D0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics
export const analytics = getAnalytics(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Initialize Cloud Storage
export const storage = getStorage(app);
