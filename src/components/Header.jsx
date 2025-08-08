import React from 'react';
import { useName } from '../context/NameContext';

const Header = ({ coins }) => {
  const { name } = useName();

  return (
    <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-purple-400 to-blue-400 text-white shadow-md">
      <h1 className="text-lg font-bold">
        Halo, <span className="font-bold">{name || "Anak Baik"}</span>! 👋
      </h1>
      {coins !== undefined && (
        <div className="bg-yellow-300 text-black px-3 py-1 rounded-full font-semibold">
          💰 {coins}
        </div>
      )}
    </div>
  );
};

export default Header;