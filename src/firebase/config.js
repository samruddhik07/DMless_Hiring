import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBeAkzk_J9LL1hfITymXFNAQZCfsUILuGY",
  authDomain: "dmless-platform.firebaseapp.com",
  projectId: "dmless-platform",
  storageBucket: "dmless-platform.firebasestorage.app",
  messagingSenderId: "1024135931517",
  appId: "1:1024135931517:web:a52eca47932c2550a4f314",
  measurementId: "G-RFXVZG9FSS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);