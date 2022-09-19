// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBavYuhnprjp7WSwLuxjYCNfNdpd1b7jdA",
  authDomain: "invoice-8e8e9.firebaseapp.com",
  projectId: "invoice-8e8e9",
  storageBucket: "invoice-8e8e9.appspot.com",
  messagingSenderId: "692151323698",
  appId: "1:692151323698:web:e8f42171930f8e2c46402b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
// Create a root reference
export const storage = getStorage(app);
