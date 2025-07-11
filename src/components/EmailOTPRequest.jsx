import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { FaGoogle } from "react-icons/fa6";
const EmailOTPRequest = ({ onEmailSubmit }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onEmailSubmit(email);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center   p-4 mt-5 mb-5">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-vintage-900 mb-2">Enter your email for registration</h1>
          <p className="text-gray-600">We'll send you a verification code</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="your@email.com"
              autoFocus
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-medium ${loading ? 'bg-gray-400' : 'bg-vintage-700 hover:bg-vintage-800'} transition-colors`}
          >
            {loading ? (
              'Sending...'
            ) : (
              <>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </form>


        <p className='text-center'>or</p>

        <button onClick={() => {
          window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?client_id=308166864000-8elnoii29oorqvpv1olot1f2qsbmqj51.apps.googleusercontent.com&redirect_uri=https://legacy-backend-wcod.onrender.com/api/auth/verifywithgoogle&response_type=code&scope=profile email";
        }} className="flex items-center justify-center gap-4 w-full mt-5 p-3 border-2 border-gray-300 rounded-md hover:bg-gray-100 transition">
          <FaGoogle className="text-xl" />
          <span className="font-medium">Continue with Google</span>
        </button>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};


export default EmailOTPRequest;