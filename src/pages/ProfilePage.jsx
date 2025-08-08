import React from 'react';
import Header from '../components/Header';

const ProfilePage = ({ coins, completedMissions, totalMissions, streak, onSetPin, isOldPinVerified, childName }) => {
  const completionPercentage = totalMissions > 0 ? Math.round((completedMissions.length / totalMissions) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header coins={coins} />
      <div className="p-4">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-purple-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
            👧
          </div>
          <h2 className="text-xl font-bold text-gray-800">{childName || "Anak Baik"}</h2>
          <p className="text-gray-600">Anak yang rajin!</p>
        </div>

        <div className="space-y-4">
          {/* Statistik Utama */}
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h3 className="font-bold text-gray-800 mb-3">📊 Statistik</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{coins}</div>
                <div className="text-sm text-gray-600">Total Koin</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedMissions.length}</div>
                <div className="text-sm text-gray-600">Misi Selesai</div>
              </div>
            </div>
          </div>

          {/* Progress Misi */}
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h3 className="font-bold text-gray-800 mb-3">🎯 Progress Misi</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Selesai: {completedMissions.length}/{totalMissions}</span>
              <span className="text-sm font-medium text-purple-600">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Streak */}
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h3 className="font-bold text-gray-800 mb-3">🔥 Streak Harian</h3>
            <div className="text-center">
              <div className="text-4xl mb-2">🔥</div>
              <div className="text-2xl font-bold text-orange-600">{streak} Hari</div>
              <div className="text-sm text-gray-600">Berturut-turut!</div>
            </div>
          </div>

          {/* Pengaturan Orang Tua */}
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h3 className="font-bold text-gray-800 mb-3">⚙️ Pengaturan Orang Tua</h3>
            <div className="space-y-3">
              <button
                onClick={onSetPin}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 active:scale-95 transition-all"
              >
                Ubah PIN Orang Tua
              </button>
              {isOldPinVerified && (
                <div className="text-center text-green-600 text-sm font-medium">
                  ✅ PIN berhasil diubah
                </div>
              )}
              <p className="text-xs text-gray-500 text-center">
                PIN digunakan untuk verifikasi klaim misi dan tukar hadiah
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;