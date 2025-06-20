import { 
  PhotoIcon, 
  VideoCameraIcon, 
  MusicalNoteIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

function MemoryCard({ memory, className = '', isDetailView = false, isAdmin = false, onDelete }) {
  const navigate = useNavigate();
  console.log('MemoryCard Props:', { memory, isAdmin, isDetailView });

  const handleClick = () => {
    if (!isDetailView) {
      navigate(`/memories/${memory._id}`);
    }
  };

  const getMediaIcon = (type) => {
    switch (type) {
      case 'image':
        return <PhotoIcon className="h-6 w-6" />;
      case 'video':
        return <VideoCameraIcon className="h-6 w-6" />;
      case 'audio':
        return <MusicalNoteIcon className="h-6 w-6" />;
      default:
        return <PhotoIcon className="h-6 w-6" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Pending Approval';
      default:
        return '';
    }
  };

  return (
    <div 
      className={`card ${className} ${!isDetailView ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={handleClick}
    >
      <div className={`relative ${isDetailView ? 'h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-96' : 'h-48'} rounded-lg overflow-hidden mb-4`}>
        {memory.mediaType === 'image' ? (
          <img
            src={memory.mediaUrl}
            alt={memory.title}
            className={`w-full h-full ${isDetailView ? 'object-contain' : 'object-cover'} bg-vintage-100`}
          />
        ) : memory.mediaType === 'video' ? (
          <video
  src={memory.mediaUrl}
  controls={isDetailView}
  playsInline
  loop={!isDetailView}
  preload="metadata"
  className={`w-full h-full ${isDetailView ? 'object-contain' : 'object-cover'} bg-vintage-100`}
/>

        ) : (
          <div className="w-full h-full flex items-center justify-center bg-vintage-100">
            {isDetailView ? (
              <audio src={memory.mediaUrl} controls className="w-full max-w-md px-4" />
            ) : (
              getMediaIcon(memory.mediaType)
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <h3 className="font-vintage text-lg sm:text-xl font-semibold text-vintage-900 break-words">
              {memory.title}
            </h3>
            <div className="flex items-center space-x-2 text-sm whitespace-nowrap">
              {getStatusIcon(memory.status)}
              <span className={`
                ${memory.status === 'approved' ? 'text-green-600' : ''}
                ${memory.status === 'rejected' ? 'text-red-600' : ''}
                ${memory.status === 'pending' ? 'text-yellow-600' : ''}
              `}>
                {getStatusText(memory.status)}
              </span>
            </div>
          </div>
          {memory.description && (
            <p className="text-vintage-600 mt-2 text-sm sm:text-base break-words">
              {memory.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-vintage-500">
          <span className="flex items-center">
            <span className="truncate max-w-[120px] sm:max-w-none">Uploaded by {memory.uploadedBy?.name}</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span>{new Date(memory.createdAt).toLocaleDateString()}</span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center">
            {getMediaIcon(memory.mediaType)}
            <span className="ml-1 capitalize">{memory.mediaType}</span>
          </span>
          {isAdmin && (
            <>
              <span className="hidden sm:inline">•</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(memory._id);
                }}
                className="text-red-500 hover:text-red-700 flex items-center"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemoryCard; 
