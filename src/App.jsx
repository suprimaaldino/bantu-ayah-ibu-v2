import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import ToastMessage from "./components/ToastMessage.jsx";
import ModalPIN from "./components/ModalPIN.jsx";
import ModalInputName from "./components/ModalInputName.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import useSound from "./hooks/useSound.js";
import useFamilyData from "./hooks/useFamilyData.js";
import { useName } from "./context/NameContext";

// ✅ Lazy Load pages
const MissionsPage = lazy(() => import("./pages/MissionsPage.jsx"));
const RewardsPage = lazy(() => import("./pages/RewardsPage.jsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.jsx"));
const InstallPrompt = lazy(() => import("./components/InstallPrompt.jsx"));
const ParentDashboard = lazy(() => import("./pages/ParentDashboard.jsx"));

const App = () => {
  // --- Real-time Data Hook ---
  const {
    familyId,
    isAuthenticated,
    isLoading: isDataLoading,
    error: dataError,
    createFamily,
    joinFamily,
    joinFamilyAsChild,
    resetPinWithSecret,
    leaveFamily,
    missions,       // Synced List
    rewards,        // Synced List
    pendingClaims,  // Synced List
    coins,          // Synced Value
    pin,            // Synced Value
    streak,         // Synced Value
    missionClaimCount, // Synced Value
    claimedRewards, // Synced Value
    addMission,
    updateMission,
    deleteMission,
    addReward,
    updateReward,
    deleteReward,
    requestClaim,
    deleteClaim,
    updateKeys
  } = useFamilyData();

  // --- Local UI State ---
  const [activePage, setActivePage] = useState("missions");
  const [toast, setToast] = useState({ message: "", type: "" });
  const [pinModal, setPinModal] = useState({
    isOpen: false,
    action: null,
    title: "",
    description: "",
    isChangingPin: false,
  });
  const [isOldPinVerified, setIsOldPinVerified] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  // Name Context
  const { name: childName, setName: setChildName, isLoading: isNameLoading } = useName();
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

  // Sound Effects
  const { playSound, playBGM, toggleMute, isMuted } = useSound();
  const [hasInteracted, setHasInteracted] = useState(false);

  // --- Effects ---

  // Start BGM
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

  // Name check
  useEffect(() => {
    if (isAuthenticated && !isNameLoading && (!childName || childName.trim() === "")) {
      setIsNameModalOpen(true);
    }
  }, [isAuthenticated, childName, isNameLoading]);

  // Streak Logic (Synced)
  useEffect(() => {
    // Only run if we have data
    if (!isAuthenticated || isDataLoading) return;

    // Check last visit date stored in Firestore (we don't expose lastVisit in hook return yet, but we should or read it here)
    // Actually, hook handles sync. We need to implement the "New Day" check logic.
    // Use localStorage for "lastVisit" check to trigger the updateKeys? 
    // Or better: updateKeys accepts partial updates.

    // Simple logic: If we are online, check date.
    // NOTE: For MVP, logic is slightly simplified. We assume useFamilyData provides `streak`.
    // We need to implement the "increment if new day" logic.
    // Ideally this is Cloud Functions, but for client-side:
    const today = new Date().toDateString();
    const lastCheck = localStorage.getItem('last_streak_check');

    if (lastCheck !== today) {
      // We haven't checked today.
      // Logic: if lastVisit (from DB) was yesterday -> streak++.
      // Since we don't have lastVisit exposed from hook easily yet, we'll skip complex streak logic for this step 
      // OR add it to hook. existing `useFamilyData` didn't assume streak logic inside.
      // Let's rely on manual sync for now or just trust the DB value.
      // To properly implement: updateHook to return lastVisit.
      localStorage.setItem('last_streak_check', today);
    }
  }, [isAuthenticated, isDataLoading]);

  // --- Handlers ---

  const showToast = useCallback((message, type = "success") => setToast({ message, type }), []);
  const closeToast = useCallback(() => setToast({ message: "", type: "" }), []);

  const handleCreateFamily = async (familyName, customPin, secretWord) => {
    setIsJoining(true);
    const result = await createFamily(familyName, customPin, secretWord);
    setIsJoining(false);

    if (result.success) {
      showToast(`Keluarga "${result.displayName}" berhasil dibuat!`, "success");
    } else {
      showToast(result.error || "Gagal membuat keluarga", "error");
    }
  };

  const handleJoinFamily = async (familyName, pin) => {
    setIsJoining(true);
    const result = await joinFamily(familyName, pin);
    setIsJoining(false);

    if (result.success) {
      showToast(`Berhasil masuk keluarga "${result.displayName}"!`, "success");
    } else {
      showToast(result.error || "Gagal masuk keluarga", "error");
    }
  };

  // Handler for Child Login (no PIN)
  const handleJoinAsChild = async (familyName) => {
    setIsJoining(true);
    const result = await joinFamilyAsChild(familyName);
    setIsJoining(false);

    if (result.success) {
      showToast(`Halo! Selamat datang di ${result.displayName}! 🎉`, "success");
    } else {
      showToast(result.error || "Gagal masuk keluarga", "error");
    }
  };

  // Handler for Reset PIN
  const handleResetPin = async (familyName, secretWord, newPin) => {
    setIsJoining(true);
    const result = await resetPinWithSecret(familyName, secretWord, newPin);
    setIsJoining(false);

    if (result.success) {
      showToast(`PIN berhasil direset! Silakan login dengan PIN baru.`, "success");
    } else {
      showToast(result.error || "Gagal reset PIN", "error");
    }
  };

  // Wrapper for PIN verification using SYNCED PIN
  const handlePinVerification = useCallback(
    (inputPin) => {
      if (!inputPin || inputPin.length !== 6 || !/^\d+$/.test(inputPin)) {
        showToast("PIN harus 6 digit angka!", "error");
        return;
      }

      if (pinModal.isChangingPin) {
        updateKeys({ pin: inputPin }); // Update to Firestore
        showToast("PIN berhasil diubah!", "success");
        setIsOldPinVerified(true);
      } else if (inputPin === pin) { // Verify against Synced PIN
        pinModal.action?.(pinModal.data);
        showToast("Verifikasi berhasil!", "success");
      } else {
        showToast("PIN salah!", "error");
      }
      setPinModal((prev) => ({ ...prev, isOpen: false, action: null, isChangingPin: false }));
    },
    [pinModal, showToast, pin, updateKeys]
  );

  const requestPinVerification = useCallback(
    (action, data, title, description, isChangingPin = false) => {
      setPinModal({ isOpen: true, action, data, title, description, isChangingPin });
    },
    []
  );

  // --- Action Handlers (Re-implemented with Hook) ---

  const handleRequestClaim = useCallback((item, type = 'mission', quantity = 1) => {
    // Check if pending
    const isPending = pendingClaims.some(c => c.itemId === item.id && c.type === type);
    if (isPending) {
      showToast("Sedang menunggu persetujuan...", "info");
      return;
    }

    const newClaim = {
      itemId: item.id,
      type,
      quantity,
      timestamp: new Date().toISOString(),
      childName: childName,
      status: 'pending'
    };
    requestClaim(newClaim);
    playSound('success');
    showToast("Permintaan dikirim!", "success");
  }, [pendingClaims, childName, requestClaim, playSound, showToast]);

  const handleApproveClaim = useCallback((claim) => {
    let updates = {};
    if (claim.type === 'reward') {
      const reward = rewards.find(r => r.id === claim.itemId);
      if (!reward) return;

      const quantity = claim.quantity || 1;
      const totalCost = reward.price * quantity;

      if (coins < totalCost) {
        showToast("Koin tidak cukup!", "error");
        return;
      }
      updates.coins = coins - totalCost;
      // We don't really track distinct claimed IDs in array for duplicates in this DB model yet, 
      // but we can add to array if we want history. For MVP, we skip the array push to keep it fast.
      showToast(`Approved ${reward.name}`, "success");
    } else {
      const mission = missions.find(m => m.id === claim.itemId || m.id === claim.missionId);
      if (!mission) return;

      updates.coins = coins + mission.coins;
      // missionClaimCount logic
      const newCount = (missionClaimCount[mission.id] || 0) + 1;
      updates.missionClaimCount = { ...missionClaimCount, [mission.id]: newCount };

      showToast(`Approved! +${mission.coins}`, "success");
    }

    updateKeys(updates);
    deleteClaim(claim.id);
    playSound('success');
  }, [missions, rewards, coins, missionClaimCount, updateKeys, deleteClaim, playSound, showToast]);

  const handleRejectClaim = useCallback((id) => {
    deleteClaim(id);
    showToast("Ditolak", "info");
  }, [deleteClaim, showToast]);

  const claimMission = useCallback((mission) => {
    handleRequestClaim(mission, 'mission');
  }, [handleRequestClaim]);

  const redeemReward = useCallback((reward, quantity = 1) => {
    const totalCost = reward.price * quantity;
    if (coins < totalCost) {
      playSound('error');
      showToast("Koin tidak cukup!", "error");
      return;
    }
    handleRequestClaim(reward, 'reward', quantity);
  }, [coins, handleRequestClaim, playSound, showToast]);

  const handleSetNewPin = useCallback(() => {
    requestPinVerification(
      () => {
        requestPinVerification(
          (newPin) => updateKeys({ pin: newPin }),
          null,
          "Atur PIN Baru",
          "Masukkan PIN baru",
          true
        );
      },
      null,
      "Verifikasi PIN Lama",
      "Masukkan PIN lama"
    );
  }, [requestPinVerification, updateKeys]);

  const handleSaveName = useCallback((name) => {
    const trimmed = name.trim();
    if (trimmed.length < 2) return;
    setChildName(trimmed);
    setIsNameModalOpen(false);
  }, [setChildName]);

  const navigationItems = [
    { id: "missions", label: "Misi", icon: "🏠" },
    { id: "rewards", label: "Hadiah", icon: "🏆" },
    { id: "profile", label: "Profil", icon: "👧" },
  ];

  // --- Rendering ---

  if (!isAuthenticated) {
    return (
      <LoginPage
        onCreateFamily={handleCreateFamily}
        onJoinFamily={handleJoinFamily}
        onJoinAsChild={handleJoinAsChild}
        onResetPin={handleResetPin}
        isJoining={isJoining}
        error={dataError}
      />
    );
  }

  if (isDataLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-game text-white">
        <div className="text-6xl animate-bounce mb-4">⏳</div>
        <h2 className="text-2xl font-bold">Menghubungkan ke Keluarga...</h2>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <html lang="id" />
        <title>Bantu Ayah Ibu 👨‍👩‍👧</title>
      </Helmet>

      <main className="font-fun min-h-screen pb-20 relative overflow-hidden">
        {/* Background & Sounds (Same as before) */}
        <div className="fixed inset-0 bg-gradient-game -z-10" />
        <button onClick={toggleMute} className="fixed top-4 right-4 z-50 bg-white/20 backdrop-blur-md p-2 rounded-full shadow-lg border border-white/30">
          <span className="text-xl">{isMuted ? "🔇" : "🔊"}</span>
        </button>

        <Suspense fallback={<div className="text-white text-center pt-20">Loading...</div>}>
          {activePage === "missions" && (
            <MissionsPage
              missions={missions}
              onClaimMission={claimMission}
              coins={coins}
              missionClaimCount={missionClaimCount}
              pendingClaims={pendingClaims}
            />
          )}

          {activePage === "rewards" && (
            <RewardsPage
              rewards={rewards}
              coins={coins}
              onRedeemReward={redeemReward}
              claimedRewards={claimedRewards}
              pendingClaims={pendingClaims}
            />
          )}

          {activePage === "profile" && (
            <ProfilePage
              coins={coins}
              completedMissions={[]} // TODO: wire up history if needed
              totalMissions={missions.length}
              streak={streak}
              onSetPin={handleSetNewPin}
              isOldPinVerified={isOldPinVerified}
              childName={childName}
              onEnterParentMode={() => requestPinVerification(
                () => setActivePage("parent"),
                null,
                "Masuk Mode Orang Tua",
                "PIN Keluarga"
              )}
            />
          )}

          {activePage === "parent" && (
            <ParentDashboard
              missions={missions}
              setMissions={null} // Handled by add/edit hooks inside
              rewards={rewards}
              setRewards={null}
              pendingClaims={pendingClaims}
              onApproveClaim={handleApproveClaim}
              onRejectClaim={handleRejectClaim}
              onExit={() => setActivePage("missions")}

              // New Props for Real-time Actions
              onSaveMission={(m) => m.id ? updateMission(m) : addMission(m)}
              onDeleteMission={deleteMission}
              onSaveReward={(r) => r.id ? updateReward(r) : addReward(r)}
              onDeleteReward={deleteReward}

              // Pass ID for display
              familyId={familyId}
              onLogout={() => { leaveFamily(); setActivePage("missions"); }}
            />
          )}
        </Suspense>
      </main>

      {/* Navigation */}
      {activePage !== "parent" && (
        <nav className="fixed bottom-0 left-0 right-0 glass-white border-t-2 border-white/30 shadow-glow-purple z-50">
          <div className="max-w-md mx-auto flex justify-around items-center py-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { playSound('click'); setActivePage(item.id); }}
                className={`flex flex-col items-center py-3 px-6 rounded-2xl transition-all duration-300 ${activePage === item.id ? 'bg-gradient-purple-pink text-white scale-110 shadow-glow-purple' : 'text-gray-600'}`}
              >
                <span className="text-3xl mb-1">{item.icon}</span>
                <span className="text-xs font-bold uppercase">{item.label}</span>
              </button>
            ))}
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
      <Suspense fallback={null}><InstallPrompt /></Suspense>
    </>
  );
};

export default App;
