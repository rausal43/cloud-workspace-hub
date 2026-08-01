import React from 'react';
import { CheckCircle2, AlertCircle, Info, Trash2, X, Bell } from 'lucide-react';

export default function ToastNotification({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="#34a853" />;
      case 'delete':
      case 'danger':
        return <Trash2 size={18} color="#ea4335" />;
      case 'warning':
        return <AlertCircle size={18} color="#fbbc04" />;
      default:
        return <Info size={18} color="#1a73e8" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success': return '#34a853';
      case 'delete':
      case 'danger': return '#ea4335';
      case 'warning': return '#fbbc04';
      default: return '#1a73e8';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '380px',
      width: 'calc(100vw - 48px)',
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="toast-item"
          style={{
            pointerEvents: 'auto',
            background: 'var(--bg-card)',
            color: 'var(--text-main)',
            borderLeft: `4px solid ${getBorderColor(toast.type)}`,
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            gap: '12px',
            animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            backdropFilter: 'blur(10px)',
            fontSize: '0.88rem',
            fontWeight: 600
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {getIcon(toast.type)}
            </div>
            <span>{toast.message}</span>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              borderRadius: '50%',
              opacity: 0.7
            }}
            title="Tutup Notifikasi"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
