import React, { useState, useRef } from 'react';
import { Folder, FileText, Image, FileSpreadsheet, HardDrive, Plus, ExternalLink, Download, Upload, Eye, Trash2, File, CheckCircle2 } from 'lucide-react';

export default function DocsAndFiles({ files, setFiles, activeProject, notify }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [fileSource, setFileSource] = useState('Google Drive');
  const [previewFile, setPreviewFile] = useState(null);
  
  // Real Local File Upload State
  const [selectedLocalFile, setSelectedLocalFile] = useState(null);
  const [customFileName, setCustomFileName] = useState('');
  const fileInputRef = useRef(null);

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

  const handleUploadFile = (e) => {
    e.preventDefault();
    if (!selectedLocalFile && !customFileName.trim()) return;

    let detectedType = 'other';
    const fileNameToUse = customFileName || (selectedLocalFile ? selectedLocalFile.name : 'Dokumen');
    
    if (fileNameToUse.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i) || (selectedLocalFile && selectedLocalFile.type.startsWith('image/'))) {
      detectedType = 'image';
    } else if (fileNameToUse.match(/\.(pdf)$/i) || (selectedLocalFile && selectedLocalFile.type.includes('pdf'))) {
      detectedType = 'pdf';
    } else if (fileNameToUse.match(/\.(xlsx|csv|gsheet)$/i) || (selectedLocalFile && selectedLocalFile.type.includes('sheet'))) {
      detectedType = 'sheet';
    }

    const fileUrl = selectedLocalFile ? URL.createObjectURL(selectedLocalFile) : 'https://drive.google.com';

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
      author: 'Budi Santoso'
    };

    setFiles([newFile, ...files]);
    setSelectedLocalFile(null);
    setCustomFileName('');
    setShowUploadModal(false);
    notify?.(`Berkas "${fileNameToUse}" berhasil diunggah!`, 'success');
  };

  const handleDeleteFile = (fileId) => {
    setFiles(files.filter(f => f.id !== fileId));
    if (previewFile?.id === fileId) setPreviewFile(null);
    notify?.('Berkas berhasil dihapus', 'delete');
  };

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
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{files.length} Berkas • Tersimpan aman di Cloud</div>
          </div>
        </div>
        <span className="badge badge-green">Google Drive Sync Active</span>
      </div>

      {/* Files Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {files.map(file => (
          <div key={file.id} className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                {getFileIcon(file.type)}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{file.source}</span>
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
                {file.size} • Diunggah oleh {file.author}
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
              <a
                href={file.url}
                target={file.isLocalObject ? '_self' : '_blank'}
                download={file.isLocalObject ? file.name : undefined}
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '4px 8px', textDecoration: 'none' }}
              >
                <Download size={13} /> {file.isLocalObject ? 'Unduh' : 'Buka'}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div className="modal-overlay" onClick={() => setPreviewFile(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '12px', fontWeight: 800 }}>Preview Dokumen</h3>
            <div style={{ background: 'var(--bg-main)', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '20px' }}>
              {previewFile.type === 'image' && previewFile.url.startsWith('http') ? (
                <img src={previewFile.url} alt={previewFile.name} style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px', marginBottom: '12px' }} />
              ) : getFileIcon(previewFile.type)}
              <h4 style={{ margin: '12px 0 6px 0', fontSize: '1.1rem' }}>{previewFile.name}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                File disimpan di <strong>{previewFile.source}</strong> ({previewFile.size})
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="btn btn-secondary" onClick={() => handleDeleteFile(previewFile.id)} style={{ color: 'var(--g-red)' }}>
                <Trash2 size={14} /> Hapus File
              </button>
              <button className="btn btn-secondary" onClick={() => setPreviewFile(null)}>Tutup</button>
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Lokasi Destinasi Storage</label>
                <select className="input-field" value={fileSource} onChange={(e) => setFileSource(e.target.value)}>
                  <option value="Google Drive">Google Drive API (Folder Proyek)</option>
                  <option value="Firebase Storage">Firebase Cloud Storage</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Unggah ke Google Drive</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
