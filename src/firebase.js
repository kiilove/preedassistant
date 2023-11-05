// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZnanf5ghgN_eKFvh_7GTFQ6Sjp3o0QPw",
  authDomain: "preed-manager.firebaseapp.com",
  projectId: "preed-manager",
  storageBucket: "preed-manager.appspot.com",
  messagingSenderId: "1043979247875",
  appId: "1:1043979247875:web:5ba352edfe33328d94c936",
  measurementId: "G-CJ6BEV2NRE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const database = getDatabase(app);
