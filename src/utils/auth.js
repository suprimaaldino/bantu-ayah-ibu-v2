// src/utils/auth.js
import { getFromStorage, saveToStorage } from "./storage.js";

const DEFAULT_PIN = "010390"; // Default PIN for parents

const verifyPin = (inputPin) => {
  const savedPin = getFromStorage("parentPin", DEFAULT_PIN);
  return inputPin === savedPin;
};

const setParentPin = (newPin) => {
  saveToStorage("parentPin", newPin);
};

export { verifyPin, setParentPin, DEFAULT_PIN };