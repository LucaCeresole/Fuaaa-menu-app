// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSiXPUbD3a4RzhuM8ScXcD2D5XY5n_LhM",
  authDomain: "fuaaa-menu-app-f1fed.firebaseapp.com",
  projectId: "fuaaa-menu-app-f1fed",
  storageBucket: "fuaaa-menu-app-f1fed.firebasestorage.app",
  messagingSenderId: "573354471129",
  appId: "1:573354471129:web:5b2cd8e07669bc1fda18c8",
  measurementId: "G-GRVZ2V930L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
