import React, { memo } from 'react';
import { useName } from '../context/NameContext';

const Header = ({ coins }) => {
  const { name } = useName();

  return (
    <div className="relative px-3 sm:px-4 py-4 sm:py-6 mb-3 sm:mb-4 overflow-hidden">
      {/* Gradient Background with Animation */}
      <div className="absolute inset-0 bg-gradient-purple-pink opacity-90 -z-10" />

      {/* Decorative Elements */}
      <div className="absolute top-2 right-4 text-2xl sm:text-3xl animate-float">🎮</div>
      <div className="absolute bottom-2 left-4 text-xl sm:text-2xl animate-bounce-slow">✨</div>

      <div className="flex justify-between items-center relative z-10 gap-2 sm:gap-4">
        {/* Greeting */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-2xl font-game font-bold text-white drop-shadow-lg truncate">
            Halo, <span className="text-yellow-300 animate-pulse">{name || "Anak Baik"}</span>!
            <span className="inline-block ml-1 sm:ml-2 animate-wiggle">👋</span>
          </h1>
          <p className="text-white/90 text-xs sm:text-sm mt-0.5 sm:mt-1 font-fun">Ayo selesaikan misi hari ini!</p>
        </div>

        {/* Animated Coin Counter */}
        {coins !== undefined && (
          <div className="coin-display animate-fade-in-up flex-shrink-0">
            <span className="text-xl sm:text-2xl animate-coin-spin inline-block">💰</span>
            <span className="text-base sm:text-xl font-bold">{coins}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Header);
