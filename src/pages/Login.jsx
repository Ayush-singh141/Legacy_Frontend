import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa6';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center mt-5 mb-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="vintage-title mb-2">Welcome Back</h1>
            <p className="handwritten-text text-vintage-600">
              Step into your memories
            </p>
          </div>

          

          <button onClick={() => {
            window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?client_id=308166864000-8elnoii29oorqvpv1olot1f2qsbmqj51.apps.googleusercontent.com&redirect_uri=https://legacy-backend-wcod.onrender.com/api/auth/verifywithgoogle&response_type=code&scope=profile email";
          }} className="flex items-center justify-center gap-4 w-full mt-5 p-3 border-2 border-gray-300 rounded-md hover:bg-gray-100 transition">
            <FaGoogle className="text-xl" />
            <span className="font-medium">Continue with Google</span>
          </button>

            <p className='text-center mt-5 mb-5'>or</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-vintage-800 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-vintage-800 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

        

          <div className="mt-6 text-center">
            <p className="text-vintage-700">
              Don't have an account?{' '}
              <Link to="/otp" className="text-sepia-500 hover:text-sepia-600">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login; 