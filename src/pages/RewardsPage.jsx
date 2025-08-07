// src/pages/RewardsPage.jsx
import RewardCard from "../components/RewardCard.jsx";

const RewardsPage = ({ rewards, coins, onRedeemReward }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 pb-20">
      <div className="max-w-md mx-auto px-4 pt-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">🏆</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Hadiah</h1>
          <p className="text-gray-600">Tukarkan koinmu dengan hadiah!</p>
          <div className="mt-3 bg-white rounded-full px-4 py-2 inline-block shadow-sm">
            <span className="text-orange-500 font-bold">⭐ {coins}</span>
          </div>
        </div>
        <div className="grid gap-4">
          {rewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              onRedeem={() => onRedeemReward(reward)}
              coins={coins}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;