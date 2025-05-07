// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBRI-z3R-BXqlJLzBLxz7uHwMV63l1lO6o",
    authDomain: "kkn-guyangan.firebaseapp.com",
    projectId: "kkn-guyangan",
    storageBucket: "kkn-guyangan.firebasestorage.app",
    messagingSenderId: "465117721798",
    appId: "1:465117721798:web:a03c6133b1956782fd13c7",
    measurementId: "G-Y0N113RH02"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

const auth = getAuth();
signInAnonymously(auth).then(() => {
  console.log("Login anonim berhasil");
}).catch((error) => {
  console.error("Gagal login anonim:", error);
});