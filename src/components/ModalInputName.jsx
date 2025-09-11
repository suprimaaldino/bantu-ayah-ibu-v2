import React, { useState, useEffect, useCallback } from "react";
import { useName } from "../context/NameContext";

const ModalInputName = ({ onSave, defaultValue = "" }) => {
  const { setName } = useName();
  const [name, setLocalName] = useState(defaultValue);

  useEffect(() => {
    setLocalName(defaultValue);
  }, [defaultValue]);

  const handleSave = useCallback(() => {
    const trimmed = name.trim();
    if (trimmed !== "") {
      setName(trimmed);
      onSave(trimmed);
    }
  }, [name, setName, onSave]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSave();
      }
    },
    [handleSave]
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl p-6 shadow-lg max-w-sm w-full mx-4 text-center animate-fade-in">
        <div className="text-4xl mb-4">🌟</div>
        <h2 className="text-xl font-bold mb-4">Halo Anak Baik!</h2>
        <p className="text-gray-600 mb-4">Siapa nama kamu?</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setLocalName(e.target.value)}
          onKeyPress={handleKeyPress}
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
          placeholder="Namaku..."
          autoFocus
        />
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-95 transition-transform"
        >
          Simpan
        </button>
      </div>
    </div>
  );
};

export default ModalInputName;
