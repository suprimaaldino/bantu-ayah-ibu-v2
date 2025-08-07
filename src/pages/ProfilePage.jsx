// src/pages/ProfilePage.jsx
const ProfilePage = ({ 
  coins, 
  completedMissions, 
  totalMissions, 
  streak, 
  onSetPin,
  isOldPinVerified 
}) => {
  const completionRate = totalMissions > 0 
    ? Math.round((completedMissions.length / totalMissions) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 pb-20">
      <div className="max-w-md mx-auto px-4 pt-6">
        {/* Header Profil */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg">
            👧
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Profil Anak</h1>
          <p className="text-gray-600">Semangat membantu ya!</p>
        </div>

        {/* Statistik */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">⭐ {coins}</div>
              <div className="text-sm text-blue-800">Koin</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{streak}</div>
              <div className="text-sm text-green-800">Streak Hari</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl col-span-2">
              <div className="text-2xl font-bold text-purple-600">{completionRate}%</div>
              <div className="text-sm text-purple-800">Misi Selesai</div>
            </div>
          </div>
        </div>

        {/* Pengaturan Orang Tua - Hanya muncul setelah verifikasi PIN lama
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="font-bold text-gray-800 mb-4">Pengaturan Orang Tua</h3>
          
          {isOldPinVerified ? (
            <button
              onClick={onSetPin}
              className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all active:scale-95"
            >
              Atur PIN Verifikasi
            </button>
          ) : (
            <button
              onClick={onSetPin}
              className="w-full bg-yellow-400 text-white py-3 rounded-xl font-semibold opacity-90 cursor-not-allowed hover:opacity-100 transition-all"
            >
              🔐 Verifikasi PIN Dulu
            </button>
          )}
        </div> */}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Misi Harian Membantu Ayah dan Ibu © 2025
            <br />
            Dibuat dengan ❤️ oleh Aldino & QWEN
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;