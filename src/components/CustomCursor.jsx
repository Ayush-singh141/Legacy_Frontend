import { motion, useMotionValue, animate } from 'framer-motion';
import { useEffect, useState, useCallback, useRef } from 'react';

const CustomCursor = () => {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  // Smooth follow effect using animate instead of spring
  const smoothX = useMotionValue(0);
  const smoothY = useMotionValue(0);
  const size = useMotionValue(24);
  
  // Refs for cleanup and performance
  const animationRef = useRef();
  const timeoutRef = useRef();
  const touchTimeoutRef = useRef();

  // Detect if device supports touch
  useEffect(() => {
    const checkTouchDevice = () => {
      const hasTouch = 'ontouchstart' in window || 
                      navigator.maxTouchPoints > 0 || 
                      navigator.msMaxTouchPoints > 0;
      
      // Also check for primary input type
      const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
      const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      
      // If device has coarse pointer and touch, it's likely mobile
      const isMobile = hasTouch && hasCoarsePointer && !hasFinePointer;
      
      setIsTouchDevice(isMobile);
    };

    checkTouchDevice();

    // Listen for media query changes
    const finePointerQuery = window.matchMedia('(pointer: fine)');
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
    
    const handlePointerChange = () => checkTouchDevice();
    
    finePointerQuery.addEventListener('change', handlePointerChange);
    coarsePointerQuery.addEventListener('change', handlePointerChange);

    return () => {
      finePointerQuery.removeEventListener('change', handlePointerChange);
      coarsePointerQuery.removeEventListener('change', handlePointerChange);
    };
  }, []);

  // Optimized cursor movement with RAF throttling
  const moveCursor = useCallback((e) => {
    if (animationRef.current || isTouchDevice) return;
    
    animationRef.current = requestAnimationFrame(() => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      // Smooth animation to follow cursor with optimized settings
      animate(smoothX, e.clientX, {
        type: "tween",
        ease: [0.25, 0.46, 0.45, 0.94], // Custom bezier for smoother feel
        duration: isHovering ? 0.12 : 0.16
      });
      
      animate(smoothY, e.clientY, {
        type: "tween", 
        ease: [0.25, 0.46, 0.45, 0.94],
        duration: isHovering ? 0.12 : 0.16
      });
      
      animationRef.current = null;
    });
  }, [cursorX, cursorY, smoothX, smoothY, isHovering, isTouchDevice]);

  // Touch event handlers for mobile
  const handleTouchStart = useCallback((e) => {
    if (!isTouchDevice) return;
    
    setIsTouching(true);
    setIsVisible(true);
    
    const touch = e.touches[0];
    cursorX.set(touch.clientX);
    cursorY.set(touch.clientY);
    
    animate(smoothX, touch.clientX, {
      type: "tween",
      ease: [0.25, 0.46, 0.45, 0.94],
      duration: 0.1
    });
    
    animate(smoothY, touch.clientY, {
      type: "tween",
      ease: [0.25, 0.46, 0.45, 0.94],
      duration: 0.1
    });

    // Hide cursor after touch interaction
    clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      setIsTouching(false);
    }, 1000);
  }, [cursorX, cursorY, smoothX, smoothY, isTouchDevice]);

  const handleTouchMove = useCallback((e) => {
    if (!isTouchDevice || !isTouching) return;
    
    const touch = e.touches[0];
    cursorX.set(touch.clientX);
    cursorY.set(touch.clientY);
    
    animate(smoothX, touch.clientX, {
      type: "tween",
      ease: [0.25, 0.46, 0.45, 0.94],
      duration: 0.05
    });
    
    animate(smoothY, touch.clientY, {
      type: "tween",
      ease: [0.25, 0.46, 0.45, 0.94],
      duration: 0.05
    });

    // Extend visibility timeout
    clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      setIsTouching(false);
    }, 1000);
  }, [cursorX, cursorY, smoothX, smoothY, isTouchDevice, isTouching]);

  const handleTouchEnd = useCallback(() => {
    if (!isTouchDevice) return;
    
    // Keep cursor visible for a moment after touch
    clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      setIsTouching(false);
    }, 800);
  }, [isTouchDevice]);

  // Optimized event handlers for mouse
  const handleMouseDown = useCallback(() => {
    if (isTouchDevice) return;
    setIsClicking(true);
  }, [isTouchDevice]);

  const handleMouseUp = useCallback(() => {
    if (isTouchDevice) return;
    setIsClicking(false);
  }, [isTouchDevice]);

  const handleMouseEnter = useCallback(() => {
    if (isTouchDevice) return;
    setIsHovering(true);
  }, [isTouchDevice]);

  const handleMouseLeave = useCallback(() => {
    if (isTouchDevice) return;
    setIsHovering(false);
  }, [isTouchDevice]);
  
  // Hide cursor when leaving window (desktop only)
  const handleMouseLeaveWindow = useCallback(() => {
    if (isTouchDevice) return;
    setIsVisible(false);
    clearTimeout(timeoutRef.current);
  }, [isTouchDevice]);
  
  const handleMouseEnterWindow = useCallback(() => {
    if (isTouchDevice) return;
    setIsVisible(true);
    clearTimeout(timeoutRef.current);
  }, [isTouchDevice]);

  // Size animation with better performance
  useEffect(() => {
    let targetSize;
    
    if (isTouchDevice) {
      // Larger size for touch interactions
      targetSize = isTouching ? 64 : 48;
    } else {
      // Standard desktop sizes
      targetSize = isHovering ? 48 : (isClicking ? 32 : 24);
    }
    
    animate(size, targetSize, {
      type: "tween",
      ease: [0.25, 0.46, 0.45, 0.94],
      duration: 0.25
    });
  }, [isHovering, isClicking, size, isTouchDevice, isTouching]);

  useEffect(() => {
    // Passive event listeners for better performance
    const options = { passive: true };
    
    // Mouse events (desktop)
    if (!isTouchDevice) {
      window.addEventListener('mousemove', moveCursor, options);
      window.addEventListener('mousedown', handleMouseDown, options);
      window.addEventListener('mouseup', handleMouseUp, options);
      window.addEventListener('mouseleave', handleMouseLeaveWindow, options);
      window.addEventListener('mouseenter', handleMouseEnterWindow, options);
    }

    // Touch events (mobile)
    if (isTouchDevice) {
      window.addEventListener('touchstart', handleTouchStart, options);
      window.addEventListener('touchmove', handleTouchMove, options);
      window.addEventListener('touchend', handleTouchEnd, options);
      window.addEventListener('touchcancel', handleTouchEnd, options);
    }

    // Optimized interactive element detection
    const updateInteractiveElements = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"]), [data-cursor-hover]'
      );
      
      if (!isTouchDevice) {
        interactiveElements.forEach(el => {
          el.addEventListener('mouseenter', handleMouseEnter, options);
          el.addEventListener('mouseleave', handleMouseLeave, options);
        });
      }

      return interactiveElements;
    };

    const interactiveElements = updateInteractiveElements();

    // Observer for dynamically added elements
    const observer = new MutationObserver(() => {
      // Debounce the update
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        updateInteractiveElements();
      }, 100);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['role', 'tabindex', 'data-cursor-hover']
    });

    return () => {
      // Cleanup mouse events
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeaveWindow);
      window.removeEventListener('mouseenter', handleMouseEnterWindow);
      
      // Cleanup touch events
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });

      observer.disconnect();
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearTimeout(timeoutRef.current);
      clearTimeout(touchTimeoutRef.current);
    };
  }, [isTouchDevice, moveCursor, handleMouseDown, handleMouseUp, handleMouseEnter, handleMouseLeave, handleMouseLeaveWindow, handleMouseEnterWindow, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Don't render on touch devices at all
  if (isTouchDevice || !isVisible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-50"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%'
      }}
    >
      <motion.div
        className={`rounded-full border-2 backdrop-blur-sm shadow-lg ${
          isTouchDevice 
            ? 'border-blue-500/60 bg-gradient-to-br from-blue-100/40 to-indigo-200/50' 
            : 'border-amber-600/50 bg-gradient-to-br from-amber-100/30 to-orange-200/40'
        }`}
        style={{
          width: size,
          height: size,
          boxShadow: isTouchDevice 
            ? '0 0 20px rgba(59, 130, 246, 0.3), inset 0 0 20px rgba(99, 102, 241, 0.1)' 
            : '0 0 16px rgba(180, 83, 9, 0.25), inset 0 0 16px rgba(245, 158, 11, 0.1)',
          willChange: 'transform, opacity' // Optimize for animations
        }}
        animate={{
          scale: (isTouchDevice && isTouching) ? 0.9 : (isClicking ? 0.8 : 1),
          opacity: (isTouchDevice && isTouching) ? 0.9 : (isHovering ? 0.8 : 0.6)
        }}
        transition={{
          type: "tween",
          ease: [0.25, 0.46, 0.45, 0.94], 
          duration: 0.15
        }}
      >
        {/* Inner dot - different for touch vs mouse */}
        {((isHovering && !isTouchDevice) || (isTouching && isTouchDevice)) && (
          <motion.div
            className={`absolute top-1/2 left-1/2 rounded-full ${
              isTouchDevice 
                ? 'w-2 h-2 bg-blue-700/90' 
                : 'w-1.5 h-1.5 bg-amber-700/90'
            }`}
            style={{
              translateX: '-50%',
              translateY: '-50%',
              boxShadow: isTouchDevice 
                ? '0 0 8px rgba(29, 78, 216, 0.8)' 
                : '0 0 6px rgba(180, 83, 9, 0.8)',
              willChange: 'transform, opacity'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: "tween",
              ease: [0.25, 0.46, 0.45, 0.94],
              duration: 0.12
            }}
          />
        )}
        
        {/* Touch ripple effect for mobile */}
        {isTouchDevice && isTouching && (
          <motion.div
            className="absolute top-1/2 left-1/2 border border-blue-400/30 rounded-full"
            style={{
              translateX: '-50%',
              translateY: '-50%',
            }}
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ 
              width: size.get() * 1.8, 
              height: size.get() * 1.8, 
              opacity: 0 
            }}
            transition={{
              type: "tween",
              ease: [0.25, 0.46, 0.45, 0.94],
              duration: 0.6
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default CustomCursor;