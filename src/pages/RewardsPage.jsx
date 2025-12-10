import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';

const RewardsPage = ({ rewards, coins, onRedeemReward, claimedRewards, pendingClaims = [] }) => {
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

        <div className="px-3 sm:px-4 py-2">
          {/* Page Title with Animation */}
          <div className="text-center mb-4 sm:mb-6 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-game font-bold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] mb-2 flex items-center justify-center gap-2 sm:gap-3">
              <span className="animate-float">🏆</span>
              <span className="text-yellow-300">Toko Hadiah</span>
              <span className="animate-float" style={{ animationDelay: '0.3s' }}>💎</span>
            </h2>
            <p className="text-white font-fun text-base sm:text-lg font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">Tukar koin dengan hadiah menarik!</p>
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4 max-w-2xl mx-auto">
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
                  {/* Single Row Layout */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      {/* Reward Icon */}
                      <div className={`text-3xl sm:text-4xl p-2.5 sm:p-3 rounded-2xl ${category.gradient} shadow-lg flex-shrink-0 ${!canAfford && !isClaimed ? 'grayscale opacity-50' : 'animate-bounce-slow'}`}>
                        {category.emoji}
                      </div>

                      {/* Reward Info */}
                      <div className="flex-1 min-w-0">
                        {/* Lock Badge Above Title */}
                        {!canAfford && !isClaimed && (
                          <div className="mb-0.5">
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold whitespace-nowrap inline-block">
                              🔒 Terkunci
                            </span>
                          </div>
                        )}

                        {/* Title */}
                        <h3 className="font-game font-bold text-gray-800 text-sm sm:text-base mb-1">
                          {reward.name}
                        </h3>

                        {/* Price Tag */}
                        <div className="inline-flex items-center gap-1.5 bg-gradient-orange-yellow px-2.5 py-0.5 rounded-full shadow-md flex-shrink-0">
                          <span className="text-sm">💰</span>
                          <span className="font-game font-bold text-white text-xs sm:text-sm whitespace-nowrap">{reward.price} koin</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity and Action Row */}
                    {!isClaimed && (
                      <RewardAction
                        reward={reward}
                        coins={coins}
                        onRedeem={onRedeemReward}
                        isPending={pendingClaims.some(c => c.itemId === reward.id && c.type === 'reward')}
                      />
                    )}

                    {isClaimed && (
                      <div className="bg-gradient-green-teal text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-full font-game font-bold text-xs sm:text-sm shadow-glow-green whitespace-nowrap text-center">
                        ✅ Ditukar
                      </div>
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
            <div className="mt-6 sm:mt-8 text-center animate-fade-in-up">
              <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-4 sm:p-6 max-w-md mx-auto shadow-2xl border-2 border-white/50">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 animate-bounce-slow">💪</div>
                <p className="text-gray-800 font-fun text-xs sm:text-sm font-semibold">
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

const RewardAction = ({ reward, coins, onRedeem, isPending }) => {
  const [quantity, setQuantity] = React.useState(1);
  const totalCost = reward.price * quantity;
  const canAfford = coins >= totalCost;

  const handleIncrement = () => setQuantity(q => q + 1);
  const handleDecrement = () => setQuantity(q => Math.max(1, q - 1));

  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-xl p-2">
      {/* Quantity Controls */}
      <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
        <button
          onClick={handleDecrement}
          disabled={quantity <= 1 || isPending}
          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-l-lg disabled:opacity-50"
        >
          -
        </button>
        <span className="w-8 text-center font-bold text-gray-700">{quantity}</span>
        <button
          onClick={handleIncrement}
          disabled={!canAfford || isPending}
          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-r-lg disabled:opacity-50"
        >
          +
        </button>
      </div>

      {/* Total & Action */}
      <button
        onClick={() => onRedeem(reward, quantity)}
        disabled={!canAfford || isPending}
        className={`flex-1 ml-3 py-2 px-4 rounded-lg font-bold text-xs sm:text-sm shadow-md transition-all whitespace-nowrap
          ${isPending
            ? 'bg-yellow-200 text-yellow-700 cursor-not-allowed'
            : canAfford
              ? 'bg-gradient-purple-pink text-white hover:scale-105 active:scale-95 shadow-glow-purple'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
      >
        {isPending
          ? '⏳ Menunggu...'
          : canAfford
            ? `Tukar (${totalCost})`
            : '💔 Kurang'}
      </button>
    </div>
  );
};

export default RewardsPage;
