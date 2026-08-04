import { useState, useRef } from 'react';
import { IconCamera, IconX } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function PhotoUpload({ value, onChange, isEditing, initials }) {
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // Client-side validations
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }

    // Set immediate local preview
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    const previousValue = value;
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await axios.post('http://localhost:8080/api/upload/image', formData, {
        headers,
      });
      if (res.data && res.data.url) {
        onChange(res.data.url);
      } else {
        throw new Error('No URL returned from server');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to upload image');
      // Revert local preview
      setLocalPreview(null);
      onChange(previousValue);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setLocalPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayPhoto = localPreview || value;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="profile-avatar-wrap" style={{ position: 'relative', width: '76px', height: '76px' }}>
        <div 
          className="profile-avatar"
          style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            background: 'var(--color-status-blue-bg, #E6F1FB)',
            color: 'var(--color-status-blue, #0C447C)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: '600',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {displayPhoto ? (
            <img 
              src={displayPhoto} 
              alt="Avatar" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            initials || '—'
          )}

          {uploading && (
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span className="spinner" style={{ width: '20px', height: '20px' }} />
            </div>
          )}
        </div>

        {isEditing && !uploading && (
          <div
            className="avatar-camera-badge"
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'var(--color-teal, #1D9E75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #fff',
              cursor: 'pointer',
              color: '#fff'
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <IconCamera size={12} />
          </div>
        )}
      </div>

      {isEditing && (
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      )}

      {isEditing && value && !uploading && (
        <button
          type="button"
          onClick={handleRemove}
          style={{
            background: 'none',
            border: 'none',
            color: '#791F1F',
            fontSize: '11px',
            fontWeight: '500',
            cursor: 'pointer',
            marginTop: '6px',
            padding: 0,
            textDecoration: 'underline',
          }}
        >
          Remove photo
        </button>
      )}
    </div>
  );
}
