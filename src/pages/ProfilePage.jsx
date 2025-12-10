import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';

const ProfilePage = ({ coins, completedMissions, totalMissions, streak, onSetPin, isOldPinVerified, childName, onEnterParentMode }) => {
  const completionPercentage =
    totalMissions > 0
      ? Math.round((completedMissions.length / totalMissions) * 100)
      : 0;

  return (
    <>
      <Helmet>
        <title>Profil Anak 👧 - Bantu Ayah Ibu</title>
        <meta
          name="description"
          content="Lihat statistik anak, progress misi, streak harian, dan atur PIN orang tua."
        />
      </Helmet>

      <div className="min-h-screen pb-20">
        <Header coins={coins} />

        <div className="px-4 py-2">
          {/* Profile Header with Character */}
          <div className="text-center mb-6 animate-fade-in-up">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-purple-pink rounded-full flex items-center justify-center text-5xl mx-auto mb-3 shadow-glow-purple animate-bounce-slow">
                👧
              </div>
              {/* Achievement Badge */}
              {completionPercentage === 100 && (
                <div className="absolute -top-2 -right-2 text-3xl animate-sparkle">
                  🏆
                </div>
              )}
            </div>
            <h2 className="text-3xl font-game font-bold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] mb-1">
              {childName || 'Anak Baik'}
            </h2>
            <p className="text-white font-fun text-lg font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">Anak yang rajin! ⭐</p>
          </div>

          {/* Stats Grid */}
          <div className="space-y-4 max-w-2xl mx-auto">
            {/* Main Statistics */}
            <div className="stat-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="font-game font-bold text-gray-800 mb-4 text-xl flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Statistik Kamu
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-orange-yellow rounded-2xl shadow-lg">
                  <div className="text-4xl font-game font-bold text-white drop-shadow-md animate-coin-spin">
                    {coins}
                  </div>
                  <div className="text-sm font-fun font-bold text-white/90 mt-1">Total Koin 💰</div>
                </div>
                <div className="text-center p-4 bg-gradient-green-teal rounded-2xl shadow-lg">
                  <div className="text-4xl font-game font-bold text-white drop-shadow-md">
                    {completedMissions.length}
                  </div>
                  <div className="text-sm font-fun font-bold text-white/90 mt-1">Misi Selesai ✅</div>
                </div>
              </div>
            </div>

            {/* Progress Mission */}
            <div className="stat-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="font-game font-bold text-gray-800 mb-4 text-xl flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Progress Misi
              </h3>
              <div className="flex items-center justify-between mb-3">
                <span className="font-fun text-gray-700 font-semibold">
                  Selesai: {completedMissions.length}/{totalMissions}
                </span>
                <span className="font-game text-2xl font-bold text-gradient-purple">
                  {completionPercentage}%
                </span>
              </div>
              {/* Animated Progress Bar */}
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              {completionPercentage === 100 && (
                <div className="mt-3 text-center">
                  <span className="inline-flex items-center gap-2 bg-gradient-rainbow text-white px-4 py-2 rounded-full font-game font-bold shadow-lg animate-pulse-glow">
                    <span className="text-xl">🎉</span>
                    Sempurna!
                    <span className="text-xl">🎉</span>
                  </span>
                </div>
              )}
            </div>

            {/* Streak Counter */}
            <div className="stat-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="font-game font-bold text-gray-800 mb-4 text-xl flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                Streak Harian
              </h3>
              <div className="text-center p-6 bg-gradient-orange-yellow rounded-2xl shadow-lg">
                <div className="text-6xl mb-3 animate-bounce-slow">🔥</div>
                <div className="text-5xl font-game font-bold text-white drop-shadow-lg mb-2">
                  {streak}
                </div>
                <div className="text-xl font-fun font-bold text-white/90">
                  Hari Berturut-turut!
                </div>
                <div className="mt-3 text-sm font-fun text-white/80">
                  Tetap semangat! 💪
                </div>
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="stat-card animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <h3 className="font-game font-bold text-gray-800 mb-4 text-xl flex items-center gap-2">
                <span className="text-2xl">🏅</span>
                Pencapaian
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {/* First Mission Badge */}
                <div className={`text-center p-3 rounded-xl ${completedMissions.length > 0 ? 'bg-gradient-blue-cyan shadow-glow-purple' : 'bg-gray-200'}`}>
                  <div className={`text-3xl mb-1 ${completedMissions.length > 0 ? 'animate-wiggle' : 'grayscale opacity-50'}`}>
                    🌟
                  </div>
                  <div className={`text-xs font-fun font-bold ${completedMissions.length > 0 ? 'text-white' : 'text-gray-500'}`}>
                    Misi Pertama
                  </div>
                </div>

                {/* 5 Missions Badge */}
                <div className={`text-center p-3 rounded-xl ${completedMissions.length >= 5 ? 'bg-gradient-purple-pink shadow-glow-pink' : 'bg-gray-200'}`}>
                  <div className={`text-3xl mb-1 ${completedMissions.length >= 5 ? 'animate-wiggle' : 'grayscale opacity-50'}`}>
                    ⭐
                  </div>
                  <div className={`text-xs font-fun font-bold ${completedMissions.length >= 5 ? 'text-white' : 'text-gray-500'}`}>
                    5 Misi
                  </div>
                </div>

                {/* All Missions Badge */}
                <div className={`text-center p-3 rounded-xl ${completionPercentage === 100 ? 'bg-gradient-rainbow shadow-glow-gold animate-pulse-glow' : 'bg-gray-200'}`}>
                  <div className={`text-3xl mb-1 ${completionPercentage === 100 ? 'animate-bounce-slow' : 'grayscale opacity-50'}`}>
                    🏆
                  </div>
                  <div className={`text-xs font-fun font-bold ${completionPercentage === 100 ? 'text-white' : 'text-gray-500'}`}>
                    Semua Misi!
                  </div>
                </div>
              </div>
            </div>

            {/* Encouragement Message */}
            <div className="glass-white rounded-3xl p-6 text-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="text-4xl mb-3 animate-float">🎮</div>
              <p className="text-gray-700 font-fun font-semibold">
                Terus semangat menyelesaikan misi! Kamu luar biasa! 🌟
              </p>
            </div>

            {/* Parent Mode Button */}
            <div className="mt-6 text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <button
                onClick={onEnterParentMode}
                className="bg-white/50 border-2 border-dashed border-gray-400 text-gray-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100/80 shadow-sm active:scale-95 transition-transform flex items-center gap-2 mx-auto"
              >
                🔒 Mode Orang Tua
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
