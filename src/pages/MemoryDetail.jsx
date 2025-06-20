import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  ArrowLeftIcon, 
  BookOpenIcon,
  CalendarIcon,
  UserGroupIcon,
  HeartIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import MemoryCard from '../components/MemoryCard';
import { useAuth } from '../contexts/AuthContext';

const MemoryDetail = () => {
  const { memoryId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/memories/${memoryId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMemory(response.data.memory);
        setLikesCount(response.data.memory.likes?.length || 0);
        setHasLiked(response.data.memory.likes?.includes(user?._id));
      } catch (error) {
        console.error('Error fetching memory:', error);
        setError(error.response?.data?.error || 'Failed to load memory');
        toast.error(error.response?.data?.error || 'Failed to load memory');
        if (error.response?.status === 404) {
          navigate('/dashboard');
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMemory();
    }
  }, [memoryId, token, navigate, user?._id]);

  const handleBack = () => {
    navigate(`/vaults/${memory.vault._id}`);
  };

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/memories/${memoryId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setLikesCount(response.data.likesCount);
        setHasLiked(response.data.liked);
        toast.success(response.data.liked ? 'Memory liked!' : 'Memory unliked');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error(error.response?.data?.error || 'Failed to toggle like');
    }
  };  const handleDeleteRequest = async () => {
    try {
      if (!window.confirm('Are you sure you want to request deletion of this memory? This will initiate a voting process with all vault members.')) {
        return;
      }

      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/memories/${memoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Deletion vote initiated successfully. All vault members will be notified to vote.');
      navigate(`/vote/${response.data.voteId}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to initiate deletion vote';
      toast.error(errorMessage);
      console.error('Error initiating deletion vote:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-vintage-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-vintage-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container px-4 py-4 mx-auto sm:py-8">
      {/* Navigation and Context Bar */}
      <div className="p-3 mb-4 bg-white shadow-sm sm:p-4 sm:mb-8 rounded-xl">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <button
            onClick={handleBack}
            className="flex items-center text-vintage-600 hover:text-vintage-800"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Vault
          </button>
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-sm text-vintage-600 sm:text-base">
              <CalendarIcon className="w-4 h-4 mr-1 sm:w-5 sm:h-5" />
              {new Date(memory?.createdAt).toLocaleDateString()}
            </span>
            <button 
              onClick={handleLike}
              className={`flex items-center ${hasLiked ? 'text-red-500' : 'text-vintage-600 hover:text-red-500'} transition-colors duration-200`}
            >
              <HeartIcon className={`w-4 h-4 sm:w-5 sm:h-5 mr-1 ${hasLiked ? 'fill-current' : ''} transition-all duration-200`} />
              {likesCount}
            </button>
          </div>
        </div>
      </div>

      {/* Memory Context */}
      <div className="max-w-4xl mx-auto">
        {memory && (
          <>
            {/* Vault Context */}
            <div className="p-4 mb-4 bg-white shadow-sm sm:p-6 sm:mb-8 rounded-xl">
              <div className="flex flex-col justify-between gap-4 mb-4 sm:flex-row sm:items-center">
                <div className="flex items-center space-x-2">
                  <BookOpenIcon className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 text-vintage-600" />
                  <h2 className="text-lg font-semibold break-words sm:text-xl font-vintage text-vintage-900">
                    From Vault: {memory.vault.name}
                  </h2>
                </div>
                <div className="flex items-center text-sm text-vintage-600 sm:text-base whitespace-nowrap">
                  <UserGroupIcon className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
                  <span>Shared with {memory.vault.members?.length || 0} members</span>
                </div>
              </div>
              <p className="text-sm break-words text-vintage-600 sm:text-base">
                {memory.vault.description}
              </p>
            </div>

            {/* Memory Card */}
            <div className="p-3 bg-white shadow-sm sm:p-6 rounded-xl">
              <MemoryCard memory={memory} isDetailView={true} />
            </div>

            {/* Memory Stats */}
            <div className="mt-6 text-center sm:mt-8 text-vintage-600">
              <p className="px-2 text-lg sm:text-xl handwritten-text">
                This memory was captured on {" "+new Date(memory.createdAt).toLocaleDateString()+" "} 
                by {memory.uploadedBy?.name}
              </p>
            </div>

            {/* Delete Memory */}
            <div className="mt-4 text-center">
              <button
                onClick={handleDeleteRequest}
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition-all duration-200"
              >
                <TrashIcon className="w-5 h-5 mr-2" />
                Request Memory Deletion
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export { MemoryDetail as default };