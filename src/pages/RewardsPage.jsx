import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';

const RewardsPage = ({ rewards, coins, onRedeemReward, claimedRewards }) => {
  const getRewardCategory = (price) => {
    if (price < 50) return { emoji: "🎁", label: "Hadiah Kecil", gradient: "bg-gradient-blue-cyan" };
    if (price < 100) return { emoji: "🧃", label: "Hadiah Menengah", gradient: "bg-gradient-orange-yellow" };
    return { emoji: "🌟", label: "Hadiah Besar", gradient: "bg-gradient-purple-pink" };
  };

  return (
    <>
      <Helmet>
        <title>Toko Hadiah 🎁 - Bantu Ayah Ibu</title>
        <meta
          name="description"
          content="Tukar koin yang kamu kumpulkan dengan hadiah menarik di Toko Hadiah. Semangat selesaikan misi!"
        />
      </Helmet>

      <div className="min-h-screen pb-20">
        <Header coins={coins} />

        <div className="px-4 py-2">
          {/* Page Title with Animation */}
          <div className="text-center mb-6 animate-fade-in-up">
            <h2 className="text-4xl font-game font-bold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] mb-2 flex items-center justify-center gap-3">
              <span className="animate-float">🏆</span>
              <span className="text-yellow-300">Toko Hadiah</span>
              <span className="animate-float" style={{ animationDelay: '0.3s' }}>💎</span>
            </h2>
            <p className="text-white font-fun text-lg font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">Tukar koin dengan hadiah menarik!</p>
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
            {rewards.map((reward, index) => {
              const category = getRewardCategory(reward.price);
              const isClaimed = claimedRewards?.includes(reward.id);
              const canAfford = coins >= reward.price;

              return (
                <div
                  key={reward.id}
                  className="reward-card animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    {/* Reward Icon */}
                    <div className={`text-5xl p-4 rounded-2xl ${category.gradient} shadow-lg ${!canAfford && !isClaimed ? 'grayscale opacity-50' : 'animate-bounce-slow'}`}>
                      {category.emoji}
                    </div>

                    {/* Reward Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-game font-bold text-gray-800 text-lg">
                          {reward.name}
                        </h3>
                        {!canAfford && !isClaimed && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">
                            🔒 Terkunci
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 font-fun">
                        {category.label}
                      </p>

                      {/* Price Tag */}
                      <div className="inline-flex items-center gap-2 bg-gradient-orange-yellow px-3 py-1 rounded-full shadow-md">
                        <span className="text-lg">💰</span>
                        <span className="font-game font-bold text-white">{reward.price} koin</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    {isClaimed ? (
                      <div className="flex flex-col items-center gap-1">
                        <div className="bg-gradient-green-teal text-white px-4 py-2 rounded-full font-game font-bold shadow-glow-green">
                          ✅ Sudah Ditukar
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => onRedeemReward(reward)}
                        disabled={!canAfford}
                        className={`btn-game px-5 py-3 rounded-full font-game font-bold text-sm transition-all duration-300 ${canAfford
                          ? "bg-gradient-purple-pink text-white shadow-glow-purple hover:scale-110 active:scale-95"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                          }`}
                      >
                        {canAfford ? "🎁 Tukar Sekarang" : "💔 Koin Kurang"}
                      </button>
                    )}
                  </div>

                  {/* Shimmer Effect for Unlocked Items */}
                  {canAfford && !isClaimed && (
                    <div className="absolute inset-0 animate-shimmer pointer-events-none rounded-3xl" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Encouragement Message */}
          {rewards.length > 0 && (
            <div className="mt-8 text-center animate-fade-in-up">
              <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 max-w-md mx-auto shadow-2xl border-2 border-white/50">
                <div className="text-4xl mb-3 animate-bounce-slow">💪</div>
                <p className="text-gray-800 font-fun text-sm font-semibold">
                  Kumpulkan lebih banyak koin dengan menyelesaikan misi untuk mendapatkan hadiah impianmu!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RewardsPage;
