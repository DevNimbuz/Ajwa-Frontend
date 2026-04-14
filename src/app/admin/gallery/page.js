'use client';
import { useState, useEffect } from 'react';
import { UploadCloud, Trash2, Image as ImageIcon } from 'lucide-react';
import { galleryAPI } from '@/lib/api';
import packagesData from '@/data/packages';

export default function AdminGalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [targetPackage, setTargetPackage] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteTask, setDeleteTask] = useState(null); // { type: 'single' | 'bulk', id?: string }

  const fetchImages = async () => {
    try {
      const data = await galleryAPI.list('', 1, 100);
      if (data.success) setImages(data.data);
    } catch (err) {
      console.error('Failed to load gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files || files.length === 0) return;
    setUploading(true);
    
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('images', f));
    if (targetPackage) {
      formData.append('packageSlug', targetPackage);
    }
    
    try {
      const data = await galleryAPI.upload(formData);
      if (data.success) {
        setFiles([]);
        fetchImages();
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const confirmSingleDelete = (id) => {
    setDeleteTask({ type: 'single', id });
  };

  const confirmBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setDeleteTask({ type: 'bulk' });
  };

  const executeDelete = async () => {
    if (!deleteTask) return;
    
    const isBulk = deleteTask.type === 'bulk';
    setLoading(true);
    
    try {
      if (isBulk) {
        const data = await galleryAPI.bulkDelete(selectedIds);
        if (data.success) {
          setSelectedIds([]);
          fetchImages();
        } else {
          alert(data.message || 'Bulk delete failed');
        }
      } else {
        const data = await galleryAPI.delete(deleteTask.id);
        if (data.success) {
          fetchImages();
          setSelectedIds(prev => prev.filter(i => i !== deleteTask.id));
        } else {
          alert(data.message || 'Delete failed');
        }
      }
    } catch (err) {
      alert(err.message || 'Delete failed');
    } finally {
      setLoading(false);
      setDeleteTask(null);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const displayedImages = images.filter(img => {
    if (!targetPackage) return !img.packageSlug;
    return img.packageSlug === targetPackage;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === displayedImages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayedImages.map(img => img._id));
    }
  };

  if (loading) return <div style={{ padding: '2rem', color: '#fff' }}>Loading gallery...</div>;

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: 1200, margin: '0 auto' }}>
      <div className="admin-card-header">
        <div>
          <h1 style={{ color: '#f1f5f9', fontSize: '1.875rem', fontWeight: 700 }}>Interactive Gallery</h1>
          <p style={{ color: '#94a3b8' }}>Upload memories to be displayed on the public Reviews & Gallery page.</p>
        </div>
        
        <form 
          onSubmit={handleUpload} 
          style={{ 
            display: 'flex', gap: '1rem', alignItems: 'center', 
            background: '#1e293b', padding: '16px', borderRadius: '12px', 
            border: '1px solid #334155', flexWrap: 'wrap', width: '100%', maxWidth: 'none'
          }}
        >
          {selectedIds.length > 0 && (
            <button 
              type="button"
              onClick={confirmBulkDelete}
              style={{ background: '#ef4444', color: '#fff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', flex: '1 1 auto' }}
            >
              Delete Selected ({selectedIds.length})
            </button>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: '1 1 200px', flexWrap: 'wrap' }}>
            <select 
              value={targetPackage}
              onChange={e => setTargetPackage(e.target.value)}
              style={{ padding: '10px 12px', background: '#334155', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.875rem', cursor: 'pointer', flex: '1 1 120px' }}
            >
              <option value="">General Gallery</option>
              {Object.keys(packagesData).map(slug => (
                <option key={slug} value={slug}>{packagesData[slug].name}</option>
              ))}
            </select>

            <input 
              type="file" 
              accept="image/*" 
              multiple
              id="gallery-upload"
              onChange={e => setFiles(e.target.files)} 
              style={{ display: 'none' }}
            />
            <label htmlFor="gallery-upload" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#334155', color: '#cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.2s', flex: '1 1 auto', justifyContent: 'center' }}>
              <ImageIcon size={18} />
              {files.length > 0 ? `${files.length} selected` : 'Choose Photos'}
            </label>
          </div>
          <button 
            type="submit" 
            disabled={uploading || files.length === 0}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#63ab45', color: '#fff', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, opacity: uploading || files.length === 0 ? 0.6 : 1, flex: '1 1 auto', justifyContent: 'center' }}
          >
            {uploading ? <UploadCloud size={16} className="spin" /> : <UploadCloud size={16} />}
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
        <input 
          type="checkbox" 
          id="select-all"
          onChange={toggleSelectAll}
          checked={displayedImages.length > 0 && selectedIds.length === displayedImages.length}
          style={{ cursor: 'pointer', width: '16px', height: '16px' }}
        />
        <label htmlFor="select-all" style={{ color: '#fff', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }}>Select All Photos ({targetPackage ? packagesData[targetPackage]?.name : 'General Gallery'})</label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {displayedImages.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            No photos uploaded yet for the selected gallery database.
          </div>
        )}
        {displayedImages.map(img => (
          <div key={img._id} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#1e293b', border: selectedIds.includes(img._id) ? '2px solid #63ab45' : '1px solid #334155', aspectRatio: '1/1', transition: 'all 0.2s' }}>
              {/* Clickable Selection Overlay */}
              <div 
                onClick={() => toggleSelect(img._id)}
                style={{ position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 1 }} 
              />
              
              <input 
                type="checkbox"
                checked={selectedIds.includes(img._id)}
                onChange={() => toggleSelect(img._id)}
                style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, cursor: 'pointer', width: '20px', height: '20px' }}
                onClick={e => e.stopPropagation()}
              />

              <img 
                src={img.url?.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:5000'}${img.url}` : img.url} 
                alt={img.alt} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              
              {img.packageSlug && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px 8px', background: 'rgba(99, 171, 69, 0.9)', color: '#fff', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', textAlign: 'center', zIndex: 5 }}>
                  {packagesData[img.packageSlug]?.name || img.packageSlug}
                </div>
              )}

              <button 
                onClick={(e) => { e.stopPropagation(); confirmSingleDelete(img._id); }}
                style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(239, 68, 68, 0.9)', color: '#fff', border: 'none', padding: 8, borderRadius: '50%', cursor: 'pointer', zIndex: 20 }}
                title="Delete Photo"
              >
                <Trash2 size={16} />
              </button>
          </div>
        ))}
        {images.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: '#1e293b', borderRadius: '12px', border: '1px dashed #475569', color: '#94a3b8' }}>
            No memories uploaded yet. Click Choose Image to start adding.
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      {deleteTask && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '16px', maxWidth: '400px', width: '90%', textAlign: 'center', border: '1px solid #334155' }}>
            <Trash2 size={48} color="#ef4444" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ color: '#f1f5f9', fontSize: '1.25rem', marginBottom: '1rem' }}>Confirm Deletion</h3>
            <p style={{ color: '#94a3b8', marginBottom: '2rem', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete {deleteTask.type === 'bulk' ? `all ${selectedIds.length} selected photos` : 'this photo'}? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => setDeleteTask(null)}
                style={{ padding: '10px 24px', borderRadius: '8px', background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete}
                style={{ padding: '10px 24px', borderRadius: '8px', background: '#ef4444', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
