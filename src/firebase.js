// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBRY1jAzkzG2ldInRTZwEWrB2y1DmYWW-A",
  authDomain: "oncologin-6c029.firebaseapp.com",
  projectId: "oncologin-6c029",
  storageBucket: "oncologin-6c029.appspot.com",
  messagingSenderId: "421553295698",
  appId: "1:421553295698:web:0e0c29622331426595ea8b",
  measurementId: "G-QSYLK9MPEQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// For testing purposes, disable app verification
if (window.location.hostname === "localhost") {
  auth.settings.appVerificationDisabledForTesting = true;
}

export { auth, RecaptchaVerifier, signInWithPhoneNumber }