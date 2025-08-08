import React, { createContext, useContext, useState } from 'react';

const NameContext = createContext();

export const NameProvider = ({ children }) => {
  const [name, setName] = useState('Anak Hebat');

  return (
    <NameContext.Provider value={{ name, setName }}>
      {children}
    </NameContext.Provider>
  );
};

export const useName = () => useContext(NameContext);
