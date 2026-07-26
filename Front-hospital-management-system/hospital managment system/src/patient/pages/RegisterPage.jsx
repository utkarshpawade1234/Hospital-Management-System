import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconActivity } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import { register } from '../api/patientApi';

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dob: '',
    address: '',
    profilephoto: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 5 || form.password.length > 20)
      e.password = 'Password must be 5–20 characters';
    if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    if (!form.phoneNumber.trim()) e.phoneNumber = 'Phone number is required';
    else if (!/^[0-9]{10}$/.test(form.phoneNumber))
      e.phoneNumber = 'Must be 10 digits';
    if (!form.dob) e.dob = 'Date of birth is required';
    else if (new Date(form.dob) >= new Date())
      e.dob = 'DOB must be in the past';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const { confirmPassword, ...payload } = form;
      const res = await register(payload);
      toast.success(res.message || 'Registration successful!');
      setTimeout(() => navigate('/'), 500);
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || 'Registration failed';
      if (status === 409) {
        setErrors({ ...errors, email: msg });
      } else {
        toast.error(msg);
      }
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
      <h1 className="auth-title">Create an account</h1>
      <p className="auth-subtitle">Fill in your details to get started</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">First name</label>
            <input
              className={`form-input${errors.firstName ? ' error' : ''}`}
              type="text"
              placeholder="John"
              value={form.firstName}
              onChange={set('firstName')}
            />
            {errors.firstName && <div className="form-error">{errors.firstName}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Last name</label>
            <input
              className={`form-input${errors.lastName ? ' error' : ''}`}
              type="text"
              placeholder="Doe"
              value={form.lastName}
              onChange={set('lastName')}
            />
            {errors.lastName && <div className="form-error">{errors.lastName}</div>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className={`form-input${errors.email ? ' error' : ''}`}
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={set('email')}
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className={`form-input${errors.password ? ' error' : ''}`}
              type="password"
              placeholder="5–20 characters"
              value={form.password}
              onChange={set('password')}
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Confirm password</label>
            <input
              className={`form-input${errors.confirmPassword ? ' error' : ''}`}
              type="password"
              placeholder="Repeat password"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
            />
            {errors.confirmPassword && (
              <div className="form-error">{errors.confirmPassword}</div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Phone number</label>
            <input
              className={`form-input${errors.phoneNumber ? ' error' : ''}`}
              type="tel"
              placeholder="10-digit number"
              value={form.phoneNumber}
              onChange={set('phoneNumber')}
            />
            {errors.phoneNumber && (
              <div className="form-error">{errors.phoneNumber}</div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Date of birth</label>
            <input
              className={`form-input${errors.dob ? ' error' : ''}`}
              type="date"
              value={form.dob}
              onChange={set('dob')}
            />
            {errors.dob && <div className="form-error">{errors.dob}</div>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Address <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(optional)</span></label>
          <input
            className="form-input"
            type="text"
            placeholder="Your address"
            value={form.address}
            onChange={set('address')}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Profile photo URL <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(optional)</span></label>
          <input
            className="form-input"
            type="url"
            placeholder="https://example.com/photo.jpg"
            value={form.profilephoto}
            onChange={set('profilephoto')}
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" /> Creating account...
            </>
          ) : (
            'Create account'
          )}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/">Sign in</Link>
      </p>
    </div>
  );
}
