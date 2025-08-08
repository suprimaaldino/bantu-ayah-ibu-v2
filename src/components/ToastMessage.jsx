import React, { useEffect } from 'react';

const ToastMessage = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white font-medium transform transition-all duration-300 ${
      type === "error" ? "bg-red-500" : 
      type === "info" ? "bg-blue-500" : 
      "bg-green-500"
    }`}>
      <div className="flex items-center gap-2">
        <span>
          {type === "error" ? "❌" : 
           type === "info" ? "ℹ️" : 
           "✅"}
        </span>
        <span>{message}</span>
        <button 
          onClick={onClose} 
          className="ml-2 text-white hover:opacity-70 font-bold text-lg"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ToastMessage;