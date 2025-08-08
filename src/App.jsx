import React, { useState, useEffect } from "react";
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

  // 🧒 Nama anak dari context
  const { name: childName, setName: setChildName } = useName();
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCoins = getFromStorage("coins", 0);
    const savedCompletedMissions = getFromStorage("completedMissions", []);
    const savedClaimedRewards = getFromStorage("claimedRewards", []);
    const savedStreak = getFromStorage("streak", 1);
    const lastVisit = getFromStorage("lastVisit", null);

    setCoins(savedCoins);
    setCompletedMissions(savedCompletedMissions);
    setClaimedRewards(savedClaimedRewards);
    setStreak(savedStreak);

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
  }, []);

  // Cek apakah nama sudah diisi
  useEffect(() => {
    if (!childName || childName.trim() === "") {
      setIsNameModalOpen(true);
    } else {
      setIsNameModalOpen(false);
    }
  }, [childName]);

  // Save to localStorage whenever data changes
  useEffect(() => saveToStorage("coins", coins), [coins]);
  useEffect(() => saveToStorage("completedMissions", completedMissions), [completedMissions]);
  useEffect(() => saveToStorage("claimedRewards", claimedRewards), [claimedRewards]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast({ message: "", type: "" });
  };

  const handlePinVerification = (inputPin) => {
    if (pinModal.isChangingPin) {
      if (inputPin.length === 6 && /^\d+$/.test(inputPin)) {
        setParentPin(inputPin);
        showToast("PIN berhasil diubah!", "success");
        setIsOldPinVerified(true);
      } else {
        showToast("PIN harus 6 digit angka!", "error");
      }
    } else {
      if (verifyPin(inputPin)) {
        if (pinModal.action) {
          pinModal.action(pinModal.data);
        }
        showToast("Verifikasi berhasil!", "success");
      } else {
        showToast("PIN salah!", "error");
      }
    }
    setPinModal({ isOpen: false, action: null, isChangingPin: false });
  };

  const requestPinVerification = (action, data, title, description, isChangingPin = false) => {
    setPinModal({ isOpen: true, action, data, title, description, isChangingPin });
  };

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

  const setNewPin = () => {
    requestPinVerification(
      () => {
        requestPinVerification(
          (newPin) => {
            if (newPin.length === 6 && /^\d+$/.test(newPin)) {
              setParentPin(newPin);
              showToast("PIN berhasil diubah!", "success");
              setIsOldPinVerified(true);
            } else {
              showToast("PIN baru harus 6 digit angka!", "error");
            }
          },
          null,
          "Atur PIN Baru",
          "Masukkan PIN baru (6 digit)",
          true
        );
      },
      null,
      "Verifikasi PIN Lama",
      "Masukkan PIN lama untuk melanjutkan",
      false
    );
  };

  const handleSaveName = (name) => {
    setChildName(name); // update context + localStorage
    setIsNameModalOpen(false);
    showToast(`Halo, ${name}!`, "success");
  };

  const navigationItems = [
    { id: "missions", label: "Misi", icon: "🏠" },
    { id: "rewards", label: "Hadiah", icon: "🏆" },
    { id: "profile", label: "Profil", icon: "👧" },
  ];

  return (
    <div className="font-sans">
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
          childName={childName}
        />
      )}
      {activePage === "profile" && (
        <ProfilePage
          coins={coins}
          completedMissions={completedMissions}
          totalMissions={missions.length}
          streak={streak}
          onSetPin={setNewPin}
          isOldPinVerified={isOldPinVerified}
          childName={childName}
        />
      )}

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="max-w-md mx-auto">
          <div className="flex justify-around">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  activePage === item.id
                    ? "text-purple-600 bg-purple-50 scale-110"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal & Toast */}
      <ModalPIN
        isOpen={pinModal.isOpen}
        onClose={() => setPinModal({ isOpen: false, action: null, isChangingPin: false })}
        onConfirm={handlePinVerification}
        title={pinModal.title}
        description={pinModal.description}
      />

      {isNameModalOpen && (
        <ModalInputName onSave={handleSaveName} defaultValue="" />
      )}

      <ToastMessage message={toast.message} type={toast.type} onClose={closeToast} />
    </div>
  );
};

export default App;