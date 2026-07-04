import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/patient/forgot-password', { email });
      showToast(response.data.message || 'Password reset link has been sent to your email.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send password reset link. Ensure the email is registered.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <p className="auth-subtitle">Enter your email and we'll send you a password reset link</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="auth-footer">
          Remembered your password? <Link to="/">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
