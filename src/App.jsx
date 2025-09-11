import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import missions from "./data/missions.js";
import rewards from "./data/rewards.js";
import ToastMessage from "./components/ToastMessage.jsx";
import ModalPIN from "./components/ModalPIN.jsx";
import ModalInputName from "./components/ModalInputName.jsx";
import MissionsPage from "./pages/MissionsPage.jsx";
import RewardsPage from "./pages/RewardsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { getFromStorage, saveToStorage } from "./utils/storage.js";
import { verifyPin, setParentPin } from "./utils/auth.js";
import { useName } from "./context/NameContext";

const App = () => {
  // State Management
  const [coins, setCoins] = useState(0);
  const [completedMissions, setCompletedMissions] = useState([]);
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [streak, setStreak] = useState(1);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [activePage, setActivePage] = useState("missions");
  const [pinModal, setPinModal] = useState({
    isOpen: false,
    action: null,
    title: "",
    description: "",
    isChangingPin: false,
  });
  const [isOldPinVerified, setIsOldPinVerified] = useState(false);

  // Name Context
  const { name: childName, setName: setChildName, isLoading: isNameLoading } = useName();
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

  // Load persisted data on mount
  useEffect(() => {
    try {
      const savedCoins = getFromStorage("coins", 0);
      const savedCompletedMissions = getFromStorage("completedMissions", []);
      const savedClaimedRewards = getFromStorage("claimedRewards", []);
      const savedStreak = getFromStorage("streak", 1);
      const lastVisit = getFromStorage("lastVisit", null);

      setCoins(savedCoins);
      setCompletedMissions(savedCompletedMissions);
      setClaimedRewards(savedClaimedRewards);
      setStreak(savedStreak);

      // Streak calculation
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      if (lastVisit === yesterday) {
        const newStreak = savedStreak + 1;
        setStreak(newStreak);
        saveToStorage("streak", newStreak);
      } else if (lastVisit !== today) {
        saveToStorage("streak", 1);
      }

      saveToStorage("lastVisit", today);
    } catch (error) {
      console.error("Failed to load saved data:", error);
    }
  }, []);

  // Check if name is required
  useEffect(() => {
    if (!isNameLoading && (!childName || childName.trim() === "")) {
      setIsNameModalOpen(true);
    }
  }, [childName, isNameLoading]);

  // Auto-save effects
  useEffect(() => saveToStorage("coins", coins), [coins]);
  useEffect(() => saveToStorage("completedMissions", completedMissions), [completedMissions]);
  useEffect(() => saveToStorage("claimedRewards", claimedRewards), [claimedRewards]);

  // Helper Functions
  const showToast = (message, type = "success") => setToast({ message, type });
  const closeToast = () => setToast({ message: "", type: "" });

  const handlePinVerification = (inputPin) => {
    if (!inputPin || inputPin.length !== 6 || !/^\d+$/.test(inputPin)) {
      showToast("PIN harus 6 digit angka!", "error");
      return;
    }

    if (pinModal.isChangingPin) {
      setParentPin(inputPin);
      showToast("PIN berhasil diubah!", "success");
      setIsOldPinVerified(true);
    } else if (verifyPin(inputPin)) {
      pinModal.action?.(pinModal.data);
      showToast("Verifikasi berhasil!", "success");
    } else {
      showToast("PIN salah!", "error");
    }
    setPinModal({ isOpen: false, action: null, isChangingPin: false });
  };

  const requestPinVerification = (action, data, title, description, isChangingPin = false) => {
    setPinModal({ isOpen: true, action, data, title, description, isChangingPin });
  };

  // Mission & Reward Handlers
  const claimMission = (mission) => {
    if (completedMissions.includes(mission.id)) {
      showToast("Misi sudah selesai!", "error");
      return;
    }
    requestPinVerification(
      () => {
        setCompletedMissions([...completedMissions, mission.id]);
        setCoins(coins + mission.coins);
        showToast(`Selamat! Kamu mendapat ${mission.coins} koin!`, "success");
      },
      mission,
      "Verifikasi Orang Tua",
      "Masukkan PIN untuk mengklaim misi ini"
    );
  };

  const redeemReward = (reward) => {
    if (coins < reward.price) {
      showToast("Koin tidak cukup!", "error");
      return;
    }
    if (claimedRewards.includes(reward.id)) {
      showToast("Hadiah sudah ditukar!", "error");
      return;
    }
    requestPinVerification(
      () => {
        setCoins(coins - reward.price);
        setClaimedRewards([...claimedRewards, reward.id]);
        showToast(`Selamat! Kamu mendapatkan ${reward.name}!`, "success");
      },
      reward,
      "Verifikasi Penukaran Hadiah",
      "Masukkan PIN orang tua untuk menukar hadiah ini"
    );
  };

  const handleSetNewPin = () => {
    requestPinVerification(
      () => {
        requestPinVerification(
          (newPin) => setParentPin(newPin),
          null,
          "Atur PIN Baru",
          "Masukkan PIN baru (6 digit)",
          true
        );
      },
      null,
      "Verifikasi PIN Lama",
      "Masukkan PIN lama untuk melanjutkan"
    );
  };

  const handleSaveName = (name) => {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      showToast("Nama harus lebih dari 1 huruf!", "error");
      return;
    }
    setChildName(trimmedName);
    setIsNameModalOpen(false);
    showToast(`Halo, ${trimmedName}!`, "success");
  };

  const navigationItems = [
    { id: "missions", label: "Misi", icon: "🏠" },
    { id: "rewards", label: "Hadiah", icon: "🏆" },
    { id: "profile", label: "Profil", icon: "👧" },
  ];

  if (isNameLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <>
      {/* ✅ Helmet Global */}
      <Helmet>
        <html lang="id" />
        <title>Bantu Ayah Ibu 👨‍👩‍👧</title>
        <meta
          name="description"
          content="Aplikasi gamifikasi untuk membantu Ayah dan Ibu memberi tugas harian dan reward kepada anak."
        />
      </Helmet>

      {/* ✅ Gunakan main sebagai container halaman */}
      <main className="font-sans bg-gray-50 min-h-screen pb-16">
        {activePage === "missions" && (
          <MissionsPage
            missions={missions}
            completedMissions={completedMissions}
            onClaimMission={claimMission}
            coins={coins}
          />
        )}

        {activePage === "rewards" && (
          <RewardsPage
            rewards={rewards}
            coins={coins}
            onRedeemReward={redeemReward}
            claimedRewards={claimedRewards}
          />
        )}

        {activePage === "profile" && (
          <ProfilePage
            coins={coins}
            completedMissions={completedMissions}
            totalMissions={missions.length}
            streak={streak}
            onSetPin={handleSetNewPin}
            isOldPinVerified={isOldPinVerified}
            childName={childName}
          />
        )}
      </main>

      {/* ✅ Bottom Navigation dengan role navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md"
        role="navigation"
        aria-label="Navigasi bawah"
      >
        <div className="max-w-md mx-auto">
          <div className="flex justify-around">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex flex-col items-center py-3 px-4 transition-all ${
                  activePage === item.id
                    ? "text-purple-600 scale-110"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Modals */}
      <ModalPIN
        isOpen={pinModal.isOpen}
        onClose={() => setPinModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handlePinVerification}
        title={pinModal.title}
        description={pinModal.description}
      />

      {isNameModalOpen && (
        <ModalInputName onSave={handleSaveName} defaultValue="" />
      )}

      {toast.message && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </>
  );
};

export default App;
