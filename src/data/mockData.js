// Clean initial mock data without AI slop icons or Basecamp references

export const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    name: 'Google Cloud Platform App Redesign',
    description: 'Modernisasi antarmuka aplikasi manajemen proyek dengan integrasi Firebase & Drive Platform.',
    category: 'Productivity',
    color: '#1a73e8',
    updatedAt: '2 jam lalu',
    members: [
      { name: 'Budi Santoso', role: 'Project Lead', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', email: 'budi.santoso@gmail.com' },
      { name: 'Rian Hidayat', role: 'Developer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', email: 'rian.hidayat@gmail.com' }
    ]
  },
  {
    id: 'proj-2',
    name: 'Integrasi Realtime Messaging Engine',
    description: 'Pengembangan backend Firestore Realtime Listener untuk fitur Obrolan Tim.',
    category: 'Backend Architecture',
    color: '#34a853',
    updatedAt: '1 hari lalu',
    members: [
      { name: 'Budi Santoso', role: 'Project Lead', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', email: 'budi.santoso@gmail.com' }
    ]
  }
];

export const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    projectId: 'proj-1',
    title: 'Peluncuran Fitur Otentikasi Firebase & Custom Roles',
    author: 'Budi Santoso',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    category: 'Pengumuman',
    date: '28 Juli 2026',
    content: 'Fitur otentikasi akun Google Workspace dan Custom Roles dengan batasan hak akses telah berhasil diimplementasikan.',
    commentsCount: 2,
    pinned: true,
    comments: [
      {
        id: 'c-1',
        author: 'Rian Hidayat',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        time: '1 jam lalu',
        text: 'Luar biasa! Sangat membantu untuk pengaturan wewenang tim.'
      }
    ]
  }
];

export const INITIAL_TODOS = [
  {
    id: 'cat-1',
    title: 'Phase 1: Authentication & Firestore Setup',
    items: [
      { id: 'todo-1', text: 'Konfigurasi Firebase App & Google Auth Provider', completed: true, assignee: 'Rian Hidayat', dueDate: '25 Juli' },
      { id: 'todo-2', text: 'Setup Firestore Rules & Security Rules', completed: true, assignee: 'Budi Santoso', dueDate: '26 Juli' }
    ]
  },
  {
    id: 'cat-2',
    title: 'Phase 2: Frontend & Core Modules',
    items: [
      { id: 'todo-3', text: 'Modul Diskusi & Pengumuman', completed: true, assignee: 'Siti Rahma', dueDate: '27 Juli' },
      { id: 'todo-4', text: 'Modul Task Manager (Kanban View & Confetti)', completed: true, assignee: 'Budi Santoso', dueDate: '28 Juli' },
      { id: 'todo-5', text: 'Integrasi Google Drive Upload API & Storage Browser', completed: false, assignee: 'Rian Hidayat', dueDate: '29 Juli' }
    ]
  }
];

export const INITIAL_CHAT_MESSAGES = [
  {
    id: 'chat-1',
    projectId: 'proj-1',
    sender: 'Rian Hidayat',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    time: '10:14 AM',
    text: 'Selamat pagi tim! API Firestore sudah terhubung dengan baik.'
  },
  {
    id: 'chat-2',
    projectId: 'proj-1',
    sender: 'Budi Santoso',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    time: '10:16 AM',
    text: 'Siap Rian. Mari kita lanjutkan pengujian modul Drive dan Calendar.'
  }
];

export const INITIAL_FILES = [
  {
    id: 'file-1',
    projectId: 'proj-1',
    name: 'Roadmap_Proyek_Q3.gsheet',
    type: 'Google Sheet',
    size: '1.2 MB',
    author: 'Budi Santoso',
    uploadedAt: '2 jam lalu',
    googleDriveUrl: 'https://drive.google.com'
  },
  {
    id: 'file-2',
    projectId: 'proj-1',
    name: 'Arsitektur_Sistem_Firebase.pdf',
    type: 'PDF Document',
    size: '4.5 MB',
    author: 'Rian Hidayat',
    uploadedAt: '1 hari lalu',
    googleDriveUrl: 'https://drive.google.com'
  }
];

export const INITIAL_EVENTS = [
  {
    id: 'evt-1',
    projectId: 'proj-1',
    title: 'Sprint Review & Demo Google Services',
    date: '2026-07-30',
    time: '10:00 - 11:30 WIB',
    location: 'Google Meet',
    color: '#1a73e8',
    syncGoogleCalendar: true,
    completed: false
  },
  {
    id: 'evt-2',
    projectId: 'proj-1',
    title: 'Deadline Pipeline Stage 2',
    date: '2026-08-02',
    time: '17:00 WIB',
    location: 'Milestone Release',
    color: '#34a853',
    syncGoogleCalendar: true,
    completed: false
  }
];

export const INITIAL_CHECKINS = [
  {
    id: 'chk-1',
    projectId: 'proj-1',
    question: 'Apa yang kamu kerjakan hari ini dan apakah ada kendala?',
    schedule: 'Setiap Hari Kerja jam 16:30 WIB',
    responses: [
      {
        author: 'Rian Hidayat',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        time: 'Kemarin 16:35 WIB',
        answer: 'Menyelesaikan integrasi Firebase Auth & Google Drive file picker, tidak ada kendala.'
      }
    ]
  }
];
