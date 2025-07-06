import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VaultDetail from './pages/VaultDetail';
import CreateVault from './pages/CreateVault';
import ApproveMemory from './pages/ApproveMemory';
import Profile from './pages/Profile';
import MemoryDetail from './pages/MemoryDetail';
import VotePage from './pages/VotePage';
import { AnimatePresence } from 'framer-motion';
import NostalgicPageTransition from './components/NostalgicPageTransition';
import { useLocation } from 'react-router-dom';
import { ReactLenis, useLenis } from 'lenis/react'
import CustomCursor from './components/CustomCursor';
import OTPFlow from './pages/OTPFlow';
import LegacyChatbot from './pages/LegacyChatbot';
import ProfilePage from './pages/ProfilePage';

function App() {
  const lenis = useLenis((lenis) => {})
  return (
      
    <AnimatePresence mode="wait">
      <CustomCursor/>
    <ReactLenis root/>
      <AuthProvider>
        <div className="min-h-screen bg-vintage-50">
          <NostalgicPageTransition>
          <Navbar />
          
          <Routes location={useLocation()} key={useLocation().pathname}>
            {/* Public routes */}
            <Route path="/" element={
              
              <AuthenticatedRoute>
                <Home />
              </AuthenticatedRoute>
            } />
            
            <Route path='/otp' element={
              <NostalgicPageTransition>
              <AuthenticatedRoute>
                <OTPFlow />
              </AuthenticatedRoute>
              </NostalgicPageTransition>
            }/>
            <Route path="/login" element={
              <NostalgicPageTransition>
              <AuthenticatedRoute>
                <Login />
              </AuthenticatedRoute>
              </NostalgicPageTransition>
            } />
            <Route path="/register" element={
              <NostalgicPageTransition>
              <AuthenticatedRoute>
                <Register />
              </AuthenticatedRoute>
              </NostalgicPageTransition>
            } />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <NostalgicPageTransition>
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
              </NostalgicPageTransition>  
            } />
            <Route
             path="/legacybot"
             element={
              <NostalgicPageTransition>
              <PrivateRoute>
              <LegacyChatbot/>
              </PrivateRoute>
              </NostalgicPageTransition>
             }
             />
            <Route path="/profile" element={
              <NostalgicPageTransition>
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
              </NostalgicPageTransition>
            } />
            <Route path="/user-profile" element={
              <NostalgicPageTransition>
              <PrivateRoute>
                <ProfilePage/>
              </PrivateRoute>
              </NostalgicPageTransition>
            } />
            <Route path="/vaults/create" element={
              <PrivateRoute>
                <CreateVault />
              </PrivateRoute>
            } />
            <Route path="/vaults/:id" element={
              <NostalgicPageTransition>
              <PrivateRoute>
                <VaultDetail />
              </PrivateRoute>
              </NostalgicPageTransition>
            } />
            <Route path="/memories/:memoryId" element={
              <NostalgicPageTransition>
              <PrivateRoute>
                <MemoryDetail />
              </PrivateRoute>
              </NostalgicPageTransition>
            } />
            <Route path="/admin/approve-memory/:memoryId" element={
              <PrivateRoute>
                <ApproveMemory />
              </PrivateRoute>
            } />
            <Route path="/vote/:voteId" element={
              <PrivateRoute>
                <VotePage />
              </PrivateRoute>
            } />
          </Routes>
          </NostalgicPageTransition>
          
          {/* Toast notifications */}
          <ToastContainer position="bottom-right" theme="light" />
        </div>
      </AuthProvider>
    
    </AnimatePresence>
  );
}

export default App;
