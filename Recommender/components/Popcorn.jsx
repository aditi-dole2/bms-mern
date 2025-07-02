import lottieFile from "../assets/lottie/YnS6Knvh0n";
import Lottie from 'lottie-react';

import LoadingMessages from "./LoadingText";

const Popcorn = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-4">
    <Lottie autoplay loop animationData={lottieFile} style={{ zIndex: 4, height: "150px", width: "auto" }} />
    <LoadingMessages></LoadingMessages>
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
            animation: animFw 8s linear forwards;
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
            top: 7px;
            right: -5px;
            opacity: 0;
            transform: rotate(45deg) translateX(0px);
            animation: coli2 0.3s linear infinite;
          }
        `}
      </style>
      <div className="w-64 h-12 relative">
        <div className="loader-line w-0 h-[20px] absolute left-0 top-1/2 rounded-full -translate-y-1/2 bg-purple-500 shadow-[0_0_17px_9px_#8c36fce3]" />
      </div>

    </div>
  );
};

export default Popcorn;
