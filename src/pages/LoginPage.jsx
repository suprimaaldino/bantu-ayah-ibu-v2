import React, { useState } from 'react';
import useSound from '../hooks/useSound';

const LoginPage = ({ onCreateFamily, onJoinFamily, onJoinAsChild, onResetPin, isJoining, error }) => {
    // Mode: 'select' | 'child' | 'parent' | 'create' | 'reset'
    const [mode, setMode] = useState('select');
    const [familyName, setFamilyName] = useState("");
    const [pin, setPin] = useState("");
    const [newFamilyName, setNewFamilyName] = useState("");
    const [newFamilyPin, setNewFamilyPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [secretWord, setSecretWord] = useState("");
    // Reset PIN state
    const [resetFamilyName, setResetFamilyName] = useState("");
    const [resetSecretWord, setResetSecretWord] = useState("");
    const [resetNewPin, setResetNewPin] = useState("");
    const [resetConfirmPin, setResetConfirmPin] = useState("");

    const { playSound } = useSound();

    // Child login
    const handleChildLogin = (e) => {
        e.preventDefault();
        if (familyName.trim().length < 3) return;
        playSound('click');
        onJoinAsChild(familyName);
    };

    // Parent login
    const handleParentLogin = (e) => {
        e.preventDefault();
        if (familyName.trim().length < 3 || pin.length !== 6) return;
        playSound('click');
        onJoinFamily(familyName, pin);
    };

    // Create family with secret word
    const handleCreateFamily = (e) => {
        e.preventDefault();
        if (newFamilyName.trim().length < 3) return;
        if (newFamilyPin.length !== 6 || confirmPin.length !== 6) return;
        if (newFamilyPin !== confirmPin) {
            playSound('error');
            return;
        }
        if (secretWord.trim().length < 2) return;
        playSound('click');
        onCreateFamily(newFamilyName, newFamilyPin, secretWord);
    };

    // Reset PIN with secret word
    const handleResetPin = (e) => {
        e.preventDefault();
        if (resetFamilyName.trim().length < 3) return;
        if (resetSecretWord.trim().length < 2) return;
        if (resetNewPin.length !== 6 || resetConfirmPin.length !== 6) return;
        if (resetNewPin !== resetConfirmPin) {
            playSound('error');
            return;
        }
        playSound('click');
        onResetPin(resetFamilyName, resetSecretWord, resetNewPin);
    };

    const resetForm = () => {
        setFamilyName('');
        setPin('');
        setNewFamilyName('');
        setNewFamilyPin('');
        setConfirmPin('');
        setSecretWord('');
        setResetFamilyName('');
        setResetSecretWord('');
        setResetNewPin('');
        setResetConfirmPin('');
    };

    const switchMode = (newMode) => {
        playSound('click');
        setMode(newMode);
        resetForm();
    };

    return (
        <div className="min-h-screen bg-gradient-game flex flex-col items-center justify-center p-4">
            {/* Logo / Header */}
            <div className="text-center mb-8 animate-fade-in-up">
                <div className="text-6xl mb-4 animate-bounce-slow">👨‍👩‍👧</div>
                <h1 className="text-4xl font-game font-bold text-white drop-shadow-lg mb-2">
                    Bantu Ayah Ibu
                </h1>
                <p className="text-white/90 font-bold text-lg">Aplikasi Misi & Reward Keluarga</p>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-6 text-center font-bold text-sm animate-shake">
                        ⚠️ {error}
                    </div>
                )}

                {/* ===== ROLE SELECTION ===== */}
                {mode === 'select' && (
                    <div className="flex flex-col gap-4">
                        <p className="text-center text-gray-600 font-bold mb-2">
                            Siapa yang mau masuk?
                        </p>
                        <button
                            onClick={() => switchMode('child')}
                            className="w-full py-5 rounded-2xl font-bold text-xl bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg hover:scale-105 transition-transform active:scale-95"
                        >
                            <span className="text-3xl mr-2">👧</span>
                            Anak
                        </button>
                        <button
                            onClick={() => switchMode('parent')}
                            className="w-full py-5 rounded-2xl font-bold text-xl bg-gradient-purple-pink text-white shadow-lg hover:scale-105 transition-transform active:scale-95"
                        >
                            <span className="text-3xl mr-2">👨‍👩‍👧</span>
                            Orang Tua
                        </button>
                        {/* Create new family link */}
                        <div className="text-center mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500 mb-2">Belum punya keluarga?</p>
                            <button
                                onClick={() => switchMode('create')}
                                className="text-purple-600 font-bold hover:underline"
                            >
                                ➕ Buat Keluarga Baru
                            </button>
                        </div>
                    </div>
                )}

                {/* ===== CHILD LOGIN ===== */}
                {mode === 'child' && (
                    <form onSubmit={handleChildLogin} className="flex flex-col gap-4">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-2">
                            <p className="text-sm text-green-800 font-semibold text-center">
                                💡 Tanya nama keluarga ke Ayah/Ibu ya!
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                👨‍👩‍👧 Nama Keluarga
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: Keluarga Budi"
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-xl font-bold focus:border-green-500 focus:outline-none transition-colors"
                                value={familyName}
                                onChange={(e) => setFamilyName(e.target.value)}
                                maxLength={20}
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => switchMode('select')}
                                className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
                            >
                                ← Kembali
                            </button>
                            <button
                                type="submit"
                                disabled={isJoining || familyName.trim().length < 3}
                                className={`flex-1 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${isJoining || familyName.trim().length < 3
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-400 to-emerald-500 hover:scale-105'
                                    }`}
                            >
                                {isJoining ? 'Masuk...' : '🚀 Masuk'}
                            </button>
                        </div>
                    </form>
                )}

                {/* ===== PARENT LOGIN ===== */}
                {mode === 'parent' && (
                    <form onSubmit={handleParentLogin} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                👨‍👩‍👧 Nama Keluarga
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: Keluarga Budi"
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-xl font-bold focus:border-game-purple focus:outline-none transition-colors"
                                value={familyName}
                                onChange={(e) => setFamilyName(e.target.value)}
                                maxLength={20}
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                🔐 PIN Keluarga (6 digit)
                            </label>
                            <input
                                type="password"
                                inputMode="numeric"
                                placeholder="••••••"
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-widest focus:border-game-purple focus:outline-none transition-colors"
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => switchMode('select')}
                                className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
                            >
                                ← Kembali
                            </button>
                            <button
                                type="submit"
                                disabled={isJoining || familyName.trim().length < 3 || pin.length !== 6}
                                className={`flex-1 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${isJoining || familyName.trim().length < 3 || pin.length !== 6
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-gradient-purple-pink shadow-glow-purple hover:scale-105'
                                    }`}
                            >
                                {isJoining ? 'Masuk...' : '🚀 Masuk'}
                            </button>
                        </div>
                        {/* Lupa PIN link */}
                        <div className="text-center mt-2">
                            <button
                                type="button"
                                onClick={() => switchMode('reset')}
                                className="text-red-500 font-bold text-sm hover:underline"
                            >
                                🔑 Lupa PIN?
                            </button>
                        </div>
                    </form>
                )}

                {/* ===== RESET PIN ===== */}
                {mode === 'reset' && (
                    <form onSubmit={handleResetPin} className="flex flex-col gap-4">
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-2">
                            <p className="text-sm text-orange-800 font-semibold text-center">
                                🔑 Reset PIN dengan kata rahasia
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                👨‍👩‍👧 Nama Keluarga
                            </label>
                            <input
                                type="text"
                                placeholder="Nama keluarga kamu"
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-xl font-bold focus:border-orange-500 focus:outline-none transition-colors"
                                value={resetFamilyName}
                                onChange={(e) => setResetFamilyName(e.target.value)}
                                maxLength={20}
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                🤫 Kata Rahasia
                            </label>
                            <input
                                type="text"
                                placeholder="Kata rahasia saat buat keluarga"
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-lg font-bold focus:border-orange-500 focus:outline-none transition-colors"
                                value={resetSecretWord}
                                onChange={(e) => setResetSecretWord(e.target.value)}
                                maxLength={30}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                🔐 PIN Baru (6 digit)
                            </label>
                            <input
                                type="password"
                                inputMode="numeric"
                                placeholder="••••••"
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-widest focus:border-orange-500 focus:outline-none transition-colors"
                                value={resetNewPin}
                                onChange={(e) => setResetNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                ✅ Konfirmasi PIN Baru
                            </label>
                            <input
                                type="password"
                                inputMode="numeric"
                                placeholder="••••••"
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-widest focus:border-orange-500 focus:outline-none transition-colors"
                                value={resetConfirmPin}
                                onChange={(e) => setResetConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                            />
                        </div>
                        {resetNewPin && resetConfirmPin && resetNewPin !== resetConfirmPin && (
                            <div className="text-red-500 text-sm font-bold text-center">
                                ⚠️ PIN tidak sama!
                            </div>
                        )}
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => switchMode('parent')}
                                className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
                            >
                                ← Kembali
                            </button>
                            <button
                                type="submit"
                                disabled={isJoining || resetFamilyName.trim().length < 3 || resetSecretWord.trim().length < 2 || resetNewPin.length !== 6 || resetConfirmPin.length !== 6 || resetNewPin !== resetConfirmPin}
                                className={`flex-1 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${isJoining || resetFamilyName.trim().length < 3 || resetSecretWord.trim().length < 2 || resetNewPin.length !== 6 || resetConfirmPin.length !== 6 || resetNewPin !== resetConfirmPin
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-orange-400 to-red-500 hover:scale-105'
                                    }`}
                            >
                                {isJoining ? 'Menyimpan...' : '🔐 Reset PIN'}
                            </button>
                        </div>
                    </form>
                )}

                {/* ===== CREATE FAMILY ===== */}
                {mode === 'create' && (
                    <form onSubmit={handleCreateFamily} className="flex flex-col gap-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-2">
                            <p className="text-sm text-blue-800 font-semibold text-center">
                                💡 Buat keluarga baru dengan nama, PIN, dan kata rahasia
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                👨‍👩‍👧 Nama Keluarga
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: Keluarga Budi"
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-xl font-bold focus:border-game-purple focus:outline-none transition-colors"
                                value={newFamilyName}
                                onChange={(e) => setNewFamilyName(e.target.value)}
                                maxLength={20}
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                🔐 Buat PIN (6 digit angka)
                            </label>
                            <input
                                type="password"
                                inputMode="numeric"
                                placeholder="••••••"
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-widest focus:border-game-purple focus:outline-none transition-colors"
                                value={newFamilyPin}
                                onChange={(e) => setNewFamilyPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                ✅ Konfirmasi PIN
                            </label>
                            <input
                                type="password"
                                inputMode="numeric"
                                placeholder="••••••"
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-widest focus:border-game-purple focus:outline-none transition-colors"
                                value={confirmPin}
                                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                            />
                        </div>
                        {newFamilyPin && confirmPin && newFamilyPin !== confirmPin && (
                            <div className="text-red-500 text-sm font-bold text-center">
                                ⚠️ PIN tidak sama!
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                🤫 Kata Rahasia (untuk reset PIN)
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: nama hewan peliharaan"
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-lg font-bold focus:border-game-purple focus:outline-none transition-colors"
                                value={secretWord}
                                onChange={(e) => setSecretWord(e.target.value)}
                                maxLength={30}
                            />
                            <p className="text-xs text-gray-500 mt-1 text-center">
                                Simpan kata ini untuk reset PIN jika lupa!
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => switchMode('parent')}
                                className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
                            >
                                ← Kembali
                            </button>
                            <button
                                type="submit"
                                disabled={isJoining || newFamilyName.trim().length < 3 || newFamilyPin.length !== 6 || confirmPin.length !== 6 || newFamilyPin !== confirmPin || secretWord.trim().length < 2}
                                className={`flex-1 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${isJoining || newFamilyName.trim().length < 3 || newFamilyPin.length !== 6 || confirmPin.length !== 6 || newFamilyPin !== confirmPin || secretWord.trim().length < 2
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-gradient-purple-pink shadow-glow-purple hover:scale-105'
                                    }`}
                            >
                                {isJoining ? 'Membuat...' : '✨ Buat'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Footer */}
            <div className="mt-6 text-white/80 text-center text-sm max-w-sm">
                {mode === 'select' && (
                    <p>Pilih siapa yang mau masuk ke aplikasi</p>
                )}
                {mode === 'child' && (
                    <p>Anak cukup ketik nama keluarga saja tanpa PIN</p>
                )}
                {mode === 'parent' && (
                    <p>Orang tua perlu nama keluarga dan PIN untuk akses penuh</p>
                )}
                {mode === 'create' && (
                    <p>Simpan kata rahasia untuk reset PIN jika lupa!</p>
                )}
                {mode === 'reset' && (
                    <p>Gunakan kata rahasia yang dibuat saat daftar</p>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
