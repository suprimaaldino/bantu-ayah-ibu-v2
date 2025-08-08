import React, { useState } from 'react';
import { useName } from '../context/NameContext';
import Header from '../components/Header';

const ProfilePage = () => {
  const { name, setName } = useName();
  const [tempName, setTempName] = useState(name);
  const [showModal, setShowModal] = useState(false);

  const handleSave = () => {
    setName(tempName);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      <div className="p-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
        >
          Ganti Nama
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 animate-scale-in">
            <h2 className="text-lg font-semibold mb-4">Ganti Nama</h2>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="border w-full p-2 rounded-lg mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
