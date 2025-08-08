import React from 'react';
import Header from '../components/Header';

const MissionsPage = ({ missions, completedMissions, onClaimMission, coins }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header coins={coins} />
      <div className="p-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Misi Harian 🎯</h2>
          <p className="text-gray-600">Bantu Ayah dan Ibu hari ini!</p>
        </div>

        <div className="space-y-4">
          {missions.map((mission) => {
            const isCompleted = completedMissions.includes(mission.id);
            return (
              <div key={mission.id} className="bg-white rounded-xl p-4 shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-800 flex-1 pr-2">{mission.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      mission.difficulty === "Mudah" ? "bg-green-100 text-green-800" : 
                      mission.difficulty === "Sedang" ? "bg-blue-100 text-blue-800" :
                      "bg-orange-100 text-orange-800"
                    }`}>
                      {mission.difficulty}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-yellow-600">
                    <span>⭐</span>
                    <span className="font-bold">{mission.coins}</span>
                  </div>
                  
                  {isCompleted ? (
                    <div className="flex items-center gap-1 text-green-600 font-medium">
                      <span>✅</span>
                      <span>Selesai</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onClaimMission(mission)}
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 active:scale-95 transition-all"
                    >
                      Klaim Misi
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MissionsPage;