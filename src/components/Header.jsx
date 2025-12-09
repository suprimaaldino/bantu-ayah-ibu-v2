import React, { memo } from 'react';
import { useName } from '../context/NameContext';

const Header = ({ coins }) => {
  const { name } = useName();

  return (
    <div className="relative px-3 sm:px-4 py-4 sm:py-6 mb-3 sm:mb-4 overflow-hidden">
      {/* Gradient Background with Animation */}
      <div className="absolute inset-0 bg-gradient-purple-pink opacity-90 -z-10" />

      <div className="relative z-10 flex flex-col items-center justify-center gap-2 sm:gap-3">
        {/* Animated Coin Counter - CENTERED & BIGGER */}
        {coins !== undefined && (
          <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border-2 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-fade-in-up transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl animate-coin-spin filter drop-shadow-md">💰</span>
              <span className="text-2xl sm:text-3xl font-game font-bold text-yellow-300 drop-shadow-md tracking-wider">{coins}</span>
            </div>
          </div>
        )}

        {/* Greeting - CENTERED BELOW */}
        <div className="text-center w-full px-4 mt-1">
          <h1 className="text-lg sm:text-xl font-game font-bold text-white drop-shadow-lg truncate">
            Halo, <span className="text-yellow-300 animate-pulse">{name || "Anak Baik"}</span>!
            <span className="inline-block ml-2 animate-wiggle">👋</span>
          </h1>
          <p className="text-white/90 text-xs sm:text-sm font-fun opacity-90">Ayo selesaikan misi hari ini!</p>
        </div>
      </div>
    </div>
  );
};

export default memo(Header);
