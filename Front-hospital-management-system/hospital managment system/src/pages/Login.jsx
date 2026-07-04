import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Sending login request to the Spring Boot backend
      const response = await axios.post('http://localhost:8080/patient/login', formData);
      showToast(response.data.message || 'Login successful!', 'success');
      
      // Store user data in localStorage to persist across refreshes
      localStorage.setItem('token', response.data.jwtToken);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userRole', response.data.role);
      
      // Speed up login redirect navigation to 300ms
      setTimeout(() => navigate('/dashboard', { state: { email: formData.email } }), 300); 
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed. Please check your credentials.', 'error');
    }
  };

  return (
    <div className="app-layout">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to your account to continue</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Enter your email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password">Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: '#0f52ba', textDecoration: 'none', fontWeight: '500' }}>Forgot Password?</Link>
            </div>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Enter your password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <button type="submit" className="btn-primary">Sign In</button>
        </form>
        
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
