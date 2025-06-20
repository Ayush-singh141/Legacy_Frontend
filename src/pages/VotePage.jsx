import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function VotePage() {
  const [voteData, setVoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { voteId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVoteData();
  }, [voteId]);

  const fetchVoteData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/votes/vote/${voteId}`);
      setVoteData(response.data.vote);
    } catch (error) {
      toast.error('Error fetching vote details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitVote = async (voteType) => {
    try {
      setSubmitting(true);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/votes/vote/${voteId}`, {
        vote: voteType
      });
      toast.success('Vote submitted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting vote');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!voteData) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-red-600">Vote not found</h2>
        </div>
      </div>
    );
  }

  const isVotingClosed = new Date() > new Date(voteData.votingDeadline);
  const hasUserVoted = voteData.votes.some(vote => 
    vote.user === localStorage.getItem('userId')
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    {/* Header */}
    <div className="bg-vintage-400 p-6">
      <h2 className="text-2xl font-bold text-vintage-100">Memory Deletion Vote</h2>
      <p className="text-vintage-50 mt-1">Participate in the voting process</p>
    </div>
    
    {/* Content */}
    <div className="p-6 space-y-6">
      {/* Vote Info */}
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 h-5 w-5 text-vintage-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">Initiated by</p>
            <p className="text-sm font-semibold text-gray-900">{voteData.initiatedBy.name}</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0 h-5 w-5 text-vintage-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">Deadline</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(voteData.votingDeadline).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0 h-5 w-5 text-vintage-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p className={`text-sm font-semibold ${
              voteData.status === 'pending' ? 'text-amber-500' :
              voteData.status === 'approved' ? 'text-emerald-500' :
              'text-rose-500'
            }`}>
              {voteData.status.charAt(0).toUpperCase() + voteData.status.slice(1)}
            </p>
          </div>
        </div>
      </div>

      {/* Voting Buttons */}
      {voteData.status === 'pending' && !isVotingClosed && !hasUserVoted && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 text-center">Cast your vote below:</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => submitVote('infavor')}
              disabled={submitting}
              className={`inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ${
                submitting ? 'opacity-70' : ''
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              In Favor
            </button>
            <button
              onClick={() => submitVote('against')}
              disabled={submitting}
              className={`inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ${
                submitting ? 'opacity-70' : ''
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Against
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {(hasUserVoted || isVotingClosed || voteData.status !== 'pending') && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-vintage-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            Voting Results
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-emerald-600">In Favor</span>
                <span className="text-sm font-medium text-gray-900">
                  {voteData.votes.filter(v => v.vote === 'infavor').length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-emerald-500 h-2.5 rounded-full" 
                  style={{ width: `${(voteData.votes.filter(v => v.vote === 'infavor').length / voteData.votes.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-rose-600">Against</span>
                <span className="text-sm font-medium text-gray-900">
                  {voteData.votes.filter(v => v.vote === 'against').length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-rose-500 h-2.5 rounded-full" 
                  style={{ width: `${(voteData.votes.filter(v => v.vote === 'against').length / voteData.votes.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {hasUserVoted && (
            <div className="mt-4 p-3 bg-indigo-50 rounded-md flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-vintage-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-vintage-700">You've already submitted your vote</span>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
</div>
  );
}
