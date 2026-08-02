import React, { useState } from 'react';
import { LogIn, LogOut, User, Mail, Shield, Check, Globe } from 'lucide-react';
import { auth, googleProvider, isLiveFirebase } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

export default function LoginModal({ isOpen, onClose, currentUser, setCurrentUser }) {
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [roleInput, setRoleInput] = useState('Project Lead');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const saveUserSession = (userObj) => {
    setCurrentUser(userObj);
    try {
      localStorage.setItem('hub_currentUser', JSON.stringify(userObj));
    } catch (e) {}
  };

  const handleGoogleSignIn = async () => {
    if (isLiveFirebase && auth && googleProvider) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const userObj = {
          id: user.uid,
          name: user.displayName || 'Pengguna Google',
          email: user.email || 'user@gmail.com',
          avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          role: 'Project Lead',
          provider: 'Google OAuth'
        };
        saveUserSession(userObj);
        setSuccessMsg('Berhasil Login dengan akun Google!');
        setTimeout(() => {
          setSuccessMsg('');
          onClose();
        }, 1200);
      } catch (err) {
        console.error("Google Sign-In Error:", err);
        if (err.code === 'auth/configuration-not-found' || err.code === 'auth/operation-not-allowed') {
          alert("⚠️ Provider Google belum diaktifkan di Firebase Console.\n\nSilakan buka Firebase Console -> Authentication -> Sign-in method -> Tambahkan Provider Google & Aktifkan.");
        } else if (err.code === 'auth/unauthorized-domain') {
          const host = typeof window !== 'undefined' ? window.location.hostname : 'project.rasaraja.my.id';
          alert(`⚠️ Domain ini (${host}) belum diizinkan di Firebase Console.\n\nSilakan buka Firebase Console -> Authentication -> Settings -> Authorized Domains -> Tambahkan domain ${host}`);
        } else {
          alert(`Google Sign-In Error (${err.code || 'unknown'}): ${err.message}`);
        }
      }
    } else {
      simulateLogin();
    }
  };

  const simulateLogin = () => {
    const userObj = {
      id: `usr-${Date.now()}`,
      name: nameInput.trim() || 'Anggota Tim',
      email: emailInput.trim() || 'budi.santoso@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role: roleInput,
      provider: 'Google Workspace'
    };
    saveUserSession(userObj);
    setSuccessMsg(`Berhasil Login sebagai ${userObj.name}!`);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  const handleCustomLogin = (e) => {
    e.preventDefault();
    simulateLogin();
  };

  const handleSignOut = async () => {
    if (isLiveFirebase && auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn(err);
      }
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem('hub_currentUser');
    } catch (e) {}
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--g-blue-light)', color: 'var(--g-blue)' }}>
            <User size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Otentikasi & Akun Pengguna</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Login Google Cloud Workspace & Hak Akses
            </span>
          </div>
        </div>

        {currentUser ? (
          <div>
            <div style={{
              background: 'var(--bg-main)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '20px'
            }}>
              <img src={currentUser.avatar} alt={currentUser.name} className="avatar" style={{ width: '48px', height: '48px', border: '2px solid var(--g-blue)' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>{currentUser.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{currentUser.email}</div>
                <span className="badge badge-blue" style={{ marginTop: '4px', fontSize: '0.7rem' }}>
                  Role: {currentUser.role}
                </span>
              </div>
            </div>

            <button
              className="btn btn-secondary"
              onClick={handleSignOut}
              style={{ width: '100%', color: 'var(--g-red)', border: '1px solid var(--g-red-light)' }}
            >
              <LogOut size={16} /> Keluar dari Akun (Sign Out)
            </button>
          </div>
        ) : (
          <div>
            {/* Google OAuth Button */}
            <button
              className="btn"
              onClick={handleGoogleSignIn}
              style={{
                width: '100%',
                padding: '12px',
                background: '#ffffff',
                color: '#3c4043',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                fontWeight: 700,
                fontSize: '0.95rem',
                marginBottom: '16px',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <Globe size={20} color="#4285F4" /> Login dengan Google Workspace
            </button>

            <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', gap: '10px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ATAU ISI MANUAL</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            </div>

            <form onSubmit={handleCustomLogin}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '4px' }}>Nama Lengkap</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Misal: Budi Santoso"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '4px' }}>Alamat Email Gmail</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="budi.santoso@gmail.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '4px' }}>Role / Hak Akses</label>
                <select className="input-field" value={roleInput} onChange={(e) => setRoleInput(e.target.value)}>
                  <option value="Project Lead">Project Lead (Admin / Akses Penuh)</option>
                  <option value="Developer">Developer (Akses Edit & Tambah)</option>
                  <option value="UI/UX Designer">UI/UX Designer (Akses Edit & Tambah)</option>
                  <option value="QA Engineer">QA Engineer (Akses Edit & Tambah)</option>
                  <option value="Viewer">Viewer (Hanya Akses Lihat)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {successMsg ? (
                  <span style={{ color: 'var(--g-green)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={16} /> {successMsg}
                  </span>
                ) : <div />}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
                  <button type="submit" className="btn btn-primary">Login Masuk</button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
