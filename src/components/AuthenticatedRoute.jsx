import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AuthenticatedRoute({ children }) {
  const { token } = useAuth();
  
  // If user is authenticated, redirect to dashboard
  // Otherwise, render the children (login/register/home pages)
  return token ? <Navigate to="/dashboard" replace /> : children;
}

export default AuthenticatedRoute; 