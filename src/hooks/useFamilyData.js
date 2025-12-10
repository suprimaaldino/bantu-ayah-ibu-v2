import { useState, useEffect, useCallback } from 'react';
import { db } from '../config/firebase';
import {
    doc,
    collection,
    onSnapshot,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    getDoc
} from 'firebase/firestore';

const STORAGE_KEY = 'family_id';

const useFamilyData = () => {
    const [familyId, setFamilyId] = useState(localStorage.getItem(STORAGE_KEY));
    const [missions, setMissions] = useState([]);
    const [rewards, setRewards] = useState([]);
    const [pendingClaims, setPendingClaims] = useState([]);
    const [coins, setCoins] = useState(0);
    const [pin, setPin] = useState("123456"); // Default PIN
    const [streak, setStreak] = useState(1);
    const [claimedRewards, setClaimedRewards] = useState([]); // Store IDs
    const [missionClaimCount, setMissionClaimCount] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Create a new Family Group
    const createFamily = async (familyName, customPin = "123456") => {
        setError(null);
        try {
            console.log('[createFamily] Starting with:', { familyName, customPin });

            // Validate family name
            if (!familyName || typeof familyName !== 'string') {
                throw new Error("Nama keluarga harus diisi!");
            }
            const trimmedName = familyName.trim();
            if (trimmedName.length < 3) {
                throw new Error("Nama keluarga minimal 3 karakter!");
            }
            if (trimmedName.length > 20) {
                throw new Error("Nama keluarga maksimal 20 karakter!");
            }
            if (!/^[a-zA-Z0-9\s]+$/.test(trimmedName)) {
                throw new Error("Nama keluarga hanya boleh huruf, angka, dan spasi!");
            }

            console.log('[createFamily] Validation passed');

            // Validate PIN
            if (!customPin || customPin.length !== 6 || !/^\d+$/.test(customPin)) {
                throw new Error("PIN harus 6 digit angka!");
            }

            // Use lowercase family name as document ID to prevent duplicates
            const familyId = trimmedName.toLowerCase();
            const familyRef = doc(db, 'families', familyId);

            console.log('[createFamily] Checking if family exists:', familyId);

            // Check if family name already exists
            const snap = await getDoc(familyRef);

            console.log('[createFamily] getDoc result:', snap.exists());

            if (snap.exists()) {
                throw new Error("Nama keluarga sudah digunakan!");
            }

            console.log('[createFamily] Creating family document...');

            // Initialize default data
            await setDoc(familyRef, {
                displayName: trimmedName, // Store original casing
                coins: 0,
                pin: customPin,
                streak: 1,
                createdAt: new Date().toISOString()
            });

            console.log('[createFamily] Family created successfully, saving to localStorage');

            localStorage.setItem(STORAGE_KEY, familyId);
            setFamilyId(familyId); // This will trigger useEffect to handle loading

            console.log('[createFamily] Success! familyId:', familyId);

            return { success: true, displayName: trimmedName };
        } catch (err) {
            console.error("[createFamily] Error:", err);
            setError(err.message || "Gagal membuat keluarga baru.");
            return { success: false, error: err.message };
        }
    };

    // 2. Join existing Family
    const joinFamily = async (familyName, pin) => {
        setError(null);
        try {
            // Validate inputs
            if (!familyName || typeof familyName !== 'string') {
                throw new Error("Nama keluarga harus diisi!");
            }
            const trimmedName = familyName.trim();
            if (trimmedName.length < 3) {
                throw new Error("Nama keluarga tidak valid!");
            }
            if (!pin || pin.length !== 6 || !/^\d+$/.test(pin)) {
                throw new Error("PIN harus 6 digit angka!");
            }

            // Use lowercase for lookup (case-insensitive)
            const familyId = trimmedName.toLowerCase();
            const familyRef = doc(db, 'families', familyId);
            const snap = await getDoc(familyRef);

            if (!snap.exists()) {
                throw new Error("Keluarga tidak ditemukan!");
            }

            const data = snap.data();
            if (data.pin !== pin) {
                throw new Error("PIN salah!");
            }

            // PIN correct, join family
            localStorage.setItem(STORAGE_KEY, familyId);
            setFamilyId(familyId); // This will trigger useEffect to handle loading
            return { success: true, displayName: data.displayName };
        } catch (err) {
            console.error("Error joining family:", err);
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    // 3. Logout
    const leaveFamily = () => {
        localStorage.removeItem(STORAGE_KEY);
        setFamilyId(null);
        setMissions([]);
        setRewards([]);
        setPendingClaims([]);
        setCoins(0);
    };

    // 4. Real-time Sync
    useEffect(() => {
        if (!familyId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const familyRef = doc(db, 'families', familyId);
        const missionsRef = collection(db, 'families', familyId, 'missions');
        const rewardsRef = collection(db, 'families', familyId, 'rewards');
        const claimsRef = collection(db, 'families', familyId, 'claims');

        // Sync Main Data (Coins, Pin, Streak)
        const unsubFamily = onSnapshot(familyRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setCoins(data.coins || 0);
                setPin(data.pin || "123456");
                setStreak(data.streak || 1);
                setClaimedRewards(data.claimedRewards || []);
                setMissionClaimCount(data.missionClaimCount || {});
            }
        }, (err) => setError("Gagal sinkron data keluarga."));

        // Sync Missions
        const unsubMissions = onSnapshot(query(missionsRef, orderBy('createdAt', 'desc')), (snap) => {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setMissions(list);
        });

        // Sync Rewards
        const unsubRewards = onSnapshot(query(rewardsRef, orderBy('createdAt', 'desc')), (snap) => {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setRewards(list);
        });

        // Sync Pending Claims
        const unsubClaims = onSnapshot(query(claimsRef, orderBy('timestamp', 'desc')), (snap) => {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setPendingClaims(list);
        });

        setIsLoading(false);

        return () => {
            unsubFamily();
            unsubMissions();
            unsubRewards();
            unsubClaims();
        };
    }, [familyId]);

    // --- ACTIONS (Wrappers for Firestore writes) ---

    const addMission = async (mission) => {
        if (!familyId) return;
        await addDoc(collection(db, 'families', familyId, 'missions'), {
            ...mission,
            createdAt: new Date().toISOString()
        });
    };

    const updateMission = async (mission) => {
        if (!familyId) return;
        await updateDoc(doc(db, 'families', familyId, 'missions', mission.id), mission);
    };

    const deleteMission = async (id) => {
        if (!familyId) return;
        await deleteDoc(doc(db, 'families', familyId, 'missions', id));
    };

    const addReward = async (reward) => {
        if (!familyId) return;
        await addDoc(collection(db, 'families', familyId, 'rewards'), {
            ...reward,
            createdAt: new Date().toISOString()
        });
    };

    const updateReward = async (reward) => {
        if (!familyId) return;
        await updateDoc(doc(db, 'families', familyId, 'rewards', reward.id), reward);
    };

    const deleteReward = async (id) => {
        if (!familyId) return;
        await deleteDoc(doc(db, 'families', familyId, 'rewards', id));
    };

    const requestClaim = async (claim) => {
        if (!familyId) return;
        await addDoc(collection(db, 'families', familyId, 'claims'), claim);
    };

    const deleteClaim = async (id) => {
        if (!familyId) return;
        await deleteDoc(doc(db, 'families', familyId, 'claims', id));
    };

    const updateKeys = async (updates) => {
        if (!familyId) return;
        await updateDoc(doc(db, 'families', familyId), updates);
    };

    return {
        familyId,
        isAuthenticated: !!familyId,
        isLoading,
        error,
        missions,
        rewards,
        pendingClaims,
        coins,
        pin,
        streak,
        claimedRewards,
        missionClaimCount,
        createFamily,
        joinFamily,
        leaveFamily,
        addMission,
        updateMission,
        deleteMission,
        addReward,
        updateReward,
        deleteReward,
        requestClaim,
        deleteClaim,
        updateKeys // Use this to update coins, pin, claimedRewards, etc.
    };
};

export default useFamilyData;
