import React from 'react';
import Header from '../components/Header';
import RewardCard from '../components/RewardCard';

const RewardsPage = ({ rewards, totalCoins, onRedeem }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-20">
      <Header coins={totalCoins} />
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {rewards.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            onRedeem={onRedeem}
            totalCoins={totalCoins}
          />
        ))}
      </div>
    </div>
  );
};

export default RewardsPage;
