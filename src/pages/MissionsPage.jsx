// src/pages/MissionsPage.jsx
import MissionCard from "../components/MissionCard.jsx";

const groupMissionsByDifficulty = (missions) => {
  const grouped = {
    Mudah: [],
    Sedang: [],
    Sulit: [],
  };

  missions.forEach((mission) => {
    if (grouped[mission.difficulty]) {
      grouped[mission.difficulty].push(mission);
    }
  });

  return grouped;
};

const getEmojiAndColor = (difficulty) => {
  switch (difficulty) {
    case "Mudah":
      return { emoji: "🟢", color: "text-green-600" };
    case "Sedang":
      return { emoji: "🟡", color: "text-yellow-600" };
    case "Sulit":
      return { emoji: "🔴", color: "text-red-600" };
    default:
      return { emoji: "", color: "text-gray-600" };
  }
};

const MissionsPage = ({ missions, completedMissions, onClaimMission, coins }) => {
  const groupedMissions = groupMissionsByDifficulty(missions);

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

        {["Mudah", "Sedang", "Sulit"].map((difficulty) => {
          const missionsList = groupedMissions[difficulty];
          if (!missionsList.length) return null;

          const { emoji, color } = getEmojiAndColor(difficulty);

          return (
            <div key={difficulty} className="mb-6">
              <h2 className={`text-center text-xl font-semibold mb-5 ${color}`}>
                {emoji} {difficulty}
              </h2>
              <div className="grid gap-4">
                {missionsList.map((mission) => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    onClaim={() => onClaimMission(mission)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MissionsPage;
