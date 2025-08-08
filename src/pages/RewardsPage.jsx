import React from 'react';
import Header from '../components/Header';

const RewardsPage = ({ rewards, coins, onRedeemReward, childName }) => {
  const getRewardCategory = (price) => {
    if (price < 50) return { emoji: "🎁", label: "Hadiah Kecil" };
    if (price < 100) return { emoji: "🧃", label: "Hadiah Menengah" };
    return { emoji: "🌟", label: "Hadiah Besar" };
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header coins={coins} />
      <div className="p-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Toko Hadiah 🎁</h2>
          <p className="text-gray-600">Tukar koin dengan hadiah menarik!</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {rewards.map((reward) => {
            const category = getRewardCategory(reward.price);
            return (
              <div key={reward.id} className="bg-white rounded-xl p-4 shadow-md">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{category.emoji}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{reward.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">{category.label}</p>
                    <p className="text-purple-600 font-bold">💰 {reward.price} koin</p>
                  </div>
                  <button
                    onClick={() => onRedeemReward(reward)}
                    disabled={coins < reward.price}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      coins >= reward.price
                        ? "bg-green-500 text-white hover:bg-green-600 active:scale-95"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {coins >= reward.price ? "Tukar" : "Koin Kurang"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;