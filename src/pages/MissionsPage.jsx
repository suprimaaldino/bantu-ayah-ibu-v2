import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';

const MissionsPage = ({ missions, onClaimMission, coins, missionClaimCount = {}, pendingClaims = [] }) => {
  return (
    <>
      <Helmet>
        <title>Misi Harian 🎯 - Bantu Ayah Ibu</title>
        <meta
          name="description"
          content="Lihat dan klaim misi harian untuk membantu Ayah dan Ibu. Selesaikan tugas, kumpulkan bintang, dan dapatkan reward!"
        />
      </Helmet>

      <div className="min-h-screen pb-20">
        <Header coins={coins} />

        <div className="px-3 sm:px-4 py-2">
          {/* Page Title with Animation */}
          <div className="text-center mb-4 sm:mb-6 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-game font-bold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] mb-2 flex items-center justify-center gap-2 sm:gap-3">
              <span className="animate-bounce-slow">🎯</span>
              <span>Misi Harian</span>
              <span className="animate-bounce-slow" style={{ animationDelay: '0.2s' }}>🎯</span>
            </h2>
            <p className="text-white font-fun text-base sm:text-lg font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">Bantu Ayah dan Ibu hari ini!</p>
          </div>

          {/* Mission Cards */}
          <div className="space-y-3 sm:space-y-4 max-w-2xl mx-auto">
            {missions.map((mission, index) => {
              return (
                <div
                  key={mission.id}
                  className="mission-card animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Mission Header */}
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <h3 className="font-game font-bold text-gray-800 text-base sm:text-lg flex-1 min-w-0 pr-2">
                      {mission.name}
                    </h3>
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap shadow-md ${mission.difficulty === 'Mudah'
                          ? 'bg-gradient-green-teal text-white'
                          : mission.difficulty === 'Sedang'
                            ? 'bg-gradient-blue-cyan text-white'
                            : 'bg-gradient-orange-yellow text-white animate-pulse-glow'
                          }`}
                      >
                        {mission.difficulty}
                      </span>
                      {missionClaimCount[mission.id] > 0 && (
                        <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-bold bg-gradient-purple-pink text-white shadow-glow-purple animate-bounce-slow whitespace-nowrap">
                          {missionClaimCount[mission.id]}x
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mission Footer - Single Row */}
                  <div className="flex justify-between items-center gap-3 mt-4">
                    {/* Coin Reward */}
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-orange-yellow px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-glow-gold flex-shrink-0">
                      <span className="text-xl sm:text-2xl animate-coin-spin">⭐</span>
                      <span className="font-game font-bold text-white text-sm sm:text-base whitespace-nowrap">{mission.coins} koin</span>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => onClaimMission(mission)}
                      disabled={pendingClaims?.some(c => c.missionId === mission.id)}
                      className={`btn-game px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-game font-bold text-xs sm:text-sm shadow-glow-purple hover:scale-105 active:scale-95 transition-all duration-300 flex-1 whitespace-nowrap 
                        ${pendingClaims?.some(c => c.missionId === mission.id)
                          ? 'bg-gray-400 text-white cursor-not-allowed opacity-80'
                          : 'bg-gradient-purple-pink text-white'}`}
                    >
                      {pendingClaims?.some(c => c.missionId === mission.id) ? '⏳ Menunggu...' : '🚀 Klaim Misi'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default MissionsPage;
