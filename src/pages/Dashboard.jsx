import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  PlusIcon,
  BookOpenIcon,
  PhotoIcon,
  UserGroupIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

function Dashboard() {
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMemories: 0,
    totalVaults: 0,
    totalCollaborators: 0,
  });
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchVaults = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/vaults`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setVaults(response.data.vaults);

        // Calculate stats
        const totalMemories = response.data.vaults.reduce(
          (sum, vault) => sum + (vault.memoryCount || 0),
          0
        );
        const uniqueCollaborators = new Set();
        response.data.vaults.forEach((vault) => {
          vault.members?.forEach((member) =>
            uniqueCollaborators.add(member.user._id)
          );
        });

        setStats({
          totalMemories,
          totalVaults: response.data.vaults.length,
          totalCollaborators: uniqueCollaborators.size,
        });
      } catch (error) {
        console.error("Error fetching vaults:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVaults();
  }, [token]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vintage-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6">
          <div>
            <h1 className="vintage-title text-2xl sm:text-3xl mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-vintage-600 text-sm sm:text-base">
              Here's an overview of your memory collection
            </p>
          </div>
          <Link
            to="/profile"
            className="btn-secondary w-full sm:w-auto text-center sm:text-left"
          >
            View Profile
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-vintage-50 rounded-lg p-4 hover:bg-vintage-100 transition-colors">
            <div className="flex items-center space-x-3">
              <BookOpenIcon className="h-8 w-8 text-vintage-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-vintage-600">Total Vaults</p>
                <p className="text-xl sm:text-2xl font-semibold text-vintage-900">
                  {stats.totalVaults}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-vintage-50 rounded-lg p-4 hover:bg-vintage-100 transition-colors">
            <div className="flex items-center space-x-3">
              <PhotoIcon className="h-8 w-8 text-vintage-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-vintage-600">Total Memories</p>
                <p className="text-xl sm:text-2xl font-semibold text-vintage-900">
                  {stats.totalMemories}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-vintage-50 rounded-lg p-4 hover:bg-vintage-100 transition-colors">
            <div className="flex items-center space-x-3">
              <UserGroupIcon className="h-8 w-8 text-vintage-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-vintage-600">Collaborators</p>
                <p className="text-xl sm:text-2xl font-semibold text-vintage-900">
                  {stats.totalCollaborators}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vaults Section */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <h2 className="vintage-title text-xl sm:text-2xl">
            My Memory Vaults
          </h2>
          <div className="flex items-center gap-5">
            <Link
              to="/legacybot"
              className="relative overflow-hidden flex items-center gap-2 justify-center w-full sm:w-auto px-3 py-[7px] bg-vintage-600 hover:bg-vintage-700 text-white font-medium rounded-lg border-2 border-vintage-700/40 shadow-lg hover:shadow-vintage-300/40 transition-all duration-300 group"
            >
              {/* Animated pulse ring (hidden until hover) */}
              <span className="absolute inset-0 rounded-md ring-4 ring-vintage-400/80 scale-0 group-hover:scale-100 group-hover:opacity-0 transition-all duration-1000" />

              {/* Lightning bolt animation */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 group-hover:animate-[lightning_0.7s_ease-in-out_infinite]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>

              {/* Text with stretch effect */}
              <span className="group-hover:animate-[pulseText_1.5s_ease-in-out_infinite] rounded-lg">
                Chat with Legacy Bot
              </span>

              {/* Add this to your Tailwind config */}
              <style jsx global>{`
                @keyframes lightning {
                  0%,
                  100% {
                    transform: scale(1) rotate(0deg);
                    opacity: 1;
                  }
                  25% {
                    transform: scale(1.3) rotate(-5deg);
                    opacity: 0.8;
                  }
                  50% {
                    transform: scale(1) rotate(5deg);
                    opacity: 1;
                  }
                  75% {
                    transform: scale(1.2) rotate(0deg);
                    opacity: 0.9;
                  }
                }
                @keyframes pulseText {
                  0%,
                  100% {
                    transform: scaleX(1);
                  }
                  50% {
                    transform: scaleX(1.03);
                  }
                }
              `}</style>
            </Link>

            <Link
              to="/vaults/create"
              className="btn-primary flex items-center justify-center w-full sm:w-auto"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              <span>Create New Vault</span>
            </Link>
          </div>
        </div>

        {vaults.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <BookOpenIcon className="h-16 w-16 text-vintage-300 mx-auto mb-4" />
            <h2 className="handwritten-text text-lg sm:text-xl mb-2">
              Start Your Memory Collection
            </h2>
            <p className="text-vintage-600 text-sm sm:text-base mb-6">
              Create your first vault to begin storing and sharing precious
              memories
            </p>
            <Link
              to="/vaults/create"
              className="btn-primary inline-flex items-center justify-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              <span>Create Your First Vault</span>
            </Link>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {vaults.map((vault) => (
              <motion.div
                key={vault._id}
                variants={item}
                className="bg-vintage-50 rounded-xl p-4 hover:shadow-lg transition-all duration-200 group"
              >
                <Link to={`/vaults/${vault._id}`} className="block">
                  <div className="relative h-40 sm:h-48 mb-4 rounded-lg overflow-hidden">
                    {vault.coverPhoto ? (
                      <img
                        src={vault.coverPhoto}
                        alt={vault.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-vintage-200 group-hover:bg-vintage-300 transition-colors">
                        <BookOpenIcon className="h-12 w-12 text-vintage-500" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-vintage text-lg sm:text-xl font-semibold text-vintage-900 mb-2 truncate">
                    {vault.name}
                  </h3>
                  <p className="text-vintage-600 text-sm line-clamp-2 mb-4 min-h-[2.5rem]">
                    {vault.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-vintage-500">
                    <div className="flex items-center space-x-2">
                      <UserGroupIcon className="h-4 w-4" />
                      <span>{vault.members?.length || 1} members</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <PhotoIcon className="h-4 w-4" />
                      <span>{vault.memoryCount || 0} memories</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
