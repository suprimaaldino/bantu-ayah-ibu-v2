// src/pages/MissionsPage.jsx
import MissionCard from "../components/MissionCard.jsx";

const MissionsPage = ({ missions, completedMissions, onClaimMission, coins }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-20">
      <div className="max-w-md mx-auto px-4 pt-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">🏡</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Misi Harian</h1>
          <p className="text-gray-600">Bantu Ayah dan Ibu hari ini!</p>
          <div className="mt-3 bg-white rounded-full px-4 py-2 inline-block shadow-sm">
            <span className="text-orange-500 font-bold">⭐ {coins}</span>
          </div>
        </div>
        <div className="grid gap-4">
          {missions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onClaim={() => onClaimMission(mission)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MissionsPage;