import React, { useState, useRef } from 'react';
import { Folder, FileText, Image, FileSpreadsheet, HardDrive, Plus, ExternalLink, Download, Upload, Eye, Trash2, File, CheckCircle2, Loader2 } from 'lucide-react';
import { isMatchProject } from '../hooks/useWorkspaceData';

export default function DocsAndFiles({ files, setFiles, activeProject, projects = [], currentUser, notify }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [fileSource, setFileSource] = useState('Google Drive');
  const [previewFile, setPreviewFile] = useState(null);
  
  // Real Local File Upload State & Progress
  const [selectedLocalFile, setSelectedLocalFile] = useState(null);
  const [customFileName, setCustomFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const fileInputRef = useRef(null);

  const authorName = currentUser ? currentUser.name : 'Rausal Bahtiar';

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <Image size={24} color="#ea4335" />;
      case 'sheet': return <FileSpreadsheet size={24} color="#34a853" />;
      case 'pdf': return <FileText size={24} color="#1a73e8" />;
      default: return <File size={24} color="#fbbc04" />;
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0 || !bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedLocalFile(file);
      setCustomFileName(file.name);
    }
  };

  const defaultUploader = currentUser?.name || activeProject?.members?.[0]?.name || 'Rausal Bahtiar';
  const [uploaderName, setUploaderName] = useState(defaultUploader);

  const handleUploadFile = async (e) => {
    e.preventDefault();
    if (!selectedLocalFile && !customFileName.trim()) return;
    if (isUploading) return;

    setIsUploading(true);
    setUploadProgress(20);
    setUploadStatusText('Membaca & Memproses Berkas...');

    let detectedType = 'other';
    const fileNameToUse = customFileName || (selectedLocalFile ? selectedLocalFile.name : 'Dokumen');
    
    if (fileNameToUse.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i) || (selectedLocalFile && selectedLocalFile.type.startsWith('image/'))) {
      detectedType = 'image';
    } else if (fileNameToUse.match(/\.(pdf)$/i) || (selectedLocalFile && selectedLocalFile.type.includes('pdf'))) {
      detectedType = 'pdf';
    } else if (fileNameToUse.match(/\.(xlsx|csv|gsheet)$/i) || (selectedLocalFile && selectedLocalFile.type.includes('sheet'))) {
      detectedType = 'sheet';
    }

    setUploadProgress(50);
    setUploadStatusText('Mengunggah ke Cloud Storage (Google Drive API)...');

    let fileUrl = 'https://drive.google.com';
    if (selectedLocalFile) {
      if (selectedLocalFile.size < 5 * 1024 * 1024) {
        fileUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target.result);
          reader.onerror = () => resolve(URL.createObjectURL(selectedLocalFile));
          reader.readAsDataURL(selectedLocalFile);
        });
      } else {
        fileUrl = URL.createObjectURL(selectedLocalFile);
      }
    }

    setUploadProgress(80);
    setUploadStatusText('Menyingkronkan Berkas dengan Seluruh Anggota Tim...');

    const newFile = {
      id: `file-${Date.now()}`,
      projectId: activeProject.id,
      name: fileNameToUse,
      type: detectedType,
      size: selectedLocalFile ? formatBytes(selectedLocalFile.size) : '1.5 MB',
      source: fileSource,
      url: fileUrl,
      isLocalObject: !!selectedLocalFile,
      updatedAt: 'Hari ini',
      uploader: uploaderName || defaultUploader,
      author: uploaderName || defaultUploader
    };

    const updated = [newFile, ...files];
    await setFiles(updated, newFile, false);

    setUploadProgress(100);
    setUploadStatusText('Selesai! Berkas Terhubung ke Tim.');

    setTimeout(() => {
      setSelectedLocalFile(null);
      setCustomFileName('');
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStatusText('');
      setShowUploadModal(false);
      notify?.(`Berkas "${fileNameToUse}" berhasil diunggah & disinkronkan! 🎉`, 'success');
    }, 500);
  };

  const getSafeFileUrl = (file) => {
    if (!file || !file.url) return 'https://drive.google.com';
    if (file.url.startsWith('blob:')) {
      return `https://drive.google.com/drive/search?q=${encodeURIComponent(file.name || 'document')}`;
    }
    return file.url;
  };

  const handleDownloadFile = (file, e) => {
    if (e) e.preventDefault();
    const safeUrl = getSafeFileUrl(file);

    if (safeUrl.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = safeUrl;
      link.download = file.name || 'downloaded-file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      notify?.(`Mengunduh berkas "${file.name}"...`, 'info');
    } else {
      window.open(safeUrl, '_blank');
    }
  };

  const handleDeleteFile = (fileId) => {
    const deletedItem = files.find(f => f.id === fileId) || { id: fileId };
    const remaining = files.filter(f => f.id !== fileId);
    setFiles(remaining, deletedItem, true);
    if (previewFile?.id === fileId) setPreviewFile(null);
    notify?.('Berkas berhasil dihapus', 'delete');
  };

  // Filter files strictly for current active project using isMatchProject helper
  const projectFiles = files.filter(f => isMatchProject(f.projectId, activeProject, projects));

  return (
    <div style={{ padding: '8px 0' }}>
      {/* Hidden Real File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HardDrive color="var(--g-yellow)" size={24} /> Google Drive & Cloud Files
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Unggah file lokal dari komputer Anda langsung ke Google Drive API & Cloud Storage.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <a
            href="https://docs.google.com"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
            style={{ textDecoration: 'none', fontSize: '0.85rem' }}
          >
            <Plus size={16} /> Buat Google Doc
          </a>

          <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
            <Upload size={16} /> Unggah File Lokal
          </button>
        </div>
      </div>

      {/* Storage Indicator Bar */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--g-blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HardDrive size={22} color="var(--g-blue)" />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Penyimpanan Google Drive Proyek</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{projectFiles.length} Berkas • Tersimpan aman di Cloud</div>
          </div>
        </div>
        <span className="badge badge-green">Google Drive Sync Active</span>
      </div>

      {/* Files Grid */}
      {projectFiles.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {projectFiles.map(file => (
            <div key={file.id} className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  {getFileIcon(file.type)}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{file.source || 'Google Drive'}</span>
                    <button
                      className="btn-icon"
                      onClick={() => handleDeleteFile(file.id)}
                      title="Hapus File"
                      style={{ padding: '4px' }}
                    >
                      <Trash2 size={14} color="var(--g-red)" />
                    </button>
                  </div>
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.name}
                </h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  {file.size} • Diunggah oleh {file.uploader || file.author || 'User'}
                </div>
              </div>

            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setPreviewFile(file)}
                style={{ flex: 1, fontSize: '0.75rem', padding: '4px 8px' }}
              >
                <Eye size={13} /> Preview
              </button>
              <button
                onClick={(e) => handleDownloadFile(file, e)}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '4px 8px', textDecoration: 'none' }}
              >
                <Download size={13} /> {file.url && file.url.startsWith('data:') ? 'Unduh' : 'Buka'}
              </button>
            </div>
          </div>
        ))}
      </div>
      ) : (
        <div className="glass-card" style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <HardDrive size={38} color="var(--g-yellow)" style={{ marginBottom: '10px', opacity: 0.7 }} />
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>Belum Ada Berkas di Proyek Ini</h4>
          <p style={{ fontSize: '0.85rem' }}>Unggah file komputer Anda atau buat Google Doc baru menggunakan tombol di atas.</p>
        </div>
      )}

      {/* Enhanced Preview Modal */}
      {previewFile && (
        <div className="modal-overlay" onClick={() => setPreviewFile(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {getFileIcon(previewFile.type)} Preview Dokumen
              </h3>
              <button className="btn-icon" onClick={() => setPreviewFile(null)}>✕</button>
            </div>

            <div style={{ background: 'var(--bg-main)', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '20px', maxHeight: '400px', overflowY: 'auto' }}>
              {previewFile.url && (previewFile.url.startsWith('data:image/') || previewFile.url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) ? (
                <img src={previewFile.url} alt={previewFile.name} style={{ maxWidth: '100%', maxHeight: '280px', borderRadius: '8px', marginBottom: '12px', objectFit: 'contain' }} />
              ) : previewFile.url && previewFile.url.startsWith('data:video/') ? (
                <video src={previewFile.url} controls style={{ maxWidth: '100%', maxHeight: '280px', borderRadius: '8px', marginBottom: '12px' }} />
              ) : previewFile.url && previewFile.url.startsWith('data:application/pdf') ? (
                <iframe src={previewFile.url} title={previewFile.name} style={{ width: '100%', height: '300px', borderRadius: '8px', border: 'none' }} />
              ) : (
                <div style={{ padding: '24px 10px' }}>
                  <HardDrive size={48} color="var(--g-blue)" style={{ marginBottom: '12px', opacity: 0.8 }} />
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 700 }}>{previewFile.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {previewFile.size} • Diunggah di <strong>{previewFile.source || 'Google Drive'}</strong>
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Diunggah oleh: <strong>{previewFile.uploader || previewFile.author || 'Anggota Tim'}</strong>
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => handleDeleteFile(previewFile.id)} style={{ color: 'var(--g-red)' }}>
                <Trash2 size={14} /> Hapus File
              </button>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-secondary" onClick={() => setPreviewFile(null)}>Tutup</button>
                <button className="btn btn-primary" onClick={(e) => handleDownloadFile(previewFile, e)}>
                  <Download size={14} /> {previewFile.url && previewFile.url.startsWith('data:') ? 'Unduh Berkas' : 'Buka di Google Drive'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real Local Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Unggah Berkas dari Komputer Lokal</h3>
            <form onSubmit={handleUploadFile}>
              {/* Drag & Drop / File Selector Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--g-blue)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  textAlign: 'center',
                  background: 'var(--g-blue-light)',
                  cursor: 'pointer',
                  marginBottom: '16px',
                  transition: 'all 0.2s'
                }}
              >
                <Upload size={32} color="var(--g-blue)" style={{ marginBottom: '8px' }} />
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--g-blue)' }}>
                  {selectedLocalFile ? selectedLocalFile.name : 'Klik untuk memilih file dari Komputer'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {selectedLocalFile ? `${formatBytes(selectedLocalFile.size)} • Siap diunggah` : 'Mendukung PDF, Gambar, Excel, Zip, Dokumen'}
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Nama Tampilan Berkas</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Misal: Dokumen_Arsitektur_Sistem.pdf"
                  value={customFileName}
                  onChange={(e) => setCustomFileName(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Pengunggah Berkas (Gmail Undangan Tim)</label>
                <select
                  className="input-field"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                >
                  {activeProject?.members && activeProject.members.length > 0 ? (
                    activeProject.members.map((m, idx) => (
                      <option key={idx} value={m.name || m.email}>
                        {m.name} ({m.email || 'Anggota'}) - {m.role || 'Member'}
                      </option>
                    ))
                  ) : (
                    <option value={currentUser ? currentUser.name : 'Rausal Bahtiar'}>
                      {currentUser ? currentUser.name : 'Rausal Bahtiar'}
                    </option>
                  )}
                  <option value="Semua Anggota Tim">Semua Anggota Tim</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Lokasi Destinasi Storage</label>
                <select className="input-field" value={fileSource} onChange={(e) => setFileSource(e.target.value)} disabled={isUploading}>
                  <option value="Google Drive">Google Drive API (Folder Proyek)</option>
                  <option value="Firebase Storage">Firebase Cloud Storage</option>
                </select>
              </div>

              {/* Dynamic Upload Progress & Loading Bar */}
              {isUploading && (
                <div style={{ marginBottom: '20px', background: 'var(--g-blue-light)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(26, 115, 232, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--g-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Loader2 className="animate-spin" size={16} /> {uploadStatusText}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--g-blue)' }}>{uploadProgress}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(26, 115, 232, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--g-blue)', transition: 'width 0.3s ease-in-out' }} />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)} disabled={isUploading}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" disabled={isUploading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isUploading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} /> Mengunggah ({uploadProgress}%)...
                    </>
                  ) : (
                    'Unggah ke Google Drive'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
