import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import {
  BookOpenIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  PlusCircleIcon,
  ArrowUpTrayIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

function Navbar() {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpenIcon className="w-8 h-8 text-vintage-600" />
            <span className="text-xl font-semibold font-vintage text-vintage-900">LegacyVault</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-4 md:flex">
            {token ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-3 py-2 text-sm font-medium rounded-md text-vintage-600 hover:text-vintage-800 hover:bg-vintage-50 transition-colors"
                >
                  My Vaults
                </Link>

                {/* Enhanced Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center p-1 space-x-1 rounded-full hover:bg-vintage-50 focus:outline-none transition-colors group"
                  >
                    {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt="Profile"
                        className="object-cover w-8 h-8 border rounded-full border-vintage-200 group-hover:border-vintage-300 transition-colors"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-8 h-8 border rounded-full bg-vintage-100 border-vintage-200 group-hover:border-vintage-300 transition-colors">
                        <UserIcon className="w-5 h-5 text-vintage-600" />
                      </div>
                    )}
                    <ChevronDownIcon className={`w-4 h-4 text-vintage-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Discord-like Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 z-20 w-56 py-1 mt-2 bg-white rounded-md shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {/* User Info Section */}
                      <div className="px-4 py-3 border-b border-vintage-100">
                        <p className="text-sm font-medium text-vintage-900 truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-vintage-500 truncate">{user?.email || 'No email'}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-vintage-700 hover:bg-vintage-50 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <UserCircleIcon className="w-5 h-5 mr-3 text-vintage-500" />
                          Profile Settings
                        </Link>
                        <Link
                          to="/legacybot"
                          className="flex items-center px-4 py-2 text-sm text-vintage-700 hover:bg-vintage-50 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <BoltIcon className="w-5 h-5 mr-3 text-vintage-500" />
                          Legacy Bot
                        </Link>
                        {/* <Link
                          to="/upload"
                          className="flex items-center px-4 py-2 text-sm text-vintage-700 hover:bg-vintage-50 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <ArrowUpTrayIcon className="w-5 h-5 mr-3 text-vintage-500" />
                          Upload Memory
                        </Link>
                        <Link
                          to="/create-vault"
                          className="flex items-center px-4 py-2 text-sm text-vintage-700 hover:bg-vintage-50 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <PlusCircleIcon className="w-5 h-5 mr-3 text-vintage-500" />
                          Create New Vault
                        </Link> */}
                      </div>

                      {/* Logout Section */}
                      <div className="py-1 border-t border-vintage-100">
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-left text-vintage-700 hover:bg-vintage-50 transition-colors"
                        >
                          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-vintage-500" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium rounded-md text-vintage-600 hover:text-vintage-800 hover:bg-vintage-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/otp"
                  className="px-4 py-2 text-sm font-medium text-white rounded-md bg-vintage-600 hover:bg-vintage-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-vintage-600 hover:text-vintage-800 hover:bg-vintage-50 rounded-md transition-colors"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="py-2 border-t md:hidden border-vintage-100">
            {token ? (
              <div className="px-2 pb-3 space-y-1">
                {/* Mobile Profile Section */}
                <div className="flex items-center px-3 py-2 mb-2">
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="Profile"
                      className="object-cover w-10 h-10 border rounded-full border-vintage-200"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-10 h-10 border rounded-full bg-vintage-100 border-vintage-200">
                      <UserIcon className="w-6 h-6 text-vintage-600" />
                    </div>
                  )}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-vintage-900">{user?.name}</p>
                    <p className="text-xs text-vintage-500">{user?.email}</p>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  className="flex items-center px-3 py-2 text-base font-medium rounded-md text-vintage-600 hover:text-vintage-800 hover:bg-vintage-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BookOpenIcon className="w-5 h-5 mr-2" />
                  My Vaults
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 text-base font-medium rounded-md text-vintage-600 hover:text-vintage-800 hover:bg-vintage-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserCircleIcon className="w-5 h-5 mr-2" />
                  Profile Settings
                </Link>
                <Link
                  to="/legacybot"
                  className="flex items-center px-3 py-2 text-base font-medium rounded-md text-vintage-600 hover:text-vintage-800 hover:bg-vintage-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BoltIcon className="w-5 h-5 mr-2" />
                  Legacy Bot
                </Link>
                {/* <Link
                  to="/upload"
                  className="flex items-center px-3 py-2 text-base font-medium rounded-md text-vintage-600 hover:text-vintage-800 hover:bg-vintage-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                  Upload Memory
                </Link>
                <Link
                  to="/create-vault"
                  className="flex items-center px-3 py-2 text-base font-medium rounded-md text-vintage-600 hover:text-vintage-800 hover:bg-vintage-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <PlusCircleIcon className="w-5 h-5 mr-2" />
                  Create New Vault
                </Link> */}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-left rounded-md text-vintage-600 hover:text-vintage-800 hover:bg-vintage-50 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-2 pb-3 space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium rounded-md text-vintage-600 hover:text-vintage-800 hover:bg-vintage-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/otp"
                  className="block px-3 py-2 text-base font-medium text-white rounded-md bg-vintage-600 hover:bg-vintage-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;