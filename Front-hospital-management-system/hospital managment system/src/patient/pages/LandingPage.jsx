import { useNavigate, Navigate } from 'react-router-dom';
import {
  IconActivity,
  IconStethoscope,
  IconCalendarEvent,
  IconFileText,
  IconCreditCard,
  IconArrowRight,
  IconShieldCheck,
  IconMail,
  IconPhone,
  IconBuildingHospital,
  IconUserCheck,
  IconMapPin,
  IconClock,
} from '@tabler/icons-react';
import { getSessionItem } from '../../utils/sessionStorage';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();


  return (
    <div className="landing-page">
      {/* ── Top Navbar ── */}
      <header className="landing-navbar">
        <div className="landing-nav-container">
          {/* Logo Mark: 26px navy rounded square with teal heartbeat/pulse icon + HMS wordmark */}
          <div className="logo-brand" onClick={() => navigate('/')}>
            <div className="logo-icon-box">
              <IconActivity size={16} color="#1D9E75" />
            </div>
            <span className="logo-wordmark">HMS</span>
          </div>

          <nav className="landing-nav-links">
            <a href="#features" className="landing-nav-link">
              Features
            </a>
            <a href="#about" className="landing-nav-link">
              About
            </a>
            <a href="#contact" className="landing-nav-link">
              Contact
            </a>
          </nav>

          <div className="landing-nav-actions">
            {/* Outline "Login" button: flat, no shadow */}
            <button className="btn-cta-outline" onClick={() => navigate('/login')}>
              Login
            </button>
            {/* Primary CTA button: soft teal shadow */}
            <button className="btn-cta-primary" onClick={() => navigate('/register')}>
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="landing-hero">
        {/* Trust Pill Badge */}
        <div className="trust-pill-badge">
          <span className="teal-dot" />
          Trusted care, made simple.
        </div>

        {/* Headline */}
        <h1 className="hero-headline">
          Modern Healthcare Management System for Patients & Clinics
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Effortlessly book appointments, manage digital prescriptions, and connect
          with top healthcare professionals — all in one secure platform.
        </p>

        {/* Hero CTAs */}
        <div className="hero-cta-group">
          <button className="btn-cta-primary" onClick={() => navigate('/login')}>
            Book Appointment <IconArrowRight size={16} style={{ marginLeft: 6, verticalAlign: 'middle' }} />
          </button>
          <button className="btn-cta-outline" onClick={() => navigate('/login')}>
            Login to Account
          </button>
        </div>

        {/* Key Metrics / Highlights */}
        <div className="hero-stats-row">
          <div className="stat-item">
            <span className="stat-value">50+</span>
            <span className="stat-label">Specialist Doctors</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">10k+</span>
            <span className="stat-label">Happy Patients</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">24/7</span>
            <span className="stat-label">Online Access</span>
          </div>
        </div>
      </section>

      {/* ── 1. Features Section ── */}
      <section id="features" className="landing-features-section">
        <div className="section-header">
          <h2 className="section-title">Designed for Complete Healthcare Management</h2>
          <p className="section-desc">
            Everything you need for seamless doctor consultation and medical tracking.
          </p>
        </div>

        <div className="features-grid">
          {/* Feature Card 1 */}
          <div className="feature-card">
            <div className="icon-chip">
              <IconStethoscope size={20} color="#085041" />
            </div>
            <h3 className="feature-card-title">Find & Book Doctors</h3>
            <p className="feature-card-text">
              Browse top verified doctors by specialization or department and schedule visits with real-time availability.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="feature-card">
            <div className="icon-chip">
              <IconCalendarEvent size={20} color="#085041" />
            </div>
            <h3 className="feature-card-title">Instant Slot Selection</h3>
            <p className="feature-card-text">
              Select 30-minute consultation slots that fit your schedule with immediate confirmation.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="feature-card">
            <div className="icon-chip">
              <IconFileText size={20} color="#085041" />
            </div>
            <h3 className="feature-card-title">Digital Prescriptions</h3>
            <p className="feature-card-text">
              Access and view your digital prescriptions, doctor notes, and dosage guidelines online at any time.
            </p>
          </div>

          {/* Feature Card 4 */}
          <div className="feature-card">
            <div className="icon-chip">
              <IconCreditCard size={20} color="#085041" />
            </div>
            <h3 className="feature-card-title">Secure Payments</h3>
            <p className="feature-card-text">
              Pay consultation fees safely via integrated Razorpay payment gateway with instant receipts.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. About Section ── */}
      <section id="about" className="landing-about-section">
        <div className="about-container">
          <div className="section-header">
            <h2 className="section-title">About CarePulse HMS</h2>
            <p className="section-desc">
              Empowering healthcare providers and patients with modern digital infrastructure.
            </p>
          </div>

          <div className="about-grid">
            <div className="about-card">
              <div className="icon-chip">
                <IconUserCheck size={20} color="#085041" />
              </div>
              <h3 className="about-card-title">Patient-Centric Care</h3>
              <p className="about-card-desc">
                Designed to make healthcare frictionless. Patients can easily search specialist doctors, manage bookings, and access medical records anytime.
              </p>
            </div>

            <div className="about-card">
              <div className="icon-chip">
                <IconStethoscope size={20} color="#085041" />
              </div>
              <h3 className="about-card-title">Empowering Doctors</h3>
              <p className="about-card-desc">
                Provides doctors with intuitive schedule management, patient consultation logs, and instant digital prescription tools.
              </p>
            </div>

            <div className="about-card">
              <div className="icon-chip">
                <IconBuildingHospital size={20} color="#085041" />
              </div>
              <h3 className="about-card-title">Hospital Administration</h3>
              <p className="about-card-desc">
                Gives administrators complete visibility over departments, doctor rosters, medicine stocks, and transaction analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Contact Section ── */}
      <section id="contact" className="landing-contact-section">
        <div className="section-header">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-desc">
            Have questions or need assistance? Reach out to our support team directly.
          </p>
        </div>

        <div className="contact-cards-grid">
          {/* Email Card */}
          <div className="contact-card">
            <div className="icon-chip">
              <IconMail size={20} color="#085041" />
            </div>
            <h4 className="contact-card-title">Email Support</h4>
            <a href="mailto:medicarenotify2003@gmail.com" className="contact-card-detail">
              medicarenotify2003@gmail.com
            </a>
            <p className="contact-card-sub">24/7 Response for general & support queries</p>
          </div>

          {/* Phone Card */}
          <div className="contact-card">
            <div className="icon-chip">
              <IconPhone size={20} color="#085041" />
            </div>
            <h4 className="contact-card-title">Phone Desk</h4>
            <a href="tel:+919876543210" className="contact-card-detail">
              +91 98765 43210
            </a>
            <p className="contact-card-sub">Mon - Sun (8:00 AM - 10:00 PM IST)</p>
          </div>

          {/* Location Card */}
          <div className="contact-card">
            <div className="icon-chip">
              <IconMapPin size={20} color="#085041" />
            </div>
            <h4 className="contact-card-title">Main Facility</h4>
            <span className="contact-card-detail" style={{ color: '#0B1F3F' }}>
              CarePulse Medical Tower
            </span>
            <p className="contact-card-sub">City Medical Zone, Building 4B</p>
          </div>

          {/* Emergency Card */}
          <div className="contact-card">
            <div className="icon-chip">
              <IconClock size={20} color="#085041" />
            </div>
            <h4 className="contact-card-title">Emergency Help</h4>
            <span className="contact-card-detail" style={{ color: '#085041' }}>
              24/7 Helpline Active
            </span>
            <p className="contact-card-sub">Instant response for emergency bookings</p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-top">
            <div>
              {/* Reused 26px navy rounded square logo mark */}
              <div className="logo-brand" onClick={() => navigate('/')}>
                <div className="logo-icon-box">
                  <IconActivity size={16} color="#1D9E75" />
                </div>
                <span className="logo-wordmark">HMS</span>
              </div>
              <p className="footer-tagline">
                Streamlining hospital administration and patient care with modern technology.
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 HMS Healthcare Management System. All rights reserved.</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <IconShieldCheck size={14} color="#1D9E75" />
              <span>HIPAA-Compliant & Secure Data Protection</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
