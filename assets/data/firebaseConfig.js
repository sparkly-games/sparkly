import { initializeApp, getApps, getApp } from 'firebase/app';
import ENV_VARS from '@/assets/data/env';
import { getAnalytics, logEvent } from 'firebase/analytics'; // JS SDK, not native
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const hostname =
  typeof window !== "undefined"
    ? window.location.hostname
    : "localhost";

const authDomain =
  hostname === "localhost" ||
  hostname === "127.0.0.1"
    ? "sparxapi.firebaseapp.com"
    : `auth.${hostname}`;

const firebaseConfig = {
  apiKey: ENV_VARS.FIREBASE_API_KEY,
  authDomain,
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
let analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
analytics = ENV_VARS.USE_ANALYTICS === 'true' ? analytics : null;

// Initialize Authentication
const auth = getAuth(app);

export const db = getDatabase(app); // Export this!


export { app, analytics, logEvent, auth };