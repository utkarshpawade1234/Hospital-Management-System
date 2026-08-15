import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconActivity } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import { login, getProfile } from '../api/patientApi';
import { setSessionItem, removeSessionItem } from '../../utils/sessionStorage';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await login(form);
      toast.success(res.message || 'Login successful!');

      setSessionItem('token', res.jwtToken);
      setSessionItem('userEmail', form.email);
      setSessionItem('userRole', res.role);

      // Route by role
      if (res.role === 'ADMIN') {
        setTimeout(() => navigate('/admin'), 300);
        return;
      }
      if (res.role === 'DOCTOR') {
        setTimeout(() => navigate('/doctor/dashboard'), 300);
        return;
      }

      // Patient — check profile
      try {
        const profile = await getProfile();
        if (profile && (profile.patientId || profile.bloodGroup)) {
          if (profile.patientId) setSessionItem('patientId', profile.patientId);
          removeSessionItem('firstTimeLogin');
          setTimeout(() => navigate('/dashboard'), 300);
        } else {
          setSessionItem('firstTimeLogin', 'true');
          setTimeout(() => navigate('/dashboard'), 300);
        }
      } catch {
        setSessionItem('firstTimeLogin', 'true');
        setTimeout(() => navigate('/dashboard'), 300);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
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
      <div className="auth-logo-brand" onClick={() => navigate('/')}>
        <div className="logo-icon-box">
          <IconActivity size={18} color="#1D9E75" />
        </div>
        <span className="logo-wordmark">HMS</span>
      </div>
      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">Sign in to your account to continue</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className={`form-input${errors.email ? ' error' : ''}`}
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={set('email')}
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <div className="form-label-row">
            <label className="form-label">Password</label>
            <Link to="/forgot-password" className="form-link">
              Forgot password?
            </Link>
          </div>
          <input
            className={`form-input${errors.password ? ' error' : ''}`}
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={set('password')}
          />
          {errors.password && (
            <div className="form-error">{errors.password}</div>
          )}
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" /> Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      <p className="auth-footer">
        Don't have an account?{' '}
        <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}
