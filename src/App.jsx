import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import missions from "./data/missions.js";
import rewards from "./data/rewards.js";
import ToastMessage from "./components/ToastMessage.jsx";
import ModalPIN from "./components/ModalPIN.jsx";
import ModalInputName from "./components/ModalInputName.jsx";
import useSound from "./hooks/useSound.js";
import { getFromStorage, saveToStorage } from "./utils/storage.js";
import { verifyPin, setParentPin } from "./utils/auth.js";
import { useName } from "./context/NameContext";

// ✅ Lazy Load pages (Code-Splitting)
const MissionsPage = lazy(() => import("./pages/MissionsPage.jsx"));
const RewardsPage = lazy(() => import("./pages/RewardsPage.jsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.jsx"));
const InstallPrompt = lazy(() => import("./components/InstallPrompt.jsx"));
const ParentDashboard = lazy(() => import("./pages/ParentDashboard.jsx"));

const App = () => {
  // State Management
  // State Management
  const [coins, setCoins] = useState(0);
  const [completedMissions, setCompletedMissions] = useState([]);
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [streak, setStreak] = useState(1);
  const [missionClaimCount, setMissionClaimCount] = useState({});
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

  // 🆕 New State for Dynamic Data & Approvals
  const [missionsList, setMissionsList] = useState([]);
  const [rewardsList, setRewardsList] = useState([]);
  const [pendingClaims, setPendingClaims] = useState([]);

  // Name Context
  const { name: childName, setName: setChildName, isLoading: isNameLoading } = useName();
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

  // Sound Effects
  const { playSound, playBGM, toggleMute, isMuted } = useSound();
  const [hasInteracted, setHasInteracted] = useState(false);

  // Start BGM on first interaction
  useEffect(() => {
    const startAudio = () => {
      if (!hasInteracted) {
        playBGM();
        setHasInteracted(true);
      }
    };
    window.addEventListener('click', startAudio);
    return () => window.removeEventListener('click', startAudio);
  }, [hasInteracted, playBGM]);

  // ✅ Load persisted data on mount & Initialize Defaults
  useEffect(() => {
    try {
      const savedCoins = getFromStorage("coins", 0);
      const savedCompletedMissions = getFromStorage("completedMissions", []);
      const savedClaimedRewards = getFromStorage("claimedRewards", []);
      const savedStreak = getFromStorage("streak", 1);
      const savedMissionClaimCount = getFromStorage("missionClaimCount", {});
      const lastVisit = getFromStorage("lastVisit", null);

      const savedMissions = getFromStorage("missionsList", missions); // Default to imported data
      const savedRewards = getFromStorage("rewardsList", rewards);    // Default to imported data
      const savedPendingClaims = getFromStorage("pendingClaims", []);

      setCoins(savedCoins);
      setCompletedMissions(savedCompletedMissions);
      setClaimedRewards(savedClaimedRewards);
      setStreak(savedStreak);
      setMissionClaimCount(savedMissionClaimCount);
      setMissionsList(savedMissions);
      setRewardsList(savedRewards);
      setPendingClaims(savedPendingClaims);

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

  // ✅ Cek nama anak, buka modal jika kosong
  useEffect(() => {
    if (!isNameLoading && (!childName || childName.trim() === "")) {
      setIsNameModalOpen(true);
    }
  }, [childName, isNameLoading]);

  // ✅ Debounce localStorage writes
  useEffect(() => {
    const t = setTimeout(() => saveToStorage("coins", coins), 300);
    return () => clearTimeout(t);
  }, [coins]);

  useEffect(() => {
    const t = setTimeout(() => saveToStorage("completedMissions", completedMissions), 300);
    return () => clearTimeout(t);
  }, [completedMissions]);

  useEffect(() => {
    const t = setTimeout(() => saveToStorage("claimedRewards", claimedRewards), 300);
    return () => clearTimeout(t);
  }, [claimedRewards]);

  useEffect(() => {
    const t = setTimeout(() => saveToStorage("missionClaimCount", missionClaimCount), 300);
    return () => clearTimeout(t);
  }, [missionClaimCount]);

  // 🆕 Persist dynamic lists
  useEffect(() => {
    const t = setTimeout(() => saveToStorage("missionsList", missionsList), 300);
    return () => clearTimeout(t);
  }, [missionsList]);

  useEffect(() => {
    const t = setTimeout(() => saveToStorage("rewardsList", rewardsList), 300);
    return () => clearTimeout(t);
  }, [rewardsList]);

  useEffect(() => {
    const t = setTimeout(() => saveToStorage("pendingClaims", pendingClaims), 300);
    return () => clearTimeout(t);
  }, [pendingClaims]);

  // ✅ Memoized Functions
  const showToast = useCallback((message, type = "success") => setToast({ message, type }), []);
  const closeToast = useCallback(() => setToast({ message: "", type: "" }), []);

  const handlePinVerification = useCallback(
    (inputPin) => {
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
      setPinModal((prev) => ({ ...prev, isOpen: false, action: null, isChangingPin: false }));
    },
    [pinModal, showToast]
  );

  const requestPinVerification = useCallback(
    (action, data, title, description, isChangingPin = false) => {
      setPinModal({ isOpen: true, action, data, title, description, isChangingPin });
    },
    []
  );

  // ✅ Mission & Reward Handlers
  // ✅ NEW: Request Claim (Child)
  const handleRequestClaim = useCallback((mission) => {
    // Check if already pending
    const isPending = pendingClaims.some(c => c.missionId === mission.id);
    if (isPending) {
      showToast("Misi ini sedang menunggu persetujuan orang tua", "info");
      return;
    }

    const newClaim = {
      id: Date.now(),
      missionId: mission.id,
      timestamp: new Date().toISOString(),
      childName: childName,
      status: 'pending'
    };

    setPendingClaims(prev => [...prev, newClaim]);
    playSound('success');
    showToast("Permintaan dikirim ke Ayah/Ibu! 👨‍👩‍👧", "success");
  }, [pendingClaims, childName, playSound, showToast]);

  // ✅ NEW: Approve Claim (Parent)
  const handleApproveClaim = useCallback((claim) => {
    const mission = missionsList.find(m => m.id === claim.missionId);
    if (!mission) return;

    setCoins((prev) => prev + mission.coins);
    setMissionClaimCount((prev) => ({
      ...prev,
      [mission.id]: (prev[mission.id] || 0) + 1
    }));

    // Remove from pending
    setPendingClaims(prev => prev.filter(c => c.id !== claim.id));

    playSound('success');
    showToast(`Klaim disetujui! Koin bertambah ` + mission.coins, "success");
  }, [missionsList, playSound, showToast]);

  // ✅ NEW: Reject Claim (Parent)
  const handleRejectClaim = useCallback((claimId) => {
    setPendingClaims(prev => prev.filter(c => c.id !== claimId));
    showToast("Klaim ditolak", "info");
  }, [showToast]);

  // ✅ Mission & Reward Handlers
  const claimMission = useCallback(
    (mission) => {
      handleRequestClaim(mission);
    },
    [handleRequestClaim]
  );


  const redeemReward = useCallback(
    (reward) => {
      if (coins < reward.price) {
        playSound('error');
        showToast("Koin tidak cukup!", "error");
        return;
      }
      if (claimedRewards.includes(reward.id)) {
        playSound('error');
        showToast("Hadiah sudah ditukar!", "error");
        return;
      }
      requestPinVerification(
        () => {
          setCoins((prev) => prev - reward.price);
          setClaimedRewards((prev) => [...prev, reward.id]);
          playSound('reward');
          showToast(`Selamat! Kamu mendapatkan ${reward.name}!`, "success");
        },
        reward,
        "Verifikasi Penukaran Hadiah",
        "Masukkan PIN orang tua untuk menukar hadiah ini"
      );
    },
    [coins, claimedRewards, requestPinVerification, showToast, playSound]
  );

  const handleSetNewPin = useCallback(() => {
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
  }, [requestPinVerification]);

  const handleSaveName = useCallback(
    (name) => {
      const trimmedName = name.trim();
      if (trimmedName.length < 2) {
        showToast("Nama harus lebih dari 1 huruf!", "error");
        return;
      }
      setChildName(trimmedName);
      setIsNameModalOpen(false);
      showToast(`Halo, ${trimmedName}!`, "success");
    },
    [setChildName, showToast]
  );

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
      <Helmet>
        <html lang="id" />
        <title>Bantu Ayah Ibu 👨‍👩‍👧</title>
        <meta
          name="description"
          content="Aplikasi gamifikasi untuk membantu Ayah dan Ibu memberi tugas harian dan reward kepada anak."
        />
      </Helmet>

      {/* 🎮 Main Game Container with Animated Background */}
      <main className="font-fun min-h-screen pb-20 relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="fixed inset-0 bg-gradient-game -z-10" />

        {/* Floating Mute Button */}
        <button
          onClick={toggleMute}
          className="fixed top-4 right-4 z-50 bg-white/20 backdrop-blur-md p-2 rounded-full shadow-lg border border-white/30 hover:bg-white/30 transition-all active:scale-95"
          aria-label={isMuted ? "Unmute sound" : "Mute sound"}
        >
          <span className="text-xl filter drop-shadow-md">
            {isMuted ? "🔇" : "🔊"}
          </span>
        </button>

        {/* Floating Stars Background */}
        <div className="fixed inset-0 -z-5 pointer-events-none">
          <div className="absolute top-10 left-10 text-4xl animate-twinkle">⭐</div>
          <div className="absolute top-20 right-20 text-3xl animate-twinkle" style={{ animationDelay: '0.5s' }}>✨</div>
          <div className="absolute top-40 left-1/4 text-2xl animate-twinkle" style={{ animationDelay: '1s' }}>💫</div>
          <div className="absolute top-60 right-1/3 text-3xl animate-twinkle" style={{ animationDelay: '1.5s' }}>🌟</div>
          <div className="absolute bottom-40 left-1/3 text-4xl animate-twinkle" style={{ animationDelay: '2s' }}>⭐</div>
          <div className="absolute bottom-60 right-1/4 text-2xl animate-twinkle" style={{ animationDelay: '2.5s' }}>✨</div>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="text-6xl animate-bounce-slow mb-4">🎮</div>
              <div className="text-white font-bold text-xl">Loading...</div>
            </div>
          </div>
        }>
          {activePage === "missions" && (
            <MissionsPage
              missions={missionsList}
              onClaimMission={claimMission}
              coins={coins}
              missionClaimCount={missionClaimCount}
              pendingClaims={pendingClaims}
            />
          )}

          {activePage === "rewards" && (
            <RewardsPage
              rewards={rewardsList}
              coins={coins}
              onRedeemReward={redeemReward}
              claimedRewards={claimedRewards}
            />
          )}

          {activePage === "profile" && (
            <ProfilePage
              coins={coins}
              completedMissions={completedMissions}
              totalMissions={missionsList.length}
              streak={streak}
              onSetPin={handleSetNewPin}
              isOldPinVerified={isOldPinVerified}
              childName={childName}
              onEnterParentMode={() => requestPinVerification(
                () => setActivePage("parent"),
                null,
                "Masuk Mode Orang Tua",
                "Masukkan PIN untuk mengakses dashboard orang tua"
              )}
            />
          )}

          {activePage === "parent" && (
            <ParentDashboard
              missions={missionsList}
              setMissions={setMissionsList}
              rewards={rewardsList}
              setRewards={setRewardsList}
              pendingClaims={pendingClaims}
              setPendingClaims={setPendingClaims}
              onApproveClaim={handleApproveClaim}
              onRejectClaim={handleRejectClaim}
              onExit={() => setActivePage("missions")}
            />
          )}
        </Suspense>
      </main>

      {/* 🎨 Game-Style Bottom Navigation */}
      {activePage !== "parent" && (
        <nav
          className="fixed bottom-0 left-0 right-0 glass-white border-t-2 border-white/30 shadow-glow-purple z-50"
          role="navigation"
          aria-label="Navigasi bawah"
        >
          <div className="max-w-md mx-auto">
            <div className="flex justify-around items-center py-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    playSound('click');
                    setActivePage(item.id);
                  }}
                  className={`flex flex-col items-center py-3 px-6 rounded-2xl transition-all duration-300 ${activePage === item.id
                    ? 'bg-gradient-purple-pink text-white scale-110 shadow-glow-purple animate-bounce-slow'
                    : 'text-gray-600 hover:text-game-purple hover:scale-105'
                    }`}
                >
                  <span className={`text-3xl mb-1 ${activePage === item.id ? 'animate-wiggle' : ''}`}>
                    {item.icon}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wide">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Modals */}
      <ModalPIN
        isOpen={pinModal.isOpen}
        onClose={() => setPinModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handlePinVerification}
        title={pinModal.title}
        description={pinModal.description}
      />

      {isNameModalOpen && <ModalInputName onSave={handleSaveName} defaultValue="" />}

      {toast.message && <ToastMessage message={toast.message} type={toast.type} onClose={closeToast} />}

      {/* PWA Install Prompt */}
      <Suspense fallback={null}>
        <InstallPrompt />
      </Suspense>
    </>
  );
};

export default App;
