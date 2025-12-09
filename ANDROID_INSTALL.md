# 📱 Panduan Install di Android

Aplikasi ini adalah **PWA (Progressive Web App)**, artinya bisa diinstall langsung melalui browser tanpa perlu masuk Play Store.

## Cara 1: Test Lokal (Sekarang Juga)
Gunakan cara ini jika kamu ingin mencoba install saat develop, hp dan laptop harus konek ke **WiFi yang sama**.

1.  Di terminal VS Code, matikan server yang jalan (Ctrl+C), lalu jalankan perintah baru:
    ```bash
    npm run dev:host
    ```
2.  Lihat di terminal, akan muncul alamat IP, contoh:
    ```
      ➜  Local:   http://localhost:5173/
      ➜  Network: http://192.168.1.5:5173/  <-- PENTING
    ```
3.  Buka Chrome di HP Android kamu.
4.  Ketik alamat **Network** tersebut persis (contoh: `http://192.168.1.5:5173`).
5.  Tunggu loading selesai.
6.  Klik tombol **"Install"** yang muncul di layar, atau:
    *   Klik menu titik tiga **(⋮)** di pojok kanan atas.
    *   Pilih **"Install App"** atau **"Tambahkan ke Layar Utama"**.

## Cara 2: Production (Untuk Penggunaan Harian)
Cara ini dipakai setelah aplikasi selesai dan siap dipakai Ayah & Ibu sehari-hari.

1.  **Deploy ke Vercel** (Upload kode ke GitHub, lalu connect ke Vercel).
2.  Dapatkan link URL (contoh: `https://bantu-ayah-ibu.vercel.app`).
3.  Buka link tersebut di Chrome Android.
4.  Lakukan instalasi seperti Cara 1.

## Kelebihan PWA
*   ✅ **Offline Mode**: Bisa dibuka meski tidak ada internet (setelah install).
*   ✅ **Full Screen**: Tampilan seperti aplikasi native.
*   ✅ **Ringan**: Tidak memakan banyak memori HP.
