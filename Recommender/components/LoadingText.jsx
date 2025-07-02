import React, { useState, useEffect } from 'react';
import SplitText from "./SplitText";

const LoadingMessages = () => {
  const messages = [
    "Collecting movies...",
    "Crunching datasets...",
    "Making predictions..."
  ];
  
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [mountKey, setMountKey] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMessageIndex((prev) => {
        if (prev < messages.length - 1) {
          setMountKey(k => k + 1); // Force re-mount of SplitText
          return prev + 1;
        }
        return prev;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const handleAnimationComplete = () => {
    console.log(`Animation completed for message ${currentMessageIndex + 1}`);
  };

  return (
      <SplitText
        key={mountKey} // Key changes force complete re-render
        text={messages[currentMessageIndex]}
        className="text-2xl font-semibold text-center text-white"
        delay={80}
        animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
        animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
        easing="easeOutCubic"
        threshold={0.2}
        rootMargin="-50px"
        onLetterAnimationComplete={handleAnimationComplete}
      />
  );
};

export default LoadingMessages;