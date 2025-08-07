// src/components/ToastMessage.jsx
import React, { useEffect } from "react";

const ToastMessage = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const icon = type === "success" ? "🎉" : "⚠️";

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`${bgColor} text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 animate-fade-in`}
      >
        <span>{icon}</span>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default ToastMessage;