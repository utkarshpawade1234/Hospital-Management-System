import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconActivity, IconCircleCheck } from '@tabler/icons-react';
import { forgotPassword } from '../api/patientApi';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Email not found';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-logo">
        <IconActivity size={26} />
        HMS
      </div>
      <h1 className="auth-title">Forgot password</h1>
      <p className="auth-subtitle">
        Enter your email and we'll send you a reset link
      </p>

      {sent ? (
        <div className="success-banner">
          <IconCircleCheck size={20} />
          If an account exists with that email, a password reset link has been
          sent. Please check your inbox.
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className={`form-input${error ? ' error' : ''}`}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
            />
            {error && <div className="form-error">{error}</div>}
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" /> Sending...
              </>
            ) : (
              'Send reset link'
            )}
          </button>
        </form>
      )}

      <p className="auth-footer">
        <Link to="/">← Back to login</Link>
      </p>
    </div>
  );
}
