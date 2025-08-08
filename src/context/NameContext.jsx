import React, { createContext, useContext, useState, useEffect } from 'react';

const NameContext = createContext();

export const NameProvider = ({ children }) => {
  const [name, setNameState] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    const savedName = localStorage.getItem("childName") || "";
    setNameState(savedName);
    setIsLoading(false);
  }, []);

  const setName = (newName) => {
    setNameState(newName);
    localStorage.setItem("childName", newName);
  };

  return (
    <NameContext.Provider value={{ name, setName, isLoading }}>
      {children}
    </NameContext.Provider>
  );
};

export const useName = () => {
  const context = useContext(NameContext);
  if (!context) {
    throw new Error("useName must be used within NameProvider");
  }
  return context;
};