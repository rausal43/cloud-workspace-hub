# 🚀 Google Cloud Project Hub

> **Enterprise Project Management Platform built on the Google Cloud Ecosystem**  
> Integrated with **Google Firebase (Cloud Firestore & Auth)**, **Google Drive API**, and **Google Calendar**.

![License MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg)
![Vite 6](https://img.shields.io/badge/Vite-6.0-646cff.svg)
![Firebase 11](https://img.shields.io/badge/Firebase-11.2-ffca28.svg)

---

## 📌 Gambaran Umum (Overview)

**Google Cloud Project Hub** adalah aplikasi web manajemen proyek enterprise yang dirancang khusus dalam ekosistem **Google Cloud Platform**. Aplikasi ini mengintegrasikan seluruh fitur pengelolaan proyek—mulai dari papan tugas Kanban, diskusi terarah, obrolan tim langsung, kalender milestone, pengumpulan berkas Google Drive, hingga *standup report* harian otomatis.

Aplikasi ini dilengkapi dengan **Global Master Dashboard** untuk memantau kalender gabungan dan laporan harian dari **seluruh proyek** dalam satu halaman terpadu.

---

## ✨ Fitur Utama (Core Features)

### 🌐 1. Global Master Dashboard (Lintas Proyek)
- **Kalender Master Terpadu**: Menggabungkan seluruh agenda, rapat, dan milestone dari **semua proyek** dalam satu tampilan kalender master dengan **Badge Tag Proyek**.
- **Standup Otomatis Lintas Proyek**: Feed terpadu yang menampilkan seluruh respon laporan status harian dari seluruh proyek tim.
- **Filter Proyek Global**: Menyaring data gabungan berdasarkan proyek tertentu secara fleksibel.

### 📢 2. Diskusi & Pengumuman (Message Board)
- **Utas Diskusi Terarah**: Buat pengumuman resmi dan ide inovasi tim.
- **Manajemen Kategori CRUD**: Tambah, edit, dan hapus kategori diskusi secara dinamis.
- **Penyematan & Komentar**: Sematkan (*pin*) postingan penting dan diskusikan topik melalui kolom komentar.

### ✅ 3. Manajemen Tugas (Task Manager & Kanban)
- **Modul Kanban Interaktif**: Tampilan *List View* dan *Kanban View* interaktif.
- **Efek Selebrasi Confetti**: Animasi konfeti saat tugas diselesaikan.
- **Statistik Progres**: Bar indikator persentase penyelesaian tugas secara *real-time*.

### 💬 4. Obrolan Tim (Realtime Chat)
- **Saluran Chat CRUD**: Buat saluran obrolan kustom (misal: `#frontend-dev`, `#ui-ux`), edit nama/deskripsi saluran, dan hapus saluran.
- **Firestore Realtime Listener**: Komunikasi tim langsung tanpa perlu *refresh* halaman.

### 📅 5. Kalender & Milestone (Schedule Calendar)
- **Ceklis Penyelesaian Agenda**: Tandai agenda yang sudah selesai dengan centang interaktif dan efek visual *strikethrough*.
- **Toggle Sembunyikan Agenda Selesai**: Tombol filter untuk menyembunyikan/menampilkan kembali agenda yang telah selesai.
- **Palet Warna Line Card**: Pilih warna aksen kartu agenda (Google Blue, Green, Yellow, Red, Purple, Cyan, Custom Color).
- **Google Calendar Sync**: Indikator sinkronisasi otomatis dengan Google Calendar API.

### 📁 6. Google Drive & Berkas (Drive & Storage Browser)
- **Pengunggah Berkas Lokal**: Pilihan berkas fisik (`<input type="file">`) dan area *Drag & Drop*.
- **Preview & Pratinjau**: Pratinjau gambar, PDF, spreadsheet, dan dokumen.
- **Google Storage Integration**: Terhubung langsung ke Google Drive API & Firebase Cloud Storage.

### ❓ 7. Standup Otomatis (Automated Check-ins)
- **Pertanyaan Rutin Otomatis**: Pengumpulan status kerja harian otomatis (misal: *"Apa yang kamu kerjakan hari ini?"*).
- **Timeline Laporan**: Riwayat respon dan kendala anggota tim secara kronologis.

### 🔑 8. Otentikasi Account & Google OAuth (`LoginModal`)
- **Google Sign-In**: Login menggunakan akun Google Workspace via Firebase Auth.
- **Profil User Bar**: Menampilkan foto profil, email Gmail, dan *Role Badge* di navbar atas dengan opsi Sign Out.

### 🛡️ 9. Sistem Peran Dinamis & Batasan Hak Akses (Custom RBAC)
- **Pembuatan Peran Kustom**: Buat peran tim kustom (misal: *DevOps Engineer*, *Product Owner*, *Client Stakeholder*).
- **Matriks Hak Akses (Permissions Boundaries)**:
  - `[x]` *Can Edit Content* (Tambah & edit diskusi, tugas, file, event).
  - `[x]` *Can Delete Content* (Hapus item).
  - `[x]` *Can Invite Team* (Undang tim via Gmail & kelola peran).
  - `[x]` *Can Manage Project* (Akses admin proyek).
- **Undangan Gmail**: Form pengiriman undangan anggota tim via alamat email Gmail.

---

## 🛠️ Arsitektur & Teknologi (Tech Stack)

| Komponen | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + Vite 6 | Aplikasi SPA super cepat & ringan |
| **Backend & Storage** | Google Firebase 11 | Cloud Firestore, Firebase Auth, Cloud Storage |
| **Google APIs** | Google Drive & Calendar API | Sinkronisasi dokumen & kalender |
| **Icons & Design** | Lucide React + Vanilla CSS | Design system kustom berstandar Google Cloud |
| **Interactive UI** | Canvas Confetti | Animasi mikro selebrasi interaktif |

---

## 📋 Persyaratan Sistem (Prerequisites)

Sebelum menjalankan proyek ini, pastikan sistem Anda telah terinstall:
- **Node.js**: Versi `>= 18.0.0`
- **npm**: Versi `>= 9.0.0`

---

## 🚀 Panduan Instalasi & Penggunaan (Quick Start)

### 1. Clone Repository
```bash
git clone https://github.com/username/google-cloud-project-hub.git
cd google-cloud-project-hub
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables (Opsional untuk Database Live)
Buat file `.env.production` atau `.env.local` di root direktori:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka browser Anda di `http://localhost:5173/` (atau port aktif yang ditampilkan).

### 5. Build untuk Produksi
```bash
npm run build
```
Hasil build akan tersimpan di folder `dist/` dan siap dideploy.

---

## 📂 Struktur Direktori Proyek

```text
google-cloud-project-hub/
├── public/                  # Assets publik
├── src/
│   ├── components/          # Komponen React UI
│   │   ├── Navbar.jsx               # Top navigation & user profile
│   │   ├── GlobalDashboard.jsx      # Unified master calendar & global standups
│   │   ├── ProjectDashboard.jsx     # Overview ringkasan proyek & module tiles
│   │   ├── MessageBoard.jsx         # Diskusi, pengumuman & category CRUD
│   │   ├── TodoList.jsx             # Task manager, kanban & confetti
│   │   ├── CampfireChat.jsx         # Realtime team chat & channel CRUD
│   │   ├── ScheduleCalendar.jsx     # Kalender, line color & checklist toggle
│   │   ├── DocsAndFiles.jsx         # Drive upload & file browser
│   │   ├── AutomaticCheckins.jsx    # Standup harian otomatis
│   │   ├── LoginModal.jsx           # Firebase Google OAuth login modal
│   │   ├── TeamManagerModal.jsx     # Gmail invite & team CRUD
│   │   ├── RoleManagerModal.jsx     # Custom roles & permission boundaries
│   │   └── FirebaseSettingsModal.jsx# Database configuration modal
│   ├── data/
│   │   └── mockData.js      # Data templat awal
│   ├── firebase.js          # Konfigurasi Google Firebase SDK
│   ├── index.css            # Design system CSS tokens & media queries
│   ├── App.jsx              # Main App Controller & State Provider
│   └── main.jsx             # Entry point React DOM
├── index.html               # Main HTML template
├── package.json             # Project dependencies & scripts
├── vite.config.js           # Vite configuration
└── README.md                # Dokumentasi lengkap proyek
```

---

## 🌐 Panduan Deployment (Deploy to Production)

Anda dapat mendeploy aplikasi ini secara gratis menggunakan platform berikut:

### Deploy ke Vercel:
```bash
npx vercel
```

### Deploy ke Cloudflare Pages:
```bash
npx wrangler pages deploy dist
```

### Deploy ke Firebase Hosting:
```bash
npx firebase login
npx firebase init hosting
npx firebase deploy
```

---

## 📜 Lisensi (License)

Hak Cipta © 2026. Didistribusikan di bawah Lisensi **MIT**. Bebas untuk digunakan dan dikembangkan.
