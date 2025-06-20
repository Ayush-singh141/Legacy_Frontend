import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';

const OTPVerification = ({ email, onOTPSubmit, onGoBack, resendOTP }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeInput, setActiveInput] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    const timer = timeLeft > 0 && setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setError('');

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
      setActiveInput(index + 1);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
      setActiveInput(index - 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (isNaN(pasteData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasteData.length; i++) {
      if (i < 6) newOtp[i] = pasteData[i];
    }
    setOtp(newOtp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    // Simulate API verification
    setTimeout(() => {
      setLoading(false);
      onOTPSubmit(otpCode);
    }, 1500);
  };

  const handleResend = () => {
    setTimeLeft(30);
    resendOTP();
  };

  return (
    <div className="flex flex-col items-center  p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden p-8 mt-12">
        <button 
          onClick={onGoBack}
          className="flex items-center text-vintage-600 mb-6 hover:text-vintage-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-vintage-900 mb-2">Verify your email</h1>
          <p className="text-vintage-600">
            Enter the 6-digit code sent to <span className="font-medium">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between space-x-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  value={otp[index]}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  onFocus={() => setActiveInput(index)}
                  className={`w-full h-14 text-center text-2xl font-medium border ${activeInput === index ? 'border-vintage-800 ring-2 ring-vintage-700' : 'border-gray-300'} rounded-lg focus:outline-none transition-all`}
                  maxLength={1}
                />
              ))}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-medium ${loading ? 'bg-gray-400' : 'bg-vintage-700 hover:bg-vintage-800'} transition-colors`}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {timeLeft > 0 ? (
            <p className="flex items-center justify-center">
              <Clock className="h-4 w-4 mr-1" />
              Resend code in {timeLeft}s
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-vintage-500 font-medium hover:underline focus:outline-none"
            >
              Resend code
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;