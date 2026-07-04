import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    phoneNumber: '',
    dob: '',
    profilephoto: ''
  });
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Sending registration data to the Spring Boot backend
      const response = await axios.post('http://localhost:8080/patient/register', formData);
      showToast('Registration successful! You can now log in.', 'success');
      
      // Redirect to login page after successful registration
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      // Backend validations will be caught here (e.g. duplicate email, invalid format)
      showToast(err.response?.data?.message || 'Registration failed. Please check your inputs.', 'error');
    }
  };

  return (
    <div className="app-layout">
      <div className="auth-card register-card">
        <h2>Create an Account</h2>
        <p className="auth-subtitle">Join us to manage your health seamlessly</p>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group half-width">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group half-width">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input type="tel" id="phoneNumber" name="phoneNumber" placeholder="10-digit number" value={formData.phoneNumber} onChange={handleChange} required pattern="^[0-9]{10}$" title="Phone number must be 10 digits" />
            </div>
          </div>

          <div className="form-row">
             <div className="form-group half-width">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Min 5 characters" value={formData.password} onChange={handleChange} required minLength="5" maxLength="20" />
            </div>
            <div className="form-group half-width">
              <label htmlFor="dob">Date of Birth</label>
              <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input type="text" id="address" name="address" placeholder="Enter your full address" value={formData.address} onChange={handleChange} />
          </div>
          
          <button type="submit" className="btn-primary">Register</button>
        </form>
        
        <p className="auth-footer">
          Already have an account? <Link to="/">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
