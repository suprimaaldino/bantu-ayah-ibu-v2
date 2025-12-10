import React, { useState } from 'react';
import useSound from '../hooks/useSound';

const LoginPage = ({ onCreateFamily, onJoinFamily, isJoining, error }) => {
    const [mode, setMode] = useState('join'); // 'join' | 'create'
    const [step, setStep] = useState('name'); // 'name' | 'pin' (for join mode)
    const [familyName, setFamilyName] = useState("");
    const [pin, setPin] = useState("");
    const [newFamilyName, setNewFamilyName] = useState("");
    const [newFamilyPin, setNewFamilyPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const { playSound } = useSound();

    const handleJoinName = (e) => {
        e.preventDefault();
        if (familyName.trim().length < 3) return;
        playSound('click');
        setStep('pin');
    };

    const handleJoinWithPin = (e) => {
        e.preventDefault();
        if (pin.length !== 6) return;
        playSound('click');
        onJoinFamily(familyName, pin);
    };

    const handleCreateFamily = (e) => {
        e.preventDefault();
        if (newFamilyName.trim().length < 3) return;
        if (newFamilyPin.length !== 6 || confirmPin.length !== 6) return;
        if (newFamilyPin !== confirmPin) {
            playSound('error');
            return;
        }
        playSound('click');
        onCreateFamily(newFamilyName, newFamilyPin);
    };

    const resetForm = () => {
        setStep('name');
        setFamilyName('');
        setPin('');
        setNewFamilyName('');
        setNewFamilyPin('');
        setConfirmPin('');
    };

    const switchMode = (newMode) => {
        playSound('click');
        setMode(newMode);
        resetForm();
    };

    return (
        <div className="min-h-screen bg-gradient-game flex flex-col items-center justify-center p-4">
            {/* Logo / Header */}
            <div className="text-center mb-10 animate-fade-in-up">
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

                {/* Mode Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => switchMode('join')}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'join'
                            ? 'bg-gradient-purple-pink text-white shadow-md'
                            : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        🔑 Masuk Keluarga
                    </button>
                    <button
                        onClick={() => switchMode('create')}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'create'
                            ? 'bg-gradient-purple-pink text-white shadow-md'
                            : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        ➕ Buat Baru
                    </button>
                </div>

                {/* Join Family Flow */}
                {mode === 'join' && (
                    <>
                        {step === 'name' ? (
                            <form onSubmit={handleJoinName} className="flex flex-col gap-4">
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
                                <button
                                    type="submit"
                                    disabled={isJoining || familyName.trim().length < 3}
                                    className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${isJoining || familyName.trim().length < 3
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-gradient-purple-pink shadow-glow-purple hover:scale-105'
                                        }`}
                                >
                                    Lanjut →
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleJoinWithPin} className="flex flex-col gap-4">
                                <div className="text-center mb-2">
                                    <div className="text-sm text-gray-500">Nama Keluarga</div>
                                    <div className="text-2xl font-bold text-purple-600">
                                        {familyName}
                                    </div>
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
                                        autoFocus
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => { setStep('name'); setPin(''); }}
                                        className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
                                    >
                                        ← Kembali
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isJoining || pin.length !== 6}
                                        className={`flex-1 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${isJoining || pin.length !== 6
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-gradient-purple-pink shadow-glow-purple hover:scale-105'
                                            }`}
                                    >
                                        {isJoining ? 'Masuk...' : '🚀 Masuk'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </>
                )}

                {/* Create Family Flow */}
                {mode === 'create' && (
                    <form onSubmit={handleCreateFamily} className="flex flex-col gap-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-2">
                            <p className="text-sm text-blue-800 font-semibold">
                                💡 Buat keluarga baru dengan nama dan PIN
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
                        <button
                            type="submit"
                            disabled={isJoining || newFamilyName.trim().length < 3 || newFamilyPin.length !== 6 || confirmPin.length !== 6 || newFamilyPin !== confirmPin}
                            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${isJoining || newFamilyName.trim().length < 3 || newFamilyPin.length !== 6 || confirmPin.length !== 6 || newFamilyPin !== confirmPin
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-gradient-purple-pink shadow-glow-purple hover:scale-105'
                                }`}
                        >
                            {isJoining ? 'Membuat...' : '✨ Buat Keluarga'}
                        </button>
                    </form>
                )}
            </div>

            {/* Footer Instructions */}
            <div className="mt-8 text-white/80 text-center text-sm max-w-sm">
                <p>Gunakan nama keluarga dan PIN yang sama untuk semua HP (Ayah, Ibu, & Anak) agar data terhubung.</p>
            </div>
        </div>
    );
};

export default LoginPage;
