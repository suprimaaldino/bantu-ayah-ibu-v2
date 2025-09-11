import React, { memo } from "react";

const MissionCard = ({ mission, onClaim }) => {
  const difficultyColors = {
    mudah: "bg-blue-100 text-blue-800 border-blue-300",
    sedang: "bg-yellow-100 text-yellow-800 border-yellow-300",
    sulit: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200 transform transition-all duration-200 hover:scale-105">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-gray-800 text-lg">{mission.name}</h3>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${difficultyColors[mission.difficulty]}`}
        >
          {mission.difficulty}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Hadiah: </span>
        <span className="font-bold text-orange-500 flex items-center">
          <span>⭐</span>
          <span className="ml-1">{mission.coins}</span>
        </span>
      </div>
      <button
        onClick={onClaim}
        className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold shadow-md hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 active:scale-95"
      >
        Klaim Misi
      </button>
    </div>
  );
};

export default memo(MissionCard);
