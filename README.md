# Portal Resmi Kelurahan Kakaskasen Dua 🍃

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Neon Postgres](https://img.shields.io/badge/Neon_Postgres-00E599?style=for-the-badge&logo=postgresql&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

Website resmi untuk **Kelurahan Kakaskasen Dua**, Kecamatan Tomohon Utara, Kota Tomohon. Dibangun dengan antarmuka yang modern, responsif, dan elegan untuk melayani masyarakat, menyebarkan informasi publik, menampilkan daya tarik wisata, serta memfasilitasi pelaporan warga secara digital.

---

## 🌟 Fitur Utama

- **Desain Modern & Responsif**: Tampilan UI/UX yang bersih (clean), elegan, dan berjalan optimal di semua perangkat (HP, Tablet, PC).
- **Dashboard Admin Terpadu**: Panel khusus untuk staf kelurahan dalam mengelola website.
- **Sistem Pengumuman Dinamis**: Publikasi informasi resmi yang bisa disematkan (*pinned*) oleh admin.
- **Layanan Pelaporan Warga**: Formulir pengaduan masyarakat yang terhubung langsung ke database dan dapat dipantau oleh admin.
- **Galeri Dokumentasi**: Album foto digital untuk mempublikasikan kegiatan kelurahan.
- **Bagan Struktur Organisasi**: Visualisasi susunan aparatur desa yang informatif.

## 🗺️ Struktur Halaman

| Nama Halaman | Route | Deskripsi |
|---|---|---|
| **Beranda** | `/` | Hero section, layanan, preview pengumuman, fitur unggulan |
| **Profil** | `/profil` | Sejarah, visi misi, data kelurahan, demografi |
| **Struktur** | `/struktur` | Bagan hierarki perangkat kelurahan (Lurah s/d Pala) |
| **Pengumuman** | `/pengumuman` | Daftar lengkap informasi publik dan kegiatan |
| **Wisata** | `/wisata` | Promosi destinasi alam (Gunung Lokon, Mahawu, dll) |
| **Galeri** | `/galeri` | Kumpulan dokumentasi foto kegiatan |
| **Pelaporan** | `/pelaporan` | Formulir pengaduan warga publik |
| **Kontak** | `/kontak` | Alamat, jam buka, dan integrasi peta Google Maps |
| **Admin** | `/admin` | *Protected route* — Mengelola pengumuman, laporan, galeri |

## 🛠️ Teknologi yang Digunakan

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [Neon Serverless PostgreSQL](https://neon.tech/)
- **Authentication**: JWT menggunakan library `jose`
- **Deployment**: Dioptimalkan untuk [Vercel](https://vercel.com)

---

## ⚙️ Persyaratan Sistem

Sebelum menginstal, pastikan Anda telah memiliki:
- **Node.js** versi 18.17 atau yang lebih baru
- Akun **Neon.tech** (untuk database)

## 🚀 Panduan Instalasi Lokal

### 1. Setup Database (Neon)
1. Buat proyek baru gratis di [console.neon.tech](https://console.neon.tech).
2. Salin *Connection String* yang diberikan (berawalan `postgresql://...`).

### 2. Kloning & Install
```bash
git clone https://github.com/username/website-desa-kkt.git
cd website-desa-kkt
npm install
```

### 3. Konfigurasi Environment
Buat file bernama `.env.local` di *root* proyek, lalu isi dengan format berikut:
```env
# Koneksi Database Neon
DATABASE_URL=postgresql://user:password@namaserver.aws.neon.tech/neondb?sslmode=require

# Kunci Rahasia JWT (Ganti dengan kata acak yang panjang)
JWT_SECRET=super-secret-key-kelurahan-kkt-2024
```

### 4. Jalankan Server
```bash
npm run dev
```
Buka browser dan akses **`http://localhost:3000`**.

> **Catatan:** Tabel database (`admin_users`, `pengumuman`, `laporan`, `galeri`) akan **otomatis dibuat** saat website pertama kali diakses!

---

Dari Dashboard Admin, staf kelurahan dapat melakukan fungsi:
1. **Pengumuman**: Menambah, mengedit, menghapus, serta menyematkan (*pin*) berita penting agar muncul di urutan teratas.
2. **Galeri**: Memasukkan URL foto dan deskripsi kegiatan ke dalam galeri publik.
3. **Laporan Warga**: Membaca dan meninjau keluhan atau masukan yang dikirimkan warga.

---

## 🌐 Deployment (Vercel)

Website ini siap di-deploy secara instan menggunakan Vercel:

1. Buat proyek baru di Vercel dan hubungkan repository GitHub Anda.
2. Pada bagian **Environment Variables**, tambahkan `DATABASE_URL` dan `JWT_SECRET` yang sama seperti di lokal.
3. Klik **Deploy**.

---
*Dibuat untuk memajukan digitalisasi layanan masyarakat di Kelurahan Kakaskasen Dua.*