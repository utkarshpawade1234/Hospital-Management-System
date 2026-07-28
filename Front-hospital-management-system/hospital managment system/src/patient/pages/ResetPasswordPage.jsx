import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { IconActivity, IconCircleCheck } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import { resetPassword } from '../api/patientApi';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.newPassword) e.newPassword = 'Password is required';
    else if (form.newPassword.length < 5 || form.newPassword.length > 20)
      e.newPassword = 'Password must be 5–20 characters';
    if (form.newPassword !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (!token) {
      setApiError('No reset token found. Please request a new link.');
      return;
    }

    setLoading(true);
    setApiError('');
    try {
      const res = await resetPassword({ token, newPassword: form.newPassword });
      toast.success(res.message || 'Password reset successfully!');
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to reset password';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  return (
    <div className="auth-card">
      <div className="auth-logo">
        <IconActivity size={26} />
        HMS
      </div>
      <h1 className="auth-title">Reset password</h1>
      <p className="auth-subtitle">Enter your new password below</p>

      {success ? (
        <div className="success-banner">
          <IconCircleCheck size={20} />
          Password reset successful! Redirecting to login...
        </div>
      ) : (
        <>
          {apiError && (
            <div className="error-banner">
              {apiError}
              {(apiError.toLowerCase().includes('expired') ||
                apiError.toLowerCase().includes('invalid') ||
                apiError.toLowerCase().includes('used')) && (
                <Link
                  to="/forgot-password"
                  style={{
                    marginLeft: '8px',
                    color: 'inherit',
                    fontWeight: 600,
                    textDecoration: 'underline',
                  }}
                >
                  Request a new link
                </Link>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">New password</label>
              <input
                className={`form-input${errors.newPassword ? ' error' : ''}`}
                type="password"
                placeholder="5–20 characters"
                value={form.newPassword}
                onChange={set('newPassword')}
              />
              {errors.newPassword && (
                <div className="form-error">{errors.newPassword}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm new password</label>
              <input
                className={`form-input${errors.confirmPassword ? ' error' : ''}`}
                type="password"
                placeholder="Repeat new password"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
              />
              {errors.confirmPassword && (
                <div className="form-error">{errors.confirmPassword}</div>
              )}
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" /> Resetting...
                </>
              ) : (
                'Reset password'
              )}
            </button>
          </form>
        </>
      )}

      <p className="auth-footer">
        <Link to="/">← Back to login</Link>
      </p>
    </div>
  );
}
