export const getParentPin = () => {
  return localStorage.getItem("parentPin") || "010390";
};

export const verifyPin = (inputPin) => {
  return inputPin === getParentPin();
};

export const setParentPin = (newPin) => {
  localStorage.setItem("parentPin", newPin);
};