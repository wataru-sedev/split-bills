import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCePoSEGFzm4KHZUIMdZgjGvgHzuLdouD4",
  authDomain: "split-bills-d5b44.firebaseapp.com",
  projectId: "split-bills-d5b44",
  storageBucket: "split-bills-d5b44.firebasestorage.app",
  messagingSenderId: "40098513660",
  appId: "1:40098513660:web:26aae7ccd9fbfb83f44d79",
  measurementId: "G-3KPNJE7EWZ"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);