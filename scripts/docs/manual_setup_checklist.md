# Manual Setup Checklist

Agar sistem berfungsi sempurna, pastikan Anda telah melakukan langkah berikut di dashboard Supabase:

## 1. Storage Buckets 🗂️
Buat 2 bucket baru di menu **Storage**:
1.  **Name:** `payment-proofs`
    *   **Public:** Yes (agar admin bisa melihat gambar).
    *   **RLS Policy:**
        *   INSERT: Allow authenticated users.
        *   SELECT: Allow public/authenticated.
2.  **Name:** `avatars`
    *   **Public:** Yes.
    *   **RLS Policy:**
        *   INSERT: Allow authenticated users.
        *   SELECT: Allow public/authenticated.

## 2. SQL Updates 🛠️
Jalankan script update paket jika belum pernah dijalankan (lihat `supabase_setup_guide.md`).

## 3. Testing Flow 🧪
1.  **User Asli:** Login -> Pilih Paket -> Checkout -> Lihat Order Detail -> Upload Bukti Bayar.
2.  **Admin:** Login (pastikan role 'admin' di table `profiles`) -> Buka Admin Dashboard -> Buka Order -> Check Bukti -> Klik "Terima Pembayaran".
## 4. Phase 4 Setup (Leads & Contact) 📞
Untuk mengaktifkan fitur Contact Form:
1.  Buka file `phase4_setup.sql` yang baru dibuat.
2.  Copy isinya.
3.  Paste di Supabase SQL Editor dan Run.
4.  **Test:** Isi form di Landing Page -> Cek `/admin/leads`.

## 5. Phase 5 Setup (Projects) 🎬
1.  Buka file `phase5_setup.sql`.
2.  Run di SQL Editor Supabase.
3.  **Storage:** Buat bucket baru `project-files` (Public: Yes).
4.  **Test:** Ubah status order jadi `processing` -> Cek `/dashboard/projects`.

## ⚠️ Troubleshooting: Admin Data Kosong
Jika dashboard Admin kosong (0 orders) padahal ada pesanan:
1.  Buka file `fix_admin_rls.sql`.
2.  Run di SQL Editor.
3.  Ini akan mengizinkan Role 'admin' melihat semua data.
