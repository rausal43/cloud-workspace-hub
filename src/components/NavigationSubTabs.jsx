import React from 'react';
import { LayoutDashboard, MessageSquare, CheckSquare, MessageCircle, Calendar, HardDrive, HelpCircle, Globe } from 'lucide-react';

const NAV_TABS = [
  { id: 'global', label: 'Dashboard Master (Semua Proyek)', icon: Globe },
  { id: 'overview', label: 'Ringkasan Proyek', icon: LayoutDashboard },
  { id: 'messages', label: 'Diskusi & Pengumuman', icon: MessageSquare },
  { id: 'todos', label: 'Manajemen Tugas', icon: CheckSquare },
  { id: 'chat', label: 'Obrolan Tim', icon: MessageCircle },
  { id: 'schedule', label: 'Kalender', icon: Calendar },
  { id: 'files', label: 'Google Drive & File', icon: HardDrive },
  { id: 'standups', label: 'Standup Otomatis', icon: HelpCircle }
];

export default function NavigationSubTabs({ activeTab, setActiveTab }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      borderBottom: '1px solid var(--border-color)',
      paddingTop: '16px',
      overflowX: 'auto',
      scrollbarWidth: 'none'
    }}>
      {NAV_TABS.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: isActive ? '3px solid var(--g-blue)' : '3px solid transparent',
              color: isActive ? 'var(--g-blue)' : 'var(--text-secondary)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.88rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <Icon size={16} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
