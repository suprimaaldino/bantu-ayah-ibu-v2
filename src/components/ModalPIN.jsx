// src/components/ModalPIN.jsx
import React, { useState } from "react";

const ModalPIN = ({ isOpen, onClose, onConfirm, title, description }) => {
  const [pin, setPin] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(pin);
    setPin("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-scale-in">
        <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">{title}</h3>
        <p className="text-gray-600 text-sm text-center mb-4">{description}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              inputMode="numeric"
              maxLength="6"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Masukkan PIN"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center text-xl font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />

          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Konfirmasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalPIN;