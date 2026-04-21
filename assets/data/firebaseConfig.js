import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics'; // JS SDK, not native
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "auth.sparklyoss.lgbt.sh",
  projectId: "sparxapi",
  storageBucket: "sparxapi.firebasestorage.app",
  messagingSenderId: "291924279653",
  databaseURL: "https://sparxapi-default-rtdb.europe-west1.firebasedatabase.app",
  appId: "1:291924279653:web:328c9c8ceec6e5d401618c",
  measurementId: "G-0RM66GJ5FL"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics safely for Web
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Initialize Authentication
const auth = getAuth(app);

export const db = getFirestore(app); // Export this!


export { app, analytics, logEvent, auth };