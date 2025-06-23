import { 
  PhotoIcon, 
  VideoCameraIcon, 
  MusicalNoteIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player'
import VideoPlayer from './VideoPlayer';
import { useState, useRef, useEffect } from 'react';

function MemoryCard({ memory, className = '', isDetailView = false, isAdmin = false, onDelete }) {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  console.log('MemoryCard Props:', { memory, isAdmin, isDetailView });

  const handleClick = () => {
    if (!isDetailView) {
      navigate(`/memories/${memory._id}`);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setProgress(0);
    });

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('ended', () => {});
    };
  }, []);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    if (newVolume == 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume;
    } else {
      audioRef.current.volume = 0;
    }
    setIsMuted(!isMuted);
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setProgress(e.target.value);
  };

  const handleReplay = () => {
    audioRef.current.currentTime = 0;
    setProgress(0);
    if (!isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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

  function getCloudinaryMp4Url(url) {
    if (!url) return '';
    if (url.endsWith('.mp4') && url.includes('/vc_h264,ac_aac/')) return url;
    if (url.includes('cloudinary')) {
      let newUrl = url.replace(/\/upload(\/)?/, '/upload/vc_h264,ac_aac/');
      if (!newUrl.endsWith('.mp4')) newUrl += '.mp4';
      return newUrl;
    }
    return url;
  }

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
          <VideoPlayer mediaId={memory.publicId}/>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-vintage-100">
            {isDetailView ? (
              <div className="w-full max-w-md px-4">
                <audio 
                  src={memory.mediaUrl} 
                  ref={audioRef}
                  className="hidden"
                />
                <div className="flex flex-col space-y-4 w-full">
                  {/* Audio Title */}
                  <div className="text-center font-medium text-vintage-900">
                    {memory.title}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={handleSeek}
                      className="w-full h-2 bg-vintage-300 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-vintage-500 mt-1">
                      <span>{formatTime((progress / 100) * duration)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Play/Pause */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlayPause();
                        }}
                        className="p-2 rounded-full hover:bg-vintage-200"
                      >
                        {isPlaying ? (
                          <PauseIcon className="h-6 w-6 text-vintage-700" />
                        ) : (
                          <PlayIcon className="h-6 w-6 text-vintage-700" />
                        )}
                      </button>
                      
                      {/* Replay */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReplay();
                        }}
                        className="p-2 rounded-full hover:bg-vintage-200"
                      >
                        <ArrowPathIcon className="h-5 w-5 text-vintage-700" />
                      </button>
                    </div>
                    
                    {/* Volume Control */}
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMute();
                        }}
                        className="p-1 rounded-full hover:bg-vintage-200"
                      >
                        {isMuted ? (
                          <SpeakerXMarkIcon className="h-5 w-5 text-vintage-700" />
                        ) : (
                          <SpeakerWaveIcon className="h-5 w-5 text-vintage-700" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-2 bg-vintage-300 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
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