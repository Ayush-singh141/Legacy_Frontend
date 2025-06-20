import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { XCircleIcon } from '@heroicons/react/24/outline';
import MemoryCard from '../components/MemoryCard';
import { useAuth } from '../contexts/AuthContext';

function ApproveMemory() {
  const { memoryId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

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
      } catch (error) {
        console.error('Error fetching memory:', error);
        setError(error.response?.data?.error || 'Failed to load memory');
        toast.error(error.response?.data?.error || 'Failed to load memory');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMemory();
    }
  }, [memoryId, token]);

  const handleAction = async (action) => {
    try {
      if (action === 'reject' && !rejectionReason.trim()) {
        toast.error('Please provide a reason for rejection');
        return;
      }

      setProcessing(true);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/memories/${memoryId}/${action}`, 
        action === 'reject' ? { rejectionReason } : {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update the local memory state to reflect the new status
      setMemory(prev => ({
        ...prev,
        status: action === 'approve' ? 'approved' : 'rejected'
      }));
      
      if (action === 'reject') {
        setShowRejectModal(false);
      }
      
      toast.success(`Memory ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      setTimeout(() => navigate('/dashboard'), 2000); // Navigate after showing the status change
    } catch (error) {
      toast.error(error.response?.data?.error || `Failed to ${action} memory`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-2xl text-vintage-600">Loading memory...</div>
      </div>
    );
  }

  if (error || !memory) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <XCircleIcon className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-vintage text-vintage-900 mb-4">
          {error || 'Memory not found'}
        </h2>
        <p className="text-vintage-600 mb-6">
          The memory you're trying to approve might have been removed or already processed.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-primary"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="vintage-title mb-2">Memory Approval Request</h1>
        <p className="handwritten-text text-vintage-600">
          Review and approve or reject this memory
        </p>
      </div>

      <MemoryCard memory={memory} isDetailView={true} />

      {memory.status === 'pending' && (
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={() => setShowRejectModal(true)}
            disabled={processing}
            className="btn-secondary flex items-center space-x-2 bg-red-100 hover:bg-red-200 text-red-700"
          >
            <XCircleIcon className="h-5 w-5" />
            <span>{processing ? 'Rejecting...' : 'Reject Memory'}</span>
          </button>
          <button
            onClick={() => handleAction('approve')}
            disabled={processing}
            className="btn-primary flex items-center space-x-2 bg-green-600 hover:bg-green-700"
          >
            <XCircleIcon className="h-5 w-5" />
            <span>{processing ? 'Approving...' : 'Approve Memory'}</span>
          </button>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-vintage text-vintage-900 mb-4">
              Reject Memory
            </h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              className="w-full h-32 p-2 border border-vintage-200 rounded-lg mb-4 focus:ring-2 focus:ring-vintage-500 focus:border-transparent"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="btn-secondary"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction('reject')}
                className="btn-primary bg-red-600 hover:bg-red-700"
                disabled={processing || !rejectionReason.trim()}
              >
                {processing ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApproveMemory;