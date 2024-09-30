// src/App.js
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "./firebase";

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // This ensures app verification is disabled only in local development
  if (window.location.hostname === "localhost") {
    auth.settings.appVerificationDisabledForTesting = true;
  }

  // Set up Recaptcha
  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          console.log("Recaptcha verified");
        },
        'expired-callback': () => {
          setMessage("Recaptcha expired. Please try again.");
        },
      },
      auth
    );
  };

  // Request OTP
  const requestOtp = async () => {
    setMessage("");
    setError("");
    if (phoneNumber.length >= 10) {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      try {
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          "+" + phoneNumber,
          appVerifier
        );
        setVerificationId(confirmationResult.verificationId);
        setShowOtpInput(true);
        setMessage("OTP sent successfully.");
      } catch (err) {
        setError("Failed to send OTP. Try again later.");
      }
    } else {
      setError("Please enter a valid phone number.");
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (otp.length === 6 && verificationId) {
      try {
        const confirmationResult = await window.confirmationResult.confirm(otp);
        const user = confirmationResult.user;
        setMessage(`Login successful! Welcome, ${user.phoneNumber}.`);
      } catch (err) {
        setError("Invalid OTP. Please try again.");
      }
    } else {
      setError("Please enter a valid OTP.");
    }
  };

  return (
    <div className="App">
      <h1>OTP Login</h1>
      <div>
        <PhoneInput
          country={"in"} // Default country code
          value={phoneNumber}
          onChange={setPhoneNumber}
        />
        <div id="recaptcha-container"></div>
        {!showOtpInput && (
          <button id="sign-in-button" onClick={requestOtp}>
            Send OTP
          </button>
        )}
        {showOtpInput && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={verifyOtp}>Verify OTP</button>
          </>
        )}
      </div>
      <p style={{ color: "green" }}>{message}</p>
      <p style={{ color: "red" }}>{error}</p>
    </div>
  );
};

export default App;
