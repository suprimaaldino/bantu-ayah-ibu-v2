import React from 'react';
import Header from '../components/Header';
import MissionCard from '../components/MissionCard';

const MissionsPage = ({ missions, completedMissions, onClaimMission, coins }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-20">
      <Header coins={coins} />
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            isCompleted={completedMissions.includes(mission.id)}
            onClaimMission={onClaimMission}
          />
        ))}
      </div>
    </div>
  );
};

export default MissionsPage;
