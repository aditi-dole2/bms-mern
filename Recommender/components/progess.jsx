import React from 'react';

const LoadingBar = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center ">
      <style>
        {`
          @keyframes animFw {
            0% { width: 0; }
            100% { width: 100%; }
          }
          @keyframes coli1 {
            0% {
              transform: rotate(-45deg) translateX(0px);
              opacity: 0.7;
            }
            100% {
              transform: rotate(-45deg) translateX(-45px);
              opacity: 0;
            }
          }
          @keyframes coli2 {
            0% {
              transform: rotate(45deg) translateX(0px);
              opacity: 1;
            }
            100% {
              transform: rotate(45deg) translateX(-45px);
              opacity: 0.7;
            }
          }
          .loader-line {
            animation: animFw 8s linear infinite;
            transform-origin: left center;
          }
          .loader-line::after {
            content: '';
            width: 10px;
            height: 1px;
            background: white;
            position: absolute;
            top: 9px;
            right: -2px;
            opacity: 0;
            transform: rotate(-45deg) translateX(0px);
            animation: coli1 0.3s linear infinite;
          }
          .loader-line::before {
            content: '';
            width: 10px;
            height: 1px;
            background: white;
            position: absolute;
            top: -4px;
            right: -2px;
            opacity: 0;
            transform: rotate(45deg) translateX(0px);
            animation: coli2 0.3s linear infinite;
          }
        `}
      </style>
      <div className="w-64 h-12 relative">
        <div className="loader-line w-0 h-[4.8px] absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-[0_0_26px_rgba(255,255,255,1)]" />
      </div>
    </div>
  );
};

export default LoadingBar;