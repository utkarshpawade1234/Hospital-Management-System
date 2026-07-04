import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword.length < 5) {
      showToast('Password must be at least 5 characters long.', 'error');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    if (!token) {
      showToast('Invalid or missing reset token.', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/patient/reset-password', {
        token,
        newPassword: formData.newPassword
      });
      showToast(response.data.message || 'Password reset successful! Redirecting to login...', 'success');
      
      // Speed up redirect navigation to 800ms
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reset password. The link may have expired or been used.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <div className="auth-card">
        <h2>Set New Password</h2>
        <p className="auth-subtitle">Choose a secure, strong password for your account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
              required
              minLength="5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="5"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Updating Password...' : 'Reset Password'}
          </button>
        </form>

        <p className="auth-footer">
          Back to <Link to="/">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
