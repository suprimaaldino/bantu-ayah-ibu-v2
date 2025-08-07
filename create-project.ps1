# create-project.ps1
# PowerShell script untuk membuat struktur proyek React "Misi Harian Membantu Ayah dan Ibu"
# DIPERBAIKI: Menghindari kesalahan Join-Path

$src = "src"

# Buat folder src dan subfolder
New-Item -ItemType Directory -Path $src -Force | Out-Null

$folders = @(
    "components",
    "pages",
    "data",
    "utils",
    "styles"
)

foreach ($folder in $folders) {
    $path = Join-Path $src $folder
    New-Item -ItemType Directory -Path $path -Force | Out-Null
}

# Fungsi untuk membuat file dengan konten
function New-FileWithContent {
    param(
        [string]$Path,
        [string]$Content = $null
    )
    $dir = Split-Path $Path -Parent
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    Set-Content -Path $Path -Value $Content -Force
}

# --- Buat file-file dengan konten dasar ---

# Data: missions.js
New-FileWithContent -Path "src/data/missions.js" -Content @"
// Daftar misi harian anak
export const missions = [
  { id: 1, name: "Merapikan tempat tidur", difficulty: "mudah", coins: 5 },
  { id: 2, name: "Menyapu lantai rumah", difficulty: "sedang", coins: 10 },
  { id: 3, name: "Menaruh piring kotor ke dapur", difficulty: "mudah", coins: 4 },
  { id: 4, name: "Membantu menyiapkan meja makan", difficulty: "mudah", coins: 6 },
  { id: 5, name: "Menyiram tanaman di halaman", difficulty: "sedang", coins: 10 },
  { id: 6, name: "Melipat baju yang sudah kering", difficulty: "sedang", coins: 12 },
  { id: 7, name: "Membuang sampah", difficulty: "sedang", coins: 8 },
  { id: 8, name: "Membantu mengepel lantai", difficulty: "sulit", coins: 15 },
  { id: 9, name: "Menemani adik bermain", difficulty: "mudah", coins: 5 },
  { id: 10, name: "Menyortir mainan dan buku", difficulty: "sedang", coins: 9 },
];
"@

# Data: rewards.js
New-FileWithContent -Path "src/data/rewards.js" -Content @"
// Daftar hadiah yang bisa ditukar
export const rewards = [
  { id: 1, name: "Permen", price: 10 },
  { id: 2, name: "Mainan kecil", price: 20 },
  { id: 3, name: "Waktu bermain ekstra", price: 30 },
  { id: 4, name: "Nonton kartun", price: 25 },
  { id: 5, name: "Jajan kesukaan", price: 40 },
];
"@

# Utils: storage.js
New-FileWithContent -Path "src/utils/storage.js" -Content @"
// Simpan dan baca data dari localStorage
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Gagal menyimpan ke localStorage", error);
  }
};

export const getFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Gagal membaca dari localStorage", error);
    return defaultValue;
  }
};
"@

# Utils: auth.js
New-FileWithContent -Path "src/utils/auth.js" -Content @"
// Verifikasi PIN orang tua
const DEFAULT_PIN = "1234";

export const verifyPin = (inputPin) => {
  const savedPin = localStorage.getItem("parentPin") || DEFAULT_PIN;
  return inputPin === savedPin;
};

export const setParentPin = (newPin) => {
  localStorage.setItem("parentPin", newPin);
};
"@

# Components
New-FileWithContent -Path "src/components/MissionCard.jsx" -Content "const MissionCard = ({ mission, onClaim }) => { return <div>Misi: {mission.name}</div>; }; export default MissionCard;"
New-FileWithContent -Path "src/components/RewardCard.jsx" -Content "const RewardCard = ({ reward, onRedeem, coins }) => { return <div>Hadiah: {reward.name}</div>; }; export default RewardCard;"
New-FileWithContent -Path "src/components/ModalPIN.jsx" -Content "const ModalPIN = ({ isOpen, onClose, onConfirm, title, description }) => { return isOpen ? <div>Modal PIN</div> : null; }; export default ModalPIN;"
New-FileWithContent -Path "src/components/ToastMessage.jsx" -Content "const ToastMessage = ({ message, type, onClose }) => { return message ? <div>{message}</div> : null; }; export default ToastMessage;"

# Pages
New-FileWithContent -Path "src/pages/MissionsPage.jsx" -Content "const MissionsPage = ({ missions, onClaimMission, coins }) => { return <div>Daftar Misi</div>; }; export default MissionsPage;"
New-FileWithContent -Path "src/pages/RewardsPage.jsx" -Content "const RewardsPage = ({ rewards, coins, onRedeemReward }) => { return <div>Daftar Hadiah</div>; }; export default RewardsPage;"
New-FileWithContent -Path "src/pages/ProfilePage.jsx" -Content "const ProfilePage = ({ coins, completedMissions, streak, onSetPin }) => { return <div>Profil Anak</div>; }; export default ProfilePage;"

# Styles
New-FileWithContent -Path "src/styles/globals.css" -Content @"
/* Animasi global */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.3s ease-out; }
"@

# Root files
New-FileWithContent -Path "src/App.jsx" -Content "<div>Aplikasi Misi Harian</div>"
New-FileWithContent -Path "src/main.jsx" -Content "import React from 'react'; import ReactDOM from 'react-dom/client'; import App from './App'; const root = ReactDOM.createRoot(document.getElementById('root')); root.render(<App />);"

# Buat public/ jika belum ada
if (!(Test-Path "public")) {
    New-Item -ItemType Directory -Path "public" -Force | Out-Null
}
New-FileWithContent -Path "public/index.html" -Content @"
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Misi Harian Membantu Ayah dan Ibu</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
"@

Write-Host "✅ Struktur proyek berhasil dibuat di folder saat ini!" -ForegroundColor Green
Write-Host "📁 Path: $PWD" -ForegroundColor Yellow