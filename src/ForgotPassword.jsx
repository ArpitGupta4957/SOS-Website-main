import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./firebaseConfig";
import "./Login.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [showOtpInput, setShowOtpInput] = useState(false);

  // Initialize reCAPTCHA
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA Verified!");
          },
        },
        auth
      );
    }
  };

  // Send OTP
  const handleSendOtp = async () => {
    setupRecaptcha();
    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
      );
      setVerificationId(confirmation.verificationId);
      setShowOtpInput(true);
      alert("OTP sent to your mobile number.");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Try again.");
    }
  };

  // Verify OTP and Redirect to Reset Password
  const handleVerifyOtp = async () => {
    try {
      const credential = window.firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        otp
      );
      await auth.signInWithCredential(credential);
      alert("OTP Verified! Now you can reset your password.");
      navigate("/reset-password");
    } catch (error) {
      console.error("OTP Verification Failed:", error);
      alert("Invalid OTP. Try again.");
    }
  };

  return (
    <div className="background">
      <div className="container-1">
        <h2>Forgot Password</h2>

        {!showOtpInput ? (
          <>
            <input type="text" placeholder="Enter Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
            <button onClick={handleSendOtp}>Send OTP</button>
            <div id="recaptcha-container"></div>
          </>
        ) : (
          <>
            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            <button onClick={handleVerifyOtp}>Verify OTP</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
