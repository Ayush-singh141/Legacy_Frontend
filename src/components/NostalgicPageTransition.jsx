import { motion } from 'framer-motion';

const NostalgicPageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0,
        filter: 'blur(5px) sepia(30%)',
        scale: 1.2
      }}
      animate={{ 
        opacity: 1,
        filter: 'blur(0px) sepia(0%)',
        scale: 1,
        transition: { 
          duration: 1.2,
          ease: [0.6, 0.01, 0.05, 0.9]
        }
      }}
      exit={{ 
        opacity: 0,
        filter: 'blur(8px) sepia(40%)',
        scale: 1.2,
        transition: { 
          duration: 0.8,
          ease: [0.6, 0.01, 0.05, 0.9]
        }
      }}
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {children}
      
      {/* Optional: Aged paper border - now the only decorative element */}
      <motion.div
        style={{
          position: 'absolute',
          
          pointerEvents: 'none',
          zIndex: 5
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
    </motion.div>
  );
};

export default NostalgicPageTransition;