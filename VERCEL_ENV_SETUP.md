# Cara Set Environment Variable di Vercel

Untuk keamanan yang lebih baik, sebaiknya PIN disimpan sebagai environment variable di Vercel, bukan hardcode di code.

## Langkah-langkah:

1. **Buka Vercel Dashboard**
   - Go to: https://vercel.com/dashboard
   - Pilih project "bantu-ayah-ibu-v2"

2. **Masuk ke Settings**
   - Klik tab **Settings**
   - Pilih **Environment Variables** di sidebar

3. **Tambah Variable Baru**
   - Name: `VITE_PARENT_PIN`
   - Value: `010390`
   - Environment: Pilih **Production**, **Preview**, dan **Development**
   - Klik **Save**

4. **Redeploy**
   - Kembali ke tab **Deployments**
   - Klik titik tiga (⋮) di deployment terbaru
   - Pilih **Redeploy**

5. **Hapus Hardcode (Opsional)**
   - Setelah environment variable di-set, bisa ubah default fallback di `auth.js` kembali ke `"000000"` atau string kosong
   - Ini memastikan PIN hanya ada di environment variable, tidak di code

## Catatan:
- Environment variable di Vercel **HARUS** diawali dengan `VITE_` agar bisa diakses di client-side
- Setelah menambah/mengubah env var, **WAJIB redeploy** agar perubahan berlaku
- File `.env` lokal tidak ter-upload ke Vercel (karena di `.gitignore`)
