// src/components/RewardCard.jsx
const RewardCard = ({ reward, onRedeem, coins }) => {
  const isAffordable = coins >= reward.price;

  return (
    <div className={`bg-white rounded-2xl p-4 shadow-md border-2 ${isAffordable ? 'border-green-200' : 'border-gray-200 opacity-70'} transform transition-all duration-200 hover:scale-105`}>
      <div className="text-center mb-3">
        <div className="text-4xl mb-2">🎁</div>
        <h3 className="font-bold text-gray-800">{reward.name}</h3>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600">Harga: </span>
        <span className="font-bold text-orange-500 flex items-center">
          <span>⭐</span>
          <span className="ml-1">{reward.price}</span>
        </span>
      </div>
      <button
        onClick={isAffordable ? onRedeem : null}
        disabled={!isAffordable}
        className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
          isAffordable
            ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 shadow-md'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isAffordable ? 'Tukar Sekarang' : 'Koin Tidak Cukup'}
      </button>
    </div>
  );
};

export default RewardCard;