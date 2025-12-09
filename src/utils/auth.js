export const getParentPin = () => {
  return localStorage.getItem("parentPin") || import.meta.env.VITE_PARENT_PIN || "010390";
};

export const verifyPin = (inputPin) => {
  return inputPin === getParentPin();
};

export const setParentPin = (newPin) => {
  localStorage.setItem("parentPin", newPin);
};