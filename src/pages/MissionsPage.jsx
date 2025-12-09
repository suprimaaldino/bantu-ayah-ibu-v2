import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';

const MissionsPage = ({ missions, onClaimMission, coins, missionClaimCount = {} }) => {
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

        <div className="px-4 py-2">
          {/* Page Title with Animation */}
          <div className="text-center mb-6 animate-fade-in-up">
            <h2 className="text-4xl font-game font-bold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] mb-2 flex items-center justify-center gap-3">
              <span className="animate-bounce-slow">🎯</span>
              <span>Misi Harian</span>
              <span className="animate-bounce-slow" style={{ animationDelay: '0.2s' }}>🎯</span>
            </h2>
            <p className="text-white font-fun text-lg font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">Bantu Ayah dan Ibu hari ini!</p>
          </div>

          {/* Mission Cards */}
          <div className="space-y-4 max-w-2xl mx-auto">
            {missions.map((mission, index) => {
              return (
                <div
                  key={mission.id}
                  className="mission-card animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Mission Header */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-game font-bold text-gray-800 text-lg flex-1 pr-2">
                      {mission.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap shadow-md ${mission.difficulty === 'Mudah'
                          ? 'bg-gradient-green-teal text-white'
                          : mission.difficulty === 'Sedang'
                            ? 'bg-gradient-blue-cyan text-white'
                            : 'bg-gradient-orange-yellow text-white animate-pulse-glow'
                          }`}
                      >
                        {mission.difficulty}
                      </span>
                      {missionClaimCount[mission.id] > 0 && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-purple-pink text-white shadow-glow-purple animate-bounce-slow">
                          {missionClaimCount[mission.id]}x
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mission Footer */}
                  <div className="flex justify-between items-center mt-4">
                    {/* Coin Reward */}
                    <div className="flex items-center gap-2 bg-gradient-orange-yellow px-4 py-2 rounded-full shadow-glow-gold">
                      <span className="text-2xl animate-coin-spin">⭐</span>
                      <span className="font-game font-bold text-white text-lg">{mission.coins}</span>
                    </div>

                    {/* Action Button - Always show claim button */}
                    <button
                      onClick={() => onClaimMission(mission)}
                      className="btn-game bg-gradient-purple-pink text-white px-6 py-3 rounded-full font-game font-bold text-sm shadow-glow-purple hover:scale-110 active:scale-95 transition-all duration-300"
                    >
                      🚀 Klaim Misi
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
