import React from 'react';
import Player from 'lottie-react';
import animationData from './assets/qr-lottie.json';


const LottieHeader = () => (
  <div className="flex justify-center mb-4">
    <Player
      autoplay
      loop
      animationData={animationData}
      style={{ width: '200px', height: '200px' }}
    />
  </div>
);

export default LottieHeader;
