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

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container", // Make sure to match your div ID
      {
        size: "invisible", // You can also use 'normal' for a visible recaptcha
        callback: (response) => {
          console.log("Recaptcha solved");
        },
        'expired-callback': () => {
          console.error("Recaptcha expired. Please try again.");
        },
      },
      auth
    );

    window.recaptchaVerifier.render().then(function (widgetId) {
      window.recaptchaWidgetId = widgetId;
    });
  };

  const requestOtp = async () => {
    setMessage("");
    setError("");
    if (phoneNumber.length >= 10) {
      setupRecaptcha(); // Set up Recaptcha
      const appVerifier = window.recaptchaVerifier;
      try {
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          "+" + phoneNumber,
          appVerifier
        );
        setVerificationId(confirmationResult.verificationId);
        setShowOtpInput(true);
        setMessage("OTP sent successfully. Please check your phone.");
      } catch (err) {
        setError("Failed to send OTP. Try again later.");
      }
    } else {
      setError("Please enter a valid phone number.");
    }
  };

  const verifyOtp = async () => {
    setMessage("");
    setError("");
    if (otp.length === 6 && verificationId) {
      try {
        const confirmationResult = await window.confirmationResult.confirm(otp);
        const user = confirmationResult.user;
        setMessage(`Login successful! Welcome, ${user.phoneNumber}.`);
      } catch (err) {
        setError("Invalid OTP. Please try again.");
      }
    } else {
      setError("Please enter a valid 6-digit OTP.");
    }
  };

  return (
    <div className="App">
      <h1>OTP Login</h1>
      <div>
        <PhoneInput
          country={"in"} // Set your default country code
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
