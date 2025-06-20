import {useEffect,useRef} from 'react'

const VideoPlayer = ({mediaId}) => {
    const cloudinaryRef = useRef(null);
    const videoRef = useRef(null);
    useEffect(() => {
        if(cloudinaryRef.current) {
            return; // Cloudinary already loaded
        }
      cloudinaryRef.current = window.cloudinary;
      const player = cloudinaryRef.current.videoPlayer(videoRef.current,{
        cloud_name:'ddgg6kmod',
        playsinline: true,
        preload: 'auto',
        fluid: true
      })
       player.source(mediaId, {
        sourceTypes: ['mp4', 'webm', 'ogv'] // Let it choose best format
      });

    }, [mediaId])
    
  return (
    <video ref={videoRef} data-cld-public-id={mediaId} controls muted playsInline className='w-[100%] h-[100%]' />
  )
}

export default VideoPlayer