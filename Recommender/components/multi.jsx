import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

const MultilineTextAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);

  const textLines = [
    "Welcome to",
    "Animated",
    "Multiline Text",
    "with React Spring"
  ];

  const springProps = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible 
      ? 'translateY(0px)' 
      : 'translateY(50px)',
    config: { 
      tension: 280, 
      friction: 20 
    }
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button 
        onClick={() => setIsVisible(!isVisible)}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isVisible ? 'Hide' : 'Show'} Text
      </button>
      
      <div className="text-center">
        {textLines.map((line, index) => (
          <animated.div 
            key={index} 
            style={{
              ...springProps,
              transitionDelay: `${index * 200}ms`
            }}
            className="text-3xl font-bold mb-4"
          >
            {line}
          </animated.div>
        ))}
      </div>
    </div>
  );
};

export default MultilineTextAnimation;