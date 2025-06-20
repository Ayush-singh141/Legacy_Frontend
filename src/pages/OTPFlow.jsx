import React, { useState } from "react";
import EmailOTPRequest from "../components/EmailOTPRequest";
import OTPVerification from "../components/OTPVerification";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const OTPFlow = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showOTPScreen, setShowOTPScreen] = useState(false);

  const handleEmailSubmit = async (submittedEmail) => {
    setEmail(submittedEmail);
    
    const response =await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/send-otp`,
      {
        email: submittedEmail,
      }
    );
    if (response.status === 200) {
        setShowOTPScreen(true);
      toast.success(`OTP sent to: ${submittedEmail}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      
    }else{
      toast.error(`Failed to send OTP. Please try again.`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });   
    }
  };

  const handleOTPSubmit = async (otp) => {
    // Verify OTP with your backend
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-otp`,
      {
        email: email,
        otp: otp,
      }
    );

    if (response.status === 200) {
      toast.success(`OTP Verified`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/register", { state: { email: email } });
    }

    // On success, you would typically redirect or update state
  };

  const handleResendOTP = async() => {
    console.log("Resending OTP to:", email);
    // Call your API to resend OTP
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/send-otp`,
      {
        email: email,
      }
    );
    if (response.status === 200) {
      toast.success(`Resent OTP to: ${email}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleGoBack = () => {
    setShowOTPScreen(false);
  };

  return (
    <>
      {!showOTPScreen ? (
        <EmailOTPRequest onEmailSubmit={handleEmailSubmit} />
      ) : (
        <OTPVerification
          email={email}
          onOTPSubmit={handleOTPSubmit}
          onGoBack={handleGoBack}
          resendOTP={handleResendOTP}
        />
      )}
    </>
  );
};

export default OTPFlow;
