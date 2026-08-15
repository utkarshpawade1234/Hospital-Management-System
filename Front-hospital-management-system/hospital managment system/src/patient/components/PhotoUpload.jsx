import { useState, useRef } from 'react';
import { IconCamera } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getSessionItem } from '../../utils/sessionStorage';
import { API_BASE_URL } from '../../config/apiConfig';


export default function PhotoUpload({
  value,
  onChange,
  isEditing,
  initials,
  size = 76,
}) {
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef(null);

  const [prevDisplay, setPrevDisplay] = useState({ value, localPreview });

  if (prevDisplay.value !== value || prevDisplay.localPreview !== localPreview) {
    setPrevDisplay({ value, localPreview });
    setImgError(false);
  }

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
    setImgError(false);
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    const previousValue = value;
    const token = getSessionItem('token');
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/upload/image`,
        formData,
        { headers }
      );
      if (res.data && res.data.url) {
        onChange(res.data.url);
      } else {
        throw new Error('No URL returned from server');
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Failed to upload image'
      );
      setLocalPreview(null);
      onChange(previousValue);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setLocalPreview(null);
    setImgError(false);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayPhoto = localPreview || value;
  const showImage = Boolean(displayPhoto) && !imgError;

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        className="profile-avatar-wrap"
        style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}
      >
        <div
          className="profile-avatar"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            background: 'var(--color-status-blue-bg, #E6F1FB)',
            color: 'var(--color-status-blue, #0C447C)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${Math.round(size * 0.32)}px`,
            fontWeight: '600',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {showImage ? (
            <img
              src={displayPhoto}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setImgError(true)}
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
                justifyContent: 'center',
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
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'var(--color-teal, #1D9E75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #fff',
              cursor: 'pointer',
              color: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
              transition: 'transform 0.15s ease',
            }}
            title="Upload photo"
            onClick={() => fileInputRef.current?.click()}
          >
            <IconCamera size={14} />
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

      {isEditing && (localPreview || value) && !uploading && (
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
