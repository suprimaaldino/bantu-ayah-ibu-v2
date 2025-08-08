import React, { useState, useEffect } from "react";

const ModalInputName = ({ onSave, defaultValue = "" }) => {
  const [name, setName] = useState(defaultValue);

  useEffect(() => {
    setName(defaultValue);
  }, [defaultValue]);

  const handleSave = () => {
    if (name.trim() !== "") {
      localStorage.setItem("childName", name);
      onSave(name);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg max-w-sm w-full text-center">
        <h2 className="text-xl font-bold mb-4">Masukkan Namamu</h2>
        <p className="text-gray-600 mb-4">Nama ini akan muncul di profil kamu</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Namaku..."
        />
        <button
          onClick={handleSave}
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 active:scale-95 transition-all"
        >
          Simpan
        </button>
      </div>
    </div>
  );
};

export default ModalInputName;
