import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/Header';

const ProfilePage = ({ coins, completedMissions, totalMissions, streak, onSetPin, isOldPinVerified, childName }) => {
  const completionPercentage =
    totalMissions > 0
      ? Math.round((completedMissions.length / totalMissions) * 100)
      : 0;

  return (
    <>
      {/* ✅ Helmet untuk SEO */}
      <Helmet>
        <title>Profil Anak 👧 - Bantu Ayah Ibu</title>
        <meta
          name="description"
          content="Lihat statistik anak, progress misi, streak harian, dan atur PIN orang tua."
        />
      </Helmet>

      {/* ✅ Tambahkan <main> sebagai landmark */}
      <main className="min-h-screen bg-gray-50 pb-20">
        <Header coins={coins} />
        <div className="p-4">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-purple-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
              👧
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {childName || 'Anak Baik'}
            </h2>
            {/* ✅ Perbaiki kontras */}
            <p className="text-gray-700">Anak yang rajin!</p>
          </div>

          <div className="space-y-4">
            {/* Statistik Utama */}
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="font-bold text-gray-800 mb-3">📊 Statistik</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{coins}</div>
                  <div className="text-sm text-gray-700">Total Koin</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {completedMissions.length}
                  </div>
                  <div className="text-sm text-gray-700">Misi Selesai</div>
                </div>
              </div>
            </div>

            {/* Progress Misi */}
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="font-bold text-gray-800 mb-3">🎯 Progress Misi</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">
                  Selesai: {completedMissions.length}/{totalMissions}
                </span>
                <span className="text-sm font-medium text-purple-600">
                  {completionPercentage}%
                </span>
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
                <div className="text-2xl font-bold text-orange-600">
                  {streak} Hari
                </div>
                <div className="text-sm text-gray-700">Berturut-turut!</div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
