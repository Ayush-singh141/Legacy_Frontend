import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Heart, Calendar, Image, Video, Music, FileText, Eye } from 'lucide-react';

// VideoPlayer Component
const VideoPlayer = ({mediaId}) => {
    const cloudinaryRef = useRef(null);
    const videoRef = useRef(null);
    useEffect(() => {
        if(cloudinaryRef.current) {
            return; // Cloudinary already loaded
        }
      cloudinaryRef.current = window.cloudinary;
      cloudinaryRef.current.videoPlayer(videoRef.current,{
        cloud_name:'ddgg6kmod',
      })

    }, [mediaId])
    
  return (
    <video ref={videoRef} data-cld-public-id={mediaId} controls muted playsInline preload="auto" className='w-[100%] h-[100%]' />
  )
}

const MemoryTimeline = ({ memories = [] }) => {
  const [playingAudio, setPlayingAudio] = useState(null);

  const formatDate = (dateString) => {
    try {
      // Handle MongoDB date format: { $date: "2025-06-20T21:49:45.742Z" }
      const date = typeof dateString === 'object' && dateString.$date 
        ? new Date(dateString.$date) 
        : new Date(dateString);
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getMediaIcon = (mediaType) => {
    switch (mediaType?.toLowerCase()) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getMediaElement = (memory) => {
    const mediaType = memory.mediaType?.toLowerCase();
    
    switch (mediaType) {
      case 'video':
        return (
          <div className="relative bg-vintage-100 rounded-lg overflow-hidden">
            <div className="w-full h-48">
              <VideoPlayer mediaId={memory.publicId} />
            </div>
          </div>
        );
      
      case 'audio':
        return (
          <div className="bg-vintage-100 rounded-lg p-6 border-2 border-dashed border-vintage-300">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Music className="w-8 h-8 text-vintage-600" />
              <span className="text-vintage-700 font-medium">Audio Recording</span>
            </div>
            <audio
              className="w-full"
              controls
              onPlay={() => setPlayingAudio(memory._id?.$oid || memory._id)}
              onPause={() => setPlayingAudio(null)}
            >
              <source src={memory.mediaUrl} type="audio/mpeg" />
              <source src={memory.mediaUrl} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      
      case 'image':
        return (
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={memory.mediaUrl}
              alt={memory.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden bg-vintage-100 h-48 items-center justify-center border-2 border-dashed border-vintage-300 rounded-lg">
              <div className="text-center text-vintage-600">
                <Image className="w-8 h-8 mx-auto mb-2" />
                <p>Image not available</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-vintage-100 rounded-lg p-6 border-2 border-dashed border-vintage-300">
            <div className="flex items-center justify-center space-x-3">
              <FileText className="w-8 h-8 text-vintage-600" />
              <span className="text-vintage-700 font-medium">
                {mediaType ? mediaType.charAt(0).toUpperCase() + mediaType.slice(1) : 'Media'} Content
              </span>
            </div>
          </div>
        );
    }
  };

  // Handle MongoDB data directly
  const displayMemories = memories || [];
  const sortedMemories = [...displayMemories].sort((a, b) => {
    const dateA = a.createdAt?.$date ? new Date(a.createdAt.$date) : new Date(a.createdAt);
    const dateB = b.createdAt?.$date ? new Date(b.createdAt.$date) : new Date(b.createdAt);
    return dateB - dateA; // Most recent first
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-vintage-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-serif text-vintage-800 mb-2">
          Memory Timeline
        </h1>
        <p className="text-vintage-600 text-base">
          A journey through time, capturing the moments that matter most
        </p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-0.5 bg-vintage-500 mx-auto mt-4 rounded-full"
        />
      </motion.div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Timeline Line */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: '100%' }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute left-6 top-0 w-0.5 bg-vintage-400 rounded-full"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sortedMemories.map((memory, index) => (
            <motion.div
              key={memory._id?.$oid || memory._id || `memory-${index}`}
              variants={itemVariants}
              className="relative mb-12 last:mb-0"
            >
              {/* Timeline Dot */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                className="absolute left-4 top-8 w-4 h-4 bg-vintage-600 rounded-full border-3 border-vintage-50 shadow-lg z-10"
              />

              {/* Date Badge - Better positioning */}
              <div className="flex items-center mb-4">
                <div className="w-12 flex-shrink-0"></div>
                <div className="bg-vintage-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                  {formatDate(memory.createdAt)}
                </div>
              </div>

              {/* Memory Card */}
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl shadow-lg border border-vintage-200 overflow-hidden ml-12"
              >
                {/* Header */}
                <div className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {getMediaIcon(memory.mediaType)}
                        <h3 className="text-lg font-semibold text-vintage-800">
                          {memory.title}
                        </h3>
                      </div>
                      <p className="text-vintage-600 text-sm leading-relaxed">
                        {memory.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        memory.status === 'approved' 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        {memory.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div className="px-4 pb-4">
                  {getMediaElement(memory)}
                </div>

                {/* Footer */}
                {/* <div className="px-4 py-3 bg-vintage-50 border-t border-vintage-100">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-vintage-600 hover:text-vintage-800 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span>{memory.likes?.length || 0}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-vintage-600 hover:text-vintage-800 transition-colors">
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-1 text-vintage-500">
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs">
                        {formatDate(memory.createdAt)}
                      </span>
                    </div>
                  </div>
                </div> */}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Empty State */}
      {sortedMemories.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-vintage-400 mb-4">
            <Calendar className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-vintage-600">No memories to display yet.</p>
        </motion.div>
      )}
    </div>
  );
};

export default MemoryTimeline;