import {useEffect,useRef} from 'react'

const VideoPlayer = ({mediaId}) => {
    const cloudinaryRef = useRef(null);
    const videoRef = useRef(null);
    useEffect(() => {
        if(cloudinaryRef.current) {
            return; // Cloudinary already loaded
        }
      cloudinaryRef.current = window.cloudinary;
      cloudinaryRef.current.videoPlayer(videoRef.current,{
        cloud_name:'ddgg6kmod'
      })
    }, [mediaId])
    
  return (
    <video ref={videoRef} data-cld-public-id={mediaId} controls className='w-[100%] h-[100%]' />
  )
}

export default VideoPlayer