import React, { useState } from 'react';

const ModalPIN = ({ isOpen, onClose, onConfirm, title, description }) => {
  const [pin, setPin] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    onConfirm(pin);
    setPin("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg max-w-sm w-full mx-4 text-center animate-fade-in">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onKeyPress={handleKeyPress}
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
          placeholder="••••••"
          maxLength={6}
          autoFocus
        />
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 active:scale-95 transition-all"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={pin.length === 0}
            className="flex-1 bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-95 transition-all"
          >
            Konfirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPIN;