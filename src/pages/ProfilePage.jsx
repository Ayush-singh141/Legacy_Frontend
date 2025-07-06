import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Clock, BookOpen, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const usertemp = location.state?.user?.user;
  
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Handle back navigation
  const handleBackToVault = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate(-1); // Fallback to browser history
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ email: usertemp?.email, id: usertemp?._id })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (usertemp) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [usertemp?.email, usertemp?._id]);

  const joinDate = new Date(user.createdAt?.$date || user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-2, 2, -2],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const shimmerVariants = {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-vintage-50 via-vintage-100 to-vintage-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-vintage-300 border-t-vintage-600 rounded-full mx-auto mb-4"
          />
          <p className="text-vintage-800 font-serif text-lg">Loading your vintage profile...</p>
        </motion.div>
      </div>
    );
  }

  if (!user || Object.keys(user).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-vintage-50 via-vintage-100 to-vintage-50"
      >
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl border-2 border-vintage-200">
          <h1 className="text-3xl font-bold text-vintage-800 font-serif mb-2">User Not Found</h1>
          <p className="text-vintage-600 font-serif">The user you are looking for does not exist.</p>
          <motion.button
            onClick={handleBackToVault}
            className="mt-4 bg-vintage-600 hover:bg-vintage-700 text-white px-4 py-2 rounded-full inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Vault
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-vintage-50 via-vintage-100 to-vintage-50 py-2 px-2 sm:py-4 sm:px-3 lg:px-4 relative">
      {/* Back to Vault Button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        onClick={handleBackToVault}
        className="fixed top-4 left-4 z-50 bg-vintage-600 hover:bg-vintage-700 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-2"
        whileHover={{ scale: 1.05, backgroundColor: '#7d5f45' }}
        whileTap={{ scale: 0.95 }}
        style={{
          boxShadow: '0 4px 12px rgba(150, 117, 85, 0.3)'
        }}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Back to Vault</span>
      </motion.button>

      {/* Vintage Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23967555' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto pt-12"
      >
        {/* Main Profile Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-vintage-200 relative"
          style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #f9f7f4 100%)',
            boxShadow: '0 12px 24px -6px rgba(150, 117, 85, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
          }}
        >
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-vintage-400 rounded-tl-2xl"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-vintage-400 rounded-tr-2xl"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-vintage-400 rounded-bl-2xl"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-vintage-400 rounded-br-2xl"></div>

          {/* Profile Header */}
          <motion.div
            variants={itemVariants}
            className="relative bg-gradient-to-r from-vintage-600 via-vintage-500 to-vintage-700 p-3 sm:p-4 md:p-6"
            style={{
              background: 'linear-gradient(135deg, #7d5f45 0%, #967555 50%, #634a37 100%)',
            }}
          >
            {/* Vintage Pattern Overlay */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v20h40V20H20z'/%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>

            <div className="relative text-center">
              <motion.div
                variants={floatingVariants}
                animate="animate"
                whileHover={{ scale: 1.07, rotate: 4 }}
                className="inline-block relative mb-3"
              >
                <div className="absolute inset-0 bg-white rounded-full blur-md opacity-40"></div>
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.name}
                    className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-xl object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`${user.profilePic ? 'hidden' : 'flex'} relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-white bg-gradient-to-br from-vintage-100 to-vintage-200 items-center justify-center shadow-xl`}
                >
                  <User className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-vintage-600" />
                </div>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 font-serif"
                style={{
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2), 0 0 5px rgba(255,255,255,0.15)'
                }}
              >
                {user.name}
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-vintage-100 text-xs sm:text-sm md:text-base font-light tracking-wide"
              >
                {user.email}
              </motion.p>

              {/* Decorative Divider */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.8, duration: 1 }}
                className="h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mt-3 mx-auto max-w-xs opacity-50"
              />
            </div>
          </motion.div>

          {/* Profile Content */}
          <div className="p-3 sm:p-4 md:p-6">
            {/* Stats Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4"
            >
              {/* Member Since */}
              <motion.div
                whileHover={{ y: -3, scale: 1.01 }}
                className="bg-gradient-to-br from-vintage-50 to-vintage-100 rounded-xl p-2 sm:p-3 border border-vintage-200 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="p-2 rounded-full bg-gradient-to-br from-vintage-200 to-vintage-300 mr-2 shadow-inner"
                  >
                    <Clock className="h-4 w-4 text-vintage-700" />
                  </motion.div>
                  <div>
                    <h3 className="text-xs font-semibold text-vintage-600 uppercase tracking-wide">Member Since</h3>
                    <p className="text-vintage-900 font-serif text-base font-medium">{joinDate}</p>
                  </div>
                </div>
              </motion.div>

              {/* Vaults Count */}
              <motion.div
                whileHover={{ y: -3, scale: 1.01 }}
                className="bg-gradient-to-br from-vintage-50 to-vintage-100 rounded-xl p-2 sm:p-3 border border-vintage-200 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center">
                  <motion.div
                    whileHover={{ rotate: -360 }}
                    transition={{ duration: 0.6 }}
                    className="p-2 rounded-full bg-gradient-to-br from-vintage-200 to-vintage-300 mr-2 shadow-inner"
                  >
                    <BookOpen className="h-4 w-4 text-vintage-700" />
                  </motion.div>
                  <div>
                    <h3 className="text-xs font-semibold text-vintage-600 uppercase tracking-wide">Memory Vaults</h3>
                    <p className="text-vintage-900 font-serif text-base font-medium">
                      {user.vaults?.length || 0} {user.vaults?.length === 1 ? 'Vault' : 'Vaults'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Bio Section */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-vintage-50 to-vintage-100 rounded-xl p-3 sm:p-4 border border-vintage-200 shadow-inner relative"
            >
              <motion.h3
                variants={shimmerVariants}
                animate="animate"
                className="text-base sm:text-lg font-bold text-vintage-800 mb-2 font-serif relative"
                style={{
                  background: 'linear-gradient(90deg, #7d5f45, #967555, #7d5f45)',
                  backgroundSize: '200% 100%',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                About This User
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-vintage-400 to-transparent"></div>
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="text-vintage-700 leading-relaxed font-serif text-sm sm:text-base italic relative z-10"
                style={{
                  textShadow: '0 1px 2px rgba(0,0,0,0.08)'
                }}
              >
                "{user.bio || "This user hasn't written a bio yet."}"
              </motion.p>
              
              {/* Decorative Quote Marks */}
              <div className="absolute top-1 left-1 text-3xl text-vintage-200 font-serif leading-none">"</div>
              <div className="absolute bottom-1 right-1 text-3xl text-vintage-200 font-serif leading-none transform rotate-180">"</div>
            </motion.div>

            {/* Vintage Footer Decoration */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="mt-4 flex justify-center"
            >
              <div className="w-20 sm:w-32 h-0.5 bg-gradient-to-r from-transparent via-vintage-400 to-transparent"></div>
            </motion.div>
          </div>

          {/* Vintage Decorative Elements */}
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-vintage-400 opacity-20"></div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-vintage-400 opacity-20"></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;