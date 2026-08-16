import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TitanPortal.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function TitanPortal({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [view, setView] = useState('student-login');

  const [cnic, setCnic] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleViewChange = (newView) => {
    setView(newView);
    setCnic('');
    setEmail('');
    setDob('');
    setPassword('');
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (view === 'teacher-login') {
      // Real trainer login — admin ne jo bhi trainer DB mein save kiya hai,
      // wahi email+password se /api/trainer-login se login hoga. Koi
      // hardcoded email/password ab nahi hai.
      setSubmitting(true);
      try {
        const res = await fetch(`${API_BASE}/api/trainer-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), password }),
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.message || 'Invalid Trainer Email or Password!');
          return;
        }
        // data.trainer = real admin-saved record: name, email, employeeId,
        // photo, courses[], cities[], campus, slotSchedule, status
        onLoginSuccess('trainer', data.trainer);
      } catch (err) {
        alert('Could not reach the server. Please try again.');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (view === 'student-login') {
      // Ab yeh real backend (/api/student-login) se check hota hai —
      // roll number ya CNIC + password, jo bhi student ne activate kiya ho.
      setSubmitting(true);
      try {
        const res = await fetch(`${API_BASE}/api/student-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: cnic.trim(), password }),
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.message || 'Invalid CNIC or Password!');
          return;
        }
        onLoginSuccess('student', data.student);
      } catch (err) {
        alert('Could not reach the server. Please try again.');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (view === 'student-register') {
      // "Create Password" — CNIC + DOB se pehchaan karke naya password set
      // karta hai (/api/students/activate). Kaam karta hai chahe student
      // admin ne manually add kiya ho ya khud enroll form se apply kiya ho.
      setSubmitting(true);
      try {
        const res = await fetch(`${API_BASE}/api/students/activate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cnic: cnic.trim(), dob, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.message || 'Could not create password. Please check your details.');
          return;
        }
        alert("Password created successfully! Kindly switch to Login tab.");
        handleViewChange('student-login');
      } catch (err) {
        alert('Could not reach the server. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="titan-container">
      {/* Branding Header */}
      <div className="titan-header">
        <div className="titan-logo-container">
          <img
            src="https://i.ibb.co/q3c3CkLS/titan-logo.jpg"
            alt="TITAN Logo"
            className="titan-logo-img"
          />
        </div>
        <p className="titan-fullname">Taj Institute of Technology and Applied Networks</p>
        <h2 className="titan-portal-title">
          {view === 'teacher-login' ? 'Trainer Portal' : 'Student Portal'}
        </h2>
      </div>

      {/* Main Card */}
      <div className="titan-card">

        {/* Student Navigation Tabs */}
        {view !== 'teacher-login' && (
          <div className="titan-tabs">
            <button
              type="button"
              className={`tab-btn ${view === 'student-login' ? 'active' : ''}`}
              onClick={() => handleViewChange('student-login')}
            >
              Login
            </button>
            <button
              type="button"
              className={`tab-btn ${view === 'student-register' ? 'active' : ''}`}
              onClick={() => handleViewChange('student-register')}
            >
              Create Password
            </button>
          </div>
        )}

        {/* Dynamic Form Content */}
        <form onSubmit={handleSubmit} className="titan-form">

          {view === 'student-login' && (
            <>
              <h3>Login</h3>
              <p className="form-instruction">
                Kindly provide the CNIC number (or Roll Number) and password used during TITAN course registration.
              </p>

              <div className="input-group">
                <label>CNIC / Roll Number *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter CNIC or Roll Number"
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                />
              </div>
            </>
          )}

          {view === 'student-register' && (
            <>
              <h3>Create a Password</h3>
              <p className="form-instruction">
                Kindly provide the CNIC number and DOB used during TITAN course registration.
              </p>

              <div className="input-group">
                <label>CNIC *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter CNIC number"
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                />
              </div>

              <div className="input-group">
                <label>DOB *</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {view === 'teacher-login' && (
            <>
              <h3>Login</h3>
              <p className="form-instruction">
                Kindly provide your email and password to access the trainer portal.
              </p>

              <div className="input-group">
                <label>Email *</label>
                <input
                  type="email"
                  placeholder="trainer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {/* Password Input */}
          <div className="input-group password-group">
            <label>Password *</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password-text"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Please wait...' : (view === 'student-register' ? 'SUBMIT' : 'LOGIN')}
          </button>

          {view === 'teacher-login' && (
            <span className="forgot-password-link">Forgot Password?</span>
          )}
        </form>
      </div>

      {/* New Admission — takes the visitor to the dedicated Admission Form
          page (StudentAuth), separate from the login card above.
          Temporarily commented out — button hidden from portal. */}
{/* Ye Apply form ka button */}

      {view !== 'teacher-login' && (
        <div className="portal-switcher-box">
          <button
            type="button"
            className="apply-admission-btn"
            onClick={() => navigate('/apply')}
          >
            📝 New Admission — Apply Now
          </button>
        </div>
      )}

      {/* Switching Button Area */}
      <div className="portal-switcher-box">
        {view === 'teacher-login' ? (
          <button
            type="button"
            className="switch-portal-btn"
            onClick={() => handleViewChange('student-login')}
          >
            Login as student
          </button>
        ) : (
          <button
            type="button"
            className="switch-portal-btn"
            onClick={() => handleViewChange('teacher-login')}
          >
            Login as teacher
          </button>
        )}
        <button
          type="button"
          className="switch-portal-btn"
          onClick={() => navigate('/admin')}
        >
          Login as admin
        </button>
      </div>
    </div>
  );
}